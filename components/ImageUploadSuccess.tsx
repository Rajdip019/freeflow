import { APP_URL } from "@/utils/constants";
import React from "react";
// import classNames from "classnames";
// import SendInvitesInput from "./ImageReview/SendInvitesInput";
import { Button, Divider, Input, Space, Typography, message } from "antd";

interface Props {
  imageId: string;
  setUploadingState: React.Dispatch<
    React.SetStateAction<"error" | "success" | "not-started" | "uploading">
  >;
  clearFile: () => any;
  mode: "dark" | "light";
  renderWorkspaceId: string;
}

const ImageUploadSuccess: React.FC<Props> = ({
  imageId,
  setUploadingState,
  clearFile,
  mode,
  renderWorkspaceId,
}) => {
  const reviewImageUrl = `${APP_URL}/review-design/w/${renderWorkspaceId}/d/${imageId}`;

  return (
    <div>
      <div
        className={`mb-6 flex items-center justify-center gap-3 text-center ${
          mode === "dark" ? "text-white" : "text-black"
        } `}
      >
        <Typography.Text className="mt-4 text-xl font-semibold">
          Done! Share the link to let anyone leave feedback
        </Typography.Text>
      </div>
      {/* 
      <SendInvitesInput
        imageId={imageId}
        inputClassName={classNames({
          "text-white": mode === "dark",
          "text-black": mode === "light",
        })}
        wrapperClassName="mb-4"
      /> */}

      {/* <Divider>OR</Divider> */}
      <div className="mb-4 flex flex-col gap-2">
        <p>Share the link:</p>
        <Space.Compact>
          <Input value={reviewImageUrl} disabled />
          <Button
            type="primary"
            onClick={() => {
              navigator.clipboard.writeText(reviewImageUrl);
              message.success("Copied to clipboard");
            }}
          >
            Copy
          </Button>
        </Space.Compact>
      </div>
      <div className="flex flex-col items-center">
        <Button
          color="purple"
          size="large"
          type="primary"
          className="mt-2 w-full"
          onClick={() => {
            setUploadingState("not-started"), clearFile();
          }}
        >
          Upload Another Design
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadSuccess;
