import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IUser } from "@/interfaces/User";
import { IWorkspace } from "@/interfaces/Workspace";
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
  const { updateUser } = useUserContext();
  const { authUser } = useAuth();
  const { createWorkspace, workspaceId } = useWorkspaceContext();
  const router = useRouter();

  const handleContinue = async () => {
    if (authUser) {
      const workspaceData: IWorkspace = {
        name: name + "'s workspace",
        description: "",
        avatarUrl: "",
        collaborators: [
          {
            id: authUser?.uid,
            role: "owner",
          },
        ],
        subscription: "free",
        storageUsed: 0,
        createdAt: Date.now(),
        isCompleted: false,
      };
      const id = await createWorkspace(workspaceData);
      const data: Partial<IUser> = {
        name,
        linkedIn,
        twitter,
        workspaces: [
          {
            id: id,
            role: "owner",
          },
        ],
      };
      await updateUser(data);
      setCurrentTab(3);
    }
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
