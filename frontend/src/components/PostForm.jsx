import React, { useState, useRef } from 'react';
import './PostForm.css';

const PostForm = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content, image);
      setContent('');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="post-form">
      <div className="form-header">
        <div className="user-avatar">U</div>
        <span>What's on your mind?</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          rows={4}
        />

        <div className="character-count">
          {content.length}/280
        </div>

        {image && (
          <div className="image-preview">
            <img src={image || "/placeholder.svg"} alt="Upload preview" />
            <button type="button" className="remove-image" onClick={removeImage}>
              ×
            </button>
          </div>
        )}

        <div className="form-actions">
          <div className="upload-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              📷 Add Image
            </button>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;