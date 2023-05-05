import { useImageContext } from '@/contexts/ImagesContext';
import { useUserContext } from '@/contexts/UserContext'
import React from 'react'

const StorageStats = () => {
    const { user } = useUserContext();
    const {storage} = useImageContext();

    console.log(user?.storage);
    

  return (
    <div className=' bg-[#1E40AF] text-white font-sec p-4  rounded w-full '>
    <div className=' flex mb-3 justify-between items-center'>
        <p>Storage</p>
        <img src="/stats/storage.png" className=' w-7' alt="" />
    </div>
    <div className=' flex items-baseline'>
        <h3 className=' text-5xl'>{storage}</h3>
        <p className=' text-sm text-gray-300 ml-1'>/ {user?.storage as number/1024} GB</p>
    </div>
</div>
  )
}

export default StorageStats