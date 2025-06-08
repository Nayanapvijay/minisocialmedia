import Post from "../models/Posts.js";

// GET posts with pagination
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// POST create new post
export const createPost = async (req, res) => {
  try {
    const { content, username, image } = req.body;
    if (content.length > 280) {
      return res.status(400).json({ error: "Content exceeds 280 characters" });
    }
    const newPost = new Post({ content, username, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// PUT like a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
};
