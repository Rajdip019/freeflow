import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { IUser } from "@/interfaces/User";
import {
  LinkedinFilled,
  RocketOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
const { Text, Title } = Typography;
type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const SocialCard = ({ setCurrentTab }: Props) => {
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { createUser } = useUserContext();
  const { authUser } = useAuth();
  const router = useRouter();

  const handleContinue = async () => {
    const data: Partial<IUser> = {
      name,
      linkedIn,
      twitter,
    };
    await createUser(authUser?.uid as string, data);
    message.success(`Welcome ${name} to Freeflow!`);
    router.push("/dashboard");
  };

  return (
    <div className="rounded-2xl bg-[#141414] p-5 px-7 text-white md:w-[50%]">
      <Form
        layout="vertical"
        className="flex flex-col space-y-5"
        initialValues={{ remember: true }}
        onFinish={handleContinue}
      >
        <div>
          <div>
            <Text type="secondary" className="text-4xl">
              <RocketOutlined />
            </Text>
          </div>
          <div className="mt-3">
            <Title level={3}>Add your socials</Title>
          </div>
          <div>
            <Text type="secondary">
              We&apos;ll share this only with your team so they can connect with
              you
            </Text>
          </div>
        </div>
        <Divider />
        {/* Name */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input
            placeholder="John Doe..."
            prefix={<UserOutlined />}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item label="Twitter" name="twitter">
          <Input
            prefix={<TwitterOutlined />}
            placeholder="twitter.com/..."
            onChange={(e) => {
              setTwitter(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item label="LinkedIn" name="linkedin">
          <Input
            prefix={<LinkedinFilled />}
            placeholder="linkedin.com/...."
            onChange={(e) => {
              setLinkedIn(e.target.value);
            }}
          />
        </Form.Item>

        <Button type="primary" className="w-full" htmlType="submit">
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default SocialCard;
