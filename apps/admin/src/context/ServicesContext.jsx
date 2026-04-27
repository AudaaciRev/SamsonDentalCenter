import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ServicesContext = createContext();

const MOCK_SERVICES = [
    {
        id: 1,
        name: 'Oral Prophylaxis (Cleaning)',
        tier: 'general',
        cost: '1500',
        duration: '45m',
        description: 'Professional cleaning to remove plaque and tartar, preventing gum disease and cavities.',
        image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop',
    },
    {
        id: 2,
        name: 'Composite Restoration',
        tier: 'general',
        cost: '2000',
        duration: '1h',
        description: 'Tooth-colored fillings used to restore decayed or damaged teeth for a natural look.',
        image_url: 'https://images.unsplash.com/photo-1606811841660-1b51e9dd2d95?w=800&h=600&fit=crop',
    },
    {
        id: 3,
        name: 'Root Canal Therapy',
        tier: 'specialized',
        cost: '8000',
        duration: '1h 30m',
        description: 'Advanced procedure to save a severely infected tooth by removing damaged pulp.',
        image_url: 'https://images.unsplash.com/photo-1593054941142-554424f20bf7?w=800&h=600&fit=crop',
    },
    {
        id: 4,
        name: 'Orthodontic Braces',
        tier: 'specialized',
        cost: '45000',
        duration: '1h',
        description: 'Corrective treatment for misaligned teeth and bite issues using premium orthodontic brackets.',
        image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=600&fit=crop',
    },
    {
        id: 5,
        name: 'Dental Implants',
        tier: 'specialized',
        cost: '60000',
        duration: '2h',
        description: 'Permanent solution for missing teeth using titanium posts and realistic crowns.',
        image_url: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=800&h=600&fit=crop',
    },
    {
        id: 6,
        name: 'Teeth Whitening',
        tier: 'general',
        cost: '12000',
        duration: '1h',
        description: 'Professional bleaching treatment to brighten your smile and remove deep stains.',
        image_url: null,
    },
    {
        id: 7,
        name: 'Tooth Extraction',
        tier: 'general',
        cost: '1500',
        duration: '30m',
        description: 'Safe and painless removal of non-restorable or problematic teeth.',
        image_url: null,
    },
    {
        id: 8,
        name: 'Wisdom Tooth Surgery',
        tier: 'specialized',
        cost: '15000',
        duration: '1h 30m',
        description: 'Surgical removal of impacted wisdom teeth to prevent pain and overcrowding.',
        image_url: null,
    },
    {
        id: 9,
        name: 'Dental crowns and Bridges',
        tier: 'specialized',
        cost: '15000',
        duration: '1h',
        description: 'Fixed prosthetics used to restore damaged teeth or replace missing ones.',
        image_url: null,
    },
    {
        id: 10,
        name: 'Full Dentures',
        tier: 'specialized',
        cost: '25000',
        duration: '2h',
        description: 'Complete set of removable teeth for patients with total tooth loss.',
        image_url: null,
    },
    {
        id: 11,
        name: 'Gingivectomy',
        tier: 'specialized',
        cost: '5000',
        duration: '45m',
        description: 'Surgical removal of excess gum tissue for health or aesthetic reasons.',
        image_url: null,
    },
    {
        id: 12,
        name: 'Fluoride Treatment',
        tier: 'general',
        cost: '800',
        duration: '15m',
        description: 'High-concentration fluoride varnish to strengthen enamel and prevent decay.',
        image_url: null,
    },
    {
        id: 13,
        name: 'Pit and Fissure Sealant',
        tier: 'general',
        cost: '1000',
        duration: '20m',
        description: 'Thin protective coating applied to the chewing surfaces of back teeth.',
        image_url: null,
    },
    {
        id: 14,
        name: 'Scaling and Root Planing',
        tier: 'specialized',
        cost: '3500',
        duration: '1h',
        description: 'Deep cleaning procedure to treat early stages of periodontal disease.',
        image_url: null,
    },
    {
        id: 15,
        name: 'Periodontal Management',
        tier: 'specialized',
        cost: '4000',
        duration: '1h',
        description: 'Ongoing care and treatment for maintaining healthy gums and supporting structures.',
        image_url: null,
    },
];

export const ServicesProvider = ({ children }) => {
    const [services, setServices] = useState(MOCK_SERVICES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCached, setIsCached] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get('/services');
            if (data.services && data.services.length > 0) {
                setServices(data.services);
            } else {
                setServices(MOCK_SERVICES);
            }
            setIsCached(true);
        } catch (err) {
            console.warn('Backend not available, using mock services.');
            setServices(MOCK_SERVICES);
            setIsCached(true);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        services,
        loading,
        error,
        refetch: fetchServices,
    };

    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServicesContext = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServicesContext must be used within ServicesProvider');
    }
    return context;
};




