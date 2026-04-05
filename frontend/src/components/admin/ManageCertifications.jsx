import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';

export default function ManageCertifications() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    // Track which entries are new (no id yet)
    const [newCerts, setNewCerts] = useState([]);

    useEffect(() => { fetchCerts(); }, []);

    async function fetchCerts() {
        try {
            const res = await api.get('/certifications/');
            setCerts(res.data || []);
        } catch (err) {
            setError('Failed to load certifications');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setError('');
        try {
            // Save all new certs (no id)
            const toCreate = certs.filter(c => !c.id && c.name);
            for (const cert of toCreate) {
                const res = await api.post('/certifications/', {
                    name: cert.name,
                    issuer: cert.issuer || cert.platform || '',
                    date: cert.date || '',
                    url: cert.url || cert.link || '',
                });
                // Replace placeholder with real object
                setCerts(prev => prev.map(c => c === cert ? res.data : c));
            }

            // Update existing certs
            const toUpdate = certs.filter(c => c.id && c._dirty);
            for (const cert of toUpdate) {
                await api.put(`/certifications/${cert.id}/`, {
                    name: cert.name,
                    issuer: cert.issuer || cert.platform || '',
                    date: cert.date || '',
                    url: cert.url || cert.link || '',
                });
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            await fetchCerts();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save certifications');
        } finally {
            setSaving(false);
        }
    }

    async function removeCert(cert) {
        if (cert.id) {
            try {
                await api.delete(`/certifications/${cert.id}/`);
            } catch {
                setError('Failed to delete certification');
                return;
            }
        }
        setCerts(prev => prev.filter(c => c !== cert));
    }

    function addCert() {
        setCerts(prev => [...prev, { name: '', issuer: '', date: '', url: '' }]);
    }

    function updateCert(index, field, value) {
        setCerts(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value, _dirty: true };
            return updated;
        });
    }

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading certifications…</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Manage Certifications</h1>
                <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.85rem' }} onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            {saved && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: 16, padding: '8px 16px', background: 'rgba(34,197,94,0.08)', borderRadius: 6, display: 'inline-block' }}>✓ Saved to database!</p>}
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {certs.map((cert, index) => (
                    <div key={cert.id || index} className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Certification Name</label>
                                <input className="admin-input" placeholder="e.g. Machine Learning Specialization" value={cert.name || ''} onChange={e => updateCert(index, 'name', e.target.value)} style={{ marginBottom: 0 }} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Issuer / Platform</label>
                                <input className="admin-input" placeholder="e.g. Coursera" value={cert.issuer || ''} onChange={e => updateCert(index, 'issuer', e.target.value)} style={{ marginBottom: 0 }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Date / Year</label>
                                <input className="admin-input" placeholder="e.g. Mar 2025" value={cert.date || ''} onChange={e => updateCert(index, 'date', e.target.value)} style={{ marginBottom: 0 }} />
                            </div>
                            <div>
                                <label className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Verification URL</label>
                                <input className="admin-input" placeholder="https://" value={cert.url || ''} onChange={e => updateCert(index, 'url', e.target.value)} style={{ marginBottom: 0 }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                            <button onClick={() => removeCert(cert)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </div>
                ))}

                <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px', alignSelf: 'flex-start' }} onClick={addCert}>
                    <Plus size={14} /> Add Certification
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
