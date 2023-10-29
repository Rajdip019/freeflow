import { useUserContext } from "@/contexts/UserContext";
import {
  AppstoreOutlined,
  AppstoreTwoTone,
  BellOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Breadcrumb, Button, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  title?: string;
};

const TaskHeader = ({ title }: Props) => {
  const { user } = useUserContext();
  const router = useRouter();
  return (
    <Space className="bg-sec sticky top-0 z-50 w-full" direction="vertical">
      <Space className="w-full items-center justify-between p-2 px-4 pt-3">
        <Breadcrumb className="text-2xl" separator={">"}>
          <Breadcrumb.Item
            className="cursor-pointer"
            onClick={() => router.push("/tasks")}
          >
            {" "}
            <Typography.Text className="text-2xl text-gray-400">
              <AppstoreTwoTone style={{ fontSize: "1.5rem" }} /> Tasks
            </Typography.Text>
          </Breadcrumb.Item>

          {title && (
            <Breadcrumb.Item>
              <Typography.Text className="text-lg text-gray-400">
                {" "}
                {title}
              </Typography.Text>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
        <Space>
          <Button disabled icon={<SearchOutlined />} />
          <Button disabled icon={<UnorderedListOutlined />} />
          <Button disabled icon={<AppstoreOutlined />} />
          <Space className="mx-3">
            <Badge dot size="small">
              <Typography.Text disabled className="text-xl">
                <BellOutlined />
              </Typography.Text>
            </Badge>
          </Space>
          <Avatar className="bg-purple-600" src={user?.imageURL}>
            {user?.name && user.name[0]}
          </Avatar>
        </Space>
      </Space>
      <div className="h-[1px] bg-[#ffffff18]" />
    </Space>
  );
};

export default TaskHeader;
