import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IUser, IWorkspaceInUser } from "@/interfaces/User";
import { IWorkspace, IUserInWorkspace } from "@/interfaces/Workspace";
import {
  LinkedinFilled,
  RocketOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
const { Text, Title } = Typography;
type Props = {
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
};

const SocialCard = ({ setCurrentTab }: Props) => {
  const { authUser } = useAuth();
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [name, setName] = useState<{ firstName: string; lastName: string }>({
    firstName: authUser?.displayName?.split(" ")[0] || "",
    lastName: authUser?.displayName?.split(" ")[1] || "",
  });
  const { createUser, addWorkspaceInUser } = useUserContext();
  const { createWorkspace, addUserInWorkspace } = useWorkspaceContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleContinue = async () => {
    if (authUser) {
      setLoading(true);
      const workspaceData: IWorkspace = {
        name: name.firstName + " " + name.lastName + "'s workspace",
        description: "",
        avatarUrl: "",
        subscription: "free",
        storageUsed: 0,
        createdAt: Date.now(),
        isCompleted: false,
      };
      const data: IUser = {
        name: name.firstName + " " + name.lastName,
        linkedIn,
        twitter,
        email: authUser.email as string,
        createTime: Date.now(),
      };
      const id = await createWorkspace(workspaceData);
      await createUser(authUser.uid, data);
      const collaboratorsData: IUserInWorkspace = {
        id: authUser?.uid,
        role: "owner",
        name: name.firstName + " " + name.lastName,
        email: authUser.email as string,
        inviteTime: Date.now(),
        imageURL: authUser.photoURL as string,
        status: "Accepted",
      };
      const workspaceDataUser: IWorkspaceInUser = {
        id: id,
        role: "owner",
        name: name.firstName + " " + name.lastName + "'s workspace",
        avatarUrl: "",
        status: "Accepted",
      };

      await addUserInWorkspace(id, collaboratorsData);
      await addWorkspaceInUser(authUser.uid, workspaceDataUser);

      setCurrentTab(3);
      setLoading(false);
    }
  };

  return (
    <div className="w-[80%] rounded-2xl bg-[#141414] p-5 px-7 text-white md:w-[70%] xl:w-[47%]">
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
          label="First Name"
          name="firstName"
          rules={[
            {
              required: name.firstName === "",
              message: "Please input your first name!",
            },
          ]}
        >
          <Input
            placeholder="John"
            prefix={<UserOutlined />}
            value={name.firstName}
            defaultValue={name.firstName}
            onChange={(e) => {
              setName({
                ...name,
                firstName: e.target.value,
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label={"Last Name"}
          name={"Last Name"}
          rules={[
            {
              required: name.lastName === "",
              message: "Last Name is required!",
            },
          ]}
        >
          <Input
            placeholder="Deo"
            prefix={<UserOutlined />}
            value={name.lastName}
            defaultValue={name.lastName}
            onChange={(e) => {
              setName({
                ...name,
                lastName: e.target.value,
              });
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

        <Button
          type="primary"
          className="w-full"
          htmlType="submit"
          loading={loading}
        >
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default SocialCard;
