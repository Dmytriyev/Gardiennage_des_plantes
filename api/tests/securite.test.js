import { describe, it, before, after } from "node:test"
import assert from "node:assert/strict"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { startDb, stopDb, api, bearer, createUser, createArticle, createComment, PASSWORD } from "./outils.js"

// Tests de sécurité : chaque attaque doit être refusée par l'API

const UNKNOWN_ID = "6650a1b2c3d4e5f6a7b8c9d0"

let alice, bob, admin, articleId, commentId, categoryId

before(async () => {
    await startDb()
    alice = await createUser()
    bob = await createUser()
    admin = await createUser({ admin: true })
    articleId = await createArticle(alice)
    commentId = await createComment(alice, articleId)
    categoryId = (await api().post("/category/new").set(bearer(admin.token)).send({ name: "Fleurs" })).body._id
}, { timeout: 60_000 })

after(stopDb)

const send = (method, url, token, body) => {
    const req = api()[method](url)
    if ( token ) req.set(bearer(token))
    return body ? req.send(body) : req
}

describe("Authentification obligatoire (401 sans jeton)", () => {
    const routes = () => [
        ["get", "/users/all"],
        ["get", `/users/${alice.id}`],
        ["put", `/users/${alice.id}`, { username: "pirate" }],
        ["delete", `/users/${alice.id}`],
        ["post", "/article/new", { title: "x", content: "x", categories: [] }],
        ["put", `/article/${articleId}`, { title: "Piraté" }],
        ["delete", `/article/${articleId}`],
        ["post", `/commentary/new/${articleId}`, { content: "x" }],
        ["put", `/commentary/${commentId}`, { content: "Piraté" }],
        ["delete", `/commentary/${commentId}`],
        ["post", "/category/new", { name: "x" }],
        ["put", `/category/${categoryId}`, { name: "x" }],
        ["delete", `/category/${categoryId}`]
    ]

    it("toutes les routes protégées refusent un visiteur", async () => {
        for (const [method, url, body] of routes()) {
            const res = await send(method, url, null, body)
            assert.equal(res.status, 401, `${method.toUpperCase()} ${url}`)
        }
    })
})

describe("Contrôle d'accès : ressources des autres (IDOR) → 403", () => {
    it("bob ne peut ni modifier ni supprimer l'annonce d'alice", async () => {
        assert.equal((await send("put", `/article/${articleId}`, bob.token, { title: "Piraté" })).status, 403)
        assert.equal((await send("delete", `/article/${articleId}`, bob.token)).status, 403)
    })

    it("bob ne peut ni modifier ni supprimer le commentaire d'alice", async () => {
        assert.equal((await send("put", `/commentary/${commentId}`, bob.token, { content: "Piraté" })).status, 403)
        assert.equal((await send("delete", `/commentary/${commentId}`, bob.token)).status, 403)
    })

    it("bob ne peut ni modifier ni supprimer le compte d'alice", async () => {
        assert.equal((await send("put", `/users/${alice.id}`, bob.token, { email: "pirate@test.fr" })).status, 403)
        assert.equal((await send("delete", `/users/${alice.id}`, bob.token)).status, 403)
    })

    it("rien n'a été modifié", async () => {
        const res = await api().get(`/article/${articleId}`)
        assert.equal(res.body.title, "Petit olivier")
    })

    it("un admin peut modérer l'annonce d'un membre", async () => {
        const res = await send("put", `/article/${articleId}`, admin.token, { title: "Petit olivier" })
        assert.equal(res.status, 200)
    })
})

describe("Élévation de privilèges", () => {
    it("impossible de s'inscrire en tant qu'admin", async () => {
        const res = await api().post("/users/register").send({ username: "pirate", email: "pirate@test.fr", password: PASSWORD, isAdmin: true })
        assert.equal(res.status, 400)
    })

    it("un membre ne peut pas se nommer admin", async () => {
        const res = await send("put", `/users/${bob.id}`, bob.token, { isAdmin: true })
        assert.equal(res.status, 403)
    })

    it("les routes d'administration refusent un membre", async () => {
        assert.equal((await send("get", "/users/all", bob.token)).status, 403)
        assert.equal((await send("post", "/category/new", bob.token, { name: "Pirate" })).status, 403)
        assert.equal((await send("put", `/category/${categoryId}`, bob.token, { name: "Pirate" })).status, 403)
        assert.equal((await send("delete", `/category/${categoryId}`, bob.token)).status, 403)
    })

    it("un admin rétrogradé perd ses droits immédiatement, même avec un ancien jeton", async () => {
        const ancienAdmin = await createUser({ admin: true })
        await mongoose.model("User").updateOne({ _id: ancienAdmin.id }, { isAdmin: false })
        const res = await send("post", "/category/new", ancienAdmin.token, { name: "Pirate" })
        assert.equal(res.status, 403)
    })
})

describe("Affectation de masse", () => {
    it("impossible de publier une annonce au nom d'un autre", async () => {
        const res = await send("post", "/article/new", bob.token, { title: "x", content: "x", categories: [], author: alice.id })
        assert.equal(res.status, 400)
    })

    it("impossible de transférer son annonce à un autre auteur", async () => {
        const res = await send("put", `/article/${articleId}`, alice.token, { author: bob.id })
        assert.equal(res.status, 400)
    })

    it("impossible de déplacer un commentaire vers une autre annonce", async () => {
        const res = await send("put", `/commentary/${commentId}`, alice.token, { article: UNKNOWN_ID })
        assert.equal(res.status, 400)
    })
})

describe("Mots de passe", () => {
    const rawUser = (email) => mongoose.connection.collection("users").findOne({ email })

    it("sont stockés hachés avec bcrypt (coût 10), jamais en clair", async () => {
        const raw = await rawUser(alice.email)
        assert.match(raw.password, /^\$2[aby]\$10\$/)
        assert.notEqual(raw.password, PASSWORD)
    })

    it("restent hachés après une modification", async () => {
        const nouveau = "autre-mot-de-passe-1"
        await send("put", `/users/${bob.id}`, bob.token, { password: nouveau })
        const raw = await rawUser(bob.email)
        assert.match(raw.password, /^\$2[aby]\$10\$/)
        assert.notEqual(raw.password, nouveau)
        bob.password = nouveau
    })

    it("aucune réponse de l'API ne contient de hash", async () => {
        const responses = await Promise.all([
            api().post("/users/register").send({ username: "nouveau", email: "nouveau@test.fr", password: PASSWORD }),
            send("get", "/users/all", admin.token),
            send("get", `/users/${alice.id}`, alice.token),
            send("put", `/users/${alice.id}`, alice.token, { username: "alice" }),
            api().get("/article/all"),
            api().get(`/article/${articleId}`)
        ])
        for (const res of responses) {
            assert.doesNotMatch(JSON.stringify(res.body), /password|\$2[aby]\$/, res.req.path)
        }
    })
})

describe("Jetons JWT", () => {
    const payload = () => ({ id: alice.id, email: alice.email, isAdmin: true })
    const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url")

    it("refuse un jeton fantaisiste", async () => {
        assert.equal((await send("get", `/users/${alice.id}`, "n-importe-quoi")).status, 401)
    })

    it("refuse un jeton signé avec une autre clé (rôle admin falsifié)", async () => {
        const forged = jwt.sign(payload(), "mauvaise-cle")
        assert.equal((await send("get", "/users/all", forged)).status, 401)
    })

    it("refuse un jeton non signé (alg: none)", async () => {
        const unsigned = `${base64url({ alg: "none", typ: "JWT" })}.${base64url(payload())}.`
        assert.equal((await send("get", "/users/all", unsigned)).status, 401)
    })

    it("refuse un jeton expiré", async () => {
        const expired = jwt.sign({ ...payload(), isAdmin: false, exp: Math.floor(Date.now() / 1000) - 60 }, process.env.SECRET_KEY)
        assert.equal((await send("get", `/users/${alice.id}`, expired)).status, 401)
    })

    it("refuse le jeton d'un compte supprimé", async () => {
        const ghost = await createUser()
        await send("delete", `/users/${ghost.id}`, ghost.token)
        assert.equal((await send("post", "/article/new", ghost.token, { title: "x", content: "x", categories: [] })).status, 401)
    })

    it("refuse un jeton valide dont l'identifiant est mal formé", async () => {
        const token = jwt.sign({ id: "pas-un-id", isAdmin: true }, process.env.SECRET_KEY)
        assert.equal((await send("get", "/users/all", token)).status, 401)
    })
})

describe("Injections", () => {
    it("injection NoSQL à la connexion → 400, pas de connexion", async () => {
        const res = await api().post("/users/login").send({ email: { $ne: null }, password: { $ne: null } })
        assert.equal(res.status, 400)
        assert.equal(res.body.token, undefined)
    })

    it("injection NoSQL à l'inscription → 400", async () => {
        const res = await api().post("/users/register").send({ username: "pirate", email: { $gt: "" }, password: PASSWORD })
        assert.equal(res.status, 400)
    })

    it("opérateur MongoDB dans une liste de catégories → 400", async () => {
        const res = await send("post", "/article/new", alice.token, { title: "x", content: "x", categories: [{ $gt: "" }] })
        assert.equal(res.status, 400)
    })

    it("le HTML est stocké comme du texte brut (l'échappement est fait par React)", async () => {
        const xss = "<img src=x onerror=alert(1)>"
        const res = await send("post", "/article/new", alice.token, { title: xss, content: xss, categories: [] })
        assert.equal(res.status, 201)
        assert.match(res.headers["content-type"], /application\/json/)
    })
})

describe("Fuites d'informations", () => {
    it("même réponse pour un e-mail inconnu et un mauvais mot de passe (pas d'énumération)", async () => {
        const inconnu = await api().post("/users/login").send({ email: "personne@test.fr", password: "mauvais" })
        const mauvais = await api().post("/users/login").send({ email: alice.email, password: "mauvais" })
        assert.equal(inconnu.status, 401)
        assert.equal(mauvais.status, 401)
        assert.deepEqual(inconnu.body, mauvais.body)
    })

    it("un membre ne voit pas l'e-mail des autres", async () => {
        const res = await send("get", `/users/${alice.id}`, bob.token)
        assert.equal(res.body.email, undefined)
    })

    it("un JSON mal formé → 400 sans trace technique", async () => {
        const res = await api().post("/users/login").set("Content-Type", "application/json").send("{ email: ")
        assert.equal(res.status, 400)
        assert.match(res.headers["content-type"], /application\/json/)
        assert.doesNotMatch(res.text, /at .*\.js|node_modules|SyntaxError/)
    })

    it("la technologie du serveur n'est pas annoncée", async () => {
        const res = await api().get("/article/all")
        assert.equal(res.headers["x-powered-by"], undefined)
    })
})

describe("En-têtes HTTP et CORS", () => {
    it("envoie les en-têtes de sécurité (helmet)", async () => {
        const res = await api().get("/article/all")
        assert.equal(res.headers["x-content-type-options"], "nosniff")
        assert.ok(res.headers["content-security-policy"])
        assert.ok(res.headers["strict-transport-security"])
    })

    it("n'autorise que l'origine du front", async () => {
        const res = await api().get("/article/all").set("Origin", "https://site-malveillant.example")
        assert.equal(res.headers["access-control-allow-origin"], "http://localhost:5173")
    })
})

describe("Taille des données", () => {
    it("refuse un titre de plus de 100 caractères et une description de plus de 2000", async () => {
        assert.equal((await send("post", "/article/new", alice.token, { title: "a".repeat(101), content: "x", categories: [] })).status, 400)
        assert.equal((await send("post", "/article/new", alice.token, { title: "x", content: "a".repeat(2001), categories: [] })).status, 400)
    })

    it("refuse un corps de requête de plus de 100 Ko", async () => {
        const res = await send("post", `/commentary/new/${articleId}`, alice.token, { content: "a".repeat(200_000) })
        assert.equal(res.status, 413)
        assert.equal(res.body.message, "Requête trop volumineuse")
    })
})

// À garder en dernier : une fois la limite atteinte, la connexion est bloquée 15 minutes
describe("Force brute", () => {
    it("bloque la connexion après 5 échecs (429)", async () => {
        for (let i = 0; i < 5; i++) {
            await api().post("/users/login").send({ email: bob.email, password: `essai-${i}` })
        }
        const res = await api().post("/users/login").send({ email: bob.email, password: bob.password })
        assert.equal(res.status, 429)
        assert.equal(res.body.message, "Trop de tentatives de connexion, réessayez dans 15 minutes")
    })
})
