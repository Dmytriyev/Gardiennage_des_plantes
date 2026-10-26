import User from "../models/user.model.js"
import Article from "../models/article.model.js"
import Commentary from "../models/commentary.model.js"
import userValidation from "../validations/user.validation.js"
import isAuthorOrAdmin from "../utils/isAuthorOrAdmin.js"
import handleError from "../utils/handleError.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async(req, res) => {
    try {
        const { body } = req

        if ( !body ) {
            return res.status(400).json({ message: "Pas de données dans la requête" })
        }

        const { error } = userValidation(body).userCreate

        if ( error ) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const searchUser = await User.findOne({email : body.email})

        if ( searchUser ) {
            return res.status(409).json({ message: "Cet e-mail est déjà utilisé" })
        }

        const user = new User(body)

        const newUser = await user.save()

        return res.status(201).json(newUser)
    } catch (error) {
        handleError(res, error)
    }
}

const login = async(req, res) => {
    try {
        const { body } = req

        if ( !body ) {
            return res.status(400).json({ message: "Pas de données dans la requête" })
        }

        const { error } = userValidation(body).userLogin

        if ( error ) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const user = await User.findOne({ email: body.email }).select("+password")

        if ( !user ) {
            return res.status(401).json({ message: "E-mail ou mot de passe incorrect" })
        }

        const isMatch = await bcrypt.compare(body.password, user.password)

        if ( !isMatch ) {
            return res.status(401).json({ message: "E-mail ou mot de passe incorrect" })
        }

        res.status(200).json({
            message: `${user.email} est connecté`,
            token: jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "12h" })
        })
    } catch (error) {
        handleError(res, error)
    }
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        handleError(res, error)
    }
}

const getUserById = async(req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if ( !user ) {
            return res.status(404).json({ message: "Utilisateur introuvable" })
        }

        // L'e-mail reste privé : les autres membres ne voient que le pseudo
        if ( !isAuthorOrAdmin(req.user, user._id) ) {
            return res.status(200).json({ _id: user._id, username: user.username })
        }

        return res.status(200).json(user)
    } catch (error) {
        handleError(res, error)
    }
}

const updateUser = async(req, res) => {
    try {
        const { body } = req

        if ( !body ) {
            return res.status(400).json({ message: "Pas de données dans la requête" })
        }

        if ( !isAuthorOrAdmin(req.user, req.params.id) ) {
            return res.status(403).json({ message: "Vous ne pouvez modifier que votre propre compte" })
        }

        const { error } = userValidation(body).userUpdate

        if ( error ) {
            return res.status(400).json({ message: error.details[0].message })
        }

        if ( body.isAdmin !== undefined && !req.user.isAdmin ) {
            return res.status(403).json({ message: "Seul un administrateur peut modifier un rôle" })
        }

        const user = await User.findById(req.params.id)

        if ( !user ) {
            return res.status(404).json({ message: "Utilisateur introuvable" })
        }

        // save() et non findByIdAndUpdate() : seul save() déclenche le hachage du mot de passe
        user.set(body)
        const updatedUser = await user.save()

        return res.status(200).json(updatedUser)
    } catch (error) {
        handleError(res, error)
    }
}

const deleteUser = async(req, res) => {
    try {
        if ( !isAuthorOrAdmin(req.user, req.params.id) ) {
            return res.status(403).json({ message: "Vous ne pouvez supprimer que votre propre compte" })
        }

        const user = await User.findByIdAndDelete(req.params.id)

        if ( !user ) {
            return res.status(404).json({ message: "Utilisateur introuvable" })
        }

        // On supprime aussi ses annonces, les commentaires de ses annonces et ses commentaires
        const articleIds = await Article.distinct("_id", { author: user._id })
        await Commentary.deleteMany({ $or: [ { author: user._id }, { article: { $in: articleIds } } ] })
        await Article.deleteMany({ author: user._id })

        return res.status(200).json({ message: "L'utilisateur a bien été supprimé" })
    } catch (error) {
        handleError(res, error)
    }
}

export { register, login, getAllUsers, getUserById, updateUser, deleteUser }
