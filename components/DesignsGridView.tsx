import { IReviewImageData } from "@/interfaces/ReviewImageData";
import Moment from "react-moment";
import React from "react";
import Copy from "./shared/Copy";
import { APP_URL } from "@/utils/constants";
import Link from "next/link";
import { Dropdown, Image, MenuProps, Tag, Typography } from "antd";
import VersionUploadModal from "./VersionControl/VersionUploadModal";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import ImageDeleteModalConfirmation from "./Modal/ImageDeleteModalConfirmation";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";

interface Props {
  image: IReviewImageData;
  setSideImage: React.Dispatch<React.SetStateAction<IReviewImageData | null>>;
}

const DesignsGridView: React.FC<Props> = ({ image, setSideImage }) => {
  // const items: MenuProps["items"] = [
  //   {
  //     key: "1",

  //     label: <ChangeFileNameModal image={image} />,
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <VersionUploadModal
  //         prevImage={image as IReviewImageData}
  //         pos={"start"}
  //       />
  //     ),
  //   },
  //   {
  //     key: "3",
  //     label: (
  //       <SendInvitesIconModal
  //         image={image}
  //         type="text"
  //         isTooltip={false}
  //         isMenuItem={true}
  //       />
  //     ),
  //   },
  //   {
  //     key: "4",
  //     label: <ImageDeleteModalConfirmation image={image} />,
  //   },
  // ];
  return (
    <div className="relative h-64 w-64 rounded-xl border border-[#181818]">
      {image.currentVersion && image.imageURL ? (
        <Image
          src={
            image.currentVersion
              ? image.imageURL[image.currentVersion - 1]
              : (image.imageURL as any)
          }
          alt={image.imageName}
          className="aspect-square w-full cursor-pointer rounded-xl object-cover"
          loading="lazy"
          preview={false}
          onClick={() => setSideImage(image)}
        />
      ) : (
        <div className=" text-white">Waiting for image...</div>
      )}
      {/* <div className="absolute left-0 top-0 flex h-64 w-64 flex-col justify-between p-2 text-white opacity-0 transition-all hover:bg-[#0000008d] hover:opacity-100">
        <div className="flex items-end justify-end">
          <Tag color="red">{image.newUpdate}</Tag>
        </div>
        <div className="flex items-center justify-between">
          <Link
            target="_blank"
            rel="noreferrer"
            href={`/review-image/${image.id}`}
          >
            <div>
              <Typography className="w-[15ch] truncate text-[1.1rem]">
                {image.imageName.includes(".")
                  ? image.imageName.split(".")[0]
                  : image.imageName}
              </Typography>
              <Typography className="text-[0.7rem]">
                {image?.size && `${Math.round(image.size * 1024)} KB`} {" • "}
                <Moment className="text-gray-400" format="MMM Do">
                  {image.timeStamp}
                </Moment>
              </Typography>
            </div>
          </Link>
          <div className="flex">
            <div className="scale-75 cursor-pointer rounded-full bg-black p-2">
              <Copy value={`${APP_URL}/review-image/${image.id}`} />
            </div>
            <div className="scale-75 cursor-pointer rounded-full bg-black p-2">
              <Dropdown menu={{ items }}>
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
              </Dropdown>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DesignsGridView;
