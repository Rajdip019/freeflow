import { useAuth } from "@/contexts/AuthContext";
import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { authUser } = useAuth();

  return (
    <div className=" flex items-center justify-between px-10 pt-5 md:px-40">
      <img src="/freeflow.png" alt="" className=" w-40" />
      <div className=" flex gap-5">
        {authUser ? (
          <>
            <Link href="/dashboard">
              <button className="font-sec btn-p hidden items-center md:flex">
                Dashboard{" "}
                <svg
                  fill="none"
                  className=" ml-2 w-5"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </button>
            </Link>
            <Tooltip label={authUser.email}>
              <img
                src={authUser.photoURL as string}
                alt=""
                className=" h-14 w-14 rounded-full"
              />
            </Tooltip>
          </>
        ) : (
          <>
            <Link href="/auth">
              <button className="font-sec btn-p hidden md:block">LogIn</button>
            </Link>
            <Link href="/auth">
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
