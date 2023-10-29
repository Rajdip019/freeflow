import SignupCard from "@/components/AuthComponents/SignupCard";
import SocialCard from "@/components/AuthComponents/SocialCard";
import Head from "next/head";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { Button, Result, Skeleton } from "antd";
import ForgotPasswordCard from "@/components/AuthComponents/ForgotPasswordCard";
import WorkspaceCard from "@/components/AuthComponents/WorkspaceCard";
import FFPage from "@/components/FFComponents/FFPage";

import Frame1 from "../../public/Login/Frame1.png";
import Frame2 from "../../public/Login/Frame2.png";
import Frame3 from "../../public/Login/Frame3.png";
import Frame4 from "../../public/Login/Frame4.png";

const Signup = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [animatedTab, setAnimatedTab] = useState<number>(1);
  const [isVerificationWindow, setIsVerificationWindow] =
    useState<boolean>(false);

  const { authUser, sendEmailVerificationToUser, logout } = useAuth();
  const { user } = useUserContext();

  useEffect(() => {
    if (authUser) {
      if (user)
        if (!user.name) setCurrentTab(1);
        else setCurrentTab(3);
      else setCurrentTab(1);
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

  useEffect(() => {
    setAnimatedTab(1);
    setTimeout(() => {
      setAnimatedTab(0);
    }, 1000);
  }, [currentTab]);

  const TabList = [SignupCard, SocialCard, ForgotPasswordCard, WorkspaceCard];

  return (
    <FFPage isAuthRequired={true}>
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
            <div className={`flex w-full items-center justify-center`}>
              <Skeleton
                loading={animatedTab === 1}
                className="h-full w-1/2"
                active
              >
                {React.createElement(TabList[currentTab], {
                  setCurrentTab,
                })}
              </Skeleton>
            </div>
            <div className="hidden w-full items-end justify-end lg:flex">
              <Image
                src={
                  currentTab === 0
                    ? Frame1
                    : currentTab === 1
                    ? Frame2
                    : currentTab === 2
                    ? Frame3
                    : Frame4
                }
                alt={"Login image"}
                width={1000}
                height={1000}
                className={`h-screen w-auto`}
                priority
              />
            </div>
          </div>
        )}
      </>
    </FFPage>
  );
};
export default Signup;
