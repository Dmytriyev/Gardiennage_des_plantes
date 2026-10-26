import { Router } from "express";

import { login, register, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js"
import admin from "../middlewares/admin.js"

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get("/all", auth, admin, getAllUsers)
router.get("/:id", auth, getUserById)
router.put("/:id", auth, updateUser)
router.delete("/:id", auth, deleteUser)

export default router