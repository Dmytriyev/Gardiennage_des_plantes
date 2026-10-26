import joi from "joi";

// Options Joi partagées : messages d'erreur en français, affichés tels quels sur le site
const champ = "Le champ «\u00a0{#label}\u00a0»"

export const joiOptions = {
    errors: { wrap: { label: false } },
    messages: {
        "any.required": `${champ} est obligatoire`,
        "object.unknown": `${champ} n'est pas autorisé`,
        "object.base": "Les données envoyées sont invalides",
        "string.base": `${champ} doit être un texte`,
        "string.empty": `${champ} ne peut pas être vide`,
        "string.min": `${champ} doit contenir au moins {#limit}\u00a0caractères`,
        "string.max": `${champ} doit contenir au plus {#limit}\u00a0caractères`,
        "string.email": "L'adresse e-mail n'est pas valide",
        "string.hex": "Identifiant invalide",
        "string.length": "Identifiant invalide",
        "boolean.base": `${champ} doit valoir vrai ou faux`,
        "array.base": `${champ} doit être une liste`
    }
}

// Identifiant MongoDB : 24 caractères hexadécimaux
export const objectId = () => joi.string().hex().length(24)
