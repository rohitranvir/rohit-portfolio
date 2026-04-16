import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Loader2, Edit3, X, Save } from 'lucide-react';

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
            padding: '12px 24px', borderRadius: 8, zIndex: 100000,
            fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', gap: 8,
        }}>
            {message}
        </div>
    );
}

const emptyCert = { name: '', issuer: '', date: '', url: '' };

export default function ManageCertifications() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    // editing holds { index, data } for the cert currently being edited
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    // adding holds the new cert form data
    const [adding, setAdding] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => { fetchCerts(); }, []);

    async function fetchCerts() {
        setLoading(true);
        try {
            const res = await api.get('/certifications/');
            setCerts(res.data || []);
        } catch {
            showToast('Failed to load certifications', 'error');
        } finally {
            setLoading(false);
        }
    }

    // ── CREATE ────────────────────────────────────────────────────────────────
    async function handleCreate() {
        if (!adding?.name) {
            showToast('Certification name is required', 'error');
            return;
        }
        setSaving(true);
        try {
            const res = await api.post('/certifications/', {
                name: adding.name,
                issuer: adding.issuer || '',
                date: adding.date || '',
                url: adding.url || '',
            });
            setCerts(prev => [...prev, res.data]);
            setAdding(null);
            showToast('Certification added successfully');
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to add certification', 'error');
        } finally {
            setSaving(false);
        }
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    async function handleUpdate() {
        if (!editing?.data?.name) {
            showToast('Certification name is required', 'error');
            return;
        }
        setSaving(true);
        try {
            const res = await api.put(`/certifications/${editing.data.id}/`, {
                name: editing.data.name,
                issuer: editing.data.issuer || '',
                date: editing.data.date || '',
                url: editing.data.url || '',
            });
            setCerts(prev => prev.map(c => c.id === editing.data.id ? res.data : c));
            setEditing(null);
            showToast('Certification updated successfully');
        } catch (err) {
            showToast(err.response?.data?.detail || 'Failed to update certification', 'error');
        } finally {
            setSaving(false);
        }
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    async function handleDelete(cert) {
        if (!window.confirm(`Delete "${cert.name}"?`)) return;
        try {
            await api.delete(`/certifications/${cert.id}/`);
            setCerts(prev => prev.filter(c => c.id !== cert.id));
            showToast('Certification deleted');
        } catch {
            showToast('Failed to delete certification', 'error');
        }
    }

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading certifications…</p>;

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Manage Certifications</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{certs.length} certifications total</p>
                </div>
                <button className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.8rem' }}
                    onClick={() => { setAdding({ ...emptyCert }); setEditing(null); }}>
                    <Plus size={16} /> Add Certification
                </button>
            </div>

            {/* Add Form */}
            {adding && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--gold)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gold)' }}>New Certification</h3>
                        <button onClick={() => setAdding(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    <CertForm data={adding} onChange={setAdding} />
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <button className="btn-gold" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={handleCreate} disabled={saving}>
                            {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={14} /> Save</>}
                        </button>
                        <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={() => setAdding(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {certs.map(cert => (
                    <div key={cert.id} className="glass-card" style={{ padding: 24 }}>
                        {editing?.data?.id === cert.id ? (
                            <>
                                <CertForm data={editing.data} onChange={d => setEditing({ ...editing, data: d })} />
                                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                    <button className="btn-gold" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={handleUpdate} disabled={saving}>
                                        {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={14} /> Save</>}
                                    </button>
                                    <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={() => setEditing(null)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>{cert.name}</h3>
                                    <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--gold)', marginBottom: 4 }}>{cert.issuer}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cert.date}</p>
                                    {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'underline' }}>Verify →</a>}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => { setEditing({ data: { ...cert } }); setAdding(null); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)' }}>
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(cert)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function CertForm({ data, onChange }) {
    const field = (key, label, placeholder, type = 'text') => (
        <div>
            <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>{label}</label>
            <input className="admin-input" type={type} placeholder={placeholder} value={data[key] || ''}
                onChange={e => onChange({ ...data, [key]: e.target.value })} style={{ marginBottom: 0 }} />
        </div>
    );
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {field('name', 'Certification Name', 'e.g. Machine Learning Specialization')}
            {field('issuer', 'Issuer / Platform', 'e.g. Coursera')}
            {field('date', 'Date / Year', 'e.g. Mar 2025')}
            {field('url', 'Verification URL', 'https://', 'url')}
        </div>
    );
}
