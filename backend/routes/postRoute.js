import {Router} from "express";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../controller/MainController/PostController.js";
import { auth } from "../middleware/authMiddleware.js";
import {role} from "../middleware/roleMiddleware.js"
import { createPostValidator } from "../middleware/sanitiserMiddleware/postValidator.js";
import { updatePostValidator } from "../middleware/sanitiserMiddleware/updatePostValidator.js";

const router=Router()  

router.get("/", getPosts);
router.post("/create", auth, createPostValidator, createPost);
router.get('/:id', getPostById);
router.delete("/:id", auth,deletePost);
router.put("/edit/:id", auth,updatePostValidator, updatePost);
export default router;