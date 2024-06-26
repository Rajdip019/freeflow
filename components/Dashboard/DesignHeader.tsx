import React, { useState } from "react";
import {
  Image,
  Button,
  Space,
  Tooltip,
  Dropdown,
  Typography,
  MenuProps,
} from "antd";
import {
  AppstoreOutlined,
  MenuOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "react-avatar";
import Inbox from "../Workspace/InviteNotification";
import SidebarDrawer from "../MobileView/SidebarDrawer";
type Props = {
  isGridView: boolean;
  setIsGridView: React.Dispatch<React.SetStateAction<boolean>>;
};

const DesignHeader = ({ isGridView, setIsGridView }: Props) => {
  const { user } = useUserContext();
  const { logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className=" flex flex-col">
          <Typography.Text className="text-gray-500">
            Signed in as
          </Typography.Text>
          <Typography.Text className="text-gray-400">
            {user?.email}
          </Typography.Text>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Typography.Text className="text-red-500" onClick={logout}>
          Sign out
        </Typography.Text>
      ),
    },
  ];
  return (
    <section className="flex w-full items-center justify-between overflow-hidden border-b border-[#2c2b2b] bg-[#141414] px-8 py-4">
      <div className=" flex h-fit items-center ">
        <Button
          icon={<MenuOutlined />}
          type="text"
          className="-ml-4 md:hidden"
          onClick={() => setOpen(true)}
        />
        <Image
          src="/logo/freeflow.png"
          width={120}
          preview={false}
          className="hidden md:block"
        />
      </div>
      <div className=" flex items-center justify-center gap-3">
        <div className="mr-1 flex items-center gap-2">
          <Space>
            <Tooltip title="List View" aria-title="List View">
              <Button
                type={isGridView ? "default" : "primary"}
                icon={<UnorderedListOutlined />}
                onClick={() => setIsGridView(false)}
                className="h-9 w-9"
              />
            </Tooltip>
            <Tooltip title="Grid View" aria-title="Grid View">
              <Button
                type={isGridView ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setIsGridView(true)}
                className="h-9 w-9"
              />
            </Tooltip>
          </Space>
        </div>
        <div className="flex">
          <Space>
            <Inbox />
            <Dropdown menu={{ items }} placement="bottomRight">
              <div>
                <Avatar
                  src={user?.imageURL}
                  name={user?.name}
                  alt={user?.name}
                  size="40"
                  round={true}
                  className="cursor-pointer"
                />
              </div>
            </Dropdown>
          </Space>
        </div>
      </div>
      <SidebarDrawer openDrawer={open} setOpenDrawer={setOpen} />
    </section>
  );
};

export default DesignHeader;
