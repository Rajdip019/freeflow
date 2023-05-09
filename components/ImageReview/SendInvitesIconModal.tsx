import { IReviewImageData } from "@/interfaces/ReviewImageData";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import SendInvitesInput from "@/components/ImageReview/SendInvitesInput";
import SendIcon from "../Icons/SendIcon";
import { isEmpty } from "lodash-es";
import { useImageContext } from "@/contexts/ImagesContext";

interface Props {
  image: IReviewImageData;
}

const ImageDeleteModalConfirmation: React.FC<Props> = ({ image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Tooltip label={"Send email invites"}>
        <button onClick={onOpen}>
          <SendIcon className="h-5 w-5 text-gray-400 hover:text-white" />
        </button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={"gray.800"} color={"white"}>
          <ModalHeader>File: {image.imageName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-4">
              <SendInvitesInput
                imageId={image.id}
                onSuccess={() => {
                  onClose();
                }}
              />
              {!isEmpty(image.sentEmailInvites) && (
                <div className="mt-4">
                  Invites have already been sent to:
                  <ul className="list-inside">
                    {image.sentEmailInvites?.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ImageDeleteModalConfirmation;
