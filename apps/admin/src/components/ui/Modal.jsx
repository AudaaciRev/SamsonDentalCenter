import { useRef, useEffect } from 'react';

export const Modal = ({
    isOpen,
    onClose,
    children,
    footer,
    className = '',
    showCloseButton = true,
    isFullscreen = false,
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const contentClasses = isFullscreen
        ? 'w-full h-full'
        : 'relative w-full sm:rounded-2xl rounded-t-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-lg max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden';

    return (
        <div className='fixed inset-0 flex sm:items-center items-end justify-center sm:p-4 p-0 modal z-[999999]'>
            {!isFullscreen && (
                <div
                    className='fixed inset-0 h-full w-full bg-black/60 backdrop-blur-md transition-all duration-300'
                    onClick={onClose}
                ></div>
            )}
            <div
                ref={modalRef}
                className={`${contentClasses} ${className} animate-in slide-in-from-bottom sm:slide-in-from-top duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Grab handle for mobile bottom sheet */}
                <div className='flex sm:hidden items-center justify-center pt-3 pb-1'>
                    <div className='w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full' />
                </div>

                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className='absolute right-3 top-3 z-[9999] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11'
                    >
                        <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z'
                                fill='currentColor'
                            />
                        </svg>
                    </button>
                )}
                <div className='flex-1 overflow-y-auto no-scrollbar'>{children}</div>
                {footer && (
                    <div className='border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]'>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};




