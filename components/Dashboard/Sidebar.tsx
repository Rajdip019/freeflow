import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { FFButton } from "@/theme/themeConfig";
import {
  CheckCircleOutlined,
  FileImageOutlined,
  FileZipOutlined,
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
  Dropdown,
  Tag,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import SearchModal from "../Modal/SearchModel";
import ImageUploadModal from "../ImageUploadModal";
import { useUserContext } from "@/contexts/UserContext";

const Sidebar = () => {
  const { workspaceInUser, renderWorkspace, fetchFullWorkspace } =
    useWorkspaceContext();
  const { user } = useUserContext();

  const [open, setOpen] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);
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
    <Space
      direction="vertical"
      className="bg-sec sticky top-0 hidden h-screen max-w-[255px] border-r border-r-[#ffffff1e] md:flex"
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
          <div className="my-8 flex w-full items-center justify-center gap-1">
            <Button
              className="w-full text-start"
              icon={<FormOutlined />}
              onClick={() => setShowModel(true)}
            >
              New Design
            </Button>
            <Button
              onClick={() => setVisible(true)}
              className="w-full"
              icon={<SearchOutlined className="mx-2" />}
            />
          </div>
          <div>
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
    </Space>
  );
};

export default Sidebar;
