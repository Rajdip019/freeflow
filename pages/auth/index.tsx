import SignupCard from "@/components/AuthComponents/SignupCard";
import SocialCard from "@/components/AuthComponents/SocialCard";
import Head from "next/head";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useUserContext } from "@/contexts/UserContext";
import { Button, Result } from "antd";

const Signup = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isVerificationWindow, setIsVerificationWindow] =
    useState<boolean>(false);
  const router = useRouter();
  const { authUser, sendEmailVerificationToUser, logout } = useAuth();
  const { user } = useUserContext();
  console.log("AuthUser", authUser);
  useEffect(() => {
    if (authUser && user && user.name) {
      router.push("/");
    }
    if (authUser) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [authUser, user]);

  useEffect(() => {
    if (authUser && !authUser.emailVerified) {
      setIsVerificationWindow(true);
    } else {
      setIsVerificationWindow(false);
    }
  }, [authUser]);

  const TabList = [SignupCard, SocialCard];

  return (
    <>
      <Head>
        <title>Freeflow | Sign Up</title>
      </Head>
      {isVerificationWindow ? (
        <div className="flex h-screen w-screen items-center justify-center bg-black">
          <Result
            status="403"
            title="Email not verified"
            subTitle="We have sent you an email for verification. Please verify your email to continue"
            extra={
              <>
                <Button type="primary" onClick={logout}>
                  Continue with different account
                </Button>
                <Button
                  type="primary"
                  onClick={async () => {
                    await sendEmailVerificationToUser();
                  }}
                >
                  Resend verification email
                </Button>
              </>
            }
          />
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="flex w-full items-center justify-center">
            {React.createElement(TabList[currentTab], {
              setCurrentTab,
            })}
          </div>
          <div className="hidden w-full items-end justify-end lg:flex">
            <Image
              src={`/login/Frame${currentTab + 1}.png`}
              alt={"Login image"}
              width={1000}
              height={1000}
              className="h-screen w-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};
export default Signup;
