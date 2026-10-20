
import { Router } from "express";
import { createCategory, getAllCategorys, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js"

const router = Router()

router.post('/new', createCategory)
router.get('/all', getAllCategorys)
router.get('/:id', getCategoryById)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

export default router