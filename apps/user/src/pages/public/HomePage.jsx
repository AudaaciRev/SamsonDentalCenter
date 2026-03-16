import { useRef } from 'react';
import Hero from '../../components/home/Hero';
import Promotions from '../../components/home/Promotions';
import HomeServices from '../../components/home/HomeServices';
import Portfolio from '../../components/home/Portfolio';
import AIChatbotPromo from '../../components/home/AIChatbotPromo';
import Gallery from '../../components/home/Gallery';
import Testimonials from '../../components/home/Testimonials';
import LocationHours from '../../components/home/LocationHours';

const HomePage = () => {
    const promotionsRef = useRef(null);

    return (
        <>
            {/* 1. Introduction & Primary CTA */}
            <Hero />

            {/* 2. Immediate Hooks/Offers */}
            <Promotions ref={promotionsRef} variant='light' />

            {/* 3. Core Offerings (What you do) */}
            <HomeServices variant='dark' />

            {/* 4. Visual Proof */}
            <Gallery variant='dark' />
            <Portfolio variant='light' />

            {/* 5. Social Proof (Trust) */}
            <Testimonials variant='light' />

            {/* 6. Secondary Features/Tech */}
            <AIChatbotPromo variant='light' />

            {/* 7. Logistics (When ready to activate) */}
            <LocationHours variant='light' />
        </>
    );
};

export default HomePage;
