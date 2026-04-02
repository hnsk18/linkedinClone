import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import AnalyticsCard from '../components/Profile/AnalyticsCard';
import ActivityCard from '../components/Profile/ActivityCard';
import ExperienceCard from '../components/Profile/ExperienceCard';
import SkillsCard from '../components/Profile/SkillsCard';
import InterestsCard from '../components/Profile/InterestsCard';
import HighlightsCard from '../components/Profile/HighlightsCard';
import AboutCard from '../components/Profile/AboutCard';
import RightSidebar from '../components/Sidebar/RightSidebar';
import Modal from '../components/common/Modal';
import JobPreferencesModal from '../components/Profile/JobPreferencesModal';
import EditJobPreferencesModal from '../components/Profile/EditJobPreferencesModal';
import './ProfilePage.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const ProfilePage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null); // 'intro' | 'experience' | 'education' | 'skill' | 'cert' | 'editExperience' | 'editEducation' | 'editCert' | 'editSkills'
    const [saving, setSaving] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [me, setMe] = useState(null);

    const token = useMemo(() => {
        let t = localStorage.getItem("token");
        if (!t) return null;
        try {
            t = JSON.parse(t);
        } catch (e) { }
        return t.replace(/^"|"$/g, "");
    }, []);

    const routeIdentifier = params.username || params.userId || null;
    const fetchIdentifier = routeIdentifier ?? me?.username ?? me?.id ?? null;
    const isMyProfile = !routeIdentifier || (me?.id != null && (routeIdentifier === String(me.id) || routeIdentifier === me.username));
    const [connectionStatus, setConnectionStatus] = useState('LOADING');

    useEffect(() => {
        const loadMe = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
                    if (res.status === 401 || res.status === 404) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    } else {
                        setError('Could not authenticate. Please try again.');
                        setLoading(false);
                    }
                    return;
                }
                setMe(await res.json());
            } catch (e) {
                console.error("Failed to load me", e);
                setError('Could not authenticate. Please try again.');
                setLoading(false);
            }
        };
        loadMe();
    }, [routeIdentifier, token, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!fetchIdentifier) return;
                setLoading(true);
                setError(null);

                const [profileRes, postsRes] = await Promise.all([
                    fetch(`${API_BASE}/api/profile/${fetchIdentifier}`),
                    fetch(`${API_BASE}/api/profile/${fetchIdentifier}/posts`)
                ]);

                if (!profileRes.ok) {
                    throw new Error(`Profile request failed with status ${profileRes.status}`);
                }
                if (!postsRes.ok) {
                    throw new Error(`Posts request failed with status ${postsRes.status}`);
                }

                const profileData = await profileRes.json();
                const postsData = await postsRes.json();

                setProfile(profileData);
                setPosts(postsData);
            } catch (e) {
                console.error('Failed to load profile', e);
                setError('Could not load profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [fetchIdentifier]);

    useEffect(() => {
        const loadStatus = async () => {
            if (!token) return;
            if (isMyProfile) {
                setConnectionStatus('NONE');
                return;
            }
            if (!profile?.user?.id) return;
            try {
                const res = await fetch(`${API_BASE}/api/connections/status?userId=${profile.user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                setConnectionStatus(data?.status || 'NONE');
            } catch (e) {
                console.error("Failed to load connection status", e);
                setConnectionStatus('NONE');
            }
        };
        loadStatus();
    }, [token, isMyProfile, profile?.user?.id]);

    const sendConnectRequest = async () => {
        if (!token || !profile?.user?.id) return;
        try {
            const res = await fetch(`${API_BASE}/api/connections/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ toUserId: profile.user.id })
            });
            if (!res.ok) {
                const t = await res.text();
                alert(t || "Failed to send request");
                return;
            }
            setConnectionStatus('PENDING_OUTGOING');
        } catch (e) {
            console.error(e);
            alert("Failed to send request");
        }
    };

    const openMessage = () => {
        if (!profile?.user?.id) return;
        navigate(`/messaging?toUserId=${profile.user.id}&toEmail=${encodeURIComponent(profile.user.email || "")}`);
    };

    const refresh = async () => {
        const [profileRes, postsRes] = await Promise.all([
            fetch(`${API_BASE}/api/profile/${fetchIdentifier}`),
            fetch(`${API_BASE}/api/profile/${fetchIdentifier}/posts`)
        ]);
        if (profileRes.ok) setProfile(await profileRes.json());
        if (postsRes.ok) setPosts(await postsRes.json());
    };

    const saveIntro = async (e) => {
        e.preventDefault();
        if (!profile?.user) return;
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/users/${me.id}/intro`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    name: payload.name,
                    headline: payload.headline,
                    location: payload.location,
                    college: payload.college,
                    about: payload.about
                })
            });
            if (!res.ok) throw new Error("Failed to update intro");
            const updatedUser = await res.json();
            setProfile((p) => (p ? { ...p, user: updatedUser } : p));
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to save intro");
        } finally {
            setSaving(false);
        }
    };

    const addExperience = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/experience`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: payload.title,
                    company: payload.company,
                    employmentType: payload.employmentType,
                    startDate: payload.startDate || null,
                    endDate: payload.endDate || null,
                    description: payload.description
                })
            });
            if (!res.ok) throw new Error("Failed to add experience");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add experience");
        } finally {
            setSaving(false);
        }
    };

    const addEducation = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/education`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    collegeName: payload.collegeName,
                    degree: payload.degree,
                    fieldOfStudy: payload.fieldOfStudy,
                    startYear: payload.startYear ? Number(payload.startYear) : null,
                    endYear: payload.endYear ? Number(payload.endYear) : null
                })
            });
            if (!res.ok) throw new Error("Failed to add education");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add education");
        } finally {
            setSaving(false);
        }
    };

    const addSkill = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/skill`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: payload.name })
            });
            if (!res.ok) throw new Error("Failed to add skill");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add skill");
        } finally {
            setSaving(false);
        }
    };

    const addCertification = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/certification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: payload.title,
                    organization: payload.organization,
                    issueDate: payload.issueDate || null,
                    credentialId: payload.credentialId,
                    credentialUrl: payload.credentialUrl
                })
            });
            if (!res.ok) throw new Error("Failed to add certification");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add certification");
        } finally {
            setSaving(false);
        }
    };

    const updateExperience = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/experience/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: payload.title,
                    company: payload.company,
                    employmentType: payload.employmentType,
                    startDate: payload.startDate || null,
                    endDate: payload.endDate || null,
                    description: payload.description
                })
            });
            if (!res.ok) throw new Error("Failed to update experience");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update experience");
        } finally {
            setSaving(false);
        }
    };

    const updateEducation = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/education/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    collegeName: payload.collegeName,
                    degree: payload.degree,
                    fieldOfStudy: payload.fieldOfStudy,
                    startYear: payload.startYear ? Number(payload.startYear) : null,
                    endYear: payload.endYear ? Number(payload.endYear) : null
                })
            });
            if (!res.ok) throw new Error("Failed to update education");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update education");
        } finally {
            setSaving(false);
        }
    };

    const updateCertification = async (e) => {
        e.preventDefault();
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        const form = new FormData(e.currentTarget);
        const payload = Object.fromEntries(form.entries());
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/certification/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: payload.title,
                    organization: payload.organization,
                    issueDate: payload.issueDate || null,
                    credentialId: payload.credentialId,
                    credentialUrl: payload.credentialUrl
                })
            });
            if (!res.ok) throw new Error("Failed to update certification");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update certification");
        } finally {
            setSaving(false);
        }
    };

    const removeSkill = async (skillId) => {
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        try {
            setSaving(true);
            const res = await fetch(`${API_BASE}/api/profile/${me.id}/skill/${skillId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to remove skill");
            await refresh();
        } catch (err) {
            console.error(err);
            alert("Failed to remove skill");
        } finally {
            setSaving(false);
        }
    };

    const updateJobPreferences = async (patch) => {
        if (!isMyProfile) {
            alert("You can only edit your own profile.");
            return;
        }
        try {
            setSaving(true);
            const res = await fetch(`http://localhost:8080/api/profile/${me.id}/job-preferences`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch)
            });
            if (!res.ok) throw new Error("Failed to update job preferences");
            await refresh();
            setModal(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update job preferences");
        } finally {
            setSaving(false);
        }
    };

    const uploadPhoto = async (type, file) => {
        if (!isMyProfile || !file) return;
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const res = await fetch(`${API_BASE}/api/users/${me.id}/photo?type=${type}`, {
                method: "POST",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: formData
            });

            if (!res.ok) throw new Error(`Failed to upload ${type} photo`);
            const updatedUser = await res.json();
            
            setProfile((p) => (p ? { ...p, user: updatedUser } : p));
            setMe((m) => (m ? { ...m, ...updatedUser } : m));
        } catch (err) {
            console.error(err);
            alert(`Failed to upload ${type} photo`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-page-container">
            <Navbar />
            <main className="profile-main-wrapper">
                <div className="profile-main-layout">
                    <div className="profile-center-column">
                        {loading && <p>Loading profile...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {profile && (
                            <>
                                <ProfileHeader
                                    user={profile.user}
                                    experience={profile.experience}
                                    education={profile.education}
                                    jobPreference={profile.jobPreference}
                                    isMyProfile={isMyProfile}
                                    onEditIntro={isMyProfile ? () => setModal('intro') : undefined}
                                    connectionStatus={connectionStatus}
                                    onConnect={sendConnectRequest}
                                    onMessage={openMessage}
                                    onPhotoUpload={uploadPhoto}
                                />
                                <AnalyticsCard analytics={profile.analytics} />
                                <ActivityCard user={profile.user} posts={posts} />
                                <ExperienceCard
                                    experiences={profile.experience}
                                    education={profile.education}
                                    certifications={profile.certifications}
                                    onAddExperience={isMyProfile ? () => setModal('experience') : undefined}
                                    onAddEducation={isMyProfile ? () => setModal('education') : undefined}
                                    onAddCertification={isMyProfile ? () => setModal('cert') : undefined}
                                    onEditExperience={isMyProfile ? () => {
                                        const first = profile.experience?.[0];
                                        if (!first) return setModal('experience');
                                        setSelectedId(first.id);
                                        setModal('editExperience');
                                    } : undefined}
                                    onEditEducation={isMyProfile ? () => {
                                        const first = profile.education?.[0];
                                        if (!first) return setModal('education');
                                        setSelectedId(first.id);
                                        setModal('editEducation');
                                    } : undefined}
                                    onEditCertification={isMyProfile ? () => {
                                        const first = profile.certifications?.[0];
                                        if (!first) return setModal('cert');
                                        setSelectedId(first.id);
                                        setModal('editCert');
                                    } : undefined}
                                />
                                <SkillsCard
                                    skills={profile.skills}
                                    onAddSkill={isMyProfile ? () => setModal('skill') : undefined}
                                    onEditSkills={isMyProfile ? () => setModal('editSkills') : undefined}
                                />
                            </>
                        )}

                        {!loading && !error && !profile && (
                            <p>Profile not found.</p>
                        )}

                        <InterestsCard />
                    </div>
                    <div className="profile-right-column">
                        <RightSidebar />
                    </div>
                </div>
            </main>

            {modal === 'intro' && (
                <Modal title="Edit intro" onClose={() => setModal(null)}>
                    <form onSubmit={saveIntro}>
                        <div className="lu-form-grid">
                            <div className="lu-field">
                                <label>Name</label>
                                <input name="name" defaultValue={profile?.user?.name || ''} />
                            </div>
                            <div className="lu-field">
                                <label>Headline</label>
                                <input name="headline" defaultValue={profile?.user?.headline || ''} />
                            </div>
                            <div className="lu-field">
                                <label>Location</label>
                                <input name="location" defaultValue={profile?.user?.location || ''} />
                            </div>
                            <div className="lu-field">
                                <label>College</label>
                                <input name="college" defaultValue={profile?.user?.college || ''} />
                            </div>
                            <div className="lu-field full">
                                <label>About</label>
                                <textarea name="about" defaultValue={profile?.user?.about || ''} />
                            </div>
                        </div>
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'experience' && (
                <Modal title="Add experience" onClose={() => setModal(null)}>
                    <form onSubmit={addExperience}>
                        <div className="lu-form-grid">
                            <div className="lu-field">
                                <label>Title</label>
                                <input name="title" required />
                            </div>
                            <div className="lu-field">
                                <label>Company</label>
                                <input name="company" required />
                            </div>
                            <div className="lu-field">
                                <label>Employment type</label>
                                <input name="employmentType" placeholder="Full-time / Part-time / Internship" />
                            </div>
                            <div className="lu-field">
                                <label>Start date</label>
                                <input name="startDate" type="date" />
                            </div>
                            <div className="lu-field">
                                <label>End date</label>
                                <input name="endDate" type="date" />
                            </div>
                            <div className="lu-field full">
                                <label>Description</label>
                                <textarea name="description" />
                            </div>
                        </div>
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'education' && (
                <Modal title="Add education" onClose={() => setModal(null)}>
                    <form onSubmit={addEducation}>
                        <div className="lu-form-grid">
                            <div className="lu-field full">
                                <label>College name</label>
                                <input name="collegeName" required />
                            </div>
                            <div className="lu-field">
                                <label>Degree</label>
                                <input name="degree" />
                            </div>
                            <div className="lu-field">
                                <label>Field of study</label>
                                <input name="fieldOfStudy" />
                            </div>
                            <div className="lu-field">
                                <label>Start year</label>
                                <input name="startYear" type="number" />
                            </div>
                            <div className="lu-field">
                                <label>End year</label>
                                <input name="endYear" type="number" />
                            </div>
                        </div>
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'skill' && (
                <Modal title="Add skill" onClose={() => setModal(null)}>
                    <form onSubmit={addSkill}>
                        <div className="lu-form-grid">
                            <div className="lu-field full">
                                <label>Skill</label>
                                <input name="name" placeholder="e.g., Java, React" required />
                            </div>
                        </div>
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'cert' && (
                <Modal title="Add certification" onClose={() => setModal(null)}>
                    <form onSubmit={addCertification}>
                        <div className="lu-form-grid">
                            <div className="lu-field full">
                                <label>Title</label>
                                <input name="title" required />
                            </div>
                            <div className="lu-field full">
                                <label>Organization</label>
                                <input name="organization" />
                            </div>
                            <div className="lu-field">
                                <label>Issue date</label>
                                <input name="issueDate" type="date" />
                            </div>
                            <div className="lu-field">
                                <label>Credential ID</label>
                                <input name="credentialId" />
                            </div>
                            <div className="lu-field full">
                                <label>Credential URL</label>
                                <input name="credentialUrl" />
                            </div>
                        </div>
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'editExperience' && (
                <Modal title="Edit experience" onClose={() => setModal(null)}>
                    <form onSubmit={updateExperience}>
                        <div className="lu-field full" style={{ marginBottom: 12 }}>
                            <label>Select experience</label>
                            <select
                                value={selectedId || ''}
                                onChange={(e) => setSelectedId(Number(e.target.value))}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.18)' }}
                            >
                                {(profile?.experience || []).map((exp) => (
                                    <option key={exp.id} value={exp.id}>
                                        {exp.title} @ {exp.company}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(() => {
                            const exp = (profile?.experience || []).find((x) => x.id === selectedId);
                            if (!exp) return null;
                            return (
                                <div className="lu-form-grid">
                                    <div className="lu-field">
                                        <label>Title</label>
                                        <input name="title" defaultValue={exp.title || ''} required />
                                    </div>
                                    <div className="lu-field">
                                        <label>Company</label>
                                        <input name="company" defaultValue={exp.company || ''} required />
                                    </div>
                                    <div className="lu-field">
                                        <label>Employment type</label>
                                        <input name="employmentType" defaultValue={exp.employmentType || ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>Start date</label>
                                        <input name="startDate" type="date" defaultValue={exp.startDate || ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>End date</label>
                                        <input name="endDate" type="date" defaultValue={exp.endDate || ''} />
                                    </div>
                                    <div className="lu-field full">
                                        <label>Description</label>
                                        <textarea name="description" defaultValue={exp.description || ''} />
                                    </div>
                                </div>
                            );
                        })()}
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'editEducation' && (
                <Modal title="Edit education" onClose={() => setModal(null)}>
                    <form onSubmit={updateEducation}>
                        <div className="lu-field full" style={{ marginBottom: 12 }}>
                            <label>Select education</label>
                            <select
                                value={selectedId || ''}
                                onChange={(e) => setSelectedId(Number(e.target.value))}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.18)' }}
                            >
                                {(profile?.education || []).map((edu) => (
                                    <option key={edu.id} value={edu.id}>
                                        {edu.collegeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(() => {
                            const edu = (profile?.education || []).find((x) => x.id === selectedId);
                            if (!edu) return null;
                            return (
                                <div className="lu-form-grid">
                                    <div className="lu-field full">
                                        <label>College name</label>
                                        <input name="collegeName" defaultValue={edu.collegeName || ''} required />
                                    </div>
                                    <div className="lu-field">
                                        <label>Degree</label>
                                        <input name="degree" defaultValue={edu.degree || ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>Field of study</label>
                                        <input name="fieldOfStudy" defaultValue={edu.fieldOfStudy || ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>Start year</label>
                                        <input name="startYear" type="number" defaultValue={edu.startYear ?? ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>End year</label>
                                        <input name="endYear" type="number" defaultValue={edu.endYear ?? ''} />
                                    </div>
                                </div>
                            );
                        })()}
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'editCert' && (
                <Modal title="Edit certification" onClose={() => setModal(null)}>
                    <form onSubmit={updateCertification}>
                        <div className="lu-field full" style={{ marginBottom: 12 }}>
                            <label>Select certification</label>
                            <select
                                value={selectedId || ''}
                                onChange={(e) => setSelectedId(Number(e.target.value))}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.18)' }}
                            >
                                {(profile?.certifications || []).map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(() => {
                            const cert = (profile?.certifications || []).find((x) => x.id === selectedId);
                            if (!cert) return null;
                            return (
                                <div className="lu-form-grid">
                                    <div className="lu-field full">
                                        <label>Title</label>
                                        <input name="title" defaultValue={cert.title || ''} required />
                                    </div>
                                    <div className="lu-field full">
                                        <label>Organization</label>
                                        <input name="organization" defaultValue={cert.organization || ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>Issue date</label>
                                        <input name="issueDate" type="date" defaultValue={cert.issueDate || ''} />
                                    </div>
                                    <div className="lu-field">
                                        <label>Credential ID</label>
                                        <input name="credentialId" defaultValue={cert.credentialId || ''} />
                                    </div>
                                    <div className="lu-field full">
                                        <label>Credential URL</label>
                                        <input name="credentialUrl" defaultValue={cert.credentialUrl || ''} />
                                    </div>
                                </div>
                            );
                        })()}
                        <div className="lu-modal-footer">
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Cancel</button>
                            <button type="submit" className="lu-btn primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {modal === 'editSkills' && (
                <Modal title="Edit skills" onClose={() => setModal(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {(profile?.skills || []).length === 0 && (
                            <p>Add skills to your profile.</p>
                        )}
                        {(profile?.skills || []).map((s) => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                <div style={{ fontWeight: 600 }}>{s.name}</div>
                                <button className="lu-btn" disabled={saving} onClick={() => removeSkill(s.id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="lu-modal-footer" style={{ justifyContent: 'flex-end' }}>
                            <button type="button" className="lu-btn" onClick={() => setModal(null)}>Done</button>
                        </div>
                    </div>
                </Modal>
            )}

            {modal === 'jobPreferences' && (
                <JobPreferencesModal
                    user={profile?.user}
                    jobPreference={profile?.jobPreference}
                    onClose={() => setModal(null)}
                    onEdit={() => setModal('editJobPreferences')}
                />
            )}

            {modal === 'editJobPreferences' && (
                <EditJobPreferencesModal
                    jobPreference={profile?.jobPreference}
                    onClose={() => setModal(null)}
                    onSave={updateJobPreferences}
                    saving={saving}
                />
            )}
        </div>
    );
};

export default ProfilePage;
