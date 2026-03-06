import React from 'react';
import Navbar from '../components/Navbar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import AnalyticsCard from '../components/Profile/AnalyticsCard';
import ActivityCard from '../components/Profile/ActivityCard';
import ExperienceCard from '../components/Profile/ExperienceCard';
import SkillsCard from '../components/Profile/SkillsCard';
import InterestsCard from '../components/Profile/InterestsCard';
import RightSidebar from '../components/Sidebar/RightSidebar';
import './ProfilePage.css';

const ProfilePage = () => {
    return (
        <div className="profile-page-container">
            <Navbar />
            <main className="profile-main-wrapper">
                <div className="profile-main-layout">
                    <div className="profile-center-column">
                        <ProfileHeader />
                        <AnalyticsCard />
                        <ActivityCard />
                        <ExperienceCard />
                        <SkillsCard />
                        <InterestsCard />
                    </div>
                    <div className="profile-right-column">
                        <RightSidebar />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
