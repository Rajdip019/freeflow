import React from "react";

const EverythingYouNeedToFocusOn = () => {
  return (
    <div className=" mt-10 px-5 text-white md:px-40">
      <h2 className="font-sec mb-10 text-center text-4xl font-bold text-white">
        Everything You Need To Focus On Design
      </h2>
      <div className=" mb-20 flex flex-col justify-between gap-5 md:flex-row md:gap-0">
        <div className="flex items-center justify-center gap-2 rounded-full border border-purple-500 px-4 py-2">
          <img src="/icons/Icon 2.png" alt="" className=" w-5" />
          <p className=" font-semibold">Version Control</p>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-purple-500 px-4 py-2">
          <img src="/icons/Icon-1 2.png" alt="" className=" w-5" />
          <p className=" font-semibold">Private Links</p>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-purple-500 px-4 py-2">
          <img src="/icons/Icon-2 2.png" alt="" className=" w-5" />
          <p className=" font-semibold">Project Dashboard</p>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-full border border-purple-500 px-4 py-2">
          <img src="/icons/Icon-3 2.png" alt="" className=" w-5" />
          <p className=" font-semibold">Approval System</p>
        </div>
      </div>
    </div>
  );
};

export default EverythingYouNeedToFocusOn;
