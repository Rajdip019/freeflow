import React from 'react'
import ImageUploadModal from '../ImageUploadModal'

interface Props {
    title: string
}

const Header: React.FC<Props> = ({ title }) => {
    return (
        <div className=" flex justify-between text-white py-5 items-center mt-5">
            <h2 className=" font-sec text-5xl font-semibold">{title}</h2>
            <div className=" flex items-center text-center justify-center gap-3">
            <ImageUploadModal />
            </div>
        </div>
    )
}

export default Header