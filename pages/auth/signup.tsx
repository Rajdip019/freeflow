import { useAuth } from "@/contexts/AuthContext";
import { AppleFilled, AppleOutlined, GoogleOutlined } from "@ant-design/icons";
import {
  Image,
  Input,
  Space,
  Typography,
  Tooltip,
  Checkbox,
  Button,
  Divider,
} from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const SignUp = () => {
  const { signUpWithGoogle } = useAuth();

  const router = useRouter();

  const handleSignupWithGoogle = async () => {
    try {
      await signUpWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>FreeFlow | Signup</title>
      </Head>
      <div className="flex h-screen max-h-screen w-screen bg-[#141414]">
        <div className="flex w-1/2 flex-col items-center justify-center">
          <Space direction="vertical" className="w-1/2">
            <Image src="/freeflow.png" width={130} />
            <Typography.Title level={4} className="text-white">
              Sign up to FreeFlow
            </Typography.Title>
            {/* first name, last name, email, password, remember me with defualt size */}
            <Space direction="vertical" size="middle" className="w-full">
              <Tooltip
                title="First Name"
                trigger={["focus"]}
                placement="topLeft"
              >
                <Input
                  size="middle"
                  placeholder="First Name"
                  className="rounded-lg"
                />
              </Tooltip>
              <Tooltip
                title="Last Name"
                trigger={["focus"]}
                placement="topLeft"
              >
                <Input
                  size="middle"
                  placeholder="Last Name"
                  className="rounded-lg"
                />
              </Tooltip>
              <Tooltip title="Email" trigger={["focus"]} placement="topLeft">
                <Input
                  size="middle"
                  placeholder="Email"
                  className="rounded-lg"
                />
              </Tooltip>
              <Tooltip title="Password" trigger={["focus"]} placement="topLeft">
                <Input.Password
                  size="middle"
                  placeholder="Password"
                  className="rounded-lg"
                />
              </Tooltip>
              {/* remember me and forgot password  */}
              <Space
                direction="horizontal"
                size="large"
                className="flex w-full items-center justify-between"
              >
                <Checkbox>Remember me</Checkbox>
                <Typography.Text className="cursor-pointer text-purple-500 hover:underline hover:underline-offset-2">
                  Forgot Password?
                </Typography.Text>
              </Space>
              <Button
                type="primary"
                size="middle"
                className="rounded-lg"
                block
                onClick={handleSignupWithGoogle}
              >
                Sign up
              </Button>
              <Divider className="text-white">Or</Divider>
              <Button
                size="middle"
                className="rounded-lg"
                block
                icon={<GoogleOutlined />}
                onClick={handleSignupWithGoogle}
              >
                Sign up with Google
              </Button>

              {/* Apple */}

              <Button
                size="middle"
                className="rounded-lg"
                block
                icon={<AppleFilled />}
                onClick={handleSignupWithGoogle}
              >
                Sign up with Apple
              </Button>

              <Typography.Text className="text-white">
                Already have an account?{" "}
                <Typography.Text
                  className="cursor-pointer text-purple-500 hover:underline hover:underline-offset-2"
                  onClick={() => router.push("/auth/login")}
                >
                  Log in
                </Typography.Text>
              </Typography.Text>
            </Space>
          </Space>
        </div>
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/login.png')",
          }}
        ></div>
      </div>
    </>
  );
};

export default SignUp;
