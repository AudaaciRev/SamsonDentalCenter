import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';
import { Input, Button } from '../../../ui';
import { useToast } from '../../../../context/ToastContext.jsx';

const SpecificTimeBlocks = () => {
    const { showToast } = useToast();
    const [blocks, setBlocks] = useState([
        { id: 1, date: '2026-04-20', start: '12:00', end: '13:00', note: 'Lunch Break' },
        { id: 2, date: '2026-04-22', start: '14:00', end: '15:00', note: 'Staff Meeting' }
    ]);
    
    const [newBlock, setNewBlock] = useState({ date: '', start: '', end: '', note: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newBlock.date || !newBlock.start || !newBlock.end || !newBlock.note) return;

        setIsAdding(true);
        setTimeout(() => {
            setBlocks([...blocks, { ...newBlock, id: Date.now() }]);
            setNewBlock({ date: '', start: '', end: '', note: '' });
            setIsAdding(false);
            showToast('Time block added successfully.', 'success');
        }, 500);
    };

    const handleDelete = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
        showToast('Time block removed.', 'success');
    };

    return (
        <div className='p-[clamp(1rem,5vw,1.75rem)] border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col h-full'>
            <div className='mb-6'>
                <h4 className='text-[clamp(16px,2.5vw,18px)] font-bold text-gray-900 dark:text-white'>
                    Specific Time Blocks
                </h4>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mt-1'>
                    Block out specific hours on a given day (e.g., lunches, meetings).
                </p>
            </div>

            <form onSubmit={handleAdd} className='grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-500/[0.02]'>
                <div className='sm:col-span-12'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>Note / Reason</label>
                    <Input 
                        required
                        placeholder="E.g., Lunch Break, Staff Meeting"
                        value={newBlock.note}
                        onChange={(e) => setNewBlock({...newBlock, note: e.target.value})}
                        className="h-10 text-sm font-bold bg-white dark:bg-gray-900"
                    />
                </div>
                <div className='sm:col-span-4'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>Date</label>
                    <Input 
                        type="date" 
                        required
                        value={newBlock.date}
                        onChange={(e) => setNewBlock({...newBlock, date: e.target.value})}
                        className="h-10 text-sm font-bold bg-white dark:bg-gray-900"
                    />
                </div>
                <div className='sm:col-span-4'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'>Time Range</label>
                    <div className='flex items-center gap-1'>
                        <Input 
                            type="time" 
                            required
                            value={newBlock.start}
                            onChange={(e) => setNewBlock({...newBlock, start: e.target.value})}
                            className="h-10 text-xs font-bold bg-white dark:bg-gray-900 px-2"
                        />
                        <span className='text-gray-400'>-</span>
                        <Input 
                            type="time" 
                            required
                            value={newBlock.end}
                            onChange={(e) => setNewBlock({...newBlock, end: e.target.value})}
                            className="h-10 text-xs font-bold bg-white dark:bg-gray-900 px-2"
                        />
                    </div>
                </div>
                <div className='sm:col-span-4 flex items-end'>
                    <Button 
                        type="submit"
                        disabled={isAdding}
                        className='w-full h-10 bg-brand-500 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-brand-600'
                    >
                        {isAdding ? 'Adding...' : <><Plus size={16} /> Block Time</>}
                    </Button>
                </div>
            </form>

            <div className='flex-grow overflow-y-auto no-scrollbar space-y-3 min-h-[150px]'>
                {blocks.map((block) => (
                    <div 
                        key={block.id}
                        className='p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:border-brand-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0'>
                                <Clock size={18} className='text-brand-500' />
                            </div>
                            <div>
                                <h5 className='text-sm font-bold text-gray-900 dark:text-white'>
                                    {block.note}
                                </h5>
                                <p className='text-xs font-medium text-gray-500 flex items-center gap-1.5'>
                                    <Calendar size={12} /> {new Date(block.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                                    <span className='mx-1 opacity-50'>|</span>
                                    {block.start} - {block.end}
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
                        <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>No Active Time Blocks</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecificTimeBlocks;
