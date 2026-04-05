import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Save, RefreshCw, Loader2 } from 'lucide-react';

const DEFAULT_VISIBILITY = {
    hero: true, marquee: true, about: true, skills: true,
    projects: true, experience: true, publications: true,
    certifications: true, contact: true,
};

export default function AdminSettings() {
    const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { fetchSettings(); }, []);

    async function fetchSettings() {
        try {
            const res = await api.get('/settings/');
            setVisibility(res.data?.section_visibility || DEFAULT_VISIBILITY);
        } catch (err) {
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    }

    async function save() {
        setSaving(true);
        setError('');
        try {
            await api.patch('/settings/', { section_visibility: visibility });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    }

    async function reset() {
        if (!confirm('Reset section visibility to defaults?')) return;
        setSaving(true);
        try {
            await api.patch('/settings/', { section_visibility: DEFAULT_VISIBILITY });
            setVisibility(DEFAULT_VISIBILITY);
        } catch (err) {
            setError('Failed to reset settings');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading settings…</p>;

    return (
        <div>
            <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500, marginBottom: 32 }}>Settings</h1>

            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}

            <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                <h2 className="font-body" style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: 8 }}>Section Visibility</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>
                    Toggle which sections appear on the public portfolio. Changes are saved to the database immediately.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                    {Object.entries(visibility).map(([key, val]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: 'var(--bg-primary)', border: `1px solid ${val ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 8, fontSize: '0.85rem', color: val ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                            <input
                                type="checkbox"
                                checked={val}
                                onChange={e => setVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                                style={{ accentColor: 'var(--gold)' }}
                            />
                            {key}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-gold" onClick={save} disabled={saving}>
                    {saving
                        ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                        : <><Save size={16} /> {saved ? '✓ Saved!' : 'Save Settings'}</>
                    }
                </button>
                <button className="btn-ghost" onClick={reset} disabled={saving}>
                    <RefreshCw size={16} /> Reset to Defaults
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
