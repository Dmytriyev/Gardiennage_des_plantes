
import { Router } from "express";
import { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle } from "../controllers/article.controller.js"
import auth from "../middlewares/auth.js"

const router = Router()

router.post('/new', auth, createArticle)
router.get('/all', getAllArticles)
router.get('/:id', getArticleById)
router.put('/:id', updateArticle)
router.delete('/:id', deleteArticle)

export default router