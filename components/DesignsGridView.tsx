import { IReviewImage } from "@/interfaces/ReviewImageData";
import React from "react";
import {
  Button,
  Dropdown,
  Image,
  MenuProps,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import VersionUploadModal from "./VersionControl/VersionUploadModal";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";
import ImageDeleteModalConfirmation from "./Modal/ImageDeleteModalConfirmation";
import { MoreOutlined } from "@ant-design/icons";

interface Props {
  image: IReviewImage;
  setSideImage: React.Dispatch<React.SetStateAction<IReviewImage | null>>;
  setSideVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesignsGridView: React.FC<Props> = ({
  image,
  setSideImage,
  setSideVisible,
}) => {
  return (
    <div className="relative flex w-[47%] cursor-pointer items-center justify-center rounded-xl border border-[#181818] md:h-64 md:w-64">
      {image.latestImageURL ? (
        <Image
          src={image.latestImageURL}
          alt={image.imageName}
          className="aspect-square w-full cursor-pointer rounded-xl object-cover"
          loading="lazy"
          preview={false}
          onClick={
            image.latestImageURL
              ? () => {
                  setSideVisible(true);
                  setSideImage(image);
                }
              : () => {}
          }
        />
      ) : (
        <Space direction="vertical" className="items-center justify-center">
          <Skeleton.Image active />
          <Typography.Text className="text-white">
            {image.imageName} Loading..
          </Typography.Text>
        </Space>
      )}
      <div
        onClick={() => {
          setSideImage(image);
          setSideVisible(true);
        }}
        className="absolute left-0 top-0 hidden w-[47%] flex-col justify-between p-2 text-white opacity-0 transition-all hover:bg-[#0000008d] hover:opacity-100 md:flex md:h-64 md:w-64"
      >
        <div className="flex items-end justify-end">
          <Tag color="red">{image.newUpdate}</Tag>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Typography className="w-[15ch] truncate text-[1.1rem]">
              {image.imageName}
            </Typography>
            <Typography className="text-[0.7rem]">
              {image?.totalSize && `${Math.round(image.totalSize)} KB`}
            </Typography>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignsGridView;
