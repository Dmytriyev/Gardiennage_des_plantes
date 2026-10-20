import joi from "joi";

export default function commentaryValidation(body){
    const commentaryCreate = joi.object({
      content: joi.string().required()
    })

    const commentaryUpdate = joi.object({
      content: joi.string()
    })

    return {
        commentaryCreate: commentaryCreate.validate(body),
        commentaryUpdate: commentaryUpdate.validate(body),
    }
}
