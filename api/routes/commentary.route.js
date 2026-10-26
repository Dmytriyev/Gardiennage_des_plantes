
import { Router } from "express";
import { createCommentary, getAllCommentaries, getCommentaryById, updateCommentary, deleteCommentary } from "../controllers/commentary.controller.js"
import auth from "../middlewares/auth.js"

const router = Router()

router.post('/new/:article_id', auth, createCommentary)
router.get('/all', getAllCommentaries)
router.get('/:id', getCommentaryById)
router.put('/:id', auth, updateCommentary)
router.delete('/:id', auth, deleteCommentary)

export default router