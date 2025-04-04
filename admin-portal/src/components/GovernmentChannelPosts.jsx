// src/components/GovernmentChannelPosts.jsx
import React, { useState } from 'react';
import '../styles/GovernmentChannelPosts.css';

const GovernmentChannelPosts = ({ channelId }) => {
    // For demo, we store posts locally
    const [posts, setPosts] = useState([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postContent, setPostContent] = useState('');

    const handleOpenPostModal = () => {
        setIsPostModalOpen(true);
    };

    const handleClosePostModal = () => {
        setIsPostModalOpen(false);
        setPostContent('');
    };

    const handleSubmitPost = () => {
        // Create a new post object; in real app, call your API (e.g., PostService.createPost)
        const newPost = {
            id: `post-${Date.now()}`,
            channelId,
            content: postContent,
            author: 'Gov Servant',
            timestamp: new Date().toISOString(),
            likes: [],
            dislikes: [],
            comments: []
        };
        setPosts([newPost, ...posts]);
        handleClosePostModal();
    };

    return (
        <div className="gov-channel-posts">
            <div className="posts-header">
                <h3>Posts</h3>
                <button className="new-post-btn" onClick={handleOpenPostModal}>
                    New Post
                </button>
            </div>
            <div className="posts-list">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="post-item">
                            <div className="post-header">
                                <span className="post-author">{post.author}</span>
                                <span className="post-timestamp">
                  {new Date(post.timestamp).toLocaleString()}
                </span>
                            </div>
                            <div className="post-content">{post.content}</div>
                            {/* Here you could add likes/dislikes and reply buttons */}
                        </div>
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>

            {isPostModalOpen && (
                <div className="modal-overlay" onClick={handleClosePostModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Create New Post</h3>
                        <textarea
                            placeholder="Type your post here..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        ></textarea>
                        <div className="modal-actions">
                            <button onClick={handleSubmitPost}>Post</button>
                            <button onClick={handleClosePostModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovernmentChannelPosts;
