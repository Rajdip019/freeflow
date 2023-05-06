import { IReviewImageData } from "@/interfaces/ReviewImageData";
import Link from "next/link";
import React, { useState } from "react";
import Moment from "react-moment";

interface Props {
    imageData: IReviewImageData;
}

const ReviewImageMobile: React.FC<Props> = ({ imageData }) => {
    const [onlyImage, setOnlyImage] = useState<boolean>(false);

    return (
        <>
            {onlyImage ? (
                <div className=" relative min-h-screen flex justify-center bg-gray-900">
                    <div className=" absolute top-5 w-full flex justify-center flex-col items-center">
                        {" "}
                        <Link href={"/"}>
                            <img src="/freeflow.png" alt="" className=" w-24 mb-4" />
                        </Link>
                        <div className="h-[8vh] text-white bg-purple-500 flex flex-col justify-center items-center w-full">
                            <h2 className=" text-lg font-semibold">{imageData?.imageName}</h2>
                            <div className=" flex flex-wrap justify-center items-center flex-col">
                                <p className=" text-sm">Uploaded by {imageData?.uploadedBy}</p>
                                <Moment fromNow className="text-xs">
                                    {imageData?.timeStamp}
                                </Moment>
                            </div>
                        </div>
                    </div>
                    <div className=" mt-40 px-5">
                        <img src={imageData.imageURL} alt="" />
                    </div>
                    <div className=" absolute bottom-10 text-gray-300 px-10 text-center">
                        <p className=" text-2xl">Want to leave feedback?
                            Visit from desktop.</p>
                    </div>
                </div>
            ) : (
                <div className=" flex min-h-screen text-white bg-gradient-to-t from-[#7834bb] to-black items-center justify-center flex-col py-5 ">
                    <div>
                        <Link href={"/"}>
                            <img src="/freeflow.png" alt="" className=" w-40" />
                        </Link>
                    </div>
                    <div className=" px-10">
                        <h1 className=" font-sec text-center text-2xl mt-7">
                            Sucks that you can’t leave feedback from mobile yet.
                        </h1>
                        <p className=" mt-12 font-sec text-center">
                            I don’t care just show me the image
                        </p>
                        <button
                            onClick={() => setOnlyImage(true)}
                            className="font-sec text-xl btn-p flex items-center w-full justify-center mt-5"
                        >
                            Continue{" "}
                            <svg
                                fill="none"
                                className=" w-5 ml-2"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className=" absolute bottom-5">
                        <p className=" text-xs opacity-70">
                            {" "}
                            © 2023 Freeflow. All rights reserved.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewImageMobile;
