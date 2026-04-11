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
    const [isLoading, setIsLoading] = useState(false);
    
    // We want a reactive reference for whether it's currently loading,
    // so the scroll handler doesn't double-fire. UseRef holds the latest values.
    const isLoadingRef = React.useRef(false);
    const seenPostsRef = React.useRef(new Set());
    const nextPageRef = React.useRef(0);
    const hasMoreRef = React.useRef(true);
    
    const size = 10;

    const loadFeed = (isInitial = false) => {
        if (isLoadingRef.current) return;
        if (!isInitial && !hasMoreRef.current) return;

        isLoadingRef.current = true;
        setIsLoading(true);
        setFeedError(null);

        if (isInitial) {
            seenPostsRef.current = new Set();
            nextPageRef.current = 0;
            hasMoreRef.current = true;
        }

        const page = nextPageRef.current;

        fetch(`${API_BASE}/api/posts/feed?size=${size}&page=${page}`)
            .then(res => {
                if (!res.ok) throw new Error(`Feed failed: ${res.status}`);
                return res.json();
            })
            .then(data => {
                const newPosts = Array.isArray(data) ? data : [];
                
                // Deduplicate
                const uniquePosts = [];
                newPosts.forEach(post => {
                    if (!seenPostsRef.current.has(post.id)) {
                        seenPostsRef.current.add(post.id);
                        uniquePosts.push(post);
                    }
                });

                if (isInitial) {
                    setPosts(uniquePosts);
                } else {
                    setPosts(prev => [...prev, ...uniquePosts]);
                }
                if (uniquePosts.length > 0) {
                    nextPageRef.current = page + 1;
                }
                if (uniquePosts.length < size) {
                    hasMoreRef.current = false;
                }
            })
            .catch(err => {
                console.error('Feed error:', err);
                setFeedError(err.message || 'Could not load feed');
                if (isInitial) setPosts([]);
            })
            .finally(() => {
                isLoadingRef.current = false;
                setIsLoading(false);
            });
    };

    useEffect(() => {
        // Initial load
        loadFeed(true);

        const handleScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const innerHeight = window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight;
            
            // Trigger fetch when user is close to the bottom
            if (innerHeight + scrollY >= scrollHeight - 300) {
                loadFeed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="home-page-container">
            <Navbar />
            <main className="home-main-wrapper">
                <div className="home-main-layout">
                    <LeftSidebar />
                    <div className="home-feed-column">
                        {feedError && <p className="feed-error-msg">{feedError}</p>}
                        {/* We pass a manual refresh handler that behaves like initial load */}
                        <MainFeed posts={posts} onPostCreated={() => loadFeed(true)} />
                        {isLoading && <p style={{ textAlign: 'center', padding: '10px', color: '#666' }}>Loading more posts...</p>}
                    </div>
                    <RightSidebarHome />
                </div>
            </main>
        </div>
    );
};

export default HomePage;
