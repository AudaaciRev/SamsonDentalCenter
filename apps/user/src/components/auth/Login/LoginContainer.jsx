import { useNavigate } from 'react-router-dom';
import Carousel from './components/Carousel';
import LoginForm from './components/LoginForm';

const LoginContainer = ({ onSubmit, loading = false, error = null }) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className='w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[580px] md:h-[620px]'>
            {/* Left — Carousel */}
            <Carousel />

            {/* Right — Form */}
            <div className='flex-grow md:w-[65%] flex flex-col p-4 sm:p-6 relative overflow-hidden'>
                <button
                    onClick={handleGoHome}
                    className='absolute top-4 right-4 text-slate-300 hover:text-sky-500 transition-all z-20'
                >
                    <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2.5'
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </button>

                <div className='flex-grow flex flex-col min-h-0 max-w-2xl mx-auto w-full px-4 sm:px-12 py-2 overflow-hidden'>
                    <div className='flex-grow flex flex-col min-h-0'>
                        <LoginForm
                            onSubmit={onSubmit}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;
