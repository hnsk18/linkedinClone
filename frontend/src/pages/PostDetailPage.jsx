import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/Home/LeftSidebar';
import MainFeed from '../components/Home/MainFeed';
import RightSidebarHome from '../components/Home/RightSidebarHome';
import './HomePage.css';

const API_BASE = 'http://localhost:8080';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPost = () => {
        if (!id) return;
        setLoading(true);
        setError(null);

        // Fetch the post; if it is a repost, also fetch its original
        fetch(`${API_BASE}/api/posts/${id}`)
            .then(res => {
                if (res.status === 404) {
                    throw new Error('Post not found');
                }
                if (!res.ok) {
                    throw new Error(`Failed to load post (${res.status})`);
                }
                return res.json();
            })
            .then(async (data) => {
                if (data && data.repostOfId) {
                    try {
                        const resOriginal = await fetch(`${API_BASE}/api/posts/${data.repostOfId}`);
                        if (resOriginal.ok) {
                            const original = await resOriginal.json();
                            setPost({ ...data, _detailOriginal: original });
                            return;
                        }
                    } catch (e) {
                        console.error('Failed to load original post for repost detail:', e);
                    }
                }
                setPost(data);
            })
            .catch(err => {
                console.error('Post detail error:', err);
                setError(err.message || 'Could not load post');
                setPost(null);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadPost();
    }, [id]);

    return (
        <div className="home-page-container">
            <Navbar />
            <main className="home-main-wrapper">
                <div className="home-main-layout">
                    <LeftSidebar />
                    <div className="home-feed-column">
                        <button
                            type="button"
                            className="btn-primary"
                            style={{ borderRadius: 24, padding: '4px 16px', marginBottom: 8 }}
                            onClick={() => navigate('/home')}
                        >
                            Back to feed
                        </button>
                        {loading && <p className="feed-error-msg">Loading post…</p>}
                        {error && !loading && <p className="feed-error-msg">{error}</p>}
                        {!loading && !error && (
                            <MainFeed posts={post ? [post] : []} onPostCreated={loadPost} />
                        )}
                    </div>
                    <RightSidebarHome />
                </div>
            </main>
        </div>
    );
};

export default PostDetailPage;

