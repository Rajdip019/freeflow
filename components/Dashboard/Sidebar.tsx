import { useUserContext } from "@/contexts/UserContext";
import React from "react";
import { sidebarData } from "@/utils/constants";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@chakra-ui/react";

const Sidebar = () => {
  const { user } = useUserContext();
  const { logout, authUser } = useAuth();
  const router = useRouter();
  return (
    <div className="bg-sec-black sticky top-0 hidden h-screen  flex-col justify-between px-4 py-4 md:flex">
      <div>
        <div className="px-8">
          <img src="/freeflow.png" alt="" className="w-40" />
        </div>
        <div className=" mt-8  flex items-center gap-3 text-lg text-white">
          <div>
            <Avatar
              className=" w-28 rounded-full ring-2 ring-purple-500"
              src={authUser?.photoURL as string}
              name={user?.name}
            />
          </div>
          <div>
            <h4 className=" truncate font-semibold">{user?.name}</h4>
            <p className="  truncate text-xs">{user?.email}</p>
          </div>
        </div>
        <div className=" mt-10 text-white">
          {sidebarData.map((route, index) => {
            return (
              <div
                onClick={() => router.push(route.url)}
                className={`flex cursor-pointer gap-3 rounded px-3 py-2 ${
                  route.url === router.pathname ? " bg-[#334155]" : ""
                }`}
                key={index}
              >
                <img src={route.img} alt="" className=" w-6" />
                <p className=" font-sec">{route.title}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" text-white">
        <button
          onClick={logout}
          className=" my-5 w-full rounded bg-red-400 py-2 transition-all hover:bg-red-500"
        >
          Logout
        </button>
        <p className=" text-xs text-gray-600">
          © 2023 Freeflow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
