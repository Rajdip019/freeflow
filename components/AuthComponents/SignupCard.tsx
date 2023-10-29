import { useAuth } from "@/contexts/AuthContext";
import { AppleFilled, GoogleOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Image, Input, Typography, message } from "antd";
import React, { useState } from "react";

type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const SignupCard = ({ setCurrentTab }: Props) => {
  const [authType, setAuthType] = useState<string>("Sign up");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signUpWithGoogle, signinWithEmail, signupWithEmail } = useAuth();

  const handleContinue = async () => {
    if (authType === "Sign up") {
      const result = await signupWithEmail(email, password);
    } else {
      await signinWithEmail(email, password);
    }
  };

  const handleGoogleAuth = async () => {
    const result = await signUpWithGoogle();
    if (result) {
      message.success("Successfully signed with Google");
      setCurrentTab(1);
    } else {
      message.error("Failed to sign with Google");
    }
  };

  return (
    <div className="rounded-2xl bg-[#141414] p-5 px-7 text-white md:w-[47%]">
      <Form layout="vertical" className="space-y-4" onFinish={handleContinue}>
        <Image
          src={"/logo/freeflow.png"}
          alt={"Logo image"}
          preview={false}
          width={100}
        />

        <Typography.Title level={3}>{authType} to Freeflow</Typography.Title>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
          tooltip="Email is required"
        >
          <Input
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
          tooltip="Password is required"
        >
          <Input.Password
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <div className="flex items-center justify-between">
          {/* <Checkbox>Remember me</Checkbox> */}
          {/* <Typography.Link
          >
            Forgot password
          </Typography.Link> */}
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {authType}
          </Button>
        </Form.Item>
        <Divider>Or</Divider>
        <Form.Item>
          <Button icon={<GoogleOutlined />} block onClick={handleGoogleAuth}>
            Continue with Google
          </Button>
        </Form.Item>
        <Form.Item>
          <Button disabled icon={<AppleFilled />} block>
            Continue with Apple
          </Button>
        </Form.Item>
        <Form.Item className="flex items-center justify-center">
          <Typography.Text>
            {authType === "Sign up"
              ? "Already have an account?"
              : "Don't have an account?"}
          </Typography.Text>
          <Typography.Link
            onClick={() => {
              authType === "Sign up"
                ? setAuthType("Log in")
                : setAuthType("Sign up");
            }}
          >
            {authType === "Sign up" ? " Log in" : " Sign up"}
          </Typography.Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignupCard;
