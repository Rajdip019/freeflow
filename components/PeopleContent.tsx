import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Header from "@/components/Dashboard/Header";
import InviteUserInWorkspaceModel from "@/components/Modal/InviteUserInWorkspaceModel";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { FFButton } from "@/theme/themeConfig";
import {
  LogoutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Menu,
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
  } = useWorkspaceContext();

  const { removeWorkspaceInUser } = useUserContext();
  const [visibleInviteModel, setVisibleInviteModel] = useState<boolean>(false);
  const [cnfLoading, setCnfLoading] = useState<boolean>(false);
  const { authUser } = useAuth();

  const handleRemoveUser = async (userId: string) => {
    try {
      setCnfLoading(true);
      const workspaceId = renderWorkspace?.id;
      if (workspaceId) {
        await removeUserFromWorkspace(workspaceId, userId);
        await removeWorkspaceInUser(userId, workspaceId);
        await fetchFullWorkspace(workspaceId);
      }
      setCnfLoading(false);
      message.success("User removed successfully");
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
                        <>
                          {/* <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item>
                                  Delete
                                </Menu.Item>
                                <Menu.Item>
                                  <Menu
                                    onClick={(e) =>
                                      handleRoleChange(user.id, e.key)
                                    }
                                  >
                                    <Menu.Item key="admin">Admin</Menu.Item>
                                    <Menu.Item key="editor">Editor</Menu.Item>
                                    <Menu.Item key="viewer">Viewer</Menu.Item>
                                  </Menu>
                                </Menu.Item>
                              </Menu>
                            }
                          >
                            <a
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              Change Role
                            </a>
                          </Dropdown> */}

                          <Tooltip title="Remove">
                            <Popconfirm
                              title="Are you sure to remove this user?"
                              okText="Yes"
                              cancelText="No"
                              okButtonProps={{ loading: cnfLoading }}
                              onConfirm={() => handleRemoveUser(user.id)}
                            >
                              <FFButton
                                type="text"
                                className="w-6 rounded-full text-gray-400 transition-all"
                                icon={<LogoutOutlined />}
                              />
                            </Popconfirm>
                          </Tooltip>
                        </>
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
