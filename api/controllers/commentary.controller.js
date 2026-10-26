import Commentary from "../models/commentary.model.js"
import Article from "../models/article.model.js"
import commentaryValidation from "../validations/commentary.validation.js"
import isAuthorOrAdmin from "../utils/isAuthorOrAdmin.js"
import handleError from "../utils/handleError.js"

const createCommentary = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Pas de données dans la requête"})
        }
        const {error} = commentaryValidation(body).commentaryCreate
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }
        if(!await Article.exists({_id: req.params.article_id})){
            return res.status(404).json({message: "Annonce introuvable"})
        }

        body.author = req.user.id
        body.article = req.params.article_id

        const commentary = new Commentary(body)
        const newCommentary = await commentary.save()
        return res.status(201).json(newCommentary)
    } catch (error) {
        handleError(res, error)
    }
}

const getAllCommentaries = async(req, res) => {
    try {
        const commentaries = await Commentary.find()
        return res.status(200).json(commentaries)
    } catch (error) {
        handleError(res, error)
    }
}

const getCommentaryById = async(req,res) => {
    try {
        const commentary = await Commentary.findById(req.params.id)
        if(!commentary){
            return res.status(404).json({message: "Commentaire introuvable"})
        }
        return res.status(200).json(commentary)
    } catch (error) {
        handleError(res, error)
    }
}

const updateCommentary = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Pas de données dans la requête"})
        }

        const {error} = commentaryValidation(body).commentaryUpdate
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }
        const commentary = await Commentary.findById(req.params.id)
        if(!commentary){
            return res.status(404).json({message: "Commentaire introuvable"})
        }
        if(!isAuthorOrAdmin(req.user, commentary.author)){
            return res.status(403).json({message: "Vous ne pouvez modifier que vos propres commentaires"})
        }
        commentary.set(body)
        const updatedCommentary = await commentary.save()
        return res.status(200).json(updatedCommentary)
    } catch (error) {
        handleError(res, error)
    }
}

const deleteCommentary = async(req, res) => {
    try {
        const commentary = await Commentary.findById(req.params.id)
        if(!commentary){
            return res.status(404).json({message: "Commentaire introuvable"})
        }
        if(!isAuthorOrAdmin(req.user, commentary.author)){
            return res.status(403).json({message: "Vous ne pouvez supprimer que vos propres commentaires"})
        }
        await commentary.deleteOne()
        return res.status(200).json({message: "Le commentaire a bien été supprimé"})
    } catch (error) {
        handleError(res, error)
    }
}

export { createCommentary, getAllCommentaries, getCommentaryById, updateCommentary, deleteCommentary }
