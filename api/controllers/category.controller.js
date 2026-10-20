import Category from "../models/category.model.js"
import categoryValidation from "../validations/category.validation.js"

const createCategory = async(req,res)=>{
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "no data in the request"})
        }
        const {error} = categoryValidation(body).categoryCreate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const category = new Category(body)
        const newCategory = await category.save()
        return res.status(201).json(newCategory)        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const getAllCategorys = async(req, res) => {
    try {
        const categorys = await Category.find()
        return res.status(200).json(categorys)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server Error", error: error})
    }
}

const getCategoryById = async(req,res) => {
    try {
        const category = await Category.findById(req.params.id)
        if(!category){
            return res.status(404).json({message: "category doesn't exist"})
        }
        return res.status(200).json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const updateCategory = async(req,res) => {
    try {
        const {body} = req
        if(!body){
            return res.status(400).json({message: "No data in the request"})
        }

        const {error} = categoryValidation(body).categoryUpdate
        if(error){
            return res.status(401).json(error.details[0].message)
        }
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, body, {new: true})
        if(!updatedCategory){
            res.status(404).json({message: "category doesn't exist"})
        }
        return res.status(200).json(updatedCategory)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

const deleteCategory = async(req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if(!category){
            return res.status(404).json({message: "category doesn't exist"})
        }
        return res.status(200).json({message: "category has been deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error", error: error})
    }
}

export { createCategory, getAllCategorys, getCategoryById, updateCategory, deleteCategory }