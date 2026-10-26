import jwt from "jsonwebtoken"
import { isValidObjectId } from "mongoose"
import User from "../models/user.model.js"

const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if ( !token ) {
        return res.status(401).json({ message: "Jeton manquant" })
    }

    let payload
    try {
        payload = jwt.verify(token, process.env.SECRET_KEY, { algorithms: ["HS256"] })
    } catch {
        return res.status(401).json({ message: "Jeton invalide ou expiré" })
    }

    // Le compte a pu être supprimé ou changer de rôle depuis la création du jeton :
    // on relit toujours l'utilisateur en base au lieu de faire confiance au jeton
    const user = isValidObjectId(payload.id) ? await User.findById(payload.id) : null

    if ( !user ) {
        return res.status(401).json({ message: "Compte introuvable" })
    }

    req.user = { id: user.id, email: user.email, isAdmin: user.isAdmin }
    next()
}

export default auth
