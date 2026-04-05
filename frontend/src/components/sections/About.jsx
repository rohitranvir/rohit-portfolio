import { useEffect, useState } from 'react';
import { useScrollReveal } from '../../hooks/useAnimations';
import { useData } from '../../context/DataContext';
import { MapPin, GraduationCap, BarChart3, Globe, Mail, Briefcase } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

function useCountUp(target, duration = 2000) {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        // Parse number from value like "4+" or "7.5"
        const numericValue = parseFloat(target);
        if (isNaN(numericValue)) {
            setCount(target); // if not a number, show as-is
            return;
        }
        
        let start = 0;
        const increment = numericValue / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
                setCount(target); // show original with symbol
                clearInterval(timer);
            } else {
                setCount(
                    numericValue % 1 === 0 
                        ? Math.floor(start)
                        : start.toFixed(1)
                );
            }
        }, 16);
        
        return () => clearInterval(timer);
    }, [target, duration]);
    
    return count;
}

export default function About() {
    const { data } = useData();
    const [ref, visible] = useScrollReveal(0.05);

    const aboutData = data?.about || {};

    const stats = [
        { value: '4+',  label: 'Projects Completed' },
        { value: '2',   label: 'Internships Done' },
        { value: '7.5', label: 'CGPA Score' }
    ];

    const infoGrid = [
        { icon: MapPin, label: 'Location', value: aboutData.info?.location || 'Pusad, Maharashtra' },
        { icon: GraduationCap, label: 'Degree', value: aboutData.info?.degree || 'B.E. CSE (Data Science & ML)' },
        { icon: BarChart3, label: 'CGPA', value: aboutData.info?.cgpa || '7.5 / 10' },
        { icon: Globe, label: 'Languages', value: aboutData.info?.languages || 'English, Marathi' },
        { icon: Mail, label: 'Email', value: aboutData.info?.email || 'rohitranveer358@gmail.com' },
        { icon: Briefcase, label: 'Status', value: aboutData.info?.status || 'Actively Job Seeking' },
    ].filter(item => item.value);

    return (
        <section id="about" style={{ padding: '120px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
                ref={ref}
                initial="hidden"
                animate={visible ? "visible" : "hidden"}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 60, alignItems: 'start' }}
            >
                {/* LEFT COLUMN — Photo + Stats */}
                <motion.div variants={{ hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } } }}>
                    {/* Luxury Frame */}
                    <motion.div
                        className="luxury-frame"
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ 
                            width: '100%', 
                            maxWidth: 320, 
                            margin: '0 auto', 
                            height: 380,
                            background: 'var(--bg-card)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            position: 'relative',
                            borderRadius: '12px'
                        }}
                    >
                        {/* Corner Brackets */}
                        <div className="corner tl" /><div className="corner tr" /><div className="corner bl" /><div className="corner br" />

                        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '10px' }}>
                            <img
                                src="/images/rohit.jpg"
                                alt="Rohit Ranvir"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    borderRadius: '12px',
                                    filter: 'contrast(1.05) brightness(0.95) saturate(0.9)'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    console.log('Image failed to load: /images/rohit.jpg');
                                }}
                            />
                            
                            <div className="photo-glow" style={{
                                position: 'absolute',
                                inset: '-1px',
                                borderRadius: '12px',
                                background: 'transparent',
                                boxShadow: '0 0 40px rgba(201,168,76,0.15)',
                                border: '1px solid rgba(201,168,76,0.25)',
                                pointerEvents: 'none',
                                zIndex: 2
                            }} />
                        </div>

                        {/* Open to Work Badge */}
                        <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '30px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', zIndex: 10, whiteSpace: 'nowrap' }}>
                            <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }} />
                            <span className="font-mono" style={{ fontSize: '0.7rem', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                                Available for Opportunities
                            </span>
                        </div>
                    </motion.div>

                    {/* Animated Stats */}
                    <div style={{ display: 'flex', gap: 16, marginTop: 40, maxWidth: 400, margin: '40px auto 0' }}>
                        {stats.map((stat, i) => (
                            <div key={i} className="glass-card" style={{ padding: '20px 16px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <StatValue target={stat.value} visible={visible} />
                                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT COLUMN — Bio */}
                <motion.div variants={{ hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } } }}>
                    <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="font-mono" style={{ display: 'inline-block', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        — ABOUT ME
                    </motion.span>

                    <h2 className={`font-display gold-underline ${visible ? 'visible' : ''}`} style={{ fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', fontWeight: 400, marginTop: 16, marginBottom: 32, lineHeight: 1.2 }}>
                        Crafting Code With Purpose & Precision.
                    </h2>

                    <motion.div className="font-body" style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.1 } } }}>
                            I'm Rohit Ranvir, a Computer Science & Engineering graduate with specialization in Data Science & Machine Learning from Babasaheb Naik College of Engineering, Pusad (Class of 2025). I build intelligent, scalable systems that solve real problems.
                        </motion.p>
                        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}>
                            My expertise spans Python full stack development, machine learning, deep learning, data analysis, and Java development. I love turning complex data into meaningful insights and building elegant web applications from scratch.
                        </motion.p>
                        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}>
                            I've completed internships at Zidio Development (Web Development) and Codesoft Private Limited (Data Analyst), where I worked on real-world projects and sharpened my skills. I've also published a research paper in IJISRT on deep learning based sentiment analysis.
                        </motion.p>
                    </motion.div>

                    {/* Gold Divider */}
                    <motion.div
                        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.4 } } }}
                        style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, var(--gold), transparent)', margin: '40px 0', opacity: 0.5, transformOrigin: 'left' }}
                    />

                    {/* Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
                        {infoGrid.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.5 + (0.1 * index) } } }}
                                    whileHover={{ x: 5, color: 'var(--gold)', '& .icon-container': { background: 'rgba(201,168,76,0.2)', scale: 1.1 } }}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'default', transition: 'color 0.3s' }}
                                >
                                    <div className="icon-container" style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                                        <Icon size={18} style={{ color: 'var(--gold)' }} />
                                    </div>
                                    <div>
                                        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                                            {item.label}
                                        </div>
                                        <div className="font-body" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, transition: 'color 0.3s' }}>
                                            {item.value}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
            
            <style>{`
                @media (max-width: 768px) {
                    #about .luxury-frame { 
                        max-width: 260px !important; 
                        height: 320px !important;
                    }
                }
            `}</style>
        </section>
    );
}

// Extracted to avoid hook in loop issue
function StatValue({ target, visible }) {
    const displayValue = useCountUp(visible ? target : '0');
    return (
        <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 600, color: 'var(--gold)', lineHeight: 1 }}>
            {displayValue}
        </div>
    );
}
