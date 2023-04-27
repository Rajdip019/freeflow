import React from "react";

const Footer = () => {
  return (
    <div className="self-stretch bg-[#1E293B] ">
      <div className="max-w-[1440px] mx-auto md:px-28 flex flex-col py-16 px-0 items-center justify-center text-md text-gray-300 md:mt-10">
        <div className="self-stretch text-center md:text-left md:flex md:flex-row py-2.5 px-10 items-center justify-between">
          <div className="relative leading-[21.6px] mb-10 md:mb-0">
            © 2023 Freeflow. All rights reserved.
          </div>
          <div className="relative text-base leading-[19px] flex flex-col items-center">
            <p className="mb-2 font-bold">Contact</p>
            <a className="m-0 mb-1 flex gap-2" href="https://twitter.com/RajdeepS019" target="_blank" rel="noreferrer">
              <img src="/twitter.png" className=" w-5" alt="" />
              Ahmed Geaissa
            </a>
            <a className="m-0 flex gap-2" href="https://twitter.com/ReallyMad0" target="_blank" rel="noreferrer">
              <img src="/twitter.png" className=" w-5" alt=""  />
              Rajdeep Sengupta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
