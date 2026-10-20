import joi from "joi";

export default function userValidation(body) {
    const userCreate = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(15).max(30).required(),
        username: joi.string().min(3).max(10).required(),
        isAdmin: joi.boolean()
    })

    const userUpdate = joi.object({
        email: joi.string().email(),
        password: joi.string().min(15).max(30),
        username: joi.string().min(3).max(10),
        isAdmin: joi.boolean()   
    })

    const userLogin = joi.object({
        email: joi.string().email(),
        password: joi.string(),
    })

    return {
        userCreate: userCreate.validate(body),
        userUpdate: userUpdate.validate(body),
        userLogin: userLogin.validate(body)
    }
}