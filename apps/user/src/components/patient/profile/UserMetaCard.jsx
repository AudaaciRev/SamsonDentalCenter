import { useState } from 'react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Label from '../../ui/Label';
import { useAuth } from '../../../context/AuthContext';

export default function UserMetaCard() {
    const { user, updateProfile } = useAuth();
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url);
    const [isSaving, setIsSaving] = useState(false);

    const AVATARS = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver'
    ];

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({ avatar_url: selectedAvatar });
            closeModal();
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className='p-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
                    <div className='flex flex-col items-center w-full gap-6 xl:flex-row'>
                        <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-brand-50 text-brand-600 font-bold text-2xl shadow-inner'>
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                getInitials()
                            )}
                        </div>
                        <div className='order-3 xl:order-2'>
                            <h4 className='mb-2 text-[clamp(18px,2vw,20px)] font-bold text-center text-gray-900 dark:text-white xl:text-left'>
                                {user?.first_name ? `${user.last_name}, ${user.first_name} ${user.middle_name || ''} ${user.suffix || ''}`.replace(/\s+/g, ' ').trim() : (user?.full_name || 'Patient Name')}
                            </h4>
                            <div className='flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                <p className='text-[clamp(13px,1.2vw,14px)] text-gray-500 dark:text-gray-400 font-medium'>
                                    Patient
                                </p>
                                <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                <p className='text-[clamp(13px,1.2vw,14px)] text-gray-500 dark:text-gray-400 font-medium'>
                                    Member since 2024
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant='outline'
                        onClick={openModal}
                        className='flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold shadow-theme-xs lg:inline-flex lg:w-auto hover:shadow-lg hover:border-brand-500 hover:text-brand-500'
                    >
                        <svg
                            className='fill-current'
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                                fill='currentColor'
                            />
                        </svg>
                        Edit
                    </Button>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[440px] w-[92%] m-auto'>
                <div className='no-scrollbar relative w-full overflow-y-auto rounded-[2rem] bg-white p-6 dark:bg-gray-900 sm:p-8'>
                    <div className='pr-8 sm:pr-12'>
                        <h4 className='mb-1 text-xl font-bold text-gray-900 dark:text-white'>
                            Edit Avatar
                        </h4>
                        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
                            Choose a custom profile avatar to personalize your account.
                        </p>
                    </div>
                    <form className='flex flex-col gap-6' onSubmit={handleSave}>
                        <div>
                            <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4 block">
                                Choose Avatar
                            </Label>
                            <div className='grid grid-cols-3 gap-3 mb-2'>
                                {AVATARS.map((url, i) => (
                                    <div 
                                        key={i}
                                        onClick={() => setSelectedAvatar(url)}
                                        className={`relative cursor-pointer group rounded-2xl border-2 transition-all duration-300 aspect-square overflow-hidden flex items-center justify-center p-1
                                            ${selectedAvatar === url ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                    >
                                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                                        {selectedAvatar === url && (
                                            <div className="absolute top-1 right-1 bg-brand-500 text-white rounded-full p-0.5 shadow-sm scale-90 sm:scale-100">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='flex items-center gap-3 mt-4 sm:justify-end'>
                            <Button variant='outline' type="button" onClick={closeModal} className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-bold" disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button type='submit' className="flex-1 sm:flex-none h-11 px-6 rounded-xl font-bold" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
