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
import SendIcon from "../Icons/SendIcon";
import { isEmpty } from "lodash-es";
import { formatCommaSeparatedStringToArray } from "@/helpers/formatters";
import { validateCommaSeparatedEmails } from "@/helpers/validators";
import { postJson } from "@/lib/fetch";
import classNames from "classnames";
import SendCompleteIcon from "../Icons/SendCompleteIcon";

interface Props {
  image: IReviewImageData;
  isText?: boolean;
  isIcon?: boolean;
  isTooltip?: boolean;
}

const ImageDeleteModalConfirmation: React.FC<Props> = ({
  image,
  isText = false,
  isTooltip = true,
  isIcon = true,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [invitesInputText, setInvitesInputText] = useState("");
  const [invitesSendStatus, setInvitesSendStatus] = useState<
    "idle" | "loading" | "done"
  >("idle");
  const toast = useToast();

  const handleSendInvites = async () => {
    setInvitesSendStatus("loading");
    try {
      await postJson(`/api/review-image/${image.id}/send-invites`, {
        emails: formatCommaSeparatedStringToArray(invitesInputText),
      });
      setInvitesSendStatus("done");
      setTimeout(() => {
        setInvitesSendStatus("idle");
      }, 3000);
      toast({
        title: "Invites sent successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      onClose();
    } catch (err) {
      setInvitesSendStatus("idle");
      toast({
        title:
          "There was an error sending invites. Please try again or contact us for support.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const wrapperClassName = "mb-4";

  console.log(image.id);

  return (
    <div>
      {isTooltip ? (
        <Tooltip label={"Send email invites"}>
          <button onClick={onOpen} className=" flex w-full items-center">
            {isText && "Send Email Invites"}
            {isIcon && (
              <SendIcon className="mt-1.5 w-5 text-gray-400 hover:text-white" />
            )}
          </button>
        </Tooltip>
      ) : (
        <button onClick={onOpen} className=" flex w-full items-center">
          {isText && "Send Email Invites"}
          {isIcon && (
            <SendIcon className="mt-1.5 w-5 text-gray-400 hover:text-white" />
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
                Send email invites
              </h2>
              {/* <h2 className=" text-center text-lg mb-6 font-sec font-semibold">{image.imageName}</h2> */}
              <div
                className={classNames(wrapperClassName, "flex flex-col gap-2")}
              >
                <InputGroup size="md">
                  <Input
                    placeholder="email1@gmail.com, email2@gmail.com, etc."
                    value={invitesInputText}
                    name="emailInvites"
                    focusBorderColor={"purple.500"}
                    borderColor={"purple.500"}
                    bgColor={"#334155"}
                    className={"font-sec mb-4 pr-4 text-white"}
                    onChange={(e) => setInvitesInputText(e.target.value)}
                  />
                </InputGroup>
                <div className="flex justify-center gap-3">
                  <button
                    className="rounded-full bg-[#334155] px-6 font-bold"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className={classNames(
                      {
                        "cursor-pointer":
                          invitesInputText &&
                          invitesSendStatus === "idle" &&
                          validateCommaSeparatedEmails(invitesInputText),
                        "cursor-not-allowed":
                          invitesSendStatus === "loading" ||
                          invitesSendStatus === "done" ||
                          !invitesInputText ||
                          !validateCommaSeparatedEmails(invitesInputText),
                      },
                      "w-fit"
                    )}
                    disabled={
                      invitesSendStatus !== "idle" ||
                      !invitesInputText ||
                      !validateCommaSeparatedEmails(invitesInputText)
                    }
                    onClick={handleSendInvites}
                  >
                    {["idle", "loading"].includes(invitesSendStatus) && (
                      <p
                        className={classNames(
                          "btn-p font-sec px-6 py-2 font-bold text-white",
                          {
                            "animate-pulse": invitesSendStatus === "loading",
                          }
                        )}
                      >
                        Send
                      </p>
                    )}
                    {invitesSendStatus === "done" && (
                      <SendCompleteIcon className="h-5 w-5 text-purple-500" />
                    )}
                  </button>
                </div>
              </div>
              {!isEmpty(image.sentEmailInvites) && (
                <div className="mt-4  text-center">
                  <p className=" mt-5 font-semibold">
                    Invites have already been sent to:
                  </p>
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
