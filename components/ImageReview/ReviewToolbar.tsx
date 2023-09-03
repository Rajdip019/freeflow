import { IReviewImageData } from "@/interfaces/ReviewImageData";
import React from "react";
import SendInvitesIconModal from "../Modal/SendInvitesIconModal";
import Copy from "../shared/Copy";
import { APP_URL } from "@/utils/constants";
import PublicAndPrivate from "./PublicAndPrivate";
import {
  Popconfirm,
  message,
  Tooltip,
  Button,
  Dropdown,
  MenuProps,
  Typography,
} from "antd";
import { FFButton } from "@/theme/themeConfig";
import {
  DeleteOutlined,
  DotChartOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useImageContext } from "@/contexts/ImagesContext";
import { useFeedbackContext } from "@/contexts/FeedbackContext";

const ReviewImageToolbarAdmin: React.FC = () => {
  const { deleteImage } = useImageContext();
  const { isCompareView, setIsCompareView, imageData, isAdmin } =
    useFeedbackContext();

  const confirm = async () => {
    await deleteImage(imageData as IReviewImageData);
    message.success("File Deleted");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          onClick={() => setIsCompareView(!isCompareView)}
          className=" flex gap-2"
        >
          <EyeOutlined />
          Compare View
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Copy value={`${APP_URL}/review-image/${imageData?.id}`} type="both" />
      ),
    },
    {
      key: "3",
      label: (
        <SendInvitesIconModal
          image={imageData as IReviewImageData}
          type="text"
          isTooltip={false}
          isMenuItem={true}
        />
      ),
    },
    {
      key: "4",
      label: (
        <Popconfirm
          title="Do you want to delete the file?"
          description="By deleting this file you will also delete any feedback on it."
          onConfirm={async () => {
            await confirm();
          }}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <Typography.Text className=" flex gap-2">
            <DeleteOutlined />
            Delete
          </Typography.Text>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      {/* ////////////// Laptop Screen View /////////////////*/}
      <div className="hidden items-center gap-5 md:flex">
        {imageData?.imageURL[1] && (
          <Tooltip title="Toggle Comparison View">
            <FFButton
              className=" border-none shadow-none"
              icon={isCompareView ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setIsCompareView(!isCompareView)}
            ></FFButton>
          </Tooltip>
        )}
        <Copy value={`${APP_URL}/review-image/${imageData?.id}`} />
        {isAdmin && (
          <>
            <SendInvitesIconModal image={imageData as IReviewImageData} />
            <div className="-ml-3.5">
              <Popconfirm
                title="Do you want to delete the file?"
                description="By deleting this file you will also delete any feedback on it."
                onConfirm={async () => {
                  await confirm();
                }}
                okText="Yes"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <FFButton
                  className=" border-none shadow-none"
                  icon={<DeleteOutlined />}
                ></FFButton>
              </Popconfirm>
            </div>
          </>
        )}
      </div>
      {/* ////////////// Mobile Screen View /////////////////*/}
      <div className="md:hidden">
        <Dropdown menu={{ items }}>
          <FFButton className=" border-none px-0 shadow-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </FFButton>
        </Dropdown>
      </div>
    </>
  );
};

export default ReviewImageToolbarAdmin;
