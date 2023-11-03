import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspaceInUser } from "@/interfaces/User";
import { db } from "@/lib/firebaseConfig";
import { BellIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Dropdown,
  MenuProps,
  Space,
  Spin,
  Tooltip,
  Typography,
  message,
} from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {}

const Inbox = (props: Props) => {
  const { fetchWorkspaceInUser } = useUserContext();
  const { authUser } = useAuth();
  const { fetchFullWorkspace } = useWorkspaceContext();
  const [workspaceInUser, setWorkspaceInUser] = useState<IWorkspaceInUser[]>(
    []
  );
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(
    router.query.invite === "workspace"
  );

  const fetchData = async () => {
    if (authUser) {
      setLoading(true);
      const data = await fetchWorkspaceInUser(authUser.uid);
      setWorkspaceInUser(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchData();
    }
  }, [authUser]);

  const acceptInvite = async (workspaceId: string) => {
    try {
      if (authUser) {
        setConfirmLoading(true);
        const userRef = doc(
          db,
          "users",
          authUser.uid,
          "workspaces",
          workspaceId
        );
        const workRef = doc(
          db,
          "workspaces",
          workspaceId,
          "collaborators",
          authUser.uid
        );
        await updateDoc(userRef, { status: "Accepted" });
        await updateDoc(workRef, { status: "Accepted" });
        await fetchFullWorkspace(workspaceId);
        localStorage.setItem("currentWorkspaceId", workspaceId);
        message.success("Invite accepted successfully");
        fetchData();
        setConfirmLoading(false);
        setOpen(false);
      }
    } catch (err) {
      message.error("Failed to accept invite");
    }
  };

  const items: MenuProps["items"] = workspaceInUser
    .filter((w) => w.status === "Pending")
    ?.map((w) => {
      return {
        key: w.id,
        label: (
          <Space className="my-1 w-[360px] rounded bg-[#141414] p-3">
            <Typography.Text type="secondary">
              You have been invited to join{" "}
              <b className="text-[#ffffff95]">{w.name}</b> 1 days ago
            </Typography.Text>
            <Button
              type="primary"
              loading={confirmLoading}
              onClick={() => acceptInvite(w.id)}
            >
              Accept
            </Button>
          </Space>
        ),
      };
    });

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      open={open}
      onOpenChange={(open) => setOpen(open)}
      placement="bottomRight"
    >
      {loading ? (
        <Spin />
      ) : (
        <Tooltip
          title={
            workspaceInUser?.filter((w) => w.status === "Pending").length ===
              0 && "No new notification"
          }
        >
          <Badge
            dot={
              workspaceInUser?.filter((w) => w.status === "Pending").length > 0
            }
            className="mr-4"
          >
            <BellIcon className="cursor-pointer" w={6} h={6} />
          </Badge>
        </Tooltip>
      )}
    </Dropdown>
  );
};

export default Inbox;
