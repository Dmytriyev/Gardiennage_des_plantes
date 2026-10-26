import joi from "joi";
import { joiOptions } from "./messages.js";

export default function categoryValidation(body){
    const categoryCreate = joi.object({
      name: joi.string().trim().max(30).required().label("nom")
    })

    const categoryUpdate = joi.object({
      name: joi.string().trim().max(30).label("nom")
    })

    return {
        categoryCreate: categoryCreate.validate(body, joiOptions),
        categoryUpdate: categoryUpdate.validate(body, joiOptions),
    }
}
