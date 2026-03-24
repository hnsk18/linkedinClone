import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/Home/LeftSidebar';
import MainFeed from '../components/Home/MainFeed';
import RightSidebarHome from '../components/Home/RightSidebarHome';
import './HomePage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [feedError, setFeedError] = useState(null);

    const loadFeed = () => {
        setFeedError(null);
        fetch(`${API_BASE}/api/posts/feed`)
            .then(res => {
                if (!res.ok) throw new Error(`Feed failed: ${res.status}`);
                return res.json();
            })
            .then(data => setPosts(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error('Feed error:', err);
                setFeedError(err.message || 'Could not load feed');
                setPosts([]);
            });
    };

    useEffect(() => {
        loadFeed();
    }, []);

    return (
        <div className="home-page-container">
            <Navbar />
            <main className="home-main-wrapper">
                <div className="home-main-layout">
                    <LeftSidebar />
                    <div className="home-feed-column">
                        {feedError && <p className="feed-error-msg">{feedError}</p>}
                        <MainFeed posts={posts} onPostCreated={loadFeed} />
                    </div>
                    <RightSidebarHome />
                </div>
            </main>
        </div>
    );
};

export default HomePage;
