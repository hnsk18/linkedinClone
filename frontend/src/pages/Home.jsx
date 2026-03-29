import React from "react";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Left Sidebar - Profile */}
      <aside className="home-sidebar-left">
        <div className="profile-card">
          <div className="profile-header"></div>
          <div className="profile-avatar">H</div>
          <h3 className="profile-name">Hemanth Sai</h3>
          <p className="profile-subtitle">CVR College of Engineering</p>
          <hr />
          <div className="profile-stat">
            <span>Profile viewers</span>
            <strong>28</strong>
          </div>
          <div className="profile-stat">
            <span>Post impressions</span>
            <strong>156</strong>
          </div>
          <hr />
          <button className="premium-btn">Try Premium</button>
        </div>

        <div className="sidebar-section">
          <a href="#">⭐ Your Premium features</a>
          <a href="#">📌 Saved items</a>
          <a href="#">👥 Groups</a>
          <a href="#">📰 Newsletters</a>
          <a href="#">🎯 Events</a>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="home-feed">
        {/* Post Creator */}
        <div className="post-creator">
          <div className="creator-header">
            <div className="avatar-small">H</div>
            <input 
              type="text" 
              placeholder="Start a post" 
              className="post-input"
            />
          </div>
          <div className="creator-actions">
            <button>📹 Video</button>
            <button>🖼️ Photo</button>
            <button>📝 Write article</button>
          </div>
        </div>

        {/* Post */}
        <div className="post-card">
          <div className="post-header">
            <div className="avatar-small">N</div>
            <div>
              <h4>NANGAAJI RUSHIKESH ✓</h4>
              <p>CVR College of Engineering, Hyderabad</p>
              <span className="post-time">1st</span>
            </div>
          </div>
          <div className="post-content">
            <p>Day 68 / 100 - LeetCode Challenge 🎯</p>
            <p>Back to Hashing + Frequency Logic today 🔥</p>
            <p>Two problems, both centered around counting smartly and making...</p>
          </div>
          <div className="post-actions">
            <button>👍 Like</button>
            <button>💬 Comment</button>
            <button>🔄 Repost</button>
            <button>➤ Send</button>
          </div>
        </div>
      </main>

      {/* Right Sidebar - News */}
      <aside className="home-sidebar-right">
        <div className="news-section">
          <h3>LinkedIn News</h3>
          <p className="news-label">Top stories</p>
          
          <div className="news-item">
            <p>Apple announces 'low-key' March 4 prod...</p>
            <span>6h ago • 16,628 readers</span>
          </div>
          
          <div className="news-item">
            <p>AI Impact Summit kicks off</p>
            <span>23h ago • 3,456 readers</span>
          </div>
          
          <div className="news-item">
            <p>India Inc profits jump in Q3</p>
            <span>3h ago • 1,175 readers</span>
          </div>

          <a href="#" className="show-more">Show more →</a>
        </div>
      </aside>
    </div>
  );
}
