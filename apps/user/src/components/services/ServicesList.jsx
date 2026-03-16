import { useNavigate } from 'react-router-dom';
import useServices from '../../hooks/useServices';

const ServicesList = () => {
    const navigate = useNavigate();
    const { services, loading, error } = useServices();

    // Mapping services to include images if they don't have them
    const serviceImages = [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1445527815219-ec9fc013d333?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    ];

    return (
        <div className='min-h-screen bg-white pb-20'>
            {/* Services List */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32'>
                {loading && (
                    <div className='flex flex-col items-center justify-center py-32 gap-4'>
                        <div className='w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin'></div>
                        <p className='text-slate-400 font-medium animate-pulse'>
                            Curating services...
                        </p>
                    </div>
                )}

                {!loading && services?.length === 0 && !error && (
                    <div className='text-center py-32 bg-slate-50 rounded-2xl border border-dashed border-slate-200'>
                        <p className='text-slate-600 font-medium'>
                            Our service catalog is currently being updated.
                        </p>
                    </div>
                )}

                {services?.length > 0 && (
                    <div className='flex flex-col gap-32 md:gap-48'>
                        {services.map((service, index) => {
                            const imageStr = serviceImages[index % serviceImages.length];
                            const numberStr = String(index + 1).padStart(2, '0');
                            const totalStr = String(services.length).padStart(2, '0');

                            return (
                                <div
                                    key={service.id}
                                    className='relative flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-24 group'
                                >
                                    {/* Image Section with Number */}
                                    <div
                                        className={`relative z-10 w-full md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}
                                    >
                                        {/* Number Behind Image */}
                                        <div className='absolute -top-16 left-0 text-[90px] font-bold text-[#c9cbce] z-0 select-none leading-none'>
                                            00/{numberStr}
                                        </div>
                                        <div className='relative aspect-[4/3] w-full overflow-hidden bg-slate-100 shadow-sm transition-[transform] duration-500 group-hover:-translate-y-2 z-10 rounded-2xl'>
                                            <img
                                                src={imageStr}
                                                alt={service.name}
                                                className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                                            />
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div
                                        className={`relative z-10 w-full md:w-1/2 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}
                                    >
                                        <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 md:mb-6 tracking-tight'>
                                            {service.name}
                                        </h2>
                                        <p className='text-base md:text-lg text-slate-500 leading-relaxed mb-8 md:mb-12 max-w-lg font-light'>
                                            {service.description ||
                                                (service.duration_minutes
                                                    ? `Duration: ${service.duration_minutes} minutes`
                                                    : 'Professional service excellence.')}
                                        </p>

                                        <button
                                            onClick={() => navigate(`/services/${service.id}`)}
                                            className='group/btn inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-blue-600 transition-[color] duration-200 w-fit'
                                        >
                                            CONTINUE READING
                                            <span className='ml-4 w-12 h-[1px] bg-slate-900 group-hover/btn:bg-blue-600 group-hover/btn:w-16 transition-all duration-300'></span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesList;
