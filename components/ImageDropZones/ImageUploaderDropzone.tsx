import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileUploaded: (file: File) => void;
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploaderDropzone: React.FC<Props> = ({
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
      <div
        {...getRootProps()}
        className=" rounded-xl border border-purple-500 p-5 text-center"
      >
        <input {...getInputProps()} accept="image/*" />
        {image ? (
          <div className="  flex  flex-col items-end">
            <img
              src={image}
              style={{ maxWidth: "100%" }}
              className=" mx-auto max-h-40 rounded-xl"
            />
          </div>
        ) : (
          <p className="font-semibold text-gray-500">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="mx-auto w-16"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.03 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v4.94a.75.75 0 001.5 0v-4.94l1.72 1.72a.75.75 0 101.06-1.06l-3-3z"
              />
            </svg>{" "}
            <br />
            Drag and drop an image here, or click to select a file
          </p>
        )}
      </div>
    </>
  );
};

export default ImageUploaderDropzone;
