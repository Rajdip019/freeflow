import { useAuth } from "@/contexts/AuthContext";
import { Tooltip } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SignUp = () => {
  const { signUpWithGoogle } = useAuth();

  const router = useRouter();

  const handleSignupWithGoogle = async () => {
    try {
      await signUpWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>FreeFlow | Signup</title>
      </Head>
      <div className=" flex h-screen items-center bg-gradient-to-t from-[#7834bb] to-black text-white ">
        <div className=" absolute left-5 top-5">
          <Link href={"/"}>
            <img src="/freeflow.png" alt="" className=" w-32" />
          </Link>
        </div>
        <div className=" flex w-full flex-col items-center justify-center gap-5 md:w-6/12">
          <h2 className=" font-sec mb-5 text-4xl font-bold">Login /Sign Up</h2>
          <div className=" flex flex-col gap-4 md:w-6/12">
            <button
              onClick={handleSignupWithGoogle}
              className=" btn-sec flex items-center justify-center gap-3"
            >
              <img src="/icons/Google.png" alt="" className=" w-5" /> Login with
              Google
            </button>
            <Tooltip label="Coming soon...">
              <button className=" btn-sec flex cursor-not-allowed items-center  justify-center gap-3">
                <img src="/icons/FaceBook.png" alt="" className=" w-6" />
                Login with Facebook
              </button>
            </Tooltip>
            <Tooltip label="Coming soon...">
              <button className=" btn-sec flex cursor-not-allowed items-center justify-center gap-3">
                <img src="/icons/Apple.png" alt="" className=" w-6" />
                Login with Apple
              </button>
            </Tooltip>
          </div>
        </div>
        <div className=" hidden h-screen w-6/12 items-center bg-black md:flex">
          <img src="/login.png" alt="" />
        </div>
        <div className=" absolute bottom-5 left-10">
          <p className=" text-xs opacity-70">
            {" "}
            © 2023 Freeflow. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
