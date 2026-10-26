import joi from "joi";
import { joiOptions } from "./messages.js";

export default function userValidation(body) {
    // isAdmin est volontairement absent : personne ne choisit son rôle à l'inscription
    const userCreate = joi.object({
        email: joi.string().trim().email().required().label("adresse e-mail"),
        password: joi.string().min(15).max(30).required().label("mot de passe"),
        username: joi.string().trim().min(3).max(10).required().label("pseudo")
    })

    // isAdmin n'est modifiable que par un administrateur (vérifié dans le contrôleur)
    const userUpdate = joi.object({
        email: joi.string().trim().email().label("adresse e-mail"),
        password: joi.string().min(15).max(30).label("mot de passe"),
        username: joi.string().trim().min(3).max(10).label("pseudo"),
        isAdmin: joi.boolean().label("administrateur")
    })

    const userLogin = joi.object({
        email: joi.string().trim().email().required().label("adresse e-mail"),
        password: joi.string().required().label("mot de passe"),
    })

    return {
        userCreate: userCreate.validate(body, joiOptions),
        userUpdate: userUpdate.validate(body, joiOptions),
        userLogin: userLogin.validate(body, joiOptions)
    }
}
