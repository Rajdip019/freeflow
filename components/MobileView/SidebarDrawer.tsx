import {
  CheckCircleOutlined,
  CloseOutlined,
  FileImageOutlined,
  FormOutlined,
  // InboxOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Select,
  Space,
  Typography,
  Image,
  Skeleton,
  Drawer,
  Tooltip,
  Dropdown,
  Tag,
} from "antd";

import React, { useEffect, useState } from "react";
import ImageUploadModal from "../ImageUploadModal";
import SearchModal from "../Modal/SearchModel";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useRouter } from "next/router";
import Avatar from "react-avatar";
import { FFButton } from "@/theme/themeConfig";
import { useUserContext } from "@/contexts/UserContext";
import SettingModal from "../Modal/SettingModal";
import { useAuth } from "@/contexts/AuthContext";
import { some } from "lodash-es";

type Props = {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarDrawer = ({ openDrawer, setOpenDrawer }: Props) => {
  const {
    workspaceInUser,
    renderWorkspace,
    fetchFullWorkspace,
    currentUserInWorkspace,
  } = useWorkspaceContext();

  const [open, setOpen] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [settingModal, setSettingModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Designs");
  const router = useRouter();
  const { user } = useUserContext();
  const { authUser } = useAuth();

  useEffect(() => {
    if (router.isReady) {
      const path = router.pathname;
      if (path === "/") setActiveTab("Designs");
      else if (path === "/inbox") setActiveTab("Inbox");
      else if (path === "/people") setActiveTab("People");
      else if (path === "/brand-assets")
        setActiveTab("Brand Assets & Guidelines");
    }
  }, [router.isReady]);

  const fetchNewWorkspace = async (workspaceTab: string) => {
    fetchFullWorkspace(workspaceTab);
    localStorage.setItem("currentWorkspaceId", workspaceTab);
  };

  const menu_items = [
    // {
    //   label: "Brand Assets & Guidelines",
    //   icon: <FileZipOutlined />,
    //   href: "/brand-assets",
    // },
    {
      label: "Designs",
      icon: <FileImageOutlined />,
      href: "/",
    },
    // {
    //   label: "Inbox",
    //   icon: <InboxOutlined />,
    //   href: "/inbox",
    // },
    {
      label: "People",
      icon: <UserOutlined />,
      href: "/people",
    },
  ];

  return (
    <Drawer
      placement="left"
      headerStyle={{ display: "none" }}
      onClose={() => setOpenDrawer(false)}
      visible={openDrawer}
      key="left"
      width={267}
      bodyStyle={{
        margin: 0,
        padding: 0,
      }}
    >
      <Space
        direction="vertical"
        className="bg-sec relative max-h-screen w-full"
      >
        {showModel && (
          <ImageUploadModal visible={true} setShowModal={setShowModel} />
        )}
        {visible && <SearchModal visible={visible} setVisible={setVisible} />}

        <div className="flex h-screen flex-col justify-between p-2">
          <div>
            <Dropdown
              open={open}
              onOpenChange={(open) => {
                setOpen(open);
              }}
              arrow={{
                pointAtCenter: true,
              }}
              placement="bottom"
              trigger={["click"]}
              dropdownRender={() => (
                <div className="customShadow ml-2 rounded-lg bg-[#121212] p-2">
                  <Typography.Text className="pl-2">
                    {user?.email}
                  </Typography.Text>
                  {/* <Divider /> */}
                  <div className="my-3 h-[1px] bg-[#ffffff18]" />

                  {workspaceInUser.map((workspace) => {
                    return (
                      <div
                        key={workspace.id}
                        className="my-1.5 flex w-full cursor-pointer items-center justify-between rounded bg-[#1a1a1a] p-2 hover:bg-[#000000]"
                        onClick={() => {
                          fetchNewWorkspace(workspace.id);
                          setOpen(false);
                          setOpenDrawer(false);
                        }}
                      >
                        <div>
                          <Avatar
                            className="mr-2 rounded"
                            size={"34"}
                            name={workspace.name}
                            src={workspace.avatarUrl}
                          />
                          <Typography.Text>{workspace.name}</Typography.Text>
                        </div>
                        <div>
                          <Tag className="ml-10">{workspace.role}</Tag>
                          {renderWorkspace?.id === workspace.id && (
                            <CheckCircleOutlined className="ml-1" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* <Divider /> */}
                  <div className="mt-3 h-[1px] bg-[#ffffff18]" />

                  <Button
                    type="text"
                    className="ml-0 w-full pl-2 text-left"
                    disabled
                    onClick={() => {
                      // router.push("/create-workspace");
                      setOpenDrawer(false);
                    }}
                  >
                    create workspace
                  </Button>
                </div>
              )}
            >
              <div
                onClick={() => {
                  setOpen(!open);
                }}
                className="m-2 flex items-center justify-start"
              >
                <Avatar
                  className="mr-2 rounded"
                  size={"30"}
                  name={renderWorkspace?.name}
                  src={renderWorkspace?.avatarUrl}
                />
                <Tooltip title={renderWorkspace?.name}>
                  <Typography.Text className="truncate">
                    {renderWorkspace?.name}
                  </Typography.Text>
                </Tooltip>
              </div>
            </Dropdown>
            <Space className="my-4">
              <Button
                className="w-[205px] text-start"
                icon={<FormOutlined />}
                onClick={() => {
                  setShowModel(true);
                  setOpenDrawer(false);
                }}
                disabled={
                  currentUserInWorkspace && currentUserInWorkspace.length > 0
                    ? some(currentUserInWorkspace, (user) => {
                        return (
                          user.id === authUser?.uid &&
                          (user.role === "viewer" || user.role === "editor")
                        );
                      })
                    : false
                }
              >
                New Design
              </Button>
              <Button
                onClick={() => {
                  setVisible(true);
                  setOpenDrawer(false);
                }}
                icon={<SearchOutlined />}
              />
            </Space>
            {menu_items.map((item) => (
              <Space
                onClick={() => {
                  router.push(item.href);
                  setOpenDrawer(false);
                }}
                className={`my-1 w-full cursor-pointer rounded-md p-1 pl-4 transition-all ${
                  activeTab === item.label
                    ? "bg-[#642AB5] text-white"
                    : "text-[#ffffffa7]"
                }`}
              >
                {item.icon}
                {item.label}
              </Space>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex">
              <FFButton
                type="text"
                className="w-6 rounded-full transition-all"
                icon={<SettingOutlined />}
                disabled={
                  currentUserInWorkspace && currentUserInWorkspace.length > 0
                    ? some(currentUserInWorkspace, (user) => {
                        return (
                          user.id === authUser?.uid &&
                          (user.role === "viewer" || user.role === "editor")
                        );
                      })
                    : false
                }
                onClick={() => {
                  // router.push("/settings");
                  setSettingModal(true);
                  setOpenDrawer(false);
                }}
              />

              <a
                href="https://linktr.ee/freeflowapp"
                target="_blank"
                rel="noreferrer"
              >
                <FFButton
                  type="text"
                  className="w-6 rounded-full transition-all"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => {
                    setOpenDrawer(false);
                  }}
                />
              </a>
            </div>
            <Image
              className="mb-4"
              src={"/logo/freeflow.png"}
              alt="freeflow"
              width={120}
              preview={false}
            />
          </div>
        </div>
        <Button
          className="hover:none absolute right-0 top-4"
          icon={<CloseOutlined />}
          type="text"
          onClick={() => setOpenDrawer(false)}
        />
        <SettingModal open={settingModal} setOpen={setSettingModal} />
      </Space>
    </Drawer>
  );
};

export default SidebarDrawer;
