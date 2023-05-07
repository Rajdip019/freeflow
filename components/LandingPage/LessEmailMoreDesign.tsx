import React from "react";

const LessEmailMoreDesign = () => {
  return (
    <div>
      <div className=" mt-10 text-white md:px-40">
        <p className="font-sec text-center text-4xl font-bold text-white">
          Less Emails. More Design
        </p>
        <div className=" mb-10 flex justify-center">
          <div className=" mr-5 mt-10 w-1 bg-gradient-to-b from-[#E5405E] via-[#FFE600] to-[#9333EA] md:hidden"></div>
          <div className=" mt-10 flex flex-col gap-5 md:w-full md:flex-row md:justify-between md:gap-0">
            <div className=" flex items-center gap-2">
              <img src="/icons/Icon.png" alt="" className="w-6" />
              <p>Upload</p>
            </div>
            <div className=" flex items-center gap-2">
              <img src="/icons/Icon-1.png" alt="" className=" w-6" />
              <p>Share</p>
            </div>
            <div className=" flex items-center gap-2">
              <img src="/icons/Icon-2.png" alt="" className=" w-6" />
              <p>Get Feedback</p>
            </div>
            <div className=" flex items-center gap-2">
              <img src="/icons/Icon-3.png" alt="" className=" w-6" />
              <p>Iterate</p>
            </div>
            <div className=" flex items-center gap-2">
              <img src="/icons/Icon-4.png" alt="" className=" w-6" />
              <p>Deliver</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" absolute left-0 mt-10 hidden h-1 w-screen bg-gradient-to-r from-[#E5405E] via-[#FFE600] to-[#9333EA] md:block"></div>
    </div>
  );
};

export default LessEmailMoreDesign;
