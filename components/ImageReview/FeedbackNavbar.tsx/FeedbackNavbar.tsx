import VersionUploadModal from "@/components/VersionControl/VersionUploadModal";
import { defaultHighlightedThread } from "@/utils/constants";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import router from "next/router";
import React from "react";
import ReviewImageToolbar from "../ReviewToolbar";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { Dropdown, MenuProps, Typography } from "antd";
import {
  DownCircleOutlined,
  DownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";

const FeedbackNavbar = () => {
  const {
    imageData,
    isAdmin,
    version,
    setHighlightedComment,
    isCompareView,
    setIsCompareView,
    setVersion,
  } = useFeedbackContext();

  const items: MenuProps["items"] = isAdmin
    ? [
        {
          key: "1",
          label: (
            <VersionUploadModal
              prevImage={imageData as IReviewImageData}
              pos="start"
            />
          ),
        },
        {
          key: "2",
          label: <Typography.Text>Versions</Typography.Text>,
          children: imageData?.imageURL.map((_, index) => {
            return {
              key: index,
              label: (
                <Typography.Text
                  key={index}
                  onClick={() => {
                    setHighlightedComment(defaultHighlightedThread);
                    setVersion(imageData.imageURL.length - index);
                  }}
                >
                  {`Version ${imageData.imageURL.length - index}`}
                </Typography.Text>
              ),
            };
          }),
        },
        {
          key: "3",
          label: (
            <Typography.Text
              onClick={() => {
                setIsCompareView(true);
              }}
            >
              Compare Versions
            </Typography.Text>
          ),
        },
      ]
    : [
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.aliyun.com"
            >
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
        {
          key: "2",
          label: <Typography.Text>Versions</Typography.Text>,
          children: imageData?.imageURL.map((_, index) => {
            return {
              key: index,
              label: (
                <div
                  key={index}
                  onClick={() => {
                    setHighlightedComment(defaultHighlightedThread);
                    setVersion(imageData.imageURL.length - index);
                  }}
                >
                  {`Version ${imageData.imageURL.length - index}`}
                </div>
              ),
            };
          }),
        },
        {
          key: "3",
          label: (
            <Typography.Text
              onClick={() => {
                setIsCompareView(true);
              }}
            >
              Compare Versions
            </Typography.Text>
          ),
        },
      ];

  return (
    <div className="bg-sec flex h-16 items-center justify-between px-5">
      <div
        className="hidden cursor-pointer gap-2 md:flex"
        onClick={() => router.push("/")}
      >
        <img src="/logo/freeflow.png" alt="" className=" w-32" />
      </div>
      <Typography.Text className=" flex items-center justify-center gap-2 font-semibold">
        {isCompareView ? "" : imageData?.imageName}{" "}
        {imageData?.currentVersion ? (
          <>
            {!isCompareView && (
              <Dropdown menu={{ items }}>
                <FFButton type="primary" size="small" className="px-">
                  {`v${version}`} <DownOutlined style={{ fontSize: 8 }} />
                </FFButton>
              </Dropdown>
            )}
          </>
        ) : (
          <Typography.Text className="text-sm text-red-500">
            Deprecated
          </Typography.Text>
        )}
      </Typography.Text>
      <ReviewImageToolbar />
    </div>
  );
};

export default FeedbackNavbar;
