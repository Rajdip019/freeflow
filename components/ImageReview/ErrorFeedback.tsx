import { useRouter } from "next/router";
import React from "react";
import { useUserContext } from "@/contexts/UserContext";
import { Image, Typography } from "antd";
import { FFButton } from "@/theme/themeConfig";

const ErrorFeedback = () => {
  const router = useRouter();
  const { user } = useUserContext();

  return (
    <>
      <div className="flex h-screen flex-col bg-black items-center justify-center ">
        <div className=" flex flex-col items-center">
          <Image src="/freeflow.png" width={150} preview={false} />
          <Typography.Title level={2} className="mt-5">The URL seems invalid 😢, Check the URL and try again</Typography.Title>
          <FFButton
            onClick={() => {
              if (user) {
                router.push("/dashboard");
              } else {
                router.push("/");
              }
            }}
            type="primary"
          >
            Go back
          </FFButton>
        </div>
      </div>
    </>
  );
};

export default ErrorFeedback;
