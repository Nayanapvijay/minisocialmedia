import React, { useState, useEffect } from 'react';

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [imageData, setImageData] = useState(null); // base64 image string
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts?page=1&limit=10');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  }

  // Handle image file upload and convert to base64 string
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  }

  // Submit new post
  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }

    if (!content.trim()) {
      alert('Please enter post content');
      return;
    }

    if (content.length > 280) {
      alert('Content cannot exceed 280 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          content: content.trim(),
          image: imageData, // base64 string or null
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Failed to create post');
        setLoading(false);
        return;
      }

      const newPost = await res.json();
      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setImageData(null);
      e.target.reset(); // reset file input
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    }

    setLoading(false);
  }

  // Like a post handler
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



  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Feed</h1>

      {/* New Post Form */}
      <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded shadow">
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          maxLength={50}
          required
        />
        <textarea
          placeholder="What's on your mind? (max 280 chars)"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          maxLength={280}
          rows={3}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2"
        />
        {imageData && (
          <img
            src={imageData}
            alt="Preview"
            className="mb-2 max-h-40 object-contain border"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to post!</p>
        ) : (
          posts.map(post => (
            <div
              key={post._id}
              className="border p-4 rounded shadow bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span className="font-semibold">{post.username}</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <p className="mb-2">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="mb-2 max-w-full max-h-60 object-contain rounded"
                />
              )}
             <button
  onClick={() => handleLike(post._id)}
  className="mt-2 text-blue-500 hover:underline"
>
  ❤️ Like ({post.likes})
</button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
