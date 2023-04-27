import { Tooltip } from "@chakra-ui/react";
import React from "react";

const Navbar = () => {
  return (
    <div className=" flex justify-center pt-5 md:justify-between md:px-40 items-center">
      <img src="/freeflow.png" alt="" className=" w-32" />
      <div className=" flex gap-5">
        <Tooltip label="Coming Soon...">
          <button className="font-sec btn-p hidden md:block cursor-not-allowed">
            LogIn
          </button>
        </Tooltip>
        <Tooltip label="Coming Soon...">
          <button className="font-sec btn-p hidden md:block cursor-not-allowed">
            Join for Free
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;
