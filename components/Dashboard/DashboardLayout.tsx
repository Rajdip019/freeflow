import React from "react";
import Sidebar from "./Sidebar";
import FFPage from "../FFComponents/FFPage";

const DashboardLayout = ({ children }: any) => {
  return (
    <FFPage isAuthRequired={true}>
      <div className=" flex">
        <Sidebar />
        <div className=" flex w-full flex-col justify-between bg-black">
          <div>{children}</div>
          <div className="h-10 w-full bg-gradient-to-t from-[#8248bd] to-black"></div>
        </div>
      </div>
    </FFPage>
  );
};

export default DashboardLayout;
