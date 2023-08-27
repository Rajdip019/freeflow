import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Tooltip,
  Input,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import classNames from "classnames";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

interface Props {
  image: IReviewImageData;
  isText?: boolean;
  isIcon?: boolean;
  isTooltip?: boolean;
}

const ChangeFileNameModal: React.FC<Props> = ({
  image,
  isText = false,
  isTooltip = true,
  isIcon = true,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileName, setFileName] = useState(image.imageName);
  const toast = useToast();

  const changeFileName = async () => {
    await updateDoc(doc(db, "reviewImages", image.id), {
      imageName: fileName,
    });
    toast({
      title: "File Name Changed Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const wrapperClassName = "mb-4";

  return (
    <div>
      {isTooltip ? (
        <Tooltip label={"Change File Name"}>
          <button onClick={onOpen} className=" flex w-full items-center">
            {isText && "Change File Name"}
            {isIcon && (
              <svg
                className="mt-1.5 w-6 text-gray-400 hover:text-white"
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            )}
          </button>
        </Tooltip>
      ) : (
        <button onClick={onOpen} className=" flex w-full items-center">
          {isText && "Change File Name"}
          {isIcon && (
            <svg
              className="mt-1.5 w-6 text-gray-400 hover:text-white"
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          )}
        </button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={"#475569"} color={"white"}>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-4">
              <h2 className=" font-sec mb-4 mt-8 text-center text-xl">
                Edit File Name
              </h2>
              {/* <h2 className=" text-center text-lg mb-6 font-sec font-semibold">{image.imageName}</h2> */}
              <div
                className={classNames(wrapperClassName, "flex flex-col gap-2")}
              >
                <Input
                  placeholder="File Name"
                  value={fileName}
                  name="changeFileName"
                  focusBorderColor={"purple.500"}
                  borderColor={"purple.500"}
                  bgColor={"#334155"}
                  className={"font-sec mb-4 pr-4 text-white"}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <div className="flex justify-center gap-3">
                  <button
                    className="rounded-full bg-[#334155] px-6 font-bold"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-p font-sec px-6 py-2 font-bold text-white"
                    onClick={() => {
                      changeFileName();
                      onClose();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChangeFileNameModal;
