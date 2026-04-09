import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Github, ExternalLink, Lightbulb,
    AlertTriangle, Rocket, ChevronRight, Target,
    Layers, Zap, BookOpen, MonitorPlay, Image as ImageIcon,
    ChevronDown, X
} from 'lucide-react';
import PageTransition from '../layout/PageTransition';
import SEO from '../SEO';
import api from '../../services/api';

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const badgePop = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const cardSlide = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Shared Components ─────────────────────────────────────────────────────────
function Section({ children, delay = 0 }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
            }}
        >
            {children}
        </motion.div>
    );
}

function SectionHeading({ icon: Icon, label, title }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon size={14} style={{ color: 'var(--gold)' }} />
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {label}
                </span>
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, lineHeight: 1.3 }}>
                {title}
            </h2>
        </div>
    );
}

function Accordion({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass-card" style={{ marginBottom: 16, overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '24px 28px', background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                <h4 className="font-body" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    <span style={{ color: 'var(--gold)', marginRight: 8 }}>Q.</span>{question}
                </h4>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div style={{ padding: '0 28px 24px 50px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function CaseStudy() {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const [study, setStudy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxImg, setLightboxImg] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/projects/slug/${slug}/`);
                setStudy(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch case study:', err);
                if (err.response?.status === 404) {
                    setError('Project not found');
                } else {
                    setError('Failed to load project');
                }
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <PageTransition>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, paddingTop: 100 }}>
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="font-mono"
                        style={{ color: 'var(--gold)' }}
                    >
                        Loading Project Data...
                    </motion.div>
                    <div style={{ width: '100%', maxWidth: 900, padding: 24 }}>
                        <div style={{ height: 60, background: '#161616', borderRadius: 8, marginBottom: 16 }} />
                        <div style={{ height: 20, background: '#161616', borderRadius: 4, width: '60%', marginBottom: 32 }} />
                        <div style={{ height: 200, background: '#161616', borderRadius: 8 }} />
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (error || !study) {
        return (
            <PageTransition>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
                    <h1 className="font-display" style={{ fontSize: '3rem', color: 'var(--gold)' }}>404</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Project not found</p>
                    <button className="btn-ghost" onClick={() => navigate('/#projects')}>← Back to Portfolio</button>
                </div>
            </PageTransition>
        );
    }

    // Helper to get embed URL from watch URL
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('embed')) return url;
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
    };

    return (
        <PageTransition>
            <>
                <SEO 
                    title={`${study.title} — Case Study`}
                    description={study.tagline || study.short_desc}
                    path={`/projects/${slug}`}
                />
                <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

                {/* ── HERO ────────────────────────────────────────────────── */}
                <section style={{ padding: '140px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        {/* Back button */}
                        <motion.button
                            variants={fadeUp}
                            onClick={() => navigate('/#projects')}
                            className="btn-ghost"
                            style={{ padding: '8px 16px', fontSize: '0.8rem', marginBottom: 40, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            whileHover={{ x: -4 }}
                        >
                            <ArrowLeft size={14} /> Back to Projects
                        </motion.button>

                        {/* Category + Featured */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {study.category}
                            </span>
                            {study.featured && (
                                <span style={{ padding: '3px 10px', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.6rem', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    ★ Featured
                                </span>
                            )}
                        </motion.div>

                        {/* Title */}
                        <motion.h1 variants={fadeUp} className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: 20 }}>
                            {study.title}
                        </motion.h1>

                        {/* Tagline / Pitch */}
                        <motion.p variants={fadeUp} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.6, maxWidth: 700, marginBottom: 32 }}>
                            {study.tagline || study.short_desc}
                        </motion.p>

                        {/* Tech Badges */}
                        <motion.div variants={stagger} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                            {(study.tech || []).map(t => (
                                <motion.span
                                    key={t}
                                    variants={badgePop}
                                    className="font-mono"
                                    style={{
                                        fontSize: '0.65rem',
                                        padding: '6px 14px',
                                        background: 'rgba(201,168,76,0.08)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 6,
                                        color: 'var(--gold-light)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                    }}
                                >
                                    {t}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Links */}
                        <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {study.github_url && (
                                <a href={study.github_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                                    <Github size={16} /> Source Code
                                </a>
                            )}
                            {study.live_url && (
                                <a href={study.live_url} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                                    <ExternalLink size={16} /> Live Demo
                                </a>
                            )}
                        </motion.div>

                        {/* Highlight */}
                        {study.highlight && (
                            <motion.div variants={fadeUp} style={{ marginTop: 24, padding: '12px 20px', background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border)', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <BookOpen size={14} style={{ color: 'var(--gold)' }} />
                                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>
                                    {study.highlight}
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </section>

                {/* Gold divider */}
                <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.3 }} />
                </div>

                {/* ── DEMO VIDEO ────────────────────────────────────────── */}
                {study.demo_video_url && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={MonitorPlay} label="Preview" title="Live Demo" />
                            <div style={{ 
                                position: 'relative', 
                                paddingBottom: '56.25%', /* 16:9 */
                                height: 0,
                                borderRadius: 12,
                                overflow: 'hidden',
                                border: '1px solid var(--gold)',
                                boxShadow: '0 10px 40px rgba(201,168,76,0.15)'
                            }}>
                                <iframe 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={getEmbedUrl(study.demo_video_url)} 
                                    title={`${study.title} Demo`}
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </Section>
                    </section>
                )}

                {/* ── SCREENSHOTS ───────────────────────────────────────── */}
                {study.screenshots && study.screenshots.length > 0 && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto', width: '100%' }}>
                        <Section>
                            <SectionHeading icon={ImageIcon} label="Gallery" title="Screenshots" />
                            <div style={{ 
                                display: 'flex', 
                                gap: 20, 
                                overflowX: 'auto', 
                                paddingBottom: 20,
                                scrollSnapType: 'x mandatory',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'var(--gold) transparent'
                            }}>
                                {study.screenshots.map((img, i) => (
                                    <div 
                                        key={i} 
                                        style={{ 
                                            minWidth: 'min(80vw, 400px)', 
                                            scrollSnapAlign: 'start',
                                            cursor: 'zoom-in',
                                        }}
                                        onClick={() => setLightboxImg(img.url)}
                                    >
                                        <motion.div 
                                            whileHover={{ y: -4, borderColor: 'var(--gold)' }}
                                            style={{ 
                                                border: '1px solid var(--border)', 
                                                borderRadius: 8, 
                                                overflow: 'hidden',
                                                background: '#161616',
                                                aspectRatio: '16/9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            <img 
                                                src={img.url} 
                                                alt={img.caption || `Screenshot ${i + 1}`} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                                                <ImageIcon style={{ opacity: 0.3 }} />
                                                <span style={{ fontSize: '0.8rem' }}>Image coming soon</span>
                                            </div>
                                        </motion.div>
                                        {img.caption && (
                                            <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                                {img.caption}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </section>
                )}

                {/* ── PROBLEM STATEMENT ─────────────────────────────────── */}
                {study.problem_statement && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={Target} label="Problem" title="What Problem Does It Solve?" />
                            <div className="glass-card" style={{ padding: 32 }}>
                                <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: study.target_audience ? 24 : 0, whiteSpace: 'pre-wrap' }}>
                                    {study.problem_statement}
                                </p>
                                {study.target_audience && (
                                    <div style={{ padding: '16px 20px', background: 'rgba(201,168,76,0.04)', borderLeft: '3px solid var(--gold)', borderRadius: '0 8px 8px 0' }}>
                                        <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Target Audience</span>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{study.target_audience}</p>
                                    </div>
                                )}
                            </div>
                        </Section>
                    </section>
                )}

                {/* ── ARCHITECTURE ──────────────────────────────────────── */}
                {study.architecture_diagram && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={Layers} label="Architecture" title="System Design" />
                            <div className="glass-card" style={{ padding: 32, overflowX: 'auto', background: '#0d0d0d' }}>
                                <pre className="font-mono" style={{
                                    fontSize: '0.72rem',
                                    lineHeight: 1.6,
                                    color: 'var(--gold)',
                                    whiteSpace: 'pre',
                                    margin: 0,
                                }}>
                                    {study.architecture_diagram.trim()}
                                </pre>
                            </div>
                        </Section>
                    </section>
                )}

                {/* ── TECH DECISIONS ────────────────────────────────────── */}
                {study.tech_decisions && study.tech_decisions.length > 0 && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={Lightbulb} label="Decisions" title="Why This Stack?" />
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'flex', flexDirection: 'column' }}>
                                {study.tech_decisions.map((td, i) => (
                                    <motion.div key={i} variants={cardSlide}>
                                        <Accordion question={td.question} answer={td.answer} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Section>
                    </section>
                )}

                {/* ── KEY FEATURES ──────────────────────────────────────── */}
                {study.key_features && study.key_features.length > 0 && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={Zap} label="Features" title="Key Highlights" />
                            <motion.div
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}
                            >
                                {study.key_features.map((f, i) => (
                                    <motion.div key={i} variants={badgePop} className="glass-card" style={{ padding: 28 }} whileHover={{ y: -4, borderColor: 'var(--gold)', transition: { duration: 0.2 } }}>
                                        <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{f.icon || '✨'}</div>
                                        <h4 className="font-body" style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 8 }}>{f.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.description || f.desc}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Section>
                    </section>
                )}

                {/* ── CHALLENGES & SOLUTIONS ────────────────────────────── */}
                {study.challenges && study.challenges.length > 0 && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={AlertTriangle} label="Challenges" title="Problems Faced & Solutions" />
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {study.challenges.map((c, i) => (
                                    <motion.div key={i} variants={cardSlide} className="glass-card" style={{ padding: 28, borderLeft: '3px solid var(--gold)' }}>
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>!</span>
                                                <span className="font-mono" style={{ fontSize: '0.65rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Problem</span>
                                            </div>
                                            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: 32 }}>{c.problem}</p>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            {/* Connecting line */}
                                            <div style={{ position: 'absolute', top: -16, left: 11, width: 2, height: 16, background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>
                                                <span className="font-mono" style={{ fontSize: '0.65rem', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution</span>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: 32 }}>{c.solution}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Section>
                    </section>
                )}

                {/* ── METRICS / IMPACT ──────────────────────────────────── */}
                {study.metrics && study.metrics.length > 0 && (
                    <section style={{ padding: '80px 24px 0', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={Rocket} label="Impact" title="Results & Metrics" />
                            <motion.div
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}
                            >
                                {study.metrics.map((r, i) => (
                                    <motion.div key={i} variants={badgePop} className="glass-card" style={{ padding: 28, textAlign: 'center' }} whileHover={{ y: -4, borderColor: 'var(--gold)' }}>
                                        <div className="font-display" style={{ fontSize: '2.4rem', fontWeight: 600, color: 'var(--gold)', lineHeight: 1, marginBottom: 8 }}>
                                            {r.value || r.metric}
                                        </div>
                                        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            {r.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Section>
                    </section>
                )}

                {/* ── ROADMAP ────────────────────────────────────────── */}
                {study.roadmap && study.roadmap.length > 0 && (
                    <section style={{ padding: '80px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
                        <Section>
                            <SectionHeading icon={ChevronRight} label="Roadmap" title="What's Next?" />
                            <div className="glass-card" style={{ padding: 32 }}>
                                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {study.roadmap.map((step, i) => (
                                        <motion.div key={i} variants={cardSlide} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>{i + 1}</span>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, paddingTop: 4 }}>
                                                {typeof step === 'string' ? step : step.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </Section>
                    </section>
                )}

                {/* ── BOTTOM CTA ────────────────────────────────────────── */}
                <section style={{ padding: '40px 24px 120px', maxWidth: 900, margin: '0 auto' }}>
                    <Section>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.3, marginBottom: 48 }} />
                            <motion.button
                                onClick={() => navigate('/#projects')}
                                className="btn-ghost"
                                style={{ padding: '14px 32px' }}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201,168,76,0.2)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft size={16} /> View All Projects
                            </motion.button>
                        </div>
                    </Section>
                </section>

                </div>
            </>
            
            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImg && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.9)', zIndex: 1000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: 24
                        }}
                        onClick={() => setLightboxImg(null)}
                    >
                        <button 
                            style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                            onClick={() => setLightboxImg(null)}
                        >
                            <X size={32} />
                        </button>
                        <motion.img 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={lightboxImg} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} 
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
