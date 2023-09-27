import React, { useEffect, useState } from "react";
import { sidebarData } from "@/utils/constants";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Divider, Image, Popconfirm, Space, Typography } from "antd";
import {
  DesktopOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";
import Link from "next/link";

const Sidebar = () => {
  const sidebarData = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HomeOutlined />,
    },
    {
      title: "Design",
      url: "/design",
      icon: <DesktopOutlined />,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: <EditOutlined />,
    },
  ];
  const { logout } = useAuth();
  const router = useRouter();
  const [width, setWidth] = useState<number>(NaN);
  useEffect(() => {
    const width = localStorage.getItem("sidebarWidth");
    if (width) {
      setWidth(parseInt(width));
    } else {
      setWidth(56);
    }
  }, []);

  useEffect(() => {
    if (isNaN(width)) return;
    localStorage.setItem("sidebarWidth", width.toString());
  }, [width]);

  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setActive(router.asPath);
  }, [router]);

  return (
    <Space
      direction="vertical"
      className="bg-sec sticky top-0 hidden h-screen border-r border-r-[#ffffff1e] md:flex"
    >
      <Space direction="vertical" className={`w-${width} transition-all`}>
        <Space className="w-full items-center justify-between">
          <Image
            src="/logo/freeflow.png"
            width={120}
            hidden={width === 14}
            className="m-4 mt-6 transition-all"
            preview={false}
          />
          <Button
            className="m-3 -ml-1 mt-6 transition-all"
            icon={
              width === 56 ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
            }
            onClick={() => setWidth(width === 56 ? 14 : 56)}
          />
        </Space>
        <Divider />
        <Space
          direction="vertical"
          className={`${
            width === 56 ? "ml-2 w-52" : "w-full items-center justify-center"
          } space-y-2`}
        >
          {sidebarData.map((route, index) => {
            return (
              <Space
                className={`flex w-full cursor-pointer rounded-xl p-3 ${
                  width !== 56 && "items-center justify-center"
                }  ${
                  active === route.url
                    ? "bg-purple-600 text-white"
                    : "bg-[#000000b5] text-[#ffffff96] transition-all hover:bg-[#3e287ba7]"
                } `}
                onClick={() => router.push(route.url)}
                key={index}
              >
                {route.icon}
                {width === 56 && (
                  <Typography.Text
                    className={`${
                      active === route.url ? " text-white" : " text-[#ffffff96]"
                    }`}
                  >
                    {route.title}
                  </Typography.Text>
                )}
              </Space>
            );
          })}
          <Divider className="mt-[340px]" />
          {/* <Space
            className={`w-full p-3 cursor-pointer rounded-xl text-white bg-purple-600 transition-all`}
          >
            <SettingOutlined className="rotate-180" />
            {""}
            {width === 56 && (
              <Typography.Text className="text-white">Setting</Typography.Text>
            )}
          </Space> */}
          <Popconfirm
            title="Logout"
            description="Are you sure to Logout?"
            onConfirm={() => {
              logout();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Space
              className={`w-full cursor-pointer rounded-xl bg-[#cc0d33ac] p-3 text-white transition-all`}
            >
              <LogoutOutlined className="rotate-180" />
              {""}
              {width === 56 && (
                <Typography.Text className="text-white">Logout</Typography.Text>
              )}
            </Space>
          </Popconfirm>
        </Space>
      </Space>
    </Space>
  );
};

export default Sidebar;
