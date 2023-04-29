import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className=" flex justify-center pt-5 md:justify-between md:px-40 items-center">
      <img src="/freeflow.png" alt="" className=" w-32" />
      <div className=" flex gap-5">
        <Link href="/auth/signup">
          <button className="font-sec btn-p hidden md:block">
            LogIn
          </button>
          </Link>  
          <Link href="/auth/signup">
          <button className="font-sec btn-p hidden md:block">
            Join for Free
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
