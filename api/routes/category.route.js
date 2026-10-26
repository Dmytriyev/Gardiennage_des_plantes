
import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js"
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"

const router = Router()

router.post('/new', auth, admin, createCategory)
router.get('/all', getAllCategories)
router.get('/:id', getCategoryById)
router.put('/:id', auth, admin, updateCategory)
router.delete('/:id', auth, admin, deleteCategory)

export default router