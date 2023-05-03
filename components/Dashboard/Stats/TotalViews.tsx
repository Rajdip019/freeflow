import { useImageContext } from '@/contexts/ImagesContext';
import React, { useEffect, useState } from 'react'

const TotalViews = () => {

    const {images} = useImageContext()
    const [views, setViews] = useState<number>(0);

    useEffect(() => {
        if(images.length !== 0){
            const sum = images.reduce((accumulator, object : any) => {
              return accumulator + object.views;
            }, 0);
            const finalSum = Math.round((Math.round(sum * 100) / 100)/1024 *100) / 100 ;
            setViews(finalSum)
        }
    }, [images])

    return (
        <div className=' bg-[#047857] text-white font-sec p-4  rounded w-full'>
            <div className=' flex mb-3 justify-between items-center'>
                <p>Total Views</p>
                <img src="/stats/eye.png" className=' w-7' alt="" />
            </div>
            <div className=' flex items-baseline'>
                <h3 className=' text-5xl'>{views}</h3>
                {/* <p className=' text-sm text-gray-300 ml-1'>+100 this week</p> */}
            </div>
        </div>
    )
}

export default TotalViews