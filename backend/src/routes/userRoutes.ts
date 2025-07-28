import { Router } from "express";
import { login, logout, register } from "../controllers/userController";
import { refreshAccessToken } from "../controllers/userController";


const userRouter = Router()

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.post('/refreshToken',refreshAccessToken)
userRouter.post('/logout',logout)

export default userRouter