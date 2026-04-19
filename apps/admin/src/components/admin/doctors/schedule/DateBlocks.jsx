import React, { useState } from 'react';
import { CalendarOff, Plus, Trash2 } from 'lucide-react';
import { Input, Button } from '../../../ui';
import { useToast } from '../../../../context/ToastContext.jsx';

const DateBlocks = () => {
    const { showToast } = useToast();
    const [blocks, setBlocks] = useState([
        { id: 1, type: 'Vacation', start: '2026-04-25', end: '2026-04-28' },
        { id: 2, type: 'Conference', start: '2026-05-12', end: '2026-05-13' }
    ]);
    
    const [newBlock, setNewBlock] = useState({ start: '', end: '', type: 'Leave' });
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newBlock.start || !newBlock.end) return;

        setIsAdding(true);
        setTimeout(() => {
            setBlocks([...blocks, { ...newBlock, id: Date.now() }]);
            setNewBlock({ start: '', end: '', type: 'Leave' });
            setIsAdding(false);
            showToast('Time off block added successfully.', 'success');
        }, 500);
    };

    const handleDelete = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
        showToast('Time off block removed.', 'success');
    };

    return (
        <div className='p-[clamp(1rem,5vw,1.75rem)] border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col h-full'>
            <div className='mb-6'>
                <h4 className='text-[clamp(16px,2.5vw,18px)] font-bold text-gray-900 dark:text-white'>
                    Date Blocks (Time Off)
                </h4>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mt-1'>
                    Block full days for vacation, sick leave, or conferences.
                </p>
            </div>

            <form onSubmit={handleAdd} className='grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-white/[0.01]'>
                <div className='sm:col-span-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>Reason</label>
                    <select 
                        value={newBlock.type}
                        onChange={(e) => setNewBlock({...newBlock, type: e.target.value})}
                        className='w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none'
                    >
                        <option value="Leave">Leave / Personal</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Conference">Training / Conference</option>
                    </select>
                </div>
                <div className='sm:col-span-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>Start Date</label>
                    <Input 
                        type="date" 
                        required
                        value={newBlock.start}
                        onChange={(e) => setNewBlock({...newBlock, start: e.target.value})}
                        className="h-10 text-sm font-bold bg-white dark:bg-gray-900"
                    />
                </div>
                <div className='sm:col-span-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>End Date</label>
                    <Input 
                        type="date" 
                        required
                        value={newBlock.end}
                        onChange={(e) => setNewBlock({...newBlock, end: e.target.value})}
                        className="h-10 text-sm font-bold bg-white dark:bg-gray-900"
                    />
                </div>
                <div className='sm:col-span-3 flex items-end'>
                    <Button 
                        type="submit"
                        disabled={isAdding}
                        className='w-full h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100'
                    >
                        {isAdding ? 'Adding...' : <><Plus size={16} /> Add Block</>}
                    </Button>
                </div>
            </form>

            <div className='flex-grow overflow-y-auto no-scrollbar space-y-3 min-h-[150px]'>
                {blocks.map((block) => (
                    <div 
                        key={block.id}
                        className='p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0'>
                                <CalendarOff size={18} className='text-amber-500' />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>
                                    {block.type}
                                </h5>
                                <p className='text-xs font-medium text-gray-500'>
                                    {new Date(block.start).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {new Date(block.end).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(block.id)}
                            className='p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100'
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className='h-full flex flex-col items-center justify-center text-center'>
                        <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>No Upcoming Time Off</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateBlocks;
