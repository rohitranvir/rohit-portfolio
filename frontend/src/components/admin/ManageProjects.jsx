import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit3, Trash2, X, Star, Eye, EyeOff, Loader2 } from 'lucide-react';

const emptyProject = {
    title: '', category: 'Web Dev', featured: false,
    description: '', short_desc: '', full_desc: '',
    tech: [], highlight: '', github_url: '', live_url: '', visible: true, order: 0
};

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [techInput, setTechInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { fetchProjects(); }, []);

    async function fetchProjects() {
        try {
            const res = await api.get('/projects/');
            setProjects(res.data || []);
        } catch (err) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    }

    async function save() {
        if (!editing.title) return;
        setSaving(true);
        setError('');
        try {
            if (editing.id) {
                const res = await api.put(`/projects/${editing.id}/`, editing);
                setProjects(prev => prev.map(p => p.id === editing.id ? res.data : p));
            } else {
                const res = await api.post('/projects/', editing);
                setProjects(prev => [...prev, res.data]);
            }
            setEditing(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save project');
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (!confirm('Delete this project?')) return;
        try {
            await api.delete(`/projects/${id}/`);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete project');
        }
    }

    async function toggleField(id, field) {
        const project = projects.find(p => p.id === id);
        if (!project) return;
        try {
            const res = await api.patch(`/projects/${id}/`, { [field]: !project[field] });
            setProjects(prev => prev.map(p => p.id === id ? res.data : p));
        } catch (err) {
            setError('Failed to update project');
        }
    }

    function addTech() {
        if (techInput.trim() && editing) {
            setEditing({ ...editing, tech: [...(editing.tech || []), techInput.trim()] });
            setTechInput('');
        }
    }

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading projects…</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Projects</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{projects.length} projects total</p>
                </div>
                <button className="btn-gold" style={{ fontSize: '0.8rem', padding: '10px 20px' }}
                    onClick={() => { setEditing({ ...emptyProject }); setTechInput(''); }}>
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {error && <p style={{ color: '#ef4444', marginBottom: 16, fontSize: '0.85rem' }}>{error}</p>}

            <div className="glass-card" style={{ overflow: 'hidden', borderRadius: 12 }}>
                <table className="admin-table">
                    <thead>
                        <tr><th>Project</th><th>Category</th><th>Tech</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {projects.map(p => (
                            <tr key={p.id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {p.featured && <Star size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />}
                                    {p.title}
                                </td>
                                <td><span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>{p.category}</span></td>
                                <td><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(p.tech || []).slice(0, 3).join(', ')}{(p.tech || []).length > 3 ? '…' : ''}</span></td>
                                <td>
                                    <button onClick={() => toggleField(p.id, 'visible')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.visible ? '#22c55e' : 'var(--text-muted)' }}>
                                        {p.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => { setEditing({ ...p }); setTechInput(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)' }}><Edit3 size={16} /></button>
                                        <button onClick={() => remove(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Add Modal */}
            {editing && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: 32, position: 'relative' }}>
                        <button onClick={() => setEditing(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                        <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: 24 }}>{editing.id ? 'Edit' : 'Add'} Project</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <input className="admin-input" placeholder="Project Title *" value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                            <select className="admin-input" value={editing.category || 'Web Dev'} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                                {['ML & AI', 'Web Dev', 'Data', 'Tools'].map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input className="admin-input" placeholder="Short Description" value={editing.short_desc || ''} onChange={e => setEditing({ ...editing, short_desc: e.target.value })} />
                            <textarea className="admin-input" placeholder="Full Description" rows={3} value={editing.full_desc || ''} onChange={e => setEditing({ ...editing, full_desc: e.target.value })} style={{ resize: 'vertical' }} />
                            <input className="admin-input" placeholder="Highlight (e.g. Published IJISRT Paper)" value={editing.highlight || ''} onChange={e => setEditing({ ...editing, highlight: e.target.value })} />

                            {/* Tech Tags */}
                            <div>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <input className="admin-input" placeholder="Add tech stack…" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                                    <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem', flexShrink: 0 }} onClick={addTech}>Add</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {(editing.tech || []).map((t, i) => (
                                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(201, 168, 76, 0.1)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                                            {t}
                                            <button onClick={() => setEditing({ ...editing, tech: editing.tech.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, lineHeight: 1 }}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <input className="admin-input" placeholder="GitHub URL" value={editing.github_url || ''} onChange={e => setEditing({ ...editing, github_url: e.target.value })} />
                                <input className="admin-input" placeholder="Live Demo URL" value={editing.live_url || ''} onChange={e => setEditing({ ...editing, live_url: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: 24 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} style={{ accentColor: 'var(--gold)' }} /> Featured
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <input type="checkbox" checked={!!editing.visible} onChange={e => setEditing({ ...editing, visible: e.target.checked })} style={{ accentColor: 'var(--gold)' }} /> Visible
                                </label>
                            </div>

                            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</p>}

                            <button className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={save} disabled={saving}>
                                {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : (editing.id ? 'Save Changes' : 'Add Project')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
