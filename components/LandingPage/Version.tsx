import React from "react";

const Version = () => {
  return (
    <div className=" md:flex px-5 md:px-40 text-white gap-28 items-center py-10 md:py-20 md:pb-20 pb-10 text-center md:text-left ">
      <div>
        <h2 className="text-[40px] md:text-[50px] font-black leading-tight mb-5 text-gradient-s">Design, iterate, iterate, iterate, iterate, submit?</h2>
        <p className=" font-semibold md:text-xl text-lg mb-10">
          Version control allows you to keep track of all your revisions in one
          place. Keep iterating until you perfect your design. No more adding
          _final_final_final to your updates.
        </p>
      </div>
      <div>
        <img src="/version.png" alt="" className=" md:w-96 w-80 mx-auto md:mx-0" />
      </div>
    </div>
  );
};

export default Version;
