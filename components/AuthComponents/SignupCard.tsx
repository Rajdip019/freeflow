import { useAuth } from "@/contexts/AuthContext";
import { AppleFilled, GoogleOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Image,
  Input,
  Skeleton,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";

type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const SignupCard = ({ setCurrentTab }: Props) => {
  const [authType, setAuthType] = useState<string>("Sign up");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signUpWithGoogle, signinWithEmail, signupWithEmail } = useAuth();
  const [animatedTab, setAnimatedTab] = useState<number>(1);
  const [loading, setLoading] = useState<{
    email: boolean;
    google: boolean;
    apple: boolean;
  }>({
    email: false,
    google: false,
    apple: false,
  });

  const handleContinue = async () => {
    setLoading({
      ...loading,
      email: true,
    });
    if (authType === "Sign up") {
      await signupWithEmail(email, password);
    } else {
      await signinWithEmail(email, password);
    }
    setLoading({
      ...loading,
      email: false,
    });
  };

  const handleGoogleAuth = async () => {
    setLoading({
      ...loading,
      google: true,
    });
    const result = await signUpWithGoogle();
    if (result) {
      message.success("Successfully signed with Google");
      setCurrentTab(1);
    } else {
      message.error("Failed to sign with Google");
    }
    setLoading({
      ...loading,
      google: false,
    });
  };

  useEffect(() => {
    setAnimatedTab(1);
    setTimeout(() => {
      setAnimatedTab(0);
    }, 1000);
  }, [authType]);

  return (
    <Skeleton loading={animatedTab === 1} active className="w-1/2">
      <div className="w-[80%] rounded-2xl bg-[#141414] p-5 px-7 text-white md:w-[70%] xl:w-[47%]">
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
              value={email}
              defaultValue={email}
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
            <Typography.Link onClick={() => setCurrentTab(2)}>
              Forgot password
            </Typography.Link>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading.email}
            >
              {authType}
            </Button>
          </Form.Item>
          <Divider>Or</Divider>
          <Form.Item>
            <Button
              icon={<GoogleOutlined />}
              block
              onClick={handleGoogleAuth}
              loading={loading.google}
            >
              Continue with Google
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              disabled
              icon={<AppleFilled />}
              block
              loading={loading.apple}
            >
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
    </Skeleton>
  );
};

export default SignupCard;
