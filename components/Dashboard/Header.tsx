import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import {
  Button,
  Dropdown,
  MenuProps,
  Space,
  Typography,
  Image,
  Breadcrumb,
} from "antd";
import React, { useState } from "react";
import Avatar from "react-avatar";
import Inbox from "../Workspace/InviteNotification";
import { MenuOutlined } from "@ant-design/icons";
import SidebarDrawer from "../MobileView/SidebarDrawer";

type Props = {
  breadcrumb: {
    title: string;
    route: string;
  }[];
};

const Header = ({ breadcrumb }: Props) => {
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
    <Space className="bg-sec sticky top-0 z-50 w-full" direction="vertical">
      <Space className="w-full items-center justify-between p-2 px-4 pt-3">
        <div>
          <Button
            icon={<MenuOutlined />}
            type="text"
            className="md:hidden"
            onClick={() => setOpen(true)}
          />
          <Breadcrumb
            className="hidden md:block"
            items={breadcrumb.map((item) => {
              return {
                title: item.route ? (
                  <a href={item.route}>{item.title}</a>
                ) : (
                  item.title
                ),
              };
            })}
          />
        </div>

        <Space>
          <Inbox />
          <Dropdown menu={{ items }} placement="bottomRight">
            <div>
              <Avatar
                src={user?.imageURL}
                name={user?.name}
                alt={user?.name}
                size="35"
                round={true}
                className="cursor-pointer"
              />
            </div>
          </Dropdown>
        </Space>
      </Space>
      <div className="h-[1px] bg-[#ffffff18]" />
      <SidebarDrawer openDrawer={open} setOpenDrawer={setOpen} />
    </Space>
  );
};

export default Header;
