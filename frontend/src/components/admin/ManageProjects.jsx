import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit3, Trash2, X, Star, Eye, EyeOff, Loader2, Save } from 'lucide-react';

const emptyProject = {
    title: '', slug: '', category: 'Web Dev', featured: false,
    description: '', short_desc: '', full_desc: '',
    tech: [], highlight: '', github_url: '', live_url: '', visible: true, order: 0,
    tagline: '', problem_statement: '', target_audience: '', architecture_diagram: '',
    tech_decisions: [], key_features: [], challenges: [], metrics: [], roadmap: [],
    demo_video_url: '', screenshots: []
};

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: type === 'error' ? '#ef4444' : 'var(--gold)',
            color: type === 'error' ? 'white' : '#080808',
            padding: '12px 24px', borderRadius: 8, zIndex: 100000,
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            {message}
        </div>
    );
}

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [techInput, setTechInput] = useState('');
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'content', label: 'Case Study Content' },
        { id: 'tech', label: 'Tech Decisions' },
        { id: 'features', label: 'Features' },
        { id: 'challenges', label: 'Challenges' },
        { id: 'metrics', label: 'Metrics & Roadmap' },
        { id: 'media', label: 'Media' }
    ];

    useEffect(() => { fetchProjects(); }, []);

    // Auto-save draft
    useEffect(() => {
        if (!editing) return;
        const timer = setInterval(() => {
            localStorage.setItem('project_draft_' + (editing.id || 'new'), JSON.stringify(editing));
        }, 30000);
        return () => clearInterval(timer);
    }, [editing]);

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

    async function startEdit(p) {
        if (p.id) {
            setLoadingEdit(true);
            setEditing(null); // Open loading overlay
            try {
                const res = await api.get(`/projects/${p.id}/`);
                const draft = localStorage.getItem('project_draft_' + p.id);
                if (draft) {
                    if(window.confirm('A saved draft was found for this project. Would you like to restore it?')) {
                        setEditing(JSON.parse(draft));
                    } else {
                        localStorage.removeItem('project_draft_' + p.id);
                        setEditing(res.data);
                    }
                } else {
                    setEditing(res.data);
                }
            } catch (err) {
                setError('Failed to load case study data');
                setEditing(null);
            } finally {
                setLoadingEdit(false);
            }
        } else {
            const draft = localStorage.getItem('project_draft_new');
            if (draft && window.confirm('A saved draft was found for a new project. Would you like to restore it?')) {
                setEditing(JSON.parse(draft));
            } else {
                setEditing({ ...emptyProject });
            }
        }
        setActiveTab('basic');
        setTechInput('');
    }

    async function save() {
        if (!editing.title) {
            setToast({ type: 'error', message: 'Project Title is required' });
            return;
        }
        setSaving(true);
        setError('');
        try {
            let res;
            if (editing.id) {
                res = await api.put(`/projects/${editing.id}/`, editing);
                setProjects(prev => prev.map(p => p.id === editing.id ? res.data : p));
            } else {
                res = await api.post('/projects/', editing);
                setProjects(prev => [...prev, res.data]);
            }
            localStorage.removeItem('project_draft_' + (editing.id || 'new'));
            setEditing(null);
            setToast({ type: 'success', message: 'All changes saved successfully' });
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.slug ? 'Slug must be unique.' : 'Failed to save case study' });
            setError(err.response?.data?.detail || 'Failed to save project');
        } finally {
            setSaving(false);
        }
    }

    async function remove(id) {
        if (!window.confirm('Delete this project?')) return;
        try {
            await api.delete(`/projects/${id}/`);
            setProjects(prev => prev.filter(p => p.id !== id));
            localStorage.removeItem('project_draft_' + id);
            setToast({ type: 'success', message: 'Project deleted' });
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to delete project' });
        }
    }

    async function toggleField(id, field) {
        const project = projects.find(p => p.id === id);
        if (!project) return;
        try {
            const res = await api.patch(`/projects/${id}/`, { [field]: !project[field] });
            setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: res.data[field] } : p));
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to update status' });
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Projects & Case Studies</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{projects.length} projects total</p>
                </div>
                <button className="btn-gold" style={{ fontSize: '0.8rem', padding: '10px 20px' }}
                    onClick={() => startEdit(emptyProject)}>
                    <Plus size={16} /> Add Project
                </button>
            </div>

            {error && !editing && <p style={{ color: '#ef4444', marginBottom: 16, fontSize: '0.85rem' }}>{error}</p>}

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
                                        <button onClick={() => startEdit(p)} disabled={loadingEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', opacity: loadingEdit ? 0.5 : 1 }}>
                                            <Edit3 size={16} />
                                        </button>
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
                <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: 800, height: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                        
                        {/* Modal Header */}
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                            <h2 className="font-display" style={{ fontSize: '1.5rem', margin: 0 }}>{editing.id ? 'Edit Case Study' : 'Add Case Study'}</h2>
                            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)', padding: '0 32px', flexShrink: 0 }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '16px 24px', background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: '0.85rem', fontWeight: 600, color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                                        borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ padding: 32, overflowY: 'auto', flexGrow: 1 }}>
                            
                            {/* TAB 1: BASIC INFO */}
                            {activeTab === 'basic' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Title *</label>
                                            <input className="admin-input" value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Category</label>
                                            <select className="admin-input" value={editing.category || 'Web Dev'} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                                                {['ML & AI', 'Web Dev', 'Data', 'Tools'].map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Slug (URL)</label>
                                        <input className="admin-input" value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Tagline (italic subtitle)</label>
                                        <input className="admin-input" value={editing.tagline || ''} onChange={e => setEditing({ ...editing, tagline: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Short Description (Card)</label>
                                            <input className="admin-input" value={editing.short_desc || ''} onChange={e => setEditing({ ...editing, short_desc: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Highlight (e.g. Published Paper)</label>
                                            <input className="admin-input" value={editing.highlight || ''} onChange={e => setEditing({ ...editing, highlight: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* Tech Tags */}
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Tech Stack</label>
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
                                </div>
                            )}

                            {/* TAB 2: CASE STUDY CONTENT */}
                            {activeTab === 'content' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Problem Statement</label>
                                        <textarea className="admin-input" rows={6} style={{ resize: 'vertical' }} value={editing.problem_statement || ''} onChange={e => setEditing({ ...editing, problem_statement: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Target Audience</label>
                                        <textarea className="admin-input" rows={3} style={{ resize: 'vertical' }} value={editing.target_audience || ''} onChange={e => setEditing({ ...editing, target_audience: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Architecture Diagram (ASCII or code)</label>
                                        <textarea className="admin-input font-mono" rows={8} style={{ resize: 'vertical', fontSize: '0.8rem', background: '#0d0d0d' }} value={editing.architecture_diagram || ''} onChange={e => setEditing({ ...editing, architecture_diagram: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: TECH DECISIONS */}
                            {activeTab === 'tech' && (
                                <div>
                                    <button className="btn-ghost" style={{ marginBottom: 16, fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => setEditing({ ...editing, tech_decisions: [...(editing.tech_decisions||[]), { question: '', answer: '' }] })}>
                                        <Plus size={14} style={{ marginRight: 6 }} /> Add Decision
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {(editing.tech_decisions || []).map((td, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
                                                <input className="admin-input" placeholder="Question?" style={{ marginBottom: 8 }} value={td.question} onChange={e => {
                                                    const newArr = [...editing.tech_decisions];
                                                    newArr[i].question = e.target.value;
                                                    setEditing({ ...editing, tech_decisions: newArr });
                                                }} />
                                                <textarea className="admin-input" placeholder="Answer" rows={3} value={td.answer} onChange={e => {
                                                    const newArr = [...editing.tech_decisions];
                                                    newArr[i].answer = e.target.value;
                                                    setEditing({ ...editing, tech_decisions: newArr });
                                                }} />
                                                <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', marginTop: 8, cursor: 'pointer' }} onClick={() => {
                                                    setEditing({ ...editing, tech_decisions: editing.tech_decisions.filter((_, idx) => idx !== i) });
                                                }}>Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: FEATURES */}
                            {activeTab === 'features' && (
                                <div>
                                    <button className="btn-ghost" style={{ marginBottom: 16, fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => setEditing({ ...editing, key_features: [...(editing.key_features||[]), { icon: '', title: '', description: '' }] })}>
                                        <Plus size={14} style={{ marginRight: 6 }} /> Add Feature
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {(editing.key_features || []).map((f, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '50px 1fr auto', gap: 12, alignItems: 'start' }}>
                                                <input className="admin-input" placeholder="Emoji" style={{ fontSize: '1.2rem', textAlign: 'center', padding: '10px 4px' }} value={f.icon} onChange={e => {
                                                    const newArr = [...editing.key_features]; newArr[i].icon = e.target.value; setEditing({ ...editing, key_features: newArr });
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    <input className="admin-input" placeholder="Title" value={f.title} onChange={e => {
                                                        const newArr = [...editing.key_features]; newArr[i].title = e.target.value; setEditing({ ...editing, key_features: newArr });
                                                    }} />
                                                    <textarea className="admin-input" placeholder="Description" rows={2} value={f.description || f.desc} onChange={e => {
                                                        const newArr = [...editing.key_features]; newArr[i].description = e.target.value; setEditing({ ...editing, key_features: newArr });
                                                    }} />
                                                </div>
                                                <button style={{ background: 'none', border: 'none', color: '#ef4444', padding: 8, cursor: 'pointer' }} onClick={() => {
                                                    setEditing({ ...editing, key_features: editing.key_features.filter((_, idx) => idx !== i) });
                                                }}><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: CHALLENGES */}
                            {activeTab === 'challenges' && (
                                <div>
                                    <button className="btn-ghost" style={{ marginBottom: 16, fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => setEditing({ ...editing, challenges: [...(editing.challenges||[]), { problem: '', solution: '' }] })}>
                                        <Plus size={14} style={{ marginRight: 6 }} /> Add Challenge
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {(editing.challenges || []).map((c, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#ef4444', textTransform: 'uppercase' }}>Problem:</span>
                                                    <input className="admin-input" value={c.problem} onChange={e => {
                                                        const newArr = [...editing.challenges]; newArr[i].problem = e.target.value; setEditing({ ...editing, challenges: newArr });
                                                    }} />
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#22c55e', textTransform: 'uppercase' }}>Solution:</span>
                                                    <input className="admin-input" value={c.solution} onChange={e => {
                                                        const newArr = [...editing.challenges]; newArr[i].solution = e.target.value; setEditing({ ...editing, challenges: newArr });
                                                    }} />
                                                </div>
                                                <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', marginTop: 12, cursor: 'pointer' }} onClick={() => {
                                                    setEditing({ ...editing, challenges: editing.challenges.filter((_, idx) => idx !== i) });
                                                }}>Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: METRICS & ROADMAP */}
                            {activeTab === 'metrics' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--gold)' }}>Metrics</h3>
                                        <button className="btn-ghost" style={{ marginBottom: 16, fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => setEditing({ ...editing, metrics: [...(editing.metrics||[]), { value: '', label: '' }] })}>
                                            <Plus size={14} style={{ marginRight: 6 }} /> Add Metric (max 4)
                                        </button>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {(editing.metrics || []).map((m, i) => (
                                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8 }}>
                                                    <input className="admin-input" placeholder="Value (e.g. 50+)" value={m.value || m.metric} onChange={e => {
                                                        const newArr = [...editing.metrics]; newArr[i].value = e.target.value; setEditing({ ...editing, metrics: newArr });
                                                    }} />
                                                    <input className="admin-input" placeholder="Label (e.g. Orgs)" value={m.label} onChange={e => {
                                                        const newArr = [...editing.metrics]; newArr[i].label = e.target.value; setEditing({ ...editing, metrics: newArr });
                                                    }} />
                                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => setEditing({ ...editing, metrics: editing.metrics.filter((_, idx) => idx !== i) })}><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: 16, color: 'var(--gold)' }}>Roadmap (Next Steps)</h3>
                                        <button className="btn-ghost" style={{ marginBottom: 16, fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => setEditing({ ...editing, roadmap: [...(editing.roadmap||[]), ''] })}>
                                            <Plus size={14} style={{ marginRight: 6 }} /> Add Step
                                        </button>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {(editing.roadmap || []).map((step, i) => (
                                                <div key={i} style={{ display: 'flex', gap: 8 }}>
                                                    <span style={{ paddingTop: 10, color: 'var(--gold-light)', fontSize: '0.8rem' }}>{i+1}.</span>
                                                    <input className="admin-input" value={typeof step === 'string' ? step : step.description} onChange={e => {
                                                        const newArr = [...editing.roadmap]; newArr[i] = e.target.value; setEditing({ ...editing, roadmap: newArr });
                                                    }} />
                                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '10px 0' }} onClick={() => setEditing({ ...editing, roadmap: editing.roadmap.filter((_, idx) => idx !== i) })}><X size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 7: MEDIA */}
                            {activeTab === 'media' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>Demo Video URL (YouTube)</label>
                                        <input className="admin-input" placeholder="https://www.youtube.com/watch?v=..." value={editing.demo_video_url || ''} onChange={e => setEditing({ ...editing, demo_video_url: e.target.value })} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Screenshots</label>
                                            <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => setEditing({ ...editing, screenshots: [...(editing.screenshots||[]), { url: '', caption: '' }] })}>
                                                <Plus size={14} style={{ marginRight: 6 }} /> Add Screenshot
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            {(editing.screenshots || []).map((img, i) => (
                                                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border)' }}>
                                                    <input className="admin-input" placeholder="Image URL (/images/projects/... or https://...)" style={{ marginBottom: 8 }} value={img.url} onChange={e => {
                                                        const newArr = [...editing.screenshots]; newArr[i].url = e.target.value; setEditing({ ...editing, screenshots: newArr });
                                                    }} />
                                                    <input className="admin-input" placeholder="Caption (optional)" value={img.caption} onChange={e => {
                                                        const newArr = [...editing.screenshots]; newArr[i].caption = e.target.value; setEditing({ ...editing, screenshots: newArr });
                                                    }} />
                                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', marginTop: 12, cursor: 'pointer' }} onClick={() => {
                                                        setEditing({ ...editing, screenshots: editing.screenshots.filter((_, idx) => idx !== i) });
                                                    }}>Remove</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, background: '#0a0a0a', flexShrink: 0 }}>
                            {error && <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</span>}
                            <button className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                            <button className="btn-gold" style={{ padding: '12px 24px' }} onClick={save} disabled={saving}>
                                {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} style={{ marginRight: 6 }}/> Save All Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
