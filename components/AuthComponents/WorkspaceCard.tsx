import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspaceInUser } from "@/interfaces/User";
import { IWorkspace } from "@/interfaces/Workspace";
import { FolderOpenOutlined, FolderViewOutlined } from "@ant-design/icons";
import { Form, Divider, Typography, Input, Button, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
const { Text, Title } = Typography;

type Props = {};

const WorkspaceCard = (props: Props) => {
  const { user, fetchWorkspaceInUser } = useUserContext();
  const { authUser } = useAuth();
  const { updateWorkspace, fetchWorkspace } = useWorkspaceContext();
  const [workspaceName, setWorkspaceName] = useState<string>(
    user?.name + "'s workspace" || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleContinue = async () => {
    setLoading(true);
    const WorkUser: IWorkspaceInUser[] =
      authUser && (await fetchWorkspaceInUser(authUser.uid));
    const _id = WorkUser.filter((w) => w.role === "owner")[0].id;
    const workspaceData = await fetchWorkspace(_id);
    const data: IWorkspace = {
      ...workspaceData,
      name: workspaceName,
      isCompleted: true,
    };

    await updateWorkspace(_id, data);
    message.success("Workspace created successfully");
    message.success(`Welcome ${user?.name} to Freeflow!`);
    setLoading(false);
    router.push("/");
  };
  return (
    <div className="w-[80%] rounded-2xl bg-[rgb(20,20,20)] p-5 px-7 text-white md:w-[70%] xl:w-[47%]">
      <Form
        layout="vertical"
        className="flex flex-col space-y-5"
        initialValues={{ remember: true }}
        onFinish={handleContinue}
      >
        <div>
          <div>
            <Text type="secondary" className="text-4xl">
              <FolderOpenOutlined />
            </Text>
          </div>
          <div className="mt-3">
            <Title level={3}>Let&apos;s set up your first workspace</Title>
          </div>
          <div>
            <Text type="secondary">
              This could be your agency/studio name or just a random name
            </Text>
          </div>
        </div>
        <Divider />
        {/* Name */}
        <Form.Item
          label="Workspace Name"
          name={"workspace name"}
          rules={[
            {
              required: !workspaceName,
              message: "Workspace Name required!!",
            },
          ]}
        >
          <Input
            placeholder={user?.name + "'s workspace"}
            defaultValue={user?.name + "'s workspace"}
            prefix={<FolderViewOutlined />}
            onChange={(e) => {
              setWorkspaceName(e.target.value);
            }}
          />
        </Form.Item>
        <Button
          type="primary"
          className="mt-3"
          htmlType="submit"
          block
          loading={loading}
        >
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default WorkspaceCard;
