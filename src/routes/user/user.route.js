import express from "express"
import userCtrl from "../../controlers/user/user.ctrl.js"
import { validators } from "../../validators/auth.valid.js"
import { middlewareAll } from "../../middleware/auth.middleware.js"

const router = express.Router()

router
.post("/signup",userCtrl.signup)
.get("/verify",userCtrl.verifyUser)

.post("/login",validators.login(),userCtrl.login)
.get("/get-me",middlewareAll.getme,userCtrl.getme)
.post("/logout", userCtrl.logout)



export default router;