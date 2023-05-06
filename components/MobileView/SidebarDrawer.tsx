import { Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, useDisclosure, Avatar } from '@chakra-ui/react'
import React from 'react'
import { sidebarData } from '@/helpers/constants'
import { useAuth } from '@/contexts/AuthContext'
import router from 'next/router'
import { useUserContext } from '@/contexts/UserContext'

const SidebarDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { logout, authUser } = useAuth();
    const { user } = useUserContext();

    return (
        <div className=' md:hidden'>
            <button onClick={onOpen}>
                <svg className=' w-8 mt-2' fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
                </svg>
            </button>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                colorScheme="blackAlpha"
            >
                <DrawerOverlay />
                <DrawerContent bgColor={"gray.800"}>
                    <DrawerCloseButton color={"white"} />
                    <DrawerHeader>Create your account</DrawerHeader>
                    <DrawerBody>
                        <div className='flex justify-between flex-col'>
                            <div>
                                <div className=''>
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
                        </div>
                    </DrawerBody>
                        <div className=' text-white p-8'>
                            <button onClick={logout} className=' my-5 w-full bg-red-400 hover:bg-red-500 transition-all py-2 rounded'>Logout</button>
                            <p className=' text-xs text-gray-600'>© 2023 Freeflow. All rights reserved.</p>
                        </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SidebarDrawer