import React from "react";
import {
  Button,
  Dropdown,
  MenuProps,
  Space,
  Typography,
  Drawer,
  Divider,
} from "antd";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  CloseOutlined,
  ExportOutlined,
  FileImageTwoTone,
  InfoCircleFilled,
  MoreOutlined,
} from "@ant-design/icons";
import Moment from "react-moment";
import VersionUploadModal from "../VersionControl/VersionUploadModal";
import ChangeFileNameModal from "../Modal/ChangeFileNameModal";
import SendInvitesIconModal from "../Modal/SendInvitesIconModal";
import ImageDeleteModalConfirmation from "../Modal/ImageDeleteModalConfirmation";
import { useImageContext } from "@/contexts/ImagesContext";

type Props = {
  image: IReviewImageData | null;
  sideVisible: boolean;
  setSideVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageInfoDrawer = ({ image, sideVisible, setSideVisible }: Props) => {
  return (
    <Drawer
      open={sideVisible}
      onClose={() => setSideVisible(false)}
      className="p-0"
      title="Design details"
    >
      {image && (
        <div className="w-full">
          <Space direction="vertical" className="w-full">
            <Space className="w-full items-center justify-center bg-[#141414]">
              <img
                className="h-[30vh] w-auto"
                src={image?.imageURL[0]}
                alt={image?.imageName}
              />
            </Space>

            <Space className="w-full items-center justify-between px-2 text-3xl">
              <Space>
                <FileImageTwoTone />
                <Typography.Text className="text-xl font-semibold">
                  {image?.imageName}
                </Typography.Text>
              </Space>
              <Space>
                <VersionUploadModal
                  prevImage={image}
                  isText={false}
                  pos="start"
                  isMenu={true}
                />

                <Dropdown
                  menu={{
                    items: [
                      {
                        label: <ChangeFileNameModal image={image} />,
                      },

                      {
                        label: (
                          <SendInvitesIconModal
                            image={image}
                            isTooltip={false}
                            isMenuItem={true}
                          />
                        ),
                      },
                      {
                        label: <ImageDeleteModalConfirmation image={image} />,
                      },
                    ] as MenuProps["items"],
                  }}
                >
                  <Button icon={<MoreOutlined />} size="small" />
                </Dropdown>
              </Space>
            </Space>
          </Space>
          <Space className="mt-10 w-full px-2" direction="vertical">
            <Typography.Text className="font-semibold">Details</Typography.Text>
            <div className="mb-1 h-[1px] w-full bg-[#ffffff18]" />
            <Space className="w-full" direction="vertical">
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Views
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  {image?.views ? (
                    <span> {image?.views}</span>
                  ) : (
                    <span>No Data</span>
                  )}
                </Typography.Text>
              </Space>
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Type
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  IMAGE
                </Typography.Text>
              </Space>
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Size
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  {image?.size && Math.round(image?.size * 1024)} KB
                </Typography.Text>
              </Space>
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Upload at
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  <Moment format="DD/MM/YYYY hh:mm A">
                    {image?.timeStamp}
                  </Moment>
                </Typography.Text>
              </Space>
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Last modified
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  <Moment format="DD/MM/YYYY hh:mm A">
                    {image?.lastUpdated}
                  </Moment>
                </Typography.Text>
              </Space>
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Uploaded by
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  {image?.uploadedBy}
                </Typography.Text>
              </Space>
            </Space>
          </Space>
          <Space className="w-full items-center justify-center p-8">
            <Button
              type="primary"
              className="mt-4 w-full"
              icon={<ExportOutlined />}
              size="large"
              onClick={() => {
                window.open(`/review-image/${image.id}`);
              }}
            >
              Open in Feedback Tool
            </Button>
          </Space>
        </div>
      )}
    </Drawer>
  );
};

export default ImageInfoDrawer;
