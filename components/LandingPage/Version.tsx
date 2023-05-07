import React from "react";

const Version = () => {
  return (
    <div className=" items-center gap-28 px-5 py-10 pb-10 text-center text-white md:flex md:px-40 md:py-20 md:pb-20 md:text-left ">
      <div>
        <h2 className="text-gradient-s mb-5 text-[40px] font-black leading-tight md:text-[50px]">
          Design, iterate, iterate, iterate, iterate, submit?
        </h2>
        <p className=" mb-10 text-lg font-semibold md:text-xl">
          Version control allows you to keep track of all your revisions in one
          place. Keep iterating until you perfect your design. No more adding
          _final_final_final to your updates.
        </p>
      </div>
      <div>
        <img
          src="/version.png"
          alt=""
          className=" mx-auto w-80 md:mx-0 md:w-96"
        />
      </div>
    </div>
  );
};

export default Version;
