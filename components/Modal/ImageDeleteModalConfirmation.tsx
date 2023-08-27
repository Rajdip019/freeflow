import { useImageContext } from "@/contexts/ImagesContext";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { Typography } from "antd";
import React from "react";

interface Props {
  image: IReviewImageData;
  onlyText?: boolean;
}

const ImageDeleteModalConfirmation: React.FC<Props> = ({ image, onlyText }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteImage } = useImageContext();

  return (
    <div>
      <Tooltip label="Delete">
        <button onClick={onOpen}>
          {onlyText ? (
            <Typography className="text-white">Delete design</Typography>
          ) : (
            <svg
              className="mt-1 w-5 cursor-pointer text-gray-400 hover:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          )}
        </button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent bgColor={"#475569"} color={"white"}>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <div className="flex flex-col items-center justify-center pb-8">
            <h4 className=" font-sec mb-6 mt-8 text-center text-xl text-white">
              Are you sure tou want to delete <br />{" "}
              <span className=" font-semibold">{image.imageName} </span>?
            </h4>
            <div className=" mb-6 flex w-10/12 justify-center">
              <div className=" w-1 bg-red-500"></div>
              <div className="font-sec bg-[#FECDD3] px-3 py-2">
                <p className="font-bold text-red-700">Warning</p>
                <p className=" text-black">
                  By deleting this file you will also delete any feedback on it{" "}
                </p>
              </div>
            </div>
            <div className=" flex gap-3">
              <button
                className="rounded-full bg-[#334155] px-6 font-bold"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteImage(image);
                  onClose();
                }}
                className=" font-sec rounded-full bg-red-500 px-6 py-2 font-bold text-white transition-all hover:bg-red-600"
              >
                Delete it
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ImageDeleteModalConfirmation;
