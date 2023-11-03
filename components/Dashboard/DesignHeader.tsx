import React, { useEffect } from "react";
import {
  Image,
  AutoComplete,
  Input,
  Button,
  Space,
  Tooltip,
  Dropdown,
  Typography,
  MenuProps,
} from "antd";
import {
  AppstoreOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import ImageUploadModal from "../ImageUploadModal";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "react-avatar";
type Props = {
  isGridView: boolean;
  setIsGridView: React.Dispatch<React.SetStateAction<boolean>>;
};

const DesignHeader = ({ isGridView, setIsGridView }: Props) => {
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
    <section className="flex w-full items-center justify-between overflow-hidden border-b border-[#2c2b2b] bg-[#141414] px-8 py-4">
      <Image src="/logo/freeflow.png" width={120} preview={false} />
      <div className=" flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
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
            <ImageUploadModal />
          </Space>
        </div>
        <div className="flex">
          <Space>
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
    </section>
  );
};

export default DesignHeader;
