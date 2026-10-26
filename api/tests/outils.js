import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"
import app from "../app.js"

// Fonctions réutilisables par tous les tests de l'API

process.env.SECRET_KEY = "cle-secrete-pour-les-tests"

export const PASSWORD = "mot-de-passe-de-test"

let mongo

// Base MongoDB jetable, en mémoire : les tests ne touchent jamais la vraie base
export const startDb = async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
    // Les index uniques (e-mail, nom de catégorie) doivent exister avant le premier test
    await Promise.all(mongoose.modelNames().map(name => mongoose.model(name).init()))
}

export const stopDb = async () => {
    await mongoose.disconnect()
    await mongo.stop()
}

export const api = () => request(app)

export const bearer = (token) => ({ Authorization: `Bearer ${token}` })

let count = 0

// Inscrit un membre (ou un admin), le connecte et renvoie { id, email, username, token }
export const createUser = async ({ admin = false } = {}) => {
    count++
    const user = { username: `membre${count}`, email: `membre${count}@test.fr`, password: PASSWORD }
    const res = await api().post("/users/register").send(user)

    if ( admin ) {
        await mongoose.model("User").updateOne({ _id: res.body._id }, { isAdmin: true })
    }

    const login = await api().post("/users/login").send({ email: user.email, password: PASSWORD })
    return { ...user, id: res.body._id, token: login.body.token }
}

// Crée une annonce pour un membre et renvoie son identifiant
export const createArticle = async (user, fields = {}) => {
    const res = await api().post("/article/new").set(bearer(user.token))
        .send({ title: "Petit olivier", content: "Je donne un olivier en pot", categories: [], ...fields })
    return res.body._id
}

// Crée un commentaire et renvoie son identifiant
export const createComment = async (user, articleId, content = "Je suis intéressé") => {
    const res = await api().post(`/commentary/new/${articleId}`).set(bearer(user.token)).send({ content })
    return res.body._id
}
