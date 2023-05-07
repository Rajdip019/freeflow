import React from "react";
import ImageUploadModal from "../ImageUploadModal";
import SidebarDrawer from "../MobileView/SidebarDrawer";

interface Props {
  title: string;
}

const Header: React.FC<Props> = ({ title }) => {
  return (
    <div className=" sticky top-0 flex items-center justify-between bg-gray-800 px-10 py-5 text-white md:mt-5 md:flex md:bg-transparent">
      <div className="flex items-center justify-center gap-3">
        <SidebarDrawer />
        <h2 className=" font-sec text-3xl font-semibold md:text-5xl">
          {title}
        </h2>
      </div>
      <div className=" flex items-center justify-center gap-3 text-center">
        <ImageUploadModal />
      </div>
    </div>
  );
};

export default Header;
