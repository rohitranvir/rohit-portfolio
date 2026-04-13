import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';

export default function ManageContent() {
    const [tab, setTab] = useState('about');
    const [about, setAbout] = useState({});
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { loadAll(); }, []);

    async function loadAll() {
        setLoading(true);
        try {
            const [aboutRes, expRes] = await Promise.all([
                api.get('/about/'),
                api.get('/experience/'),
            ]);
            setAbout(aboutRes.data || {});
            setExperiences(expRes.data || []);
        } catch (err) {
            setError('Failed to load content');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // ── About Save ───────────────────────────────────────────────────────
    async function saveAbout() {
        setSaving(true);
        setError('');
        try {
            const res = await api.put('/about/', about);
            setAbout(res.data);
            flash('About info saved to database!');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save about');
        } finally {
            setSaving(false);
        }
    }

    // ── Experience CRUD ──────────────────────────────────────────────────
    async function saveExperience(exp, index) {
        setSaving(true);
        setError('');
        try {
            if (exp.id && !exp._isNew) {
                const res = await api.put(`/experience/${exp.id}/`, {
                    role: exp.role,
                    company: exp.company,
                    duration: exp.duration,
                    exp_type: exp.exp_type || 'internship',
                    description: exp.description || [],
                    tools: exp.tools || [],
                });
                setExperiences(prev => prev.map((e, i) => i === index ? res.data : e));
            } else {
                const res = await api.post('/experience/', {
                    role: exp.role,
                    company: exp.company,
                    duration: exp.duration,
                    exp_type: exp.exp_type || 'internship',
                    description: exp.description || [],
                    tools: exp.tools || [],
                });
                setExperiences(prev => prev.map((e, i) => i === index ? res.data : e));
            }
            flash('Experience saved!');
        } catch (err) {
            if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.detail) {
                const msgs = Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(' | ');
                setError(msgs);
            } else {
                setError(err.response?.data?.detail || 'Failed to save experience');
            }
        } finally {
            setSaving(false);
        }
    }

    async function removeExperience(exp, index) {
        if (exp.id && !exp._isNew) {
            try {
                await api.delete(`/experience/${exp.id}/`);
            } catch {
                setError('Failed to delete experience');
                return;
            }
        }
        setExperiences(prev => prev.filter((_, i) => i !== index));
    }

    function addExperience() {
        setExperiences(prev => [...prev, {
            _isNew: true, role: '', company: '', duration: '',
            exp_type: 'internship', description: [], tools: [],
        }]);
    }

    function updateExp(index, field, value) {
        setExperiences(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    function flash(msg) {
        setSaved(msg);
        setTimeout(() => setSaved(''), 2500);
    }

    const tabs = [
        { id: 'about', label: 'About Me' },
        { id: 'experience', label: 'Experience' },
    ];

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading content…</p>;

    return (
        <div>
            <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500, marginBottom: 8 }}>Manage Content</h1>
            {saved && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: 16, padding: '8px 16px', background: 'rgba(34,197,94,0.08)', borderRadius: 6, display: 'inline-block' }}>✓ {saved}</p>}
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                {tabs.map(t => (
                    <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ══════════════ ABOUT ══════════════ */}
            {tab === 'about' && (
                <div className="glass-card" style={{ padding: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Name</label>
                                <input className="admin-input" value={about.name || ''} onChange={e => setAbout({ ...about, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Tagline</label>
                                <input className="admin-input" value={about.tagline || ''} onChange={e => setAbout({ ...about, tagline: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Bio Paragraphs</label>
                            {(about.bio || []).map((p, i) => (
                                <textarea key={i} className="admin-input" rows={3} value={p} style={{ marginBottom: 8, resize: 'vertical' }}
                                    onChange={e => { const b = [...about.bio]; b[i] = e.target.value; setAbout({ ...about, bio: b }); }} />
                            ))}
                            <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                                onClick={() => setAbout({ ...about, bio: [...(about.bio || []), ''] })}>
                                <Plus size={12} /> Add Paragraph
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Projects Count</label>
                                <input className="admin-input" value={about.stats?.projects || ''} onChange={e => setAbout({ ...about, stats: { ...about.stats, projects: e.target.value } })} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Internships</label>
                                <input className="admin-input" value={about.stats?.internships || ''} onChange={e => setAbout({ ...about, stats: { ...about.stats, internships: e.target.value } })} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>CGPA</label>
                                <input className="admin-input" value={about.stats?.cgpa || ''} onChange={e => setAbout({ ...about, stats: { ...about.stats, cgpa: e.target.value } })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Email</label>
                                <input className="admin-input" value={about.social?.email || ''} onChange={e => setAbout({ ...about, social: { ...about.social, email: e.target.value } })} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Phone</label>
                                <input className="admin-input" value={about.social?.phone || ''} onChange={e => setAbout({ ...about, social: { ...about.social, phone: e.target.value } })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>GitHub</label>
                                <input className="admin-input" value={about.social?.github || ''} onChange={e => setAbout({ ...about, social: { ...about.social, github: e.target.value } })} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>LinkedIn</label>
                                <input className="admin-input" value={about.social?.linkedin || ''} onChange={e => setAbout({ ...about, social: { ...about.social, linkedin: e.target.value } })} />
                            </div>
                        </div>

                        <div>
                            <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Location</label>
                            <input className="admin-input" value={about.info?.location || ''} onChange={e => setAbout({ ...about, info: { ...about.info, location: e.target.value } })} />
                        </div>

                        <button className="btn-gold" style={{ alignSelf: 'flex-start' }} onClick={saveAbout} disabled={saving}>
                            {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} /> Save About</>}
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════ EXPERIENCE ══════════════ */}
            {tab === 'experience' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {experiences.map((exp, i) => (
                        <div key={exp.id || i} className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Role / Title</label>
                                    <input className="admin-input" placeholder="e.g. Data Analyst Intern" value={exp.role || ''} onChange={e => updateExp(i, 'role', e.target.value)} />
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Company</label>
                                    <input className="admin-input" placeholder="e.g. Codesoft Pvt Ltd" value={exp.company || ''} onChange={e => updateExp(i, 'company', e.target.value)} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div>
                                    <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Duration</label>
                                    <input className="admin-input" placeholder="e.g. Jun 2024 – Aug 2024" value={exp.duration || ''} onChange={e => updateExp(i, 'duration', e.target.value)} />
                                </div>
                                <div>
                                    <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Type</label>
                                    <select className="admin-input" value={exp.exp_type || 'internship'} onChange={e => updateExp(i, 'exp_type', e.target.value)}>
                                        <option value="internship">Internship</option>
                                        <option value="job">Full-time Job</option>
                                        <option value="education">Education</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Description (one bullet per line)</label>
                                <textarea className="admin-input" rows={4} value={(exp.description || []).join('\n')} style={{ resize: 'vertical' }}
                                    onChange={e => updateExp(i, 'description', e.target.value.split('\n'))} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Tools (comma separated)</label>
                                <input className="admin-input" placeholder="Python, Pandas, SQL" value={(exp.tools || []).join(', ')}
                                    onChange={e => updateExp(i, 'tools', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                <button className="btn-gold" style={{ fontSize: '0.8rem', padding: '8px 20px' }} onClick={() => saveExperience(exp, i)} disabled={saving}>
                                    {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={14} /> Save</>}
                                </button>
                                <button onClick={() => removeExperience(exp, i)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px', alignSelf: 'flex-start' }} onClick={addExperience}>
                        <Plus size={14} /> Add Experience
                    </button>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
