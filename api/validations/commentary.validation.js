import joi from "joi";
import { joiOptions } from "./messages.js";

export default function commentaryValidation(body){
    const commentaryCreate = joi.object({
      content: joi.string().trim().max(1000).required().label("commentaire")
    })

    const commentaryUpdate = joi.object({
      content: joi.string().trim().max(1000).label("commentaire")
    })

    return {
        commentaryCreate: commentaryCreate.validate(body, joiOptions),
        commentaryUpdate: commentaryUpdate.validate(body, joiOptions),
    }
}
