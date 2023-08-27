import { APP_URL } from "@/utils/constants";
import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  useClipboard,
} from "@chakra-ui/react";
import ClipboardCopiedIcon from "@/components/Icons/ClipboardCopiedIcon";
import ClipboardIcon from "@/components/Icons/ClipboardIcon";
import classNames from "classnames";
import SendInvitesInput from "./ImageReview/SendInvitesInput";

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
  const reviewImageUrl = `${APP_URL}/review-image/${imageId}`;
  const { onCopy: onCopyImageUrl, hasCopied: hasCopiedImageUrl } =
    useClipboard(reviewImageUrl);

  return (
    <div>
      <div
        className={`mb-6 flex items-center justify-center gap-3 text-center ${
          mode === "dark" ? "text-white" : "text-black"
        } `}
      >
        <p className="text-2xl font-semibold">
          Done! Share the link to let anyone leave feedback
        </p>
      </div>

      <SendInvitesInput
        imageId={imageId}
        inputClassName={classNames({
          "text-white": mode === "dark",
          "text-black": mode === "light",
        })}
        wrapperClassName="mb-4"
      />

      <div className="my-4 flex flex-col gap-2">
        <p
          className={classNames("text-center text-2xl", {
            "text-gray-400": mode === "dark",
            "text-gray-500": mode === "light",
          })}
        >
          OR
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <p>Share the link:</p>
        <InputGroup size="md">
          <Input
            value={reviewImageUrl}
            disabled
            name="url"
            focusBorderColor={"purple.500"}
            borderColor={"purple.500"}
            className={classNames("mb-4 pr-4", {
              "text-white": mode === "dark",
              "text-black": mode === "light",
            })}
          />
          <InputRightElement>
            <button onClick={() => onCopyImageUrl()}>
              {hasCopiedImageUrl ? (
                <ClipboardCopiedIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ClipboardIcon className="h-5 w-5 cursor-pointer text-purple-500 hover:text-gray-500" />
              )}
            </button>
          </InputRightElement>
        </InputGroup>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="btn-p py-2"
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
