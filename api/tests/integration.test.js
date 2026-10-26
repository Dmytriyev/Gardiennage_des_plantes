import { describe, it, before, after } from "node:test"
import assert from "node:assert/strict"
import jwt from "jsonwebtoken"
import { startDb, stopDb, api, bearer, createUser, createArticle, createComment, PASSWORD } from "./outils.js"

// Tests d'intégration : vraies requêtes HTTP sur l'API, base MongoDB jetable en mémoire

before(startDb, { timeout: 60_000 })
after(stopDb)

// ─── Utilisateurs ──────────────────────────────────────────────────────────

describe("Inscription", () => {
    it("crée un membre (201) sans rôle admin", async () => {
        const res = await api().post("/users/register").send({ username: "camille", email: "camille@test.fr", password: PASSWORD })
        assert.equal(res.status, 201)
        assert.equal(res.body.username, "camille")
        assert.equal(res.body.isAdmin, false)
    })

    it("refuse un e-mail déjà utilisé, même écrit en majuscules (409)", async () => {
        const res = await api().post("/users/register").send({ username: "camille2", email: "CAMILLE@test.fr", password: PASSWORD })
        assert.equal(res.status, 409)
        assert.equal(res.body.message, "Cet e-mail est déjà utilisé")
    })

    it("refuse des données invalides avec un message en français (400)", async () => {
        const res = await api().post("/users/register").send({ username: "ab", email: "a@b.fr", password: PASSWORD })
        assert.equal(res.status, 400)
        assert.match(res.body.message, /pseudo.*au moins 3/)
    })

    it("refuse une requête sans corps (400)", async () => {
        const res = await api().post("/users/register")
        assert.equal(res.status, 400)
    })
})

describe("Connexion", () => {
    it("renvoie un jeton valable 12 h contenant id, e-mail et rôle", async () => {
        const res = await api().post("/users/login").send({ email: "camille@test.fr", password: PASSWORD })
        assert.equal(res.status, 200)
        const payload = jwt.verify(res.body.token, process.env.SECRET_KEY)
        assert.equal(payload.email, "camille@test.fr")
        assert.equal(payload.isAdmin, false)
        assert.equal(payload.exp - payload.iat, 12 * 3600)
    })

    it("ignore la casse de l'e-mail", async () => {
        const res = await api().post("/users/login").send({ email: "Camille@Test.fr", password: PASSWORD })
        assert.equal(res.status, 200)
    })

    it("refuse un mauvais mot de passe (401)", async () => {
        const res = await api().post("/users/login").send({ email: "camille@test.fr", password: "mauvais-mot-de-passe" })
        assert.equal(res.status, 401)
        assert.equal(res.body.message, "E-mail ou mot de passe incorrect")
    })
})

describe("Profil", () => {
    let alice, bob, admin

    before(async () => {
        alice = await createUser()
        bob = await createUser()
        admin = await createUser({ admin: true })
    })

    it("un membre voit son propre e-mail", async () => {
        const res = await api().get(`/users/${alice.id}`).set(bearer(alice.token))
        assert.equal(res.status, 200)
        assert.equal(res.body.email, alice.email)
    })

    it("un membre ne voit que le pseudo des autres", async () => {
        const res = await api().get(`/users/${alice.id}`).set(bearer(bob.token))
        assert.equal(res.status, 200)
        assert.deepEqual(Object.keys(res.body).sort(), ["_id", "username"])
    })

    it("un admin voit l'e-mail de tous et la liste des membres", async () => {
        const one = await api().get(`/users/${alice.id}`).set(bearer(admin.token))
        assert.equal(one.body.email, alice.email)
        const all = await api().get("/users/all").set(bearer(admin.token))
        assert.equal(all.status, 200)
        assert.ok(all.body.length >= 3)
    })

    it("un membre modifie son pseudo", async () => {
        const res = await api().put(`/users/${alice.id}`).set(bearer(alice.token)).send({ username: "alice" })
        assert.equal(res.status, 200)
        assert.equal(res.body.username, "alice")
    })

    it("un nouveau mot de passe remplace l'ancien", async () => {
        const nouveau = "nouveau-mot-de-passe"
        await api().put(`/users/${alice.id}`).set(bearer(alice.token)).send({ password: nouveau })
        const ok = await api().post("/users/login").send({ email: alice.email, password: nouveau })
        assert.equal(ok.status, 200)
        const ancien = await api().post("/users/login").send({ email: alice.email, password: PASSWORD })
        assert.equal(ancien.status, 401)
    })

    it("un utilisateur inexistant → 404", async () => {
        const res = await api().get("/users/6650a1b2c3d4e5f6a7b8c9d0").set(bearer(admin.token))
        assert.equal(res.status, 404)
    })
})

describe("Suppression de compte", () => {
    it("supprime le compte, ses annonces et tous les commentaires liés", async () => {
        const owner = await createUser()
        const voisin = await createUser()
        const articleId = await createArticle(owner)
        const commentOnHisArticle = await createComment(voisin, articleId)
        const otherArticle = await createArticle(voisin)
        const hisComment = await createComment(owner, otherArticle)

        const res = await api().delete(`/users/${owner.id}`).set(bearer(owner.token))
        assert.equal(res.status, 200)

        assert.equal((await api().get(`/article/${articleId}`)).status, 404)
        assert.equal((await api().get(`/commentary/${commentOnHisArticle}`)).status, 404)
        assert.equal((await api().get(`/commentary/${hisComment}`)).status, 404)
        assert.equal((await api().get(`/article/${otherArticle}`)).status, 200)
    })
})

// ─── Annonces ──────────────────────────────────────────────────────────────

describe("Annonces", () => {
    let alice, bob, categoryId, articleId

    before(async () => {
        alice = await createUser()
        bob = await createUser()
        const admin = await createUser({ admin: true })
        const category = await api().post("/category/new").set(bearer(admin.token)).send({ name: "Arbres" })
        categoryId = category.body._id
    })

    it("un membre publie une annonce (201) dont il est l'auteur", async () => {
        const res = await api().post("/article/new").set(bearer(alice.token))
            .send({ title: "Petit olivier", content: "Je donne un olivier en pot", categories: [categoryId] })
        assert.equal(res.status, 201)
        assert.equal(res.body.author, alice.id)
        articleId = res.body._id
    })

    it("la liste publique affiche l'auteur et les catégories", async () => {
        const res = await api().get("/article/all")
        assert.equal(res.status, 200)
        const article = res.body.find(a => a._id === articleId)
        assert.equal(article.author.username, alice.username)
        assert.equal(article.categories[0].name, "Arbres")
    })

    it("le détail d'une annonce contient ses commentaires et leurs auteurs", async () => {
        await createComment(bob, articleId, "Je suis intéressé")
        const res = await api().get(`/article/${articleId}`)
        assert.equal(res.status, 200)
        assert.equal(res.body.commentaries.length, 1)
        assert.equal(res.body.commentaries[0].author.username, bob.username)
    })

    it("l'auteur modifie son annonce", async () => {
        const res = await api().put(`/article/${articleId}`).set(bearer(alice.token)).send({ title: "Olivier en pot" })
        assert.equal(res.status, 200)
        assert.equal(res.body.title, "Olivier en pot")
        assert.equal(res.body.content, "Je donne un olivier en pot")
    })

    it("refuse une modification invalide (400)", async () => {
        const res = await api().put(`/article/${articleId}`).set(bearer(alice.token)).send({ title: "" })
        assert.equal(res.status, 400)
    })

    it("refuse une catégorie inconnue au format invalide (400)", async () => {
        const res = await api().post("/article/new").set(bearer(alice.token))
            .send({ title: "Rosier", content: "À donner", categories: ["pas-un-id"] })
        assert.equal(res.status, 400)
    })

    it("identifiant mal formé → 400, annonce inexistante → 404", async () => {
        assert.equal((await api().get("/article/pas-un-id")).status, 400)
        assert.equal((await api().get("/article/6650a1b2c3d4e5f6a7b8c9d0")).status, 404)
    })

    it("supprimer l'annonce supprime aussi ses commentaires", async () => {
        const commentId = await createComment(bob, articleId, "Toujours disponible ?")
        const res = await api().delete(`/article/${articleId}`).set(bearer(alice.token))
        assert.equal(res.status, 200)
        assert.equal((await api().get(`/article/${articleId}`)).status, 404)
        assert.equal((await api().get(`/commentary/${commentId}`)).status, 404)
    })
})

// ─── Commentaires et catégories ────────────────────────────────────────────

describe("Commentaires", () => {
    let alice, bob, articleId, commentId

    before(async () => {
        alice = await createUser()
        bob = await createUser()
        articleId = await createArticle(alice)
    })

    it("un membre commente une annonce (201)", async () => {
        const res = await api().post(`/commentary/new/${articleId}`).set(bearer(bob.token)).send({ content: "Je peux passer samedi ?" })
        assert.equal(res.status, 201)
        assert.equal(res.body.author, bob.id)
        assert.equal(res.body.article, articleId)
        commentId = res.body._id
    })

    it("commenter une annonce inexistante → 404", async () => {
        const res = await api().post("/commentary/new/6650a1b2c3d4e5f6a7b8c9d0").set(bearer(bob.token)).send({ content: "?" })
        assert.equal(res.status, 404)
    })

    it("refuse un commentaire vide (400)", async () => {
        const res = await api().post(`/commentary/new/${articleId}`).set(bearer(bob.token)).send({ content: "   " })
        assert.equal(res.status, 400)
    })

    it("l'auteur modifie puis supprime son commentaire", async () => {
        const put = await api().put(`/commentary/${commentId}`).set(bearer(bob.token)).send({ content: "Dimanche plutôt ?" })
        assert.equal(put.status, 200)
        assert.equal(put.body.content, "Dimanche plutôt ?")

        const del = await api().delete(`/commentary/${commentId}`).set(bearer(bob.token))
        assert.equal(del.status, 200)
        assert.equal((await api().get(`/commentary/${commentId}`)).status, 404)
    })
})

describe("Catégories", () => {
    let admin, categoryId

    before(async () => {
        admin = await createUser({ admin: true })
    })

    it("un admin crée une catégorie (201)", async () => {
        const res = await api().post("/category/new").set(bearer(admin.token)).send({ name: "Fleurs" })
        assert.equal(res.status, 201)
        categoryId = res.body._id
    })

    it("refuse un doublon (409)", async () => {
        const res = await api().post("/category/new").set(bearer(admin.token)).send({ name: "Fleurs" })
        assert.equal(res.status, 409)
    })

    it("la liste des catégories est publique", async () => {
        const res = await api().get("/category/all")
        assert.equal(res.status, 200)
        assert.ok(res.body.some(c => c.name === "Fleurs"))
    })

    it("un admin renomme puis supprime une catégorie", async () => {
        const put = await api().put(`/category/${categoryId}`).set(bearer(admin.token)).send({ name: "Fleurs vivaces" })
        assert.equal(put.status, 200)
        assert.equal(put.body.name, "Fleurs vivaces")

        const del = await api().delete(`/category/${categoryId}`).set(bearer(admin.token))
        assert.equal(del.status, 200)
        assert.equal((await api().get(`/category/${categoryId}`)).status, 404)
    })

    it("modifier une catégorie inexistante → 404 (sans plantage du serveur)", async () => {
        const res = await api().put("/category/6650a1b2c3d4e5f6a7b8c9d0").set(bearer(admin.token)).send({ name: "Cactus" })
        assert.equal(res.status, 404)
    })
})

describe("Routes inconnues", () => {
    it("renvoie 404 en JSON", async () => {
        const res = await api().get("/route/qui/n/existe/pas")
        assert.equal(res.status, 404)
        assert.equal(res.body.message, "Route introuvable")
    })
})
