import React from 'react'
import Sidebar from './Sidebar'
import FFPage from '../FFComponents/FFPage'

const DashboardLayout = ({ children }: any) => {
    return (
        <FFPage isAuthRequired={true}>
            <div className=' flex'>
                <Sidebar />
                <div className=' bg-black w-full px-10'>
                    {children}
                    {/* <div className=' absolute bottom-0 w-full h-10 bg-gradient-to-t from-[#7E3BC3] to-black '></div> */}
                </div>
            </div>
        </FFPage>
    )
}

export default DashboardLayout