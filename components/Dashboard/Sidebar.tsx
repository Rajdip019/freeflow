import React from "react";
import { sidebarData } from "@/utils/constants";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Divider, Image, Typography } from "antd";
import { DesktopOutlined, HomeOutlined } from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";

const Sidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <div className="bg-sec sticky top-0 hidden md:flex ">
      <div className="w-56">
        <div className="">
          <div className="ml-4 mt-5">
            <Image src="/freeflow.png" width={120} preview={false} />
          </div>
          <div className=" mt-10 text-white">
            {sidebarData.map((route, index) => {
              return (
                <div
                  onClick={() => router.push(route.url)}
                  className={`flex cursor-pointer gap-3 px-5 py-2 ${
                    route.url === router.pathname ? " bg-p" : ""
                  }`}
                  key={index}
                >
                  {route.url === "/dashboard" && <HomeOutlined />}
                  {route.url === "/design" && <DesktopOutlined />}
                  <Typography.Text>{route.title}</Typography.Text>
                </div>
              );
            })}
          </div>
        </div>
        <div className=" absolute bottom-0 w-full">
          <FFButton
            onClick={logout}
            className=" my-5 w-full rounded-none border-x-0"
          >
            Logout
          </FFButton>
        </div>
      </div>
      <Divider type="vertical" className=" mx-0 h-screen" />
    </div>
  );
};

export default Sidebar;
