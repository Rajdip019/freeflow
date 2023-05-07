import React from "react";
import ImageUploader from "../ImageUploader";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { authUser } = useAuth();
  return (
    <div className=" my-10 flex flex-col px-5 text-center md:flex-row md:px-40 md:py-20 md:text-left">
      <div className={`mt-5`}>
        <h1 className=" font-sec mb-5 text-[50px] font-bold leading-[75px] text-white md:text-[65px]">
          The Fastest Way For{" "}
          <span className=" text-gradient-p">designers</span> To{" "}
          <span className=" text-gradient-p">Get Feedback</span>
        </h1>
        <p className=" mb-5 text-lg font-semibold text-white">
          Upload an image and share the link to get visual feedback
        </p>
        <img
          src="/string.png"
          alt=""
          className=" mx-auto mb-10 mt-10 hidden w-10/12 md:mx-0 md:mb-0 md:block"
        />
        <div className=" flex flex-col items-center">
          {authUser ? (
            <>
              <Link href="/dashboard">
                <button className="font-sec btn-p mb-10 flex items-center md:hidden">
                  Dashboard{" "}
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
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signup">
                <button className="font-sec btn-p mb-5 w-fit cursor-not-allowed text-lg md:hidden">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="font-sec btn-p mb-10 w-fit cursor-not-allowed text-lg md:hidden">
                  Join for Free
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div>
        <ImageUploader />
      </div>
    </div>
  );
};

export default Hero;
