import React from 'react'
import ImageUploadModal from '../ImageUploadModal'
import SidebarDrawer from '../MobileView/SidebarDrawer'

interface Props {
    title: string
}

const Header: React.FC<Props> = ({ title }) => {
    return (
        <div className=" flex sticky md:flex top-0 bg-gray-800 md:bg-transparent justify-between text-white py-5 px-10 items-center md:mt-5">
            <div className='flex gap-3 justify-center items-center'>
                <SidebarDrawer />
                <h2 className=" font-sec text-3xl md:text-5xl font-semibold">{title}</h2>
            </div>
            <div className=" flex items-center text-center justify-center gap-3">
            <ImageUploadModal />
            </div>
        </div>
    )
}

export default Header