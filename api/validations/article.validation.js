import joi from "joi";

export default function articleValidation(body){
    const articleCreate = joi.object({
      title: joi.string().required(),
      content: joi.string().required(),
      categories: joi.array().required()
    })

    const articleUpdate = joi.object({
      title: joi.string(),
      content: joi.string(),
      categories: joi.array()
    })

    return {
        articleCreate: articleCreate.validate(body),
        articleUpdate: articleUpdate.validate(body),
    }
}
