import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Mail, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

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

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => { fetchMessages(); }, []);

    async function fetchMessages() {
        setLoading(true);
        try {
            const res = await api.get('/messages/admin/');
            setMessages(res.data || []);
        } catch (err) {
            console.error('Failed to load messages:', err);
            showToast('Failed to load messages', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function toggleRead(id, currentRead) {
        try {
            // Optimistic update
            setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !currentRead } : m));
            await api.patch(`/messages/admin/${id}/`, { read: !currentRead });
        } catch (err) {
            // Revert on failure
            setMessages(prev => prev.map(m => m.id === id ? { ...m, read: currentRead } : m));
            showToast('Failed to update message', 'error');
        }
    }

    async function remove(id) {
        if (!window.confirm('Delete this message permanently?')) return;
        setDeletingId(id);
        try {
            await api.delete(`/messages/admin/${id}/`);
            setMessages(prev => prev.filter(m => m.id !== id));
            showToast('Message deleted');
        } catch {
            showToast('Failed to delete message', 'error');
        } finally {
            setDeletingId(null);
        }
    }

    function exportCSV() {
        const header = 'Name,Email,Subject,Message,Date,Read\n';
        const rows = messages.map(m =>
            `"${m.name}","${m.email}","${m.subject || ''}","${(m.message || '').replace(/"/g, '""')}","${m.timestamp}","${m.read}"`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'messages.csv'; a.click();
        URL.revokeObjectURL(url);
    }

    if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading messages…</p>;

    const unread = messages.filter(m => !m.read).length;

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 500 }}>Messages</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {messages.length} messages
                        {unread > 0 && <span style={{ color: 'var(--gold)', marginLeft: 8 }}>● {unread} unread</span>}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {unread > 0 && (
                        <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px' }}
                            onClick={() => messages.filter(m => !m.read).forEach(m => toggleRead(m.id, false))}>
                            Mark All Read
                        </button>
                    )}
                    {messages.length > 0 && (
                        <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '10px 20px' }} onClick={exportCSV}>
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
                    <Mail size={40} style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.3 }} />
                    <p style={{ color: 'var(--text-muted)' }}>No messages yet. They'll appear here when visitors use the contact form.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {messages.map(msg => (
                        <div key={msg.id} className="glass-card"
                            style={{ padding: '20px 24px', borderLeft: `3px solid ${msg.read ? 'var(--border)' : 'var(--gold)'}`, opacity: deletingId === msg.id ? 0.5 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{msg.name}</span>
                                    {!msg.read && <span style={{ marginLeft: 8, fontSize: '0.65rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>● NEW</span>}
                                    <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: '0.8rem' }}>{msg.email}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('en-IN') : ''}
                                    </span>
                                    <button
                                        onClick={() => toggleRead(msg.id, msg.read)}
                                        title={msg.read ? 'Mark unread' : 'Mark read'}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: msg.read ? 'var(--text-muted)' : 'var(--gold)' }}>
                                        {msg.read ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button
                                        onClick={() => remove(msg.id)}
                                        disabled={deletingId === msg.id}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                        {deletingId === msg.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                            {msg.subject && (
                                <div style={{ display: 'inline-block', padding: '3px 10px', background: 'rgba(201, 168, 76, 0.06)', border: '1px solid var(--border)', borderRadius: 4, marginBottom: 8 }}>
                                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--gold)', textTransform: 'uppercase' }}>{msg.subject}</span>
                                </div>
                            )}
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
