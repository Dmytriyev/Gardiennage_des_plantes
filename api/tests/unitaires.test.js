import { describe, it, mock } from "node:test"
import assert from "node:assert/strict"
import { Types } from "mongoose"
import isAuthorOrAdmin from "../utils/isAuthorOrAdmin.js"
import handleError from "../utils/handleError.js"
import admin from "../middlewares/admin.js"
import userValidation from "../validations/user.validation.js"
import articleValidation from "../validations/article.validation.js"
import commentaryValidation from "../validations/commentary.validation.js"
import categoryValidation from "../validations/category.validation.js"

// Tests unitaires : fonctions isolées, sans base de données ni serveur

// ─── Contrôle auteur / admin ───────────────────────────────────────────────

describe("isAuthorOrAdmin", () => {
    const authorId = new Types.ObjectId()
    const author = { id: authorId.toString(), isAdmin: false }
    const other = { id: new Types.ObjectId().toString(), isAdmin: false }

    it("autorise l'auteur (identifiant MongoDB)", () => {
        assert.equal(isAuthorOrAdmin(author, authorId), true)
    })

    it("autorise l'auteur (identifiant en texte, ex. req.params.id)", () => {
        assert.equal(isAuthorOrAdmin(author, authorId.toString()), true)
    })

    it("autorise un administrateur", () => {
        assert.equal(isAuthorOrAdmin({ ...other, isAdmin: true }, authorId), true)
    })

    it("refuse un autre membre", () => {
        assert.equal(isAuthorOrAdmin(other, authorId), false)
    })

    it("refuse quand l'auteur n'existe plus", () => {
        assert.equal(isAuthorOrAdmin(other, null), false)
        assert.equal(isAuthorOrAdmin(other, undefined), false)
    })

    it("refuse un rôle admin qui n'est pas exactement true", () => {
        assert.equal(isAuthorOrAdmin({ ...other, isAdmin: "true" }, authorId), false)
    })
})

// ─── Gestion des erreurs ───────────────────────────────────────────────────

// Imitation minimale de la réponse Express
const fakeRes = () => ({
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this }
})

describe("handleError", () => {
    it("identifiant mal formé (CastError) → 400", () => {
        const res = handleError(fakeRes(), { name: "CastError" })
        assert.equal(res.statusCode, 400)
        assert.equal(res.body.message, "Identifiant invalide")
    })

    it("validation Mongoose échouée → 400", () => {
        const res = handleError(fakeRes(), { name: "ValidationError" })
        assert.equal(res.statusCode, 400)
    })

    it("doublon (index unique) → 409", () => {
        const res = handleError(fakeRes(), { code: 11000 })
        assert.equal(res.statusCode, 409)
    })

    it("erreur inconnue → 500 sans aucun détail technique", (t) => {
        t.mock.method(console, "error", () => {})
        const error = new Error("connexion MongoDB perdue")
        const res = handleError(fakeRes(), error)

        assert.equal(res.statusCode, 500)
        assert.deepEqual(res.body, { message: "Erreur serveur" })
        assert.equal(console.error.mock.callCount(), 1)
    })
})

// ─── Middleware admin (réutilise fakeRes ci-dessus) ────────────────────────

describe("middleware admin", () => {
    it("laisse passer un administrateur", () => {
        const next = mock.fn()
        admin({ user: { isAdmin: true } }, fakeRes(), next)
        assert.equal(next.mock.callCount(), 1)
    })

    it("bloque un membre → 403", () => {
        const next = mock.fn()
        const res = fakeRes()
        admin({ user: { isAdmin: false } }, res, next)
        assert.equal(res.statusCode, 403)
        assert.equal(next.mock.callCount(), 0)
    })

    it("bloque une requête sans utilisateur → 403", () => {
        const next = mock.fn()
        const res = fakeRes()
        admin({}, res, next)
        assert.equal(res.statusCode, 403)
        assert.equal(next.mock.callCount(), 0)
    })
})

// ─── Validations Joi ───────────────────────────────────────────────────────

const ID = "6650a1b2c3d4e5f6a7b8c9d0"
const validUser = { username: "camille", email: "camille@test.fr", password: "mot-de-passe-solide" }

// Renvoie le message d'erreur Joi, ou null si les données sont valides
const message = (result) => result.error?.details[0].message ?? null

describe("Validation des utilisateurs", () => {
    it("accepte une inscription valide", () => {
        assert.equal(message(userValidation(validUser).userCreate), null)
    })

    it("refuse isAdmin à l'inscription", () => {
        const msg = message(userValidation({ ...validUser, isAdmin: true }).userCreate)
        assert.equal(msg, "Le champ «\u00a0isAdmin\u00a0» n'est pas autorisé")
    })

    it("exige un mot de passe de 15 caractères minimum", () => {
        const msg = message(userValidation({ ...validUser, password: "court" }).userCreate)
        assert.equal(msg, "Le champ «\u00a0mot de passe\u00a0» doit contenir au moins 15\u00a0caractères")
    })

    it("limite le pseudo à 10 caractères", () => {
        const msg = message(userValidation({ ...validUser, username: "pseudo-bien-trop-long" }).userCreate)
        assert.match(msg, /pseudo.*au plus 10/)
    })

    it("refuse une adresse e-mail invalide", () => {
        assert.equal(message(userValidation({ ...validUser, email: "pas-un-email" }).userCreate), "L'adresse e-mail n'est pas valide")
    })

    it("signale un champ obligatoire manquant", () => {
        assert.equal(message(userValidation({ email: "a@b.fr", password: "x" }).userLogin), null)
        assert.equal(message(userValidation({ email: "a@b.fr" }).userLogin), "Le champ «\u00a0mot de passe\u00a0» est obligatoire")
    })

    it("refuse un objet à la place d'un texte (injection NoSQL)", () => {
        const msg = message(userValidation({ email: { $ne: null }, password: { $ne: null } }).userLogin)
        assert.equal(msg, "Le champ «\u00a0adresse e-mail\u00a0» doit être un texte")
    })
})

describe("Validation des annonces", () => {
    const valid = { title: "Petit olivier", content: "À donner", categories: [ID] }

    it("accepte une annonce valide", () => {
        assert.equal(message(articleValidation(valid).articleCreate), null)
    })

    it("refuse un titre composé uniquement d'espaces", () => {
        assert.match(message(articleValidation({ ...valid, title: "   " }).articleCreate), /titre.*ne peut pas être vide/)
    })

    it("limite le titre à 100 caractères et la description à 2000", () => {
        assert.match(message(articleValidation({ ...valid, title: "a".repeat(101) }).articleCreate), /au plus 100/)
        assert.match(message(articleValidation({ ...valid, content: "a".repeat(2001) }).articleCreate), /au plus 2000/)
    })

    it("refuse un identifiant de catégorie mal formé", () => {
        assert.equal(message(articleValidation({ ...valid, categories: ["123"] }).articleCreate), "Identifiant invalide")
    })

    it("refuse de choisir l'auteur (affectation de masse)", () => {
        assert.match(message(articleValidation({ ...valid, author: ID }).articleCreate), /author.*n'est pas autorisé/)
        assert.match(message(articleValidation({ author: ID }).articleUpdate), /author.*n'est pas autorisé/)
    })
})

describe("Validation des commentaires et des catégories", () => {
    it("limite un commentaire à 1000 caractères", () => {
        assert.equal(message(commentaryValidation({ content: "Merci !" }).commentaryCreate), null)
        assert.match(message(commentaryValidation({ content: "a".repeat(1001) }).commentaryCreate), /au plus 1000/)
    })

    it("refuse de rattacher un commentaire à un autre auteur ou une autre annonce", () => {
        assert.notEqual(message(commentaryValidation({ content: "ok", author: ID }).commentaryCreate), null)
        assert.notEqual(message(commentaryValidation({ content: "ok", article: ID }).commentaryUpdate), null)
    })

    it("limite le nom d'une catégorie à 30 caractères", () => {
        assert.equal(message(categoryValidation({ name: "Arbres fruitiers" }).categoryCreate), null)
        assert.match(message(categoryValidation({ name: "a".repeat(31) }).categoryCreate), /nom.*au plus 30/)
    })
})

describe("Messages d'erreur en français", () => {
    const invalides = [
        userValidation({}).userCreate,
        userValidation({ ...validUser, isAdmin: "oui" }).userUpdate,
        articleValidation({ title: 3 }).articleCreate,
        articleValidation({ categories: "Fleurs" }).articleUpdate,
        commentaryValidation({ content: "" }).commentaryCreate,
        categoryValidation(null).categoryCreate
    ]

    it("aucun message ne contient de formulation anglaise de Joi", () => {
        for (const result of invalides) {
            const msg = message(result)
            assert.ok(msg, "une erreur était attendue")
            assert.doesNotMatch(msg, /\b(must|is required|is not allowed|be a|length|characters)\b/, msg)
        }
    })
})
