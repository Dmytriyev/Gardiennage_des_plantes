import Article from "../models/article.model.js"
import Commentary from "../models/commentary.model.js"
import articleValidation from "../validations/article.validation.js"
import isAuthorOrAdmin from "../utils/isAuthorOrAdmin.js"
import handleError from "../utils/handleError.js"

const createArticle = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Pas de données dans la requête"})
        }
        const {error} = articleValidation(body).articleCreate
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }

        body.author = req.user.id

        const article = new Article(body)
        const newArticle = await article.save()
        return res.status(201).json(newArticle)
    } catch (error) {
        handleError(res, error)
    }
}

const getAllArticles = async(req, res) => {
    try {
        const articles = await Article.find().populate("author", "username").populate({
            path : "commentaries",
            select: "content",
            populate: {
                path: "author",
                select: "username"
            }
        }).populate("categories", "name")
        return res.status(200).json(articles)
    } catch (error) {
        handleError(res, error)
    }
}

const getArticleById = async(req,res) => {
    try {
        const article = await Article.findById(req.params.id).populate("author", "username").populate({
            path : "commentaries",
            select: "content createdAt",
            populate: {
                path: "author",
                select: "username"
            }
        }).populate("categories", "name")
        if(!article){
            return res.status(404).json({message: "Annonce introuvable"})
        }
        return res.status(200).json(article)
    } catch (error) {
        handleError(res, error)
    }
}

const updateArticle = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Pas de données dans la requête"})
        }

        const {error} = articleValidation(body).articleUpdate
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }
        const article = await Article.findById(req.params.id)
        if(!article){
            return res.status(404).json({message: "Annonce introuvable"})
        }
        if(!isAuthorOrAdmin(req.user, article.author)){
            return res.status(403).json({message: "Vous ne pouvez modifier que vos propres annonces"})
        }
        article.set(body)
        const updatedArticle = await article.save()
        return res.status(200).json(updatedArticle)
    } catch (error) {
        handleError(res, error)
    }
}

const deleteArticle = async(req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        if(!article){
            return res.status(404).json({message: "Annonce introuvable"})
        }
        if(!isAuthorOrAdmin(req.user, article.author)){
            return res.status(403).json({message: "Vous ne pouvez supprimer que vos propres annonces"})
        }
        // Les commentaires de l'annonce disparaissent avec elle
        await Commentary.deleteMany({article: article._id})
        await article.deleteOne()
        return res.status(200).json({message: "L'annonce a bien été supprimée"})
    } catch (error) {
        handleError(res, error)
    }
}

export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle }
