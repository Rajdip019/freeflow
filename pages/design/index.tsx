import DashboardLayout from '@/components/Dashboard/DashboardLayout'
import React from 'react'

const Design = () => {
    return (
        <DashboardLayout>
            <div className=' flex justify-between px-10 text-white py-5 items-center'>
                <h2 className=' font-sec text-5xl font-semibold'>Designs</h2>
                <div className=" flex items-center text-center justify-center gap-3">
                    <p className=" font-semibold text-2xl font-sec">Upload Photo</p>
                    <svg fill="currentColor" className='w-12 text-p' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" />
                    </svg>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Design