import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [data, setData] = useState({
        about: null,
        skills: null,
        projects: null,
        experience: null,
        certifications: null,
        messages: [],
        settings: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        setError(null);
        try {
            // Fetch all data from Django API in parallel
            const [projects, skills, experience, certifications, settings, about] = await Promise.all([
                api.get('/projects/'),
                api.get('/skills/'),
                api.get('/experience/'),
                api.get('/certifications/'),
                api.get('/settings/'),
                api.get('/about/'),
            ]);

            setData(prev => ({
                ...prev,
                projects: projects.data,
                skills: skills.data,           // { categories: [...], skills: { Backend: [...], ... } }
                experience: experience.data,
                certifications: certifications.data,
                settings: settings.data,       // { section_visibility: { hero: true, ... } }
                about: about.data,
            }));
        } catch (err) {
            console.warn('[DataContext] Django API unavailable — falling back to static JSON', err.message);
            setError('API offline — showing cached data');

            // Fallback: load static JSON files from public/data/
            try {
                const [aboutJson, skillsJson, projectsJson, experienceJson, certificationsJson, settingsJson] = await Promise.all([
                    fetch('/data/about.json').then(r => r.json()),
                    fetch('/data/skills.json').then(r => r.json()),
                    fetch('/data/projects.json').then(r => r.json()),
                    fetch('/data/experience.json').then(r => r.json()),
                    fetch('/data/certifications.json').then(r => r.json()),
                    fetch('/data/settings.json').then(r => r.json()),
                ]);
                setData({
                    about: aboutJson,
                    skills: skillsJson,
                    projects: projectsJson,
                    experience: experienceJson,
                    certifications: certificationsJson,
                    messages: [],
                    settings: settingsJson,
                });
            } catch (fallbackErr) {
                console.error('[DataContext] Static JSON fallback also failed', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    }

    // Used by admin panel to optimistically update local state
    const updateData = useCallback((key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    }, []);

    // Used by Contact form to add message to local state after API save
    const addMessage = useCallback((msg) => {
        setData(prev => ({
            ...prev,
            messages: [
                ...(prev.messages || []),
                { ...msg, id: Date.now(), read: false, timestamp: new Date().toISOString() },
            ],
        }));
    }, []);

    const resetData = useCallback(() => {
        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ data, loading, error, updateData, addMessage, resetData }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
