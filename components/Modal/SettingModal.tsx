import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getPlan } from "@/utils/plans";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Input,
  Modal,
  Progress,
  Space,
  Typography,
  message,
} from "antd";
import Link from "next/link";
import React, { useEffect } from "react";
import Avatar from "react-avatar";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SettingModal = ({ open, setOpen }: Props) => {
  const { renderWorkspace, updateWorkspace } = useWorkspaceContext();
  const [name, setName] = React.useState<string>(renderWorkspace?.name || "");
  const [avatar, setAvatar] = React.useState<string>(
    renderWorkspace?.avatarUrl || ""
  );
  const [Loading, setLoading] = React.useState<boolean>(false);
  const [asyncLoading, setAsyncLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setName(renderWorkspace?.name || "");
    setAvatar(renderWorkspace?.avatarUrl || "");
  }, [renderWorkspace]);

  const generateRandom = () => {
    setLoading(true);
    const randomAvatarName = Math.random().toString(36).slice(2, 12);
    setAvatar(`https://api.multiavatar.com/${randomAvatarName}.png`);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const updateSettings = async () => {
    setAsyncLoading(true);
    renderWorkspace?.id &&
      (await updateWorkspace(renderWorkspace?.id, {
        name,
        avatarUrl: avatar,
      }));
    setAsyncLoading(false);
    message.success("Workspace settings updated successfully");
  };
  return (
    <Modal
      title="Workspace Settings"
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <Space className="w-full items-center justify-between">
          <Link
            href={"https://freeflow.to/#pricing"}
            passHref
            target="_blank"
            rel="noreferrer"
          >
            <Button className="rounded-full">Get more storage</Button>
          </Link>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            className="rounded-full"
            onClick={updateSettings}
            loading={asyncLoading}
            disabled={
              (name === renderWorkspace?.name || name === "") &&
              avatar === renderWorkspace?.avatarUrl
            }
          >
            Save
          </Button>
        </Space>
      }
    >
      <Divider />
      <Space direction="vertical" className="w-full space-y-3">
        <Space direction="vertical" className="w-full">
          <Typography.Text>Workspace Name</Typography.Text>
          <Input
            placeholder={"workspace name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Space>
        <Space direction="vertical" className="w-full rounded-lg bg-black p-4">
          <Space className="w-full justify-between">
            <Space direction="vertical">
              <Typography.Text>Workspace Cover</Typography.Text>
              <Typography.Text type="secondary">
                Set a cover image for your workspace.
              </Typography.Text>
            </Space>
            <Avatar
              name={avatar === "" ? renderWorkspace?.name : avatar}
              src={avatar}
              size="70"
              round={true}
            />
          </Space>
          <Space className="">
            <Button
              type="primary"
              className="rounded-full"
              icon={<SyncOutlined />}
              onClick={generateRandom}
              loading={Loading}
              disabled={Loading}
            >
              Generate Random
            </Button>
            <Button
              type="default"
              className="rounded-full"
              icon={<DeleteOutlined />}
              onClick={() => setAvatar("")}
            >
              Remove
            </Button>
          </Space>
        </Space>
        <Space direction="vertical" className="w-full -space-y-3">
          <Typography.Text>Storage</Typography.Text>
          <Progress
            percent={
              (renderWorkspace?.storageUsed &&
                Math.round(
                  (renderWorkspace?.storageUsed /
                    getPlan(renderWorkspace?.subscription).storage) *
                    100
                )) ||
              0
            }
          />
          <Typography.Text type="secondary">
            {(renderWorkspace?.storageUsed &&
              Math.round(renderWorkspace?.storageUsed / 1024)) ||
              0}{" "}
            MB used of{" "}
            {renderWorkspace?.subscription &&
              getPlan(renderWorkspace?.subscription).storage /
                (1024 * 1024)}{" "}
            GB
          </Typography.Text>
        </Space>
      </Space>
    </Modal>
  );
};

export default SettingModal;
