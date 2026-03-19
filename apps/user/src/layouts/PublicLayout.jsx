import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

const PublicLayout = () => {
    const location = useLocation();

    return (
        <div className='font-sans antialiased text-slate-800'>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
