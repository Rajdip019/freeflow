import Navbar from "@/components/LandingPage/Navbar";
import Link from "next/link";
import React from "react";

const Error = () => {
  return (
    <div className="overflow-hidden bg-gray-900">
      <Navbar />
      <div className="relative flex h-[92.3vh] w-screen flex-col items-center justify-center bg-gray-900 md:h-[91.05vh]">
        <div className=" flex items-center justify-center">
          <img src="/404/404.png" alt="" />
        </div>
        <div className=" mx-center absolute bottom-48 flex justify-center">
          <Link href={"/"} className=" ">
            <button className=" btn-p">Take Me Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
