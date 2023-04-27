import React from "react";
import ImageUploader from "../ImageUploader";
import { Tooltip } from "@chakra-ui/react";

const Hero = () => {
  return (
    <div className=" px-5 md:px-40 md:py-20 my-10 flex flex-col md:flex-row text-center md:text-left">
      <div className=" mt-5 md:mt-14">
        <h1 className=" text-white text-[50px] md:text-[65px] font-bold leading-[75px] mb-5 font-sec">
          The Fastest Way For{" "}
          <span className=" text-gradient-p">designers</span> To{" "}
          <span className=" text-gradient-p">Get Feedback</span>
        </h1>
        <p className=" text-white font-semibold text-lg mb-5">
          Upload an image and share the link to get visual feedback
        </p>
        <img
          src="string.png"
          alt=""
          className=" w-10/12 mt-10 mb-10 md:mb-0 mx-auto md:mx-0 hidden md:block"
        />
        <div className=" flex flex-col items-center">
          <Tooltip label="Coming Soon...">
            <button className="font-sec btn-p md:hidden mb-5 text-lg cursor-not-allowed w-fit">
              Login
            </button>
          </Tooltip>
          <Tooltip label="Coming Soon...">
            <button className="font-sec btn-p md:hidden mb-10 text-lg cursor-not-allowed w-fit">
              Join for Free
            </button>
          </Tooltip>
        </div>
      </div>
      <div>
        <ImageUploader />
      </div>
    </div>
  );
};

export default Hero;
