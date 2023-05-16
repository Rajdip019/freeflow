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
        <div className=" relative flex min-h-screen justify-center bg-gray-900">
          <div className=" absolute top-5 flex w-full flex-col items-center justify-center">
            {" "}
            <Link href={"/"}>
              <img src="/freeflow.png" alt="" className=" mb-4 w-24" />
            </Link>
            <div className="flex h-[10vh] w-full flex-col items-center justify-center bg-purple-500 text-white">
              <h2 className=" text-lg font-semibold">{imageData?.imageName}</h2>
              <div className=" flex flex-col flex-wrap items-center justify-center">
                <p className=" text-sm">Uploaded by {imageData?.uploadedBy}</p>
                <Moment fromNow className="text-xs">
                  {imageData?.timeStamp}
                </Moment>
              </div>
            </div>
          </div>
          <div className=" mt-40 px-5">
            <img
              src={
                imageData.currentVersion
                  ? imageData.imageURL[imageData.currentVersion]
                  : (imageData.imageURL as any)
              }
              alt=""
            />
          </div>
          <div className=" absolute bottom-10 px-10 text-center text-gray-300">
            <p className=" text-2xl">
              Want to leave feedback? Visit from desktop.
            </p>
          </div>
        </div>
      ) : (
        <div className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-t from-[#7834bb] to-black py-5 text-white ">
          <div>
            <Link href={"/"}>
              <img src="/freeflow.png" alt="" className=" w-40" />
            </Link>
          </div>
          <div className=" px-10">
            <h1 className=" font-sec mt-7 text-center text-2xl">
              Sucks that you can’t leave feedback from mobile yet.
            </h1>
            <p className=" font-sec mt-12 text-center">
              I don’t care just show me the image
            </p>
            <button
              onClick={() => setOnlyImage(true)}
              className="font-sec btn-p mt-5 flex w-full items-center justify-center text-xl"
            >
              Continue{" "}
              <svg
                fill="none"
                className=" ml-2 w-5"
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
