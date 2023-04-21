import React from 'react'
import ImageUploader from '../ImageUploader'

const Hero = () => {
  return (
    <div className=' px-40 py-20 flex' >
        <div>
            <h1 className=' text-gradient-p text-[65px] font-black leading-tight mb-5'>The fastest way <br/> for designers to get feedback</h1>
            <p className=' text-white font-bold text-7xl mb-5'>Upload an image and share the <br /> link to get visual feedback</p>
            <img src="string.png" alt="" className=' w-10/12 mt-10' />
        </div>
        <div>
            <ImageUploader />
        </div>
    </div>
  )
}

export default Hero