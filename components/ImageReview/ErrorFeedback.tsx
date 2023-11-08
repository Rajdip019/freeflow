import { useRouter } from "next/router";
import React from "react";
import { useUserContext } from "@/contexts/UserContext";
import { Image, Typography } from "antd";
import { FFButton } from "@/theme/themeConfig";

const ErrorFeedback = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-black ">
        <div className=" flex flex-col items-center">
          <Image src="/logo/freeflow.png" width={150} preview={false} />
          <Typography.Title level={2} className="mt-5">
            The URL seems invalid 😢, Check the URL and try again
          </Typography.Title>
          <FFButton
            onClick={() => {
              router.push("/");
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
