import {Router} from "express";
import { login, logout, register } from "../controller/authController.js";
import { registerValidator } from "../middleware/sanitiserMiddleware/registerValidator.js";
import { loginValidator } from "../middleware/sanitiserMiddleware/loginValidator.js";

const router=Router()  

router.post("/register",registerValidator,register);
router.post("/login",loginValidator, login);
router.post("/logout", logout);
export default router;
