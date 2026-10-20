import { Router } from "express";

import { login, register, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js"

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get("/all", getAllUsers)
router.get("/:id", getUserById)
router.put("/:id", updateUser)
router.delete("/:id", auth, deleteUser)

export default router