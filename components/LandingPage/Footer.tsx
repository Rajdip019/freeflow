import React from 'react'

const Footer = () => {
    return (
        <div className="self-stretch bg-[#1E293B] flex flex-col py-16 px-0 items-center justify-center text-md text-gray-300 md:mt-10">
            <div className="self-stretch text-center md:text-left md:flex md:flex-row py-2.5 px-16 items-center justify-between">
                <div className="relative leading-[21.6px] mb-10 md:mb-0">
                    © 2023 Freeflow. All rights reserved.
                </div>
                <div className="relative text-base leading-[19px]">
                    <p className="mb-2 font-bold">Contact</p>
                    <p className="m-0 mb-1">Ahmed: ahmedgeaissa@gmail.com</p>
                    <p className="m-0">Rajdeep: rajdipgupta019@gmail.com</p>
                </div>
            </div>
        </div>
    )
}

export default Footer