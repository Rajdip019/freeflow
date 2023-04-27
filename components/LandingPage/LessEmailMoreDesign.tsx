import React from 'react'

const LessEmailMoreDesign = () => {
  return (
    <div>
        <div className=' md:px-40 mt-10 text-white'>
            <p className='text-white font-semibold text-center text-7xl font-sec'>Less Emails. More Design</p>
            <div className=' flex justify-center mb-10'>
            <div className=' md:hidden w-1 bg-gradient-to-b from-[#E5405E] via-[#FFE600] to-[#9333EA] mt-10 mr-5'></div>
                <div className=' flex md:w-full md:justify-between mt-10 flex-col md:flex-row gap-5 md:gap-0'>
                    <div className=' flex items-center gap-2'>
                        <img src="icon.png" alt="" className='w-6' />
                        <p>Upload</p>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <img src="icon-1.png" alt="" className=' w-6' />
                        <p>Share</p>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <img src="icon-2.png" alt="" className=' w-6' />
                        <p>Get Feedback</p>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <img src="icon-3.png" alt="" className=' w-6' />
                        <p>Iterate</p>
                    </div>
                    <div className=' flex items-center gap-2'>
                        <img src="icon-4.png" alt="" className=' w-6' />
                        <p>Deliver</p>
                    </div>
                </div>
            </div>
        </div>
        <div className=' hidden md:block w-screen h-1 bg-gradient-to-r from-[#E5405E] via-[#FFE600] to-[#9333EA] mt-10'></div>
    </div>
  )
}

export default LessEmailMoreDesign