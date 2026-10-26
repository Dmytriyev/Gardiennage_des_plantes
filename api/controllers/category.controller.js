import Category from "../models/category.model.js"
import categoryValidation from "../validations/category.validation.js"
import handleError from "../utils/handleError.js"

const createCategory = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Pas de données dans la requête"})
        }
        const {error} = categoryValidation(body).categoryCreate
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }
        const category = new Category(body)
        const newCategory = await category.save()
        return res.status(201).json(newCategory)
    } catch (error) {
        handleError(res, error)
    }
}

const getAllCategories = async(req, res) => {
    try {
        const categories = await Category.find()
        return res.status(200).json(categories)
    } catch (error) {
        handleError(res, error)
    }
}

const getCategoryById = async(req,res) => {
    try {
        const category = await Category.findById(req.params.id)
        if(!category){
            return res.status(404).json({message: "Catégorie introuvable"})
        }
        return res.status(200).json(category)
    } catch (error) {
        handleError(res, error)
    }
}

const updateCategory = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "Pas de données dans la requête"})
        }

        const {error} = categoryValidation(body).categoryUpdate
        if(error){
            return res.status(400).json({message: error.details[0].message})
        }
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedCategory){
            return res.status(404).json({message: "Catégorie introuvable"})
        }
        return res.status(200).json(updatedCategory)
    } catch (error) {
        handleError(res, error)
    }
}

const deleteCategory = async(req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if(!category){
            return res.status(404).json({message: "Catégorie introuvable"})
        }
        return res.status(200).json({message: "La catégorie a bien été supprimée"})
    } catch (error) {
        handleError(res, error)
    }
}

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory }
