import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useClipboard,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Moment from "react-moment";
import Copy from "./shared/Copy";
import { APP_URL } from "@/helpers/constants";
import PublicAndPrivate from "./ImageReview/PublicAndPrivate";
import ImageDeleteModalConfirmation from "./Modal/ImageDeleteModalConfirmation";
import ChangeFileNameModal from "./Modal/ChangeFileNameModal";
import SendInvitesIconModal from "./Modal/SendInvitesIconModal";
import VersionUploadModal from "./VersionControl/VersionUploadModal";

interface Props {
  image: IReviewImageData;
}

const DesignsTableRow: React.FC<Props> = ({ image }) => {
  const { onCopy } = useClipboard(
    image.isPrivate ? (image.private?.password as string) : ""
  );

  return (
    <Tr className="hover:bg-sec-black text-white" key={image.id}>
      <Td>
        <Link
          target="_blank"
          rel="noreferrer"
          href={`/review-image/${image.id}`}
          className=" flex items-center gap-4"
        >
          <img
            src={
              image.currentVersion
                ? image.imageURL[image.currentVersion - 1]
                : (image.imageURL as any)
            }
            alt=""
            className=" aspect-square w-8 rounded object-cover "
          />
          <p className="group flex items-center gap-2 truncate hover:underline">
            {image.imageName}{" "}
          </p>
          {/* <svg
            fill="none"
            className="relative z-40 w-4 cursor-pointer text-gray-400 group-hover:text-white"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg> */}
        </Link>
      </Td>
      {/* <Td isNumeric>
        <div className=" flex justify-end">
          <PublicAndPrivate image={image} isText={true} />
        </div>
      </Td> */}
      <Td isNumeric>
        <div className=" flex justify-end">
          {image.currentVersion
            ? `Version ${image.currentVersion}`
            : "Deprecated"}
          {/* <img src="/icons/version.png" alt="version" /> */}
        </div>
      </Td>
      <Td isNumeric>{image.views}</Td>
      <Td isNumeric>
        <Moment className="text-gray-400" format="MMM Do">
          {image.timeStamp}
        </Moment>
      </Td>
      <Td isNumeric>
        <div className="flex gap-3">
          <Copy value={`${APP_URL}/review-image/${image.id}`} />
          <PublicAndPrivate image={image} isText={false} />
          <ImageDeleteModalConfirmation image={image} />
          {/* <SendInvitesIconModal image={image} /> */}
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
      </Td>
    </Tr>
  );
};

export default DesignsTableRow;
