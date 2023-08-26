import { IReviewImageData } from "@/interfaces/ReviewImageData";
import Moment from "react-moment";
import React from "react";
import Copy from "./shared/Copy";
import { APP_URL } from "@/utils/constants";
import PublicAndPrivate from "./ImageReview/PublicAndPrivate";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
} from "@chakra-ui/react";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import VersionUploadModal from "./VersionControl/VersionUploadModal";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";
import Link from "next/link";

interface Props {
  image: IReviewImageData;
}

const DesignsGridView: React.FC<Props> = ({ image }) => {
  const { onCopy } = useClipboard(
    image.isPrivate ? (image.private?.password as string) : ""
  );
  return (
    <div className="w-60 rounded-md bg-[#20232A] transition-all hover:shadow-lg hover:shadow-[#3c3f477a]">
      <Link target="_blank" rel="noreferrer" href={`/review-image/${image.id}`}>
        <img
          src={
            image.currentVersion
              ? image.imageURL[image.currentVersion - 1]
              : (image.imageURL as any)
          }
          alt=""
          className="aspect-gridImage w-full rounded object-cover "
          loading="lazy"
        />
      </Link>
      <div className="flex items-center justify-between p-2 pr-0">
        <div>
          <p className="w-[14ch] truncate text-sm text-white">
            {image.imageName}
          </p>
          <Moment className="text-[12px] text-[#94A3B8]" format="MMM Do">
            {image.timeStamp}
          </Moment>
        </div>
        <div className="flex gap-1">
          <Copy value={`${APP_URL}/review-image/${image.id}`} />
          <PublicAndPrivate image={image} isText={false} />
          {/* Mukesh we need to change this to a pop confirm deleting this modal from the codebase */}
          {/* <ImageDeleteModalConfirmation image={image} /> */}
          <Menu>
            <MenuButton>
              <svg
                className="w-6 text-gray-400 hover:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                />
              </svg>
            </MenuButton>
            <MenuList bgColor={"#475569"} border={0}>
              <p className=" px-3 py-1.5 transition-all hover:bg-purple-500">
                <ChangeFileNameModal
                  image={image}
                  isText
                  isIcon={false}
                  isTooltip={false}
                />
              </p>
              {image?.currentVersion && (
                <MenuItem
                  className=" flex w-full justify-start p-2 py-1 text-sm text-white hover:bg-purple-500"
                  bgColor={"#475569"}
                >
                  <VersionUploadModal
                    prevImage={image as IReviewImageData}
                    pos={"start"}
                  />
                </MenuItem>
              )}
              <p className=" px-3 py-1.5 transition-all hover:bg-purple-500">
                <SendInvitesIconModal
                  image={image}
                  isText={true}
                  isIcon={false}
                  isTooltip={false}
                />
              </p>
              {image?.isPrivate ? (
                <MenuItem
                  onClick={onCopy}
                  bgColor={"#475569"}
                  className=" transition-all hover:bg-purple-500"
                >
                  Copy Password
                </MenuItem>
              ) : null}
              {/* <MenuItem disabled={true} bgColor={"#475569"} className=" hover:bg-purple-500 transition-all disabled:hover:bg-[#475569]">Edit Versions</MenuItem> */}
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default DesignsGridView;
