import { appUrl } from "@/helpers/app-url";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  useClipboard,
  useToast,
} from "@chakra-ui/react";

interface Props {
  imageId: string;
  setUploadingState: React.Dispatch<
    React.SetStateAction<"error" | "success" | "not-started" | "uploading">
  >;
  clearFile: () => any;
  mode: "dark" | "light";
  password?: string;
}

const ImageUploadSuccess: React.FC<Props> = ({
  imageId,
  setUploadingState,
  clearFile,
  mode,
  password,
}) => {
  const toast = useToast();

  const urlToCopy = `${appUrl()}/review-image/${imageId}`;
  const { onCopy, hasCopied } = useClipboard(urlToCopy);

  return (
    <div className=" space-y-2">
      <div
        className={`mb-6 flex items-center justify-center gap-3 text-center ${
          mode === "dark" ? "text-white" : "text-black"
        } `}
      >
        <p className=" text-2xl font-semibold">Done! Ready to get feedback?</p>
      </div>
      <div className="">
        <p className=" mb-4 text-center text-xl">Share the link</p>
        <InputGroup size="md">
          <Input
            value={urlToCopy}
            disabled
            name="url"
            focusBorderColor={"purple.500"}
            borderColor={"purple.500"}
            color={"white"}
            className="mb-4 text-white"
          />
          <InputRightElement width="3.5rem">
            <button className=" bg-purple-500 p-1" onClick={() => onCopy()}>
              {hasCopied ? (
                <svg
                  fill="currentColor"
                  className="w-5 text-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                  />
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                  />
                </svg>
              ) : (
                <svg
                  fill="currentColor"
                  className=" w-5 cursor-pointer text-white"
                  onClick={() => {
                    onCopy();
                  }}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                  />
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                  />
                </svg>
              )}
            </button>
          </InputRightElement>
        </InputGroup>
      </div>
      {password && (
        <div className=" flex items-center gap-2">
          <p className=" mb-4 text-center">Password</p>
          <InputGroup size="md">
            <Input
              value={password}
              disabled
              name="url"
              focusBorderColor={"purple.500"}
              borderColor={"purple.500"}
              color={"white"}
              className="mb-4 text-white"
              resize={"none"}
            />
            <InputRightElement width="3.5rem">
              <button className=" bg-purple-500 p-1" onClick={() => onCopy()}>
                {hasCopied ? (
                  <svg
                    fill="currentColor"
                    className="w-5 text-white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                    />
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                    />
                  </svg>
                ) : (
                  <svg
                    fill="currentColor"
                    className=" w-5 cursor-pointer text-white"
                    onClick={() => {
                      onCopy();
                    }}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                    />
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                    />
                  </svg>
                )}
              </button>
            </InputRightElement>
          </InputGroup>
        </div>
      )}
      <div className="flex flex-col items-center">
        <button
          className=" btn-p py-2"
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
