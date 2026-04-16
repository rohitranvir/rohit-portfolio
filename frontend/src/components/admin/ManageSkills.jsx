import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';

const CATEGORY_ORDER = ['Backend', 'Frontend', 'AI/ML', 'DevOps & Cloud', 'Data & ML', 'Tools'];

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: type === 'error' ? '#ef4444' : 'var(--gold)',
            color: type === 'error' ? 'white' : '#080808',
            padding: '12px 24px', borderRadius: 8, zIndex: 100000, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
            {message}
        </div>
    );
}

export default function ManageSkills() {
    // skillsData: { [category]: [{id, name, icon, category}] }
    const [skillsData, setSkillsData] = useState({});
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => { fetchSkills(); }, []);

    async function fetchSkills() {
        setLoading(true);
        try {
            // Get flat list with IDs from the manage endpoint
            const flatRes = await api.get('/skills/manage/');
            const flat = flatRes.data || [];

            // Group by category
            const grouped = {};
            for (const skill of flat) {
                if (!grouped[skill.category]) grouped[skill.category] = [];
                grouped[skill.category].push(skill);
            }

            // Merge with default category order
            const allCats = [...new Set([...CATEGORY_ORDER, ...Object.keys(grouped)])];
            setSkillsData(grouped);
            setCategories(allCats);
            setActiveTab(prev => prev || allCats[0] || '');
        } catch {
            showToast('Failed to load skills', 'error');
        } finally {
            setLoading(false);
        }
    }

    // ── Save the current tab's skills ────────────────────────────────────────
    // For each skill: if it has an id → PUT, if no id → POST
    async function handleSave() {
        setSaving(true);
        const currentSkills = skillsData[activeTab] || [];
        try {
            const saved = [];
            for (const skill of currentSkills) {
                if (!skill.name.trim()) continue; // skip empty rows
                if (skill.id) {
                    // Update existing skill
                    const res = await api.put(`/skills/manage/${skill.id}/`, {
                        name: skill.name.trim(),
                        icon: skill.icon || '💻',
                        category: activeTab,
                        order: skill.order || 0,
                    });
                    saved.push(res.data);
                } else {
                    // Create new skill
                    const res = await api.post('/skills/manage/', {
                        name: skill.name.trim(),
                        icon: skill.icon || '💻',
                        category: activeTab,
                        order: skill.order || 0,
                    });
                    saved.push(res.data);
                }
            }
            // Update local state with server responses (gets real IDs)
            setSkillsData(prev => ({ ...prev, [activeTab]: saved }));
            showToast(`${activeTab} skills saved!`);
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to save skills', 'error');
            console.error('Skills save error:', err.response?.data);
        } finally {
            setSaving(false);
        }
    }

    // ── Delete a skill ────────────────────────────────────────────────────────
    async function removeSkill(index) {
        const skill = (skillsData[activeTab] || [])[index];
        if (skill?.id) {
            if (!window.confirm(`Delete "${skill.name}"?`)) return;
            try {
                await api.delete(`/skills/manage/${skill.id}/`);
            } catch {
                showToast('Failed to delete skill', 'error');
                return;
            }
        }
        setSkillsData(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).filter((_, i) => i !== index),
        }));
        if (skill?.id) showToast('Skill deleted');
    }

    function addSkill() {
        setSkillsData(prev => ({
            ...prev,
            [activeTab]: [...(prev[activeTab] || []), { name: '', icon: '' }],
        }));
    }

    function updateSkill(index, field, value) {
        setSkillsData(prev => {
            const updated = [...(prev[activeTab] || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, [activeTab]: updated };
        });
    }

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading skills…</p>;

    const currentSkills = skillsData[activeTab] || [];

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Manage Skills</h1>
                <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.85rem' }} onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} /> Save {activeTab}</>}
                </button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
                {categories.map(tab => (
                    <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab}
                        {(skillsData[tab] || []).length > 0 && (
                            <span style={{ marginLeft: 6, fontSize: '0.65rem', opacity: 0.7 }}>
                                ({(skillsData[tab] || []).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    {currentSkills.map((skill, index) => (
                        <div key={skill.id || `new-${index}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab', flexShrink: 0 }} />
                            <input className="admin-input" placeholder="Icon/Emoji (e.g. ⚛️)" value={skill.icon || ''}
                                onChange={e => updateSkill(index, 'icon', e.target.value)}
                                style={{ width: 140, marginBottom: 0 }} />
                            <input className="admin-input" placeholder="Skill Name (e.g. React.js)" value={skill.name || ''}
                                onChange={e => updateSkill(index, 'name', e.target.value)}
                                style={{ flex: 1, marginBottom: 0 }} />
                            {skill.id
                                ? <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', flexShrink: 0 }}>#{skill.id}</span>
                                : <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--gold)', flexShrink: 0 }}>NEW</span>
                            }
                            <button onClick={() => removeSkill(index)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6, flexShrink: 0 }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {currentSkills.length === 0 && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
                            No skills in {activeTab} yet.
                        </p>
                    )}
                </div>
                <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={addSkill}>
                    <Plus size={14} /> Add Skill to {activeTab}
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
