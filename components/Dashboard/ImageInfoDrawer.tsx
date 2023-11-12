import React from "react";
import {
  Button,
  Dropdown,
  MenuProps,
  Space,
  Typography,
  Drawer,
  Image,
} from "antd";
import { IReviewImage } from "@/interfaces/ReviewImageData";
import {
  DoubleRightOutlined,
  ExportOutlined,
  FileImageTwoTone,
  MoreOutlined,
} from "@ant-design/icons";
import Moment from "react-moment";
import VersionUploadModal from "../VersionControl/VersionUploadModal";
import ChangeFileNameModal from "../Modal/ChangeFileNameModal";
import SendInvitesIconModal from "../Modal/SendInvitesIconModal";
import ImageDeleteModalConfirmation from "../Modal/ImageDeleteModalConfirmation";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

type Props = {
  image: IReviewImage | null;
  sideVisible: boolean;
  setSideVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageInfoDrawer = ({ image, sideVisible, setSideVisible }: Props) => {
  const { renderWorkspace } = useWorkspaceContext();
  return (
    <Drawer
      open={sideVisible}
      onClose={() => setSideVisible(false)}
      height={"100%"}
      title="Design details"
      placement={window.innerWidth < 768 ? "bottom" : "right"}
      closeIcon={
        window.innerWidth < 768 ? (
          <DoubleRightOutlined rotate={90} />
        ) : (
          <DoubleRightOutlined />
        )
      }
    >
      {image && (
        <div className="w-full">
          <Space direction="vertical" className="w-full">
            <Space className="h-[30vh] w-full items-center justify-center bg-[#141414]">
              <Image
                loading="lazy"
                className="max-h-[29vh]"
                src={image?.latestImageURL}
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
            {image?.imageDescription && (
              <Space className="mb-3 mt-5 w-full pl-2" direction="vertical">
                <Typography.Text className="font-semibold">
                  Description
                </Typography.Text>
                <div className="mb-1 h-[1px] w-full bg-[#ffffff18]" />
                <Typography.Text className="text-sm text-[#ffffff90]">
                  {image?.imageDescription}
                </Typography.Text>
              </Space>
            )}
          </Space>
          <Space className="mt-8 w-full px-2" direction="vertical">
            <Typography.Text className="font-semibold">Details</Typography.Text>
            <div className="mb-1 h-[1px] w-full bg-[#ffffff18]" />
            <Space className="w-full" direction="vertical">
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
                  {image?.totalSize && Math.round(image?.totalSize)} KB
                </Typography.Text>
              </Space>
              <Space className="w-full justify-between">
                <Typography.Text className=" text-sm text-[#ffffff90]">
                  Upload at
                </Typography.Text>
                <Typography.Text className="text-sm text-[#ffffff90]">
                  <Moment format="DD/MM/YYYY hh:mm A">{image.createdAt}</Moment>
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
            </Space>
          </Space>
          <Space className="w-full items-center justify-center p-8">
            <Button
              type="primary"
              className="mt-4 w-full"
              icon={<ExportOutlined />}
              size="large"
              onClick={() => {
                window.open(
                  `/review-design/w/${renderWorkspace?.id}/d/${image.id}`
                );
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
