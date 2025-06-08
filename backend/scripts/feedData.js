const mongoose = require('mongoose');
const Post = require('../models/Posts');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia');

const samplePosts = [
  {
    content: "Welcome to our social media platform! 🎉 This is the first post to get things started.",
    username: "admin",
    likes: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    content: "Just had an amazing coffee this morning! ☕ Nothing beats a good start to the day.",
    username: "coffeeaddict",
    likes: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
  },
  {
    content: "Working on some exciting new features for our platform. Can't wait to share them with you all! 💻✨",
    username: "developer",
    likes: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
];

// Generate more sample posts
for (let i = 4; i <= 50; i++) {
  samplePosts.push({
    content: `This is post number ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    username: `user${i}`,
    likes: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * (i + 2))
  });
}

async function feedData() {
  try {
    await Post.deleteMany({});
    await Post.insertMany(samplePosts);
    console.log('Sample data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

feedData();