import joi from "joi";

export default function categoryValidation(body){
    const categoryCreate = joi.object({
      name: joi.string().required()
    })

    const categoryUpdate = joi.object({
      name: joi.string()
    })

    return {
        categoryCreate: categoryCreate.validate(body),
        categoryUpdate: categoryUpdate.validate(body),
    }
}
