import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { Breadcrumb, Dropdown, MenuProps, Space, Typography } from "antd";
import React from "react";
import Avatar from "react-avatar";
import Inbox from "../Workspace/InviteNotification";

type Props = {
  breadcrumb: {
    title: string;
    route: string;
  }[];
};

const Header = ({ breadcrumb }: Props) => {
  const { user } = useUserContext();
  const { logout } = useAuth();
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
        <Breadcrumb
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
    </Space>
  );
};

export default Header;
