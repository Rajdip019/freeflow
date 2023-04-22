import React from 'react'
import ImageUploader from '../ImageUploader'

const Hero = () => {
  return (
    <div className=' px-5 md:px-40 md:py-20 my-10 flex flex-col md:flex-row text-center md:text-left' >
        <div>
            <h1 className=' text-gradient-p text-[50px] md:text-[65px] font-black leading-tight mb-5'>The fastest way for designers to get feedback</h1>
            <p className=' text-white font-bold text-7xl mb-5'>Upload an image and share the <br /> link to get visual feedback</p>
            <img src="string.png" alt="" className=' w-10/12 mt-10 mb-10 md:mb-0 mx-auto md:mx-0' />
        </div>
        <div>
            <ImageUploader />
        </div>
    </div>
  )
}

export default Hero