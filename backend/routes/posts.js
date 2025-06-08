const express = require('express');
const router = express.Router();
const Post = require('../models/Posts');
const mongoose = require('mongoose');


// GET /api/posts - Fetch paginated posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()

      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /api/posts - Create a new post
router.post('/', async (req, res) => {
  try {
    const { content, username, image } = req.body;

    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ error: 'Post content cannot exceed 280 characters' });
    }

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check image size if provided (base64)
    if (image && image.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size cannot exceed 5MB' });
    }

    const newPost = new Post({
      content: content.trim(),
      username: username.trim(),
      image: image || null
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id/like - Like a post
router.put('/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("Like request for post ID:", postId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log("Current likes:", post.likes);

    post.likes = (post.likes || 0) + 1; // safely increment even if undefined
    const updatedPost = await post.save();

    console.log("Updated likes:", updatedPost.likes);

    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});



module.exports = router;
