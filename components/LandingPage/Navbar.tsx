import { useAuth } from "@/contexts/AuthContext";
import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Navbar = () => {

  const { authUser } = useAuth();

  return (
    <div className=" flex justify-center pt-5 md:justify-between md:px-40 items-center">
      <img src="/freeflow.png" alt="" className=" w-32" />
      <div className=" flex gap-5">
        {authUser ? (
          <>
            <Link href="/dashboard">
              <button className="font-sec btn-p hidden md:flex items-center">
                Dashboard <svg fill="none" className=" w-5 ml-2" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </button>
            </Link>
            <Tooltip label={authUser.email}>
                <img src={authUser.photoURL as string} alt="" className=" rounded-full w-14 h-14" />
            </Tooltip>
          </>) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
