import { useImageContext } from '@/contexts/ImagesContext'
import React, { useEffect, useState } from 'react'

const TotalImagesStats = () => {

    const { images } = useImageContext();
    const [prevWeek, setPrevWeek] = useState<number>(0)

    useEffect(() => {
        const result = images.map((image) => {
            const currentTime = Date.now();
            const imageUploadTime = image.timeStamp;
            if (currentTime - 604800000 < imageUploadTime) {
                return image
            } else {
                return null
            }
        })
        const finalArray = []
        result.forEach(elements => {
            if (elements != null && elements !== undefined) {
                finalArray.push(elements);
            }
        });
        setPrevWeek(finalArray.length)
    }, [images])

    return (
        <div className=' bg-[#7E22CE] text-white font-sec p-4 rounded w-full'>
            <div className=' flex mb-3 justify-between items-center'>
                <p>Total Images</p>
                <img src="/stats/image.png" className=' w-7' alt="" />
            </div>
            <div className=' flex items-baseline'>
                <h3 className=' text-5xl'>{images.length}</h3>
                <p className=' text-sm text-gray-300 ml-1'>+{prevWeek} this week</p>
            </div>
        </div>
    )
}

export default TotalImagesStats