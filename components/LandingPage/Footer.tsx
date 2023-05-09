import React from "react";

const Footer = () => {
  return (
    <div className="self-stretch bg-[#1E293B] ">
      <div className="text-md mx-auto flex max-w-[1440px] flex-col items-center justify-center px-0 py-16 text-gray-300 md:mt-10 md:px-28">
        <div className="items-center justify-between self-stretch px-10 py-2.5 text-center md:flex md:flex-row md:text-left">
          <div className="relative mb-10 leading-[21.6px] md:mb-0">
            © 2023 Freeflow. All rights reserved.
          </div>
          <div className="relative flex flex-col items-center text-base leading-[19px] md:items-start">
            <p className="mb-2 font-bold">Contact</p>
            <a
              className="m-0 mb-1 flex gap-2"
              href="https://twitter.com/ReallyMad0"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/twitter.png" className=" w-5" alt="" />
              Ahmed Geaissa
            </a>
            <a
              className="m-0 flex gap-2"
              href="https://twitter.com/RajdeepS019"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/twitter.png" className=" w-5" alt="" />
              Rajdeep Sengupta
            </a>
            <a
              className="m-0 flex gap-2"
              href="https://twitter.com/imMichaelYoung"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/twitter.png" className=" w-5" alt="" />
              Michael Young
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
