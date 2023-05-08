import { template } from "@/helpers/apiTemplateString";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "@chakra-ui/react";

interface Props {
  imageId: string;
  setUploadingState: React.Dispatch<
    React.SetStateAction<"error" | "success" | "not-started" | "uploading">
  >;
  clearFile: () => any;
  mode: "dark" | "light";
}

const ImageUploadSuccess: React.FC<Props> = ({
  imageId,
  setUploadingState,
  clearFile,
  mode,
}) => {
  const toast = useToast();

  const urlToCopy = `${template}/review-image/${imageId}`;

  return (
    <div className=" space-y-6">
      <div
        className={`mb-6 flex items-center justify-center gap-3 text-center ${
          mode === "dark" ? "text-white" : "text-black"
        } `}
      >
        <p className=" text-2xl font-semibold">Done! Ready to get feedback?</p>
      </div>
      <div
        className={`border ${
          mode === "dark"
            ? "border-white text-white"
            : "border-black text-gray-800"
        } b clear-left rounded p-2 `}
      >
        {urlToCopy}
      </div>
      <div className=" mt-5 flex flex-col items-center">
        <CopyToClipboard text={urlToCopy}>
          <button
            onClick={() =>
              toast({
                title: "Link copied to Clipboard!",
                status: "success",
                duration: 3000,
                isClosable: false,
                position: "bottom-right",
              })
            }
            className="btn-p w-fit py-2"
          >
            Copy
          </button>
        </CopyToClipboard>
        <button
          className=" btn-p mt-5 py-2"
          onClick={() => {
            setUploadingState("not-started"), clearFile();
          }}
        >
          Upload Another Design
        </button>
      </div>
    </div>
  );
};

export default ImageUploadSuccess;
