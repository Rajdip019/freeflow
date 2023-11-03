import React from "react";
import { Button, Dropdown, MenuProps, Space, Typography } from "antd";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  EditOutlined,
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
};

const ImageInfoDrawer = ({ image }: Props) => {
  const { images } = useImageContext();
  return (
    <>
      {image === null ? (
        <div className="bg-sec sticky top-0 hidden h-screen w-[26%] flex-col space-y-4 border-l border-l-[#ffffff1e] md:flex">
          <Space className="h-[35vh] w-full items-center justify-center bg-black">
            <Typography.Text className="text-8xl">
              <FileImageTwoTone />
            </Typography.Text>
          </Space>
          <Typography.Text className="m-4 text-xl">
            Designs ({images.length} items)
          </Typography.Text>
          <Space className="m-4 rounded-md border border-[#ffffff40] p-4">
            <Typography.Text className="mr-2 text-xl text-white">
              <InfoCircleFilled />
            </Typography.Text>
            <Typography.Text className="text-[17px]">
              Select a single design to get more information about it.
            </Typography.Text>
          </Space>
        </div>
      ) : (
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
            >
              Open in Feedback Tool
            </Button>
          </Space>
        </div>
      )}
    </>
  );
};

export default ImageInfoDrawer;
