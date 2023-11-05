import React from "react";
import { Button, Dropdown, MenuProps, Space, Typography } from "antd";
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
  const { images } = useImageContext();
  return (
    <>
      {image !== null && sideVisible && (
        <div className="bg-sec sticky top-0 hidden h-screen w-[26%] flex-col justify-between space-y-4 border-l border-l-[#ffffff1e] md:flex">
          <Space direction="vertical" className="w-full">
            <Space className="w-full items-center justify-center bg-black">
              <img
                className="h-[35vh]"
                src={image?.imageURL[0]}
                alt={image?.imageName}
              />
            </Space>
            <Space className="w-full items-center justify-between px-4 text-3xl">
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
          <Space className="px-4" direction="vertical">
            <Typography.Text className="font-semibold">Details</Typography.Text>
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
          <Space className="items-center justify-center p-8">
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
          <Button
            type="text"
            onClick={() => setSideVisible(false)}
            className="absolute right-2 top-0 bg-[#00000075]"
            icon={<CloseOutlined />}
          />
        </div>
      )}
    </>
  );
};

export default ImageInfoDrawer;
