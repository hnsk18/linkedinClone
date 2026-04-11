import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaUsers } from 'react-icons/fa';
import './RightSidebar.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function profilePath(person) {
    if (person.username) return `/in/${person.username}`;
    return `/profile/${person.userId}`;
}

const RightSidebar = () => {
    const navigate = useNavigate();
    const [mutual, setMutual] = useState([]);
    const [discover, setDiscover] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = useMemo(() => {
        let t = localStorage.getItem('token');
        if (!t) return null;
        try {
            t = JSON.parse(t);
        } catch (e) { /* ignore */ }
        const s = String(t).replace(/^"|"$/g, '').trim();
        return s || null;
    }, []);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/connections/suggestions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                setMutual(Array.isArray(data.mutualConnections) ? data.mutualConnections : []);
                setDiscover(Array.isArray(data.peopleYouMayKnow) ? data.peopleYouMayKnow : []);
            } catch (e) {
                console.error('Failed to load suggestions', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const sendConnect = async (toUserId) => {
        if (!token || toUserId == null) return;
        const id = Number(toUserId);
        if (!Number.isFinite(id)) return;
        try {
            const res = await fetch(`${API_BASE}/api/connections/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ toUserId: id })
            });
            if (!res.ok) {
                const t = await res.text();
                alert(t || 'Could not send invite');
                return;
            }
            setMutual((prev) => prev.filter((p) => p.userId !== id));
            setDiscover((prev) => prev.filter((p) => p.userId !== id));
        } catch (e) {
            console.error(e);
            alert('Could not send invite');
        }
    };

    const rows = [...mutual.map((p) => ({ ...p, subtitle: 'Connection of your connection' })), ...discover.map((p) => ({ ...p, subtitle: 'People you may know' }))];

    return (
        <div className="right-sidebar">
            <div className="card language-url-card">
                <div className="card-content">
                    <div className="card-header">
                        <h3>Profile language</h3>
                        <button type="button" className="icon-btn-small"><FaPen /></button>
                    </div>
                    <p className="text-secondary">English</p>

                    <div className="divider"></div>

                    <div className="card-header">
                        <h3>Public profile & URL</h3>
                        <button type="button" className="icon-btn-small"><FaPen /></button>
                    </div>
                    <p className="text-secondary text-url">www.linkedin.com/in/hemanth-naga-sai-kumar</p>
                </div>
            </div>

            <div className="card list-card">
                <div className="card-content">
                    <h3 className="card-title">People you may know</h3>
                    <p className="list-subtitle">{loading ? 'Loading…' : 'From your network'}</p>
                    {!loading && rows.length === 0 && (
                        <p className="text-secondary" style={{ fontSize: '0.9rem' }}>No suggestions right now.</p>
                    )}
                    {rows.slice(0, 6).map((person) => (
                        <div key={person.userId} className="mini-profile">
                            <div className="mini-avatar" aria-hidden>
                                {(person.name || person.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="mini-info">
                                <h4>
                                    <button
                                        type="button"
                                        onClick={() => navigate(profilePath(person))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            font: 'inherit',
                                            textAlign: 'left',
                                            color: 'inherit'
                                        }}
                                    >
                                        {person.name || person.email || 'Member'}
                                    </button>
                                </h4>
                                <p>{[person.headline, person.location].filter(Boolean).join(' · ') || person.subtitle}</p>
                                <button type="button" className="btn-outline round-btn" onClick={() => sendConnect(person.userId)}>
                                    <FaUsers /> Connect
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {rows.length > 6 && (
                    <div className="card-footer text-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/mynetwork')} role="presentation">
                        Show all
                    </div>
                )}
            </div>

        </div>
    );
};

export default RightSidebar;
