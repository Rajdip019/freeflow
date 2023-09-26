import React, { useEffect, useState } from "react";
import { sidebarData } from "@/utils/constants";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Divider, Image, Space, Typography } from "antd";
import {
  DesktopOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EditOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";

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
      title: "Task",
      url: "/task",
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

  return (
    // <div className="bg-sec sticky top-0 hidden h-screen md:flex">
    //   <div className="w-56">
    //     <div className="">
    //       <div className="ml-4 mt-5">
    //         <Image src="/logo/freeflow.png" width={120} preview={false} />
    //       </div>
    //       <div className=" mt-10 text-white">
    //         {sidebarData.map((route, index) => {
    //           return (
    //             <div
    //               onClick={() => router.push(route.url)}
    //               className={`flex cursor-pointer gap-3 px-5 py-2 ${
    //                 route.url === router.pathname ? " bg-p" : ""
    //               }`}
    //               key={index}
    //             >
    //               {route.url === "/dashboard" && <HomeOutlined />}
    //               {route.url === "/design" && <DesktopOutlined />}
    //               <Typography.Text>{route.title}</Typography.Text>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //     <div className=" absolute bottom-0 w-full">
    //       <FFButton
    //         onClick={logout}
    //         className=" my-5 w-full rounded-none border-x-0"
    //       >
    //         Logout
    //       </FFButton>
    //     </div>
    //   </div>
    //   <Divider type="vertical" className=" mx-0 h-screen" />
    // </div>
    <Space
      direction="vertical"
      className="bg-sec sticky top-0 hidden h-screen md:flex"
    >
      <Space direction="vertical" className={`w-${width} transition-all`}>
        <Space className="w-full items-center justify-between">
          <Image
            src="/logo/freeflow.png"
            width={120}
            hidden={width === 12}
            className="m-4 mt-6 transition-all"
            preview={false}
          />
          <Button
            className="m-2 ml-0 mt-6 transition-all"
            icon={
              width === 56 ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
            }
            onClick={() => setWidth(width === 56 ? 12 : 56)}
          />
        </Space>
        <Space direction="vertical" className="w-full">
          {sidebarData.map((route, index) => {
            return (
              <Button
                key={index}
                icon={route.icon}
                className="my-4 ml-2 mr-2 w-48 rounded-none border-r-2 bg-[#041b06]"
              >
                {width === 56 && route.title}
              </Button>
            );
          })}
        </Space>
      </Space>
    </Space>
  );
};

export default Sidebar;
