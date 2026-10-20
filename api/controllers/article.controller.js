import Article from "../models/article.model.js"
import articleValidation from "../validations/article.validation.js"

const createArticle = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "no data in the request"})
        }
        const {error} = articleValidation(body).articleCreate
        if(error){
            return res.status(400).json(error.details[0].message)
        }

        body.author = req.user.id

        const article = new Article(body)
        const newArticle = await article.save()
        return res.status(201).json(newArticle)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
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
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
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
            return res.status(404).json({message: "article doesn't exist"})
        }
        return res.status(200).json(article)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateArticle = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = articleValidation(body).articleUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedArticle){
            res.status(404).json({message: "article doesn't exist"})
        }
        return res.status(200).json(updatedArticle)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteArticle = async(req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        if(!article){
            return res.status(404).json({message: "article doesn't exist"})
        }
        return res.status(200).json({message: "article has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle }