import React from "react";

const Version = () => {
  return (
    <div className=" flex px-40 text-white gap-28 items-center py-20 pb-20">
      <div>
        <h2 className=" text-[50px] font-black leading-tight mb-5 text-gradient-s">Design, iterate, iterate, iterate, iterate, submit?</h2>
        <p className=" font-semibold text-xl">
          Version control allows you to keep track of all your revisions in one
          place. Keep iterating until you perfect your design. No more adding
          _final_final_final to your updates.
        </p>
      </div>
      <div>
        <img src="/version.png" alt="" className=" w-96" />
      </div>
    </div>
  );
};

export default Version;
