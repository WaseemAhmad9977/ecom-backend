import { Router } from "express";
import { fetchUser, login, signup,session,logout } from "./user.controller";
import { AdminUserGuard,adminGuard,userGuard } from "../middleware/guard.middleware";

const UserRouter = Router()

UserRouter.get('/',adminGuard,fetchUser)
UserRouter.post('/signup',signup)
UserRouter.post('/login',login)
UserRouter.get('/session',AdminUserGuard,session)
UserRouter.get('/logout',logout)


export default UserRouter