import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/api";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?page=${pageNum}&limit=5`);
      if (res.data.length === 0) setHasMore(false);
      else setPosts((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div
          key={post._id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {!hasMore && <p className="text-center text-gray-400">No more posts.</p>}
    </div>
  );
};

export default Feed;
