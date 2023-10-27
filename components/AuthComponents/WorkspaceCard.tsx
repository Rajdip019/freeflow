import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspace } from "@/interfaces/Workspace";
import { FolderOpenOutlined, FolderViewOutlined } from "@ant-design/icons";
import { Form, Divider, Typography, Input, Button, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
const { Text, Title } = Typography;

type Props = {};

const WorkspaceCard = (props: Props) => {
  const { user } = useUserContext();
  const { updateWorkspace, workspaceData } = useWorkspaceContext();
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const router = useRouter();
  const handleContinue = async () => {
    const data: IWorkspace = {
      ...workspaceData,
      name: workspaceName,
      isCompleted: true,
    };
    user?.workspaces && (await updateWorkspace(user?.workspaces[0].id, data));
    message.success("Workspace created successfully");
    message.success(`Welcome ${user?.name} to Freeflow!`);
    router.push("/");
  };
  return (
    <div className="rounded-2xl bg-[rgb(20,20,20)] p-5 px-7 text-white md:w-[50%]">
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
          name="name"
          rules={[{ required: true, message: "Workspace Name required!!" }]}
        >
          <Input
            placeholder={user?.name + "'s workspace"}
            value={workspaceName}
            prefix={<FolderViewOutlined />}
            onChange={(e) => {
              setWorkspaceName(e.target.value);
            }}
          />
        </Form.Item>
        <Button type="primary" className="mt-3" htmlType="submit" block>
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default WorkspaceCard;
