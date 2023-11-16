import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { Button, Input, Space, Typography, message, Image } from "antd";
import React, { useState } from "react";

type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const ForgotPasswordCard = ({ setCurrentTab }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async () => {
    setBtnLoading(true);
    const res: boolean = await forgotPassword(email);
    setEmailSuccess(res);
    if (res) {
      message.success("Email sent successfully");
    } else {
      message.error("Failed to send email, wrong email");
    }
    setBtnLoading(false);
  };

  return (
    <div className="w-[80%] rounded-2xl bg-[#141414] p-5 px-7 text-white md:w-[70%] xl:w-[47%]">
      <Image
        src={"/logo/freeflow.png"}
        alt={"Logo image"}
        preview={false}
        width={100}
      />
      <Typography.Title level={3} className="mt-3">
        Forgot Password
      </Typography.Title>
      {emailSuccess ? (
        <Space direction="vertical">
          <Space>
            <CheckCircleTwoTone twoToneColor={"#52c41a"} />
            <Typography.Text type="secondary">
              Email sent successfully
            </Typography.Text>
          </Space>
          <Space>
            <CheckCircleOutlined />
            <Typography.Text type="secondary">
              Check your email for further instructions
            </Typography.Text>
          </Space>
        </Space>
      ) : (
        <>
          <Typography.Text type="secondary">
            Enter your email address to reset your password
          </Typography.Text>
          <Typography.Title level={5}>
            Email Address<Typography.Text type="danger"> *</Typography.Text>
          </Typography.Title>
          <Input
            placeholder="example@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="primary"
            className="mr-4 mt-5"
            onClick={handleForgotPassword}
            loading={btnLoading}
            disabled={!email}
          >
            Confirm
          </Button>
        </>
      )}

      <Button
        icon={<ArrowLeftOutlined />}
        className="mt-5"
        onClick={() => setCurrentTab(0)}
      >
        Back to login
      </Button>
    </div>
  );
};

export default ForgotPasswordCard;
