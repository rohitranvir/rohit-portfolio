import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine, X, Check } from 'lucide-react';

const resumes = [
    {
        id: 'software',
        icon: '💻',
        title: 'Software Developer',
        subtitle: 'Full Stack Development',
        tags: ['Django', 'React', 'Docker', 'APIs'],
        bestFor: 'Full Stack • Backend • Frontend',
        file: '/resume/Rohit_Ranvir_Software_Resume.pdf',
        filename: 'Rohit_Ranvir_Software_Resume.pdf',
        color: '#4A90E2'
    },
    {
        id: 'data',
        icon: '📊',
        title: 'Data Analyst',
        subtitle: 'Data Analysis & Insights',
        tags: ['Python', 'SQL', 'Pandas', 'PowerBI'],
        bestFor: 'Data Analyst • BI • Analytics',
        file: '/resume/Rohit_Ranvir_DataAnalyst_Resume.pdf',
        filename: 'Rohit_Ranvir_DataAnalyst_Resume.pdf',
        color: '#50C878'
    },
    {
        id: 'aiml',
        icon: '🤖',
        title: 'AI / ML Engineer',
        subtitle: 'Machine Learning & AI',
        tags: ['TensorFlow', 'CNN', 'NLP', 'Keras'],
        bestFor: 'ML Engineer • AI • Data Science',
        file: '/resume/Rohit_Ranvir_AIML_Resume.pdf',
        filename: 'Rohit_Ranvir_AIML_Resume.pdf',
        color: '#C9A84C'
    }
];

export default function ResumePopup({ isOpen, onClose }) {
    const [toastMsg, setToastMsg] = useState('');

    // Handle ESC key press and body scrolling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleDownload = (resume) => {
        // Step 1: Create link and trigger download
        const link = document.createElement('a');
        link.href = resume.file;
        link.download = resume.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Step 2: Show success toast
        setToastMsg(`⬇️ Downloading ${resume.title} Resume...`);
        setTimeout(() => setToastMsg(''), 3000);

        // Step 3: Close modal after short delay
        setTimeout(() => onClose(), 800);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Dark Blurred Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onClose}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(0, 0, 0, 0.85)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                zIndex: 99999,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Modal Content */}
                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.85, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.85, y: 20, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="resume-modal"
                                style={{
                                    position: 'relative',
                                    width: '90%',
                                    maxWidth: 780,
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    background: '#161616',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                    borderRadius: 16,
                                    margin: 'auto',
                                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)'
                                }}
                            >
                                {/* Custom Scrollbar hides inside popup safely */}
                                <button
                                    onClick={onClose}
                                    style={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20,
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: 8,
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                                >
                                    <X size={24} />
                                </button>

                                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                    <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', color: '#C9A84C', marginBottom: 16 }}>
                                        <ArrowDownToLine size={24} />
                                    </div>
                                    <h2 className="resume-modal-title" style={{ fontFamily: 'Cormorant Garamond', color: '#C9A84C', margin: '0 0 8px 0', fontWeight: 600 }}>
                                        Choose Your Resume
                                    </h2>
                                    <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: '#888880', margin: 0 }}>
                                        Select the resume for the role you are hiring for
                                    </p>
                                </div>

                                <div className="resume-grid">
                                    {resumes.map((resume) => (
                                        <motion.div
                                            key={resume.id}
                                            className="resume-card"
                                            whileHover={{
                                                y: -6,
                                                borderColor: 'rgba(201,168,76,0.8)',
                                                boxShadow: '0 8px 32px rgba(201,168,76,0.15)',
                                                background: '#1f1f1f'
                                            }}
                                            style={{
                                                background: '#1a1a1a',
                                                border: '1px solid rgba(201,168,76,0.2)',
                                                borderRadius: 12,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '40px', marginBottom: 16 }}>
                                                {resume.icon}
                                            </div>
                                            <h3 style={{ fontFamily: 'DM Sans', fontSize: '16px', color: '#FFFFFF', fontWeight: 700, margin: '0 0 4px 0' }}>
                                                {resume.title}
                                            </h3>
                                            <p style={{ fontSize: '12px', color: '#888880', margin: '0 0 16px 0' }}>
                                                {resume.subtitle}
                                            </p>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24, minHeight: 48 }}>
                                                {resume.tags.map(tag => (
                                                    <span key={tag} style={{ fontSize: '10px', color: '#E8D5A3', padding: '4px 8px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 100, background: 'rgba(201,168,76,0.05)' }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: 'auto', width: '100%' }}>
                                                <div style={{ fontSize: '11px', color: '#888880', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                                                    <span style={{ opacity: 0.8 }}>Best for:</span>
                                                    <strong style={{ marginLeft: 4, color: '#C9A84C', fontWeight: 500 }}>{resume.bestFor}</strong>
                                                </div>

                                                <button
                                                    onClick={() => handleDownload(resume)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 0',
                                                        background: 'rgba(201, 168, 76, 0.1)',
                                                        border: '1px solid #C9A84C',
                                                        color: '#C9A84C',
                                                        borderRadius: 6,
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                        fontFamily: 'DM Sans',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#C9A84C';
                                                        e.currentTarget.style.color = '#080808';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
                                                        e.currentTarget.style.color = '#C9A84C';
                                                    }}
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div style={{ marginTop: 32, textAlign: 'center', color: '#888880', fontSize: '13px' }}>
                                    Prefer a different format? Email me directly <br />
                                    <a href="mailto:rohitranveer358@gmail.com" style={{ color: '#E8D5A3', textDecoration: 'none', marginLeft: 4, fontWeight: 500 }}>
                                        rohitranveer358@gmail.com
                                    </a>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Responsive Styles */}
            <style>{`
                .resume-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                }
                .resume-modal {
                    padding: 40px;
                }
                .resume-modal-title {
                    font-size: 28px;
                }
                .resume-card {
                    padding: 24px;
                }
                @media (max-width: 768px) {
                    .resume-grid {
                        grid-template-columns: 1fr;
                    }
                    .resume-modal {
                        padding: 24px 20px;
                        width: 95vw !important;
                    }
                    .resume-modal-title {
                        font-size: 22px !important;
                    }
                    .resume-card {
                        padding: 16px;
                    }
                }
            `}</style>
            
            {/* Toast Notification */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{
                            position: 'fixed',
                            bottom: 32,
                            right: 32,
                            zIndex: 999999,
                            padding: '16px 24px',
                            borderRadius: 12,
                            background: 'rgba(201, 168, 76, 0.12)',
                            border: '1px solid rgba(201, 168, 76, 0.3)',
                            backdropFilter: 'blur(16px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                    >
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(201, 168, 76, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} style={{ color: '#C9A84C' }} />
                        </div>
                        <span style={{ fontSize: '14px', color: '#F5F5F0', fontFamily: 'DM Sans', fontWeight: 500 }}>{toastMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
