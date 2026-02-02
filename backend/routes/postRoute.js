import {Router} from "express";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../controller/MainController/PostController.js";
import { auth } from "../middleware/authMiddleware.js";
import {role} from "../middleware/roleMiddleware.js"

const router=Router()  

router.get("/", getPosts);
router.post("/create", auth, createPost);
router.get('/:id', getPostById);
router.delete("/:id", auth,deletePost);
router.put("/edit/:id", auth, updatePost);
export default router;