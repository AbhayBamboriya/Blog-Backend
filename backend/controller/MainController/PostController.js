import { Op, Sequelize } from "sequelize";
import  Post  from "../../models/Post.js";
import Comment from "../../models/Comment.js";



export const getPosts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;

    // Search query
    const search = req.query.search || '';

    // Sequelize query
    const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },    
          { content: { [Op.iLike]: `%${search}%` } },
          { tags: { [Op.overlap]: [search] } }          
        ]
      },
      order: [['createdAt', 'DESC']], 
      limit,
      offset
    });

    const totalPages = Math.ceil(totalPosts / limit);

    res.json({ posts, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};



export const createPost = async (req, res) => {
  try {
    
    const { title, content, tags, status } = req.body;
    console.log('sksk',req.user);
    
    const post = await Post.create({
      title,
      content,
      tags,
      status,
      authorId: req.user.id,
      name: req.user.name
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id); 
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const deletePost = async (req, res) => {
  try {
    console.log('in delete');
    
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (req.user.role === 'USER' && post.authorId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this post" });
    }
   const t = await Post.sequelize.transaction();

try {
  await Comment.destroy({ where: { postId: id }, transaction: t });
  await Post.destroy({ where: { id }, transaction: t });
  await t.commit();
} catch (err) {
  await t.rollback();
  throw err;
}


    res.status(200).json({ msg: "Post deleted successfully", postId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags, status } = req.body;
    console.log('sskdsks');
    
    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

         if (req.user.role === 'USER' && post.authorId !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to edit this post" });
    }

      

        await post.update({
            title: title || post.title,
            content: content || post.content,
            tags: tags || post.tags,
            status: status || post.status
        });

        res.status(200).json({ msg: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ msg: "Server error during update", error: error.message });
    }
};