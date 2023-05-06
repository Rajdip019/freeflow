import { useUserContext } from '@/contexts/UserContext'
import React from 'react'
import { sidebarData } from '@/helpers/constants';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@chakra-ui/react';

const Sidebar = () => {

  const { user } = useUserContext();
  const { logout , authUser} = useAuth()
  const router = useRouter()
  return (
    <div className='top-0 sticky hidden h-screen bg-sec-black  py-4 px-4 md:flex justify-between flex-col'>
      <div>
        <div className='px-8'>
          <img src="/freeflow.png" alt="" className='w-40' />
        </div>
        <div className=' text-white  flex items-center gap-3 mt-8 text-lg'>
          <div>
            <Avatar className=' rounded-full ring-2 ring-purple-500 w-28' src={authUser?.photoURL as string} name={user?.name} />
          </div>
          <div>
            <h4 className=' font-semibold truncate'>{user?.name}</h4>
            <p className='  text-xs truncate'>{user?.email}</p>
          </div>
        </div>
        <div className=' mt-10 text-white'>
          {sidebarData.map((route, index) => {
            return (
              <div onClick={() => router.push(route.url)} className={`flex gap-3 px-3 py-2 rounded cursor-pointer ${route.url === router.pathname ? ' bg-[#334155]' : ''}`} key={index}>
                <img src={route.img} alt="" className=' w-6' />
                <p className=' font-sec'>{route.title}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className=' text-white'>
        <button onClick={logout} className=' my-5 w-full bg-red-400 hover:bg-red-500 transition-all py-2 rounded'>Logout</button>
        <p className=' text-xs text-gray-600'>© 2023 Freeflow. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Sidebar