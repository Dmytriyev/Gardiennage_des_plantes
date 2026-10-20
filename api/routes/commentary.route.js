
import { Router } from "express";
import { createCommentary, getAllCommentarys, getCommentaryById, updateCommentary, deleteCommentary } from "../controllers/commentary.controller.js"
import auth from "../middlewares/auth.js"

const router = Router()

router.post('/new/:article_id', auth, createCommentary)
router.get('/all', getAllCommentarys)
router.get('/:id', getCommentaryById)
router.put('/:id', updateCommentary)
router.delete('/:id', deleteCommentary)

export default router