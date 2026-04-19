import React from 'react';
import WeeklyRoutine from './WeeklyRoutine';
import DateBlocks from './DateBlocks';
import SpecificTimeBlocks from './SpecificTimeBlocks';

const DoctorScheduleDetail = ({ doctor }) => {
    return (
        <div className='flex flex-col gap-6'>
            {/* Top row: The main weekly form */}
            <div className='w-full'>
                <WeeklyRoutine doctor={doctor} />
            </div>

            {/* Bottom row: Exception blocks */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <DateBlocks doctor={doctor} />
                <SpecificTimeBlocks doctor={doctor} />
            </div>
        </div>
    );
};

export default DoctorScheduleDetail;

