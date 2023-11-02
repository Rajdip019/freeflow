import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { FFButton } from "@/theme/themeConfig";
import {
  FileImageOutlined,
  FileZipOutlined,
  FormOutlined,
  // InboxOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Select, Space, Typography, Image } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";

const Sidebar = () => {
  const { workspaceInUser, renderWorkspace, fetchFullWorkspace } =
    useWorkspaceContext();

  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Designs");
  const router = useRouter();

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
    {
      label: "Brand Assets & Guidelines",
      icon: <FileZipOutlined />,
      href: "/brand-assets",
    },
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
    <Space
      direction="vertical"
      className="bg-sec sticky top-0 hidden h-screen w-[260px] border-r border-r-[#ffffff1e] md:flex"
    >
      {
        <div className="flex h-screen flex-col justify-between p-2">
          <div>
            <Select
              style={{ width: "250px" }}
              dropdownStyle={{ fontSize: "20px" }}
              size="large"
              bordered={false}
              open={open}
              onDropdownVisibleChange={() => setOpen(!open)}
              onChange={(value) => fetchNewWorkspace(value as string)}
              placeholder={
                <Space>
                  <Avatar
                    name={renderWorkspace?.name}
                    size="30"
                    round={true}
                    textSizeRatio={2}
                  />
                  <Typography.Text>{renderWorkspace?.name}</Typography.Text>
                </Space>
              }
              dropdownRender={(menu) => (
                <>
                  <Typography.Text className="mb-1 ml-2 text-[#ffffffb1]">
                    Change workspace
                  </Typography.Text>
                  {menu}
                </>
              )}
              suffixIcon={null}
            >
              {workspaceInUser.map((workspace) => {
                return (
                  <Select.Option key={workspace.id} value={workspace.id}>
                    <Space>
                      <Avatar
                        name={workspace.name}
                        src={workspace.avatarUrl}
                        size="30"
                        round={true}
                        textSizeRatio={2}
                      />
                      <Typography.Text>{workspace.name}</Typography.Text>
                    </Space>
                  </Select.Option>
                );
              })}
            </Select>
            <Space className="my-4">
              <Button className="w-[200px] text-start" icon={<FormOutlined />}>
                New Design
              </Button>
              <Button icon={<SearchOutlined />} />
            </Space>
            {menu_items.map((item) => (
              <Space
                onClick={() => router.push(item.href)}
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
      }
    </Space>
  );
};

export default Sidebar;
