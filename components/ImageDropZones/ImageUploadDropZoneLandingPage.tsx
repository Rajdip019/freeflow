import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileUploaded: (file: File) => void;
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploadDropZoneLandingPage: React.FC<Props> = ({
  onFileUploaded,
  image,
  setImage,
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImage(dataUrl as string);
      onFileUploaded(file);
    };
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div {...getRootProps()} className="p-5 text-center">
        <input {...getInputProps()} accept="image/*" />
        {image ? (
          <>
            <div className=" mb-8 flex items-center justify-center gap-3">
              <svg
                className=" text-p w-16"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                />
              </svg>
              <div>
                <p className=" text-2xl font-semibold text-black">
                  Upload Photo
                </p>
                <p className=" text-xs text-gray-400">
                  Or drag and drop a file here
                </p>
              </div>
            </div>
            <div className="  flex  flex-col items-end">
              <img
                src={image}
                style={{ maxWidth: "100%" }}
                className=" mx-auto max-h-40 rounded-xl"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <svg
              className=" text-p w-16"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              />
            </svg>
            <div>
              <p className=" text-left text-2xl font-semibold text-black">
                Upload Photo
              </p>
              <p className=" text-xs text-gray-400">
                Or drag and drop a file here
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUploadDropZoneLandingPage;
