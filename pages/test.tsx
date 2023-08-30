import ImageUploadModal from "@/components/ImageUploadModal";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";
import { useDropzone } from "react-dropzone";

type Props = {};

const Test = (props: Props) => {
  const [image, setImage] = React.useState<string>();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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
    <div
      {...getRootProps()}
      onClick={(e) => e.stopPropagation()}
      className="flex h-screen w-screen items-center justify-center bg-purple-300"
    >
      <input {...getInputProps()} accept="image/*" />
      {showModal && (
        <ImageUploadModal
          visible
          setShowModal={setShowModal}
          propImage={image}
        />
      )}
      {/* Mask */}
      {isDragActive && (
        <div className="flex h-screen w-screen items-center justify-center bg-[#ffffff7f] transition-all">
          <UploadOutlined className="text-6xl text-gray-500" />
          <p>Drop anywhere to upload</p>
        </div>
      )}
    </div>
  );
};

export default Test;
