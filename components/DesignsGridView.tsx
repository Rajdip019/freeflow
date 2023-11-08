import { IReviewImage } from "@/interfaces/ReviewImageData";
import React from "react";
import { Dropdown, Image, MenuProps, Tag, Typography } from "antd";
import Link from "next/link";
import Moment from "react-moment";
import Copy from "./shared/Copy";
import { APP_URL } from "@/utils/constants";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import VersionUploadModal from "./VersionControl/VersionUploadModal";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";
import ImageDeleteModalConfirmation from "./Modal/ImageDeleteModalConfirmation";

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
    <div className="relative h-64 w-64 cursor-pointer rounded-xl border border-[#181818]">
      {image.latestImageURL ? (
        <Image
          src={image.latestImageURL}
          alt={image.imageName}
          className="aspect-square w-full cursor-pointer rounded-xl object-cover"
          loading="lazy"
          preview={false}
        />
      ) : (
        <div className=" text-white">Waiting for image...</div>
      )}
      <div
        onClick={() => {
          setSideVisible(true);
          setSideImage(image);
        }}
        className="absolute left-0 top-0 flex h-64 w-64 flex-col justify-between p-2 text-white opacity-0 transition-all hover:bg-[#0000008d] hover:opacity-100"
      >
        <div className="flex items-end justify-end">
          <Tag color="red">{image.newUpdate}</Tag>
        </div>
        <div className="flex items-center justify-between">
          <Typography className="w-[15ch] truncate text-[1.1rem]">
            {image.imageName}
          </Typography>
          <Typography className="text-[0.7rem]">
            {image?.totalSize && `${Math.round(image.totalSize)} KB`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DesignsGridView;
