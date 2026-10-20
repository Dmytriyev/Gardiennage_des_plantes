import Commentary from "../models/commentary.model.js"
import commentaryValidation from "../validations/commentary.validation.js"

const createCommentary = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "no data in the request"})
        }
        const {error} = commentaryValidation(body).commentaryCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }

        body.author = req.user.id
        body.article = req.params.article_id

        const commentary = new Commentary(body)
        const newCommentary = await commentary.save()
        return res.status(201).json(newCommentary)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllCommentarys = async(req, res) => {
    try {
        const commentarys = await Commentary.find()
        return res.status(200).json(commentarys)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getCommentaryById = async(req,res) => {
    try {
        const commentary = await Commentary.findById(req.params.id)
        if(!commentary){
            return res.status(404).json({message: "commentary doesn't exist"})
        }
        return res.status(200).json(commentary)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateCommentary = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = commentaryValidation(body).commentaryUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedCommentary = await Commentary.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedCommentary){
            res.status(404).json({message: "commentary doesn't exist"})
        }
        return res.status(200).json(updatedCommentary)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteCommentary = async(req, res) => {
    try {
        const commentary = await Commentary.findByIdAndDelete(req.params.id)
        if(!commentary){
            return res.status(404).json({message: "commentary doesn't exist"})
        }
        return res.status(200).json({message: "commentary has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createCommentary, getAllCommentarys, getCommentaryById, updateCommentary, deleteCommentary }