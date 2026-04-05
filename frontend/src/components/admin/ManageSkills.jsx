import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';

const CATEGORY_ORDER = ['Backend', 'Frontend', 'AI/ML', 'DevOps & Cloud', 'Data & ML', 'Tools'];

export default function ManageSkills() {
    const [skillsData, setSkillsData] = useState({});
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    // Flat list of all skills with IDs for API calls
    const [flatSkills, setFlatSkills] = useState([]);

    useEffect(() => { fetchSkills(); }, []);

    async function fetchSkills() {
        try {
            const res = await api.get('/skills/');
            const grouped = res.data?.skills || {};
            const cats = res.data?.categories || CATEGORY_ORDER;
            setSkillsData(grouped);
            setCategories(cats);
            setActiveTab(cats[0] || '');

            // Also get flat list with IDs
            const flat = await api.get('/skills/manage/');
            setFlatSkills(flat.data || []);
        } catch (err) {
            setError('Failed to load skills');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setError('');
        const currentSkills = skillsData[activeTab] || [];

        try {
            for (const skill of currentSkills) {
                if (skill.id) {
                    // Update existing
                    await api.put(`/skills/manage/${skill.id}/`, {
                        name: skill.name,
                        icon: skill.icon || '💻',
                        category: activeTab,
                    });
                } else if (skill.name) {
                    // Create new
                    const res = await api.post('/skills/manage/', {
                        name: skill.name,
                        icon: skill.icon || '💻',
                        category: activeTab,
                    });
                    // Update skill with new ID
                    skill.id = res.data.id;
                }
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            await fetchSkills();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save skills');
        } finally {
            setSaving(false);
        }
    }

    async function removeSkill(index) {
        const skill = (skillsData[activeTab] || [])[index];
        if (skill?.id) {
            try {
                await api.delete(`/skills/manage/${skill.id}/`);
            } catch (err) {
                setError('Failed to delete skill');
                return;
            }
        }
        setSkillsData(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).filter((_, i) => i !== index),
        }));
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Manage Skills</h1>
                <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.85rem' }} onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            {saved && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: 16, padding: '8px 16px', background: 'rgba(34,197,94,0.08)', borderRadius: 6, display: 'inline-block' }}>✓ Skills saved to database!</p>}
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
                {categories.map(tab => (
                    <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                    {currentSkills.map((skill, index) => (
                        <div key={skill.id || index} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
                            <input className="admin-input" placeholder="Icon/Emoji (e.g. ⚛️)" value={skill.icon || ''} onChange={e => updateSkill(index, 'icon', e.target.value)} style={{ width: 140, marginBottom: 0 }} />
                            <input className="admin-input" placeholder="Skill Name (e.g. React.js)" value={skill.name || ''} onChange={e => updateSkill(index, 'name', e.target.value)} style={{ flex: 1, marginBottom: 0 }} />
                            <button onClick={() => removeSkill(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6 }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={addSkill}>
                    <Plus size={14} /> Add Skill to {activeTab}
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
