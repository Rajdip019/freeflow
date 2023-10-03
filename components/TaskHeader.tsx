import { useUserContext } from "@/contexts/UserContext";
import {
  AppstoreOutlined,
  BellOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Breadcrumb, Button, Space, Typography } from "antd";
import React from "react";

type Props = {
  title?: string;
};

const TaskHeader = ({ title }: Props) => {
  const { user } = useUserContext();
  return (
    <Space className="bg-sec w-full" direction="vertical">
      <Space className="w-full items-center justify-between p-2 px-4 pt-3">
        <Breadcrumb className="text-2xl">
          <Breadcrumb.Item>Tasks</Breadcrumb.Item>
          {title && <Breadcrumb.Item>{title}</Breadcrumb.Item>}
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
