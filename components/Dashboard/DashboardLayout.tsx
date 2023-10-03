import React from "react";
import Sidebar from "./Sidebar";
import FFPage from "../FFComponents/FFPage";
import { useDropzone } from "react-dropzone";
import ImageUploadModal from "../ImageUploadModal";
import { UploadOutlined } from "@ant-design/icons";
import { Typography } from "antd";

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
      <div className=" flex overflow-hidden">
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
            <div className="absolute left-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-[#1818189c] text-white transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-12 w-12 animate-bounce"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
                />
              </svg>

              <Typography.Text className="text-xl">
                Drop anywhere to upload
              </Typography.Text>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </FFPage>
  );
};

export default DashboardLayout;
