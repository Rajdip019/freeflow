import React from "react";
import Sidebar from "./Sidebar";
import FFPage from "../FFComponents/FFPage";
import { useDropzone } from "react-dropzone";
import ImageUploadModal from "../ImageUploadModal";
import { UploadOutlined } from "@ant-design/icons";

const DashboardLayout = ({ children }: any) => {
  const [image, setImage] = React.useState<string>();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [propFile, setPropFile] = React.useState<File | null>(null);
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPropFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImage(dataUrl as string);
      setShowModal(true);
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <FFPage isAuthRequired={true}>
      <div className=" flex">
        <Sidebar />
        <div
          {...getRootProps()}
          onClick={(e) => e.stopPropagation()}
          className=" relative flex w-full flex-col justify-between bg-black"
        >
          <input {...getInputProps()} accept="image/*" />
          {showModal && (
            <ImageUploadModal
              visible={true}
              setShowModal={setShowModal}
              propFile={propFile as File}
              propImage={image}
            />
          )}
          {/* Mask */}
          {isDragActive && (
            <div className="absolute left-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-[#ffffff69] text-white transition-all">
              <UploadOutlined className="text-6xl text-gray-500" />
              <p>Drop anywhere to upload</p>
            </div>
          )}
          <div>{children}</div>
          <div className="h-10 w-full bg-gradient-to-t from-[#8248bd] to-black "></div>
        </div>
      </div>
    </FFPage>
  );
};

export default DashboardLayout;
