import React, { useState } from "react";
import "../styles/notifications.css";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "search",
      icon: "✨",
      title: "You appeared in 5 searches this week.",
      subtitle: "Powered by Premium",
      time: "21m"
    },
    {
      id: 2,
      type: "post",
      user: "Sumith Reddy Alluri",
      avatar: "S",
      badge: "✌️",
      title: "posted",
      description: "Day 86 / 100 – #100DaysOfLeetCode 🎯 LeetCode 205: Isomorphic Strings 🎯 LeetCode 560: Subarray Sum Equals K. Today was all about hash...",
      engagement: "607 reactions • 67 comments",
      time: "21m"
    },
    {
      id: 3,
      type: "company",
      user: "Reliance Industries Limited",
      avatar: "R",
      title: "A post by an employee at",
      subtitle: "is popular",
      description: "History has been created together with our stakeholders. In Jan'26, we achieved India's highest-ever monthly sales of 173,000 tonnes...",
      engagement: "607 reactions • 67 comments",
      time: "51m"
    },
    {
      id: 4,
      type: "post",
      user: "NANGAAJI RUSHIKESH",
      avatar: "N",
      title: "posted",
      description: "2140. Solving Questions With Brainpower (Medium) 🎯 Goal You are given: questions[i] = [points, brainpower]. If you solve question i: You gain points. You must skip...",
      time: "2h"
    },
    {
      id: 5,
      type: "job",
      company: "Software Engineering at Microsoft",
      avatar: "M",
      title: "and 9 other recommendations for you.",
      description: "Software Engineering at Microsoft and 9 other recommendations for you.",
      button: "View jobs",
      time: "4h"
    },
    {
      id: 6,
      type: "job",
      company: "java software engineer: new opportunities in Bengaluru.",
      avatar: "D",
      title: "java software engineer: new opportunities in Bengaluru.",
      button: "View jobs",
      time: "5h"
    },
    {
      id: 7,
      type: "post",
      user: "Srinivash Misyule",
      avatar: "R",
      title: "posted",
      description: "Excited to share that I successfully completed the Six Security Phase in the Mastering Shell Scripting Quest course. The hands-on exercises...",
      engagement: "234 reactions • 45 comments",
      time: "6h"
    },
    {
      id: 8,
      type: "post",
      user: "Techosarath Reddy Chukka",
      avatar: "T",
      title: "posted",
      description: "2150. Find All Lonely Numbers in the Array | LeetCode Daily | Day 41/100 @LeetCode Completed LeetCode 2150: Find All Lonely Numbers in...",
      time: "7h"
    }
  ];

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="notifications-container">
      {/* Left Sidebar */}
      <aside className="notifications-sidebar">
        <div className="profile-banner">
          <div className="banner-image"></div>
          <div className="banner-content">
            <div className="profile-avatar-large">h</div>
            <h3>hemanth naga sai</h3>
            <p className="profile-education">Attended CVR College of Engineering, Hyderabad</p>
            <div className="profile-meta">
              <span>Guntur East, Andhra Pradesh</span>
              <span>CVR College of Engineering, Hyderabad</span>
            </div>
            <button className="premium-btn">Try Premium</button>
          </div>
        </div>

        <div className="manage-notifications">
          <p>Manage your notifications</p>
          <a href="#">View settings</a>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="notifications-feed">
        <div className="filter-tabs">
          <button 
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={`tab ${filter === "job" ? "active" : ""}`}
            onClick={() => setFilter("job")}
          >
            Jobs
          </button>
          <button 
            className={`tab ${filter === "post" ? "active" : ""}`}
            onClick={() => setFilter("post")}
          >
            My posts
          </button>
          <button 
            className={`tab ${filter === "mention" ? "active" : ""}`}
            onClick={() => setFilter("mention")}
          >
            Mentions
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications at the moment</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-dot"></div>
                
                {notification.type === "search" ? (
                  <>
                    <div className="notification-avatar small">{notification.icon}</div>
                    <div className="notification-body">
                      <p className="notification-main">{notification.title}</p>
                      <p className="notification-premium">{notification.subtitle}</p>
                    </div>
                  </>
                ) : notification.type === "job" ? (
                  <>
                    <div className="notification-avatar">{notification.avatar}</div>
                    <div className="notification-body">
                      <p className="notification-main">{notification.company} <strong>{notification.title}</strong></p>
                    </div>
                    <button className="view-jobs-btn">{notification.button}</button>
                  </>
                ) : notification.type === "company" ? (
                  <>
                    <div className="notification-avatar">{notification.avatar}</div>
                    <div className="notification-body">
                      <p className="notification-main">
                        <strong>{notification.title}</strong> {notification.user} <strong>{notification.subtitle}:</strong>
                      </p>
                      <p className="notification-description">{notification.description}</p>
                      {notification.engagement && (
                        <p className="notification-engagement">{notification.engagement}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="notification-avatar">
                      {notification.avatar}
                    </div>
                    <div className="notification-body">
                      <p className="notification-main">
                        <strong>{notification.user}</strong> {notification.badge} {notification.title}
                      </p>
                      <p className="notification-description">{notification.description}</p>
                      {notification.engagement && (
                        <p className="notification-engagement">{notification.engagement}</p>
                      )}
                    </div>
                  </>
                )}
                
                <div className="notification-time">{notification.time}</div>
                <button className="notification-menu">⋮</button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="notifications-sidebar-right">
        <div className="job-card">
          <div className="job-card-header">LinkedIn</div>
          <div className="job-card-content">
            <p className="job-title">Your job search <strong>powered by your network</strong></p>
            <button className="explore-jobs">Explore jobs</button>
            <img src="data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23e5e5e5' width='100' height='100'/%3E%3C/svg%3E" alt="Job search" className="job-image" />
          </div>
        </div>

        <div className="sidebar-links">
          <a href="#">About</a>
          <a href="#">Accessibility</a>
          <a href="#">Help Center</a>
        </div>

        <div className="sidebar-links">
          <a href="#">Privacy & Terms</a>
          <a href="#">Ad Choices</a>
          <a href="#">Advertising</a>
          <a href="#">Business Services</a>
        </div>

        <div className="sidebar-links">
          <a href="#">Get the LinkedIn app</a>
          <a href="#">More</a>
        </div>

        <div className="copyright">
          <p><img src="data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%230a66c2' width='20' height='20'/%3E%3C/svg%3E" alt="LinkedIn" /> LinkedIn LinkedIn Corporation © 2026</p>
        </div>
      </aside>
    </div>
  );
}
