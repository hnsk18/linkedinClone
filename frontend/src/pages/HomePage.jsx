import React from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/Home/LeftSidebar';
import MainFeed from '../components/Home/MainFeed';
import RightSidebarHome from '../components/Home/RightSidebarHome';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page-container">
            <Navbar />
            <main className="home-main-wrapper">
                <div className="home-main-layout">
                    <LeftSidebar />
                    <MainFeed />
                    <RightSidebarHome />
                </div>
            </main>
        </div>
    );
};

export default HomePage;
