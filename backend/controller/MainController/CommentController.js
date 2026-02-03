import Comment from "../../models/Comment.js";
import  Post  from "../../models/Post.js";
import User from "../../models/User.js";

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    console.log('ekrke',req.user);
   
     if (req.user=== null) {
      return res.status(403).json({ msg: "Not authorized to add comment" });
    }
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = await Comment.create({
      text,
      postId: id,
      userId: req.user.id 
    });

    const commentWithUser = await Comment.findByPk(comment.id, { include: 'user' });

    res.status(201).json(commentWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};




export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name'] 
      },
      order: [['createdAt', 'DESC']]
    });

    res.status(201).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch comments" });
  }
};



export const deleteComment = async (req, res) => {
  try {
    console.log('in delete');
    
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    console.log('cc',comment,req.user.id);
    
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
      if (req.user.role === 'USER' && comment.userId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this post" });
    }

  

    await comment.destroy();

    res.status(201).json({ msg: "Comment deleted successfully", commentId });
  } catch (err) {
    console.error('dddsdd',err);
    res.status(500).json({ msg: "Server error" });
  }
};