import React from 'react'

const EverythingYouNeedToFocusOn = () => {
  return (
    <div className=' text-white px-5 md:px-40 mt-10'>
        <h2 className='text-white font-semibold text-center text-7xl font-sec mb-10'>Everything You Need To Focus On Design</h2>
        <div className=' flex justify-between flex-col md:flex-row gap-5 md:gap-0 mb-20'>
            <div className='px-4 py-2 flex justify-center items-center gap-2 border-purple-500 border rounded-full'>
                <img src="/icons/Icon 2.png" alt="" className=' w-5' />
                <p className=' font-semibold'>Version Control</p>
            </div>
            <div className='px-4 py-2 flex justify-center items-center gap-2 border-purple-500 border rounded-full'>
                <img src="/icons/Icon-1 2.png" alt="" className=' w-5' />
                <p className=' font-semibold'>Private Links</p>
            </div>
            <div className='px-4 py-2 flex justify-center items-center gap-2 border-purple-500 border rounded-full'>
                <img src="/icons/Icon-2 2.png" alt="" className=' w-5' />
                <p className=' font-semibold'>Project Dashboard</p>
            </div>
            <div className='px-4 py-2 flex justify-center items-center gap-2 border-purple-500 border rounded-full'>
                <img src="/icons/Icon-3 2.png" alt="" className=' w-5' />
                <p className=' font-semibold'>Approval System</p>
            </div>
        </div>
    </div>
  )
}

export default EverythingYouNeedToFocusOn