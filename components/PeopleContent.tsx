import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import InviteUserInWorkspaceModel from "@/components/Modal/InviteUserInWorkspaceModel";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IUserInWorkspace } from "@/interfaces/Workspace";
import { FFButton } from "@/theme/themeConfig";
import {
  DeleteOutlined,
  LogoutOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuProps,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import Head from "next/head";
import React, { useState } from "react";
import Avatar from "react-avatar";

type Props = {};

const PeopleContent = (props: Props) => {
  const {
    renderWorkspace,
    currentUserInWorkspace,
    removeUserFromWorkspace,
    fetchFullWorkspace,
    updateUserInWorkspace,
  } = useWorkspaceContext();

  const { removeWorkspaceInUser, updateWorkspaceInUser } = useUserContext();
  const [visibleInviteModel, setVisibleInviteModel] = useState<boolean>(false);
  const { authUser } = useAuth();

  const handleRemoveUser = async (userId: string) => {
    try {
      const workspaceId = renderWorkspace?.id;
      if (workspaceId) {
        await removeUserFromWorkspace(workspaceId, userId);
        await removeWorkspaceInUser(userId, workspaceId);
        await fetchFullWorkspace(workspaceId);
      }
      message.success("User removed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRole = async (role: string, userId: string) => {
    try {
      message.loading("Changing user role...");
      const workspaceId = renderWorkspace?.id;
      if (workspaceId) {
        await updateUserInWorkspace(workspaceId, userId, {
          role: role as IUserInWorkspace["role"],
        });
        await updateWorkspaceInUser(userId, workspaceId, {
          role: role as IUserInWorkspace["role"],
        });
        await fetchFullWorkspace(workspaceId);
        message.success("User role changed to " + role);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>People | Freeflow</title>
      </Head>
      <Header
        breadcrumb={[
          {
            title: renderWorkspace?.name || "Workspace",
            route: "/",
          },
          {
            title: "People",
            route: "",
          },
        ]}
      />
      <Space direction="vertical" className="w-full p-5">
        <Space className="w-full items-center justify-between">
          <Typography.Title level={2}>People</Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setVisibleInviteModel(true)}
          >
            Invite People
          </Button>
        </Space>
        <Typography.Title type="secondary" level={4}>
          {currentUserInWorkspace?.length} members
        </Typography.Title>
        <div className="flex flex-wrap gap-5">
          {currentUserInWorkspace &&
            currentUserInWorkspace.length > 0 &&
            currentUserInWorkspace?.map((user) => (
              <Badge.Ribbon
                text={user?.role}
                color={
                  user?.role === "owner"
                    ? "red"
                    : user.role === "admin"
                    ? "orange"
                    : user.role === "editor"
                    ? "purple"
                    : "blue"
                }
              >
                <div className="flex h-60 w-52 flex-col rounded border-2 border-[#ffffff42] p-4">
                  <Avatar
                    src={user?.imageURL}
                    name={user?.name}
                    alt={user?.name}
                    size="50"
                    round={true}
                  />
                  <Typography.Text className="mt-5">
                    {user?.name}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {user?.email}
                  </Typography.Text>
                  <Divider />
                  <Space className="justify-between">
                    <Tag
                      className="w-fit"
                      color={user?.status === "Accepted" ? "green" : "orange"}
                    >
                      {user.status}
                    </Tag>
                    {user?.role !== "owner" &&
                      (currentUserInWorkspace?.filter(
                        (u) => u?.id === authUser?.uid
                      )[0]?.role === "owner" ||
                        currentUserInWorkspace?.filter(
                          (u) => u?.id === authUser?.uid
                        )[0]?.role === "admin") && (
                        <Dropdown
                          menu={{
                            items: [
                              {
                                label: "Change role",
                                icon: <SwapOutlined />,
                                key: "1",
                                children: [
                                  {
                                    label: "Admin",
                                    key: "1-2",
                                    onClick: () =>
                                      handleChangeRole("admin", user.id),
                                  },
                                  {
                                    label: "Editor",
                                    key: "1-2",
                                    onClick: () =>
                                      handleChangeRole("editor", user.id),
                                  },
                                  {
                                    label: "Viewer",
                                    key: "1-3",
                                    onClick: () =>
                                      handleChangeRole("viewer", user.id),
                                  },
                                ],
                              },
                              {
                                label: (
                                  <Popconfirm
                                    onConfirm={() => handleRemoveUser(user.id)}
                                    title="Are you sure want to remove this user?"
                                    className="flex items-center justify-start gap-2"
                                  >
                                    <DeleteOutlined />
                                    <Typography.Text>
                                      Delete user
                                    </Typography.Text>
                                  </Popconfirm>
                                ),
                                key: "2",
                              },
                            ] as MenuProps["items"],
                          }}
                          trigger={["click"]}
                        >
                          <Button
                            type="text"
                            className="flex w-4 items-center justify-center rounded-full text-xl"
                          >
                            <MoreOutlined />
                          </Button>
                        </Dropdown>
                      )}
                  </Space>
                </div>
              </Badge.Ribbon>
            ))}
          <Space
            onClick={() => setVisibleInviteModel(true)}
            className="flex h-60 w-52 cursor-pointer flex-col items-center justify-center rounded border-2 border-[#ffffff42]"
          >
            <Typography.Text className="text-4xl text-[#ffffff5d] ">
              <PlusCircleOutlined />
            </Typography.Text>
          </Space>
        </div>
      </Space>
      <InviteUserInWorkspaceModel
        visible={visibleInviteModel}
        setVisible={setVisibleInviteModel}
      />
    </DashboardLayout>
  );
};

export default PeopleContent;
