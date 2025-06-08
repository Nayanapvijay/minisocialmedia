import React, { useState } from 'react';
import './PostCard.css';

const PostCard = ({ post, onLike }) => {
  const [liked, setLiked] = useState(false);

 const handleLike = async (postId) => {
  try {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: 'PUT',
    });

    const updatedPost = await res.json();
    console.log('Updated Post:', updatedPost); // Debug this!

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  } catch (error) {
    console.error('Error liking post:', error);
  }
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-avatar">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <div className="username">{post.username}</div>
          <div className="timestamp">{formatDate(post.createdAt)}</div>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <div className="post-image">
            <img src={post.image || "/placeholder.svg"} alt="Post content" />
          </div>
        )}
      </div>

      <div className="post-actions">
        <button
  onClick={() => handleLike(post._id)}
  className="mt-2 text-blue-500 hover:underline"
>
  ❤️ Like ({post.likes})
</button>
        
        <button className="action-btn comment-btn">
          <span className="icon">💬</span>
          <span>Comment</span>
        </button>
        
        <button className="action-btn share-btn">
          <span className="icon">🔄</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;