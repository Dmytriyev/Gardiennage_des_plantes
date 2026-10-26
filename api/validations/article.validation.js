import joi from "joi";
import { joiOptions, objectId } from "./messages.js";

export default function articleValidation(body){
    const articleCreate = joi.object({
      title: joi.string().trim().max(100).required().label("titre"),
      content: joi.string().trim().max(2000).required().label("description"),
      categories: joi.array().items(objectId()).required().label("catégories")
    })

    const articleUpdate = joi.object({
      title: joi.string().trim().max(100).label("titre"),
      content: joi.string().trim().max(2000).label("description"),
      categories: joi.array().items(objectId()).label("catégories")
    })

    return {
        articleCreate: articleCreate.validate(body, joiOptions),
        articleUpdate: articleUpdate.validate(body, joiOptions),
    }
}
