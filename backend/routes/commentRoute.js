import {Router} from "express";
import { addComment, deleteComment, getCommentsByPost } from "../controller/MainController/CommentController.js";
import { auth } from "../middleware/authMiddleware.js";


const router=Router()  

router.post("/:id", auth, addComment);
router.get("/:postId/comments", auth,getCommentsByPost);
router.delete("/:commentId", auth, deleteComment);

export default router;
