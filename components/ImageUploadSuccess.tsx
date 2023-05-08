import { APP_URL } from "@/helpers/constants";
import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import ClipboardCopiedIcon from "@/components/Icons/ClipboardCopiedIcon";
import ClipboardIcon from "@/components/Icons/ClipboardIcon";
import SendIcon from "@/components/Icons/SendIcon";
import SendCompleteIcon from "@/components/Icons/SendCompleteIcon";
import classNames from "classnames";

interface Props {
  imageId: string;
  setUploadingState: React.Dispatch<
    React.SetStateAction<"error" | "success" | "not-started" | "uploading">
  >;
  clearFile: () => any;
  mode: "dark" | "light";
  password?: string;
}

const ImageUploadSuccess: React.FC<Props> = ({
  imageId,
  setUploadingState,
  clearFile,
  mode,
  password = "",
}) => {
  const toast = useToast();

  const reviewImageUrl = `${APP_URL}/review-image/${imageId}`;
  const { onCopy: onCopyImageUrl, hasCopied: hasCopiedImageUrl } =
    useClipboard(reviewImageUrl);
  const { onCopy: onCopyPassword, hasCopied: hasCopiedPassword } =
    useClipboard(password);
  const [invitesInputText, setInvitesInputText] = useState("");
  const [invitesSendStatus, setInvitesSendStatus] = useState<
    "idle" | "loading" | "done"
  >("idle");

  const handleSendInvites = async () => {
    setInvitesSendStatus("loading");
    setTimeout(() => {
      setInvitesSendStatus("done");
      toast({
        title: "Invites sent successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }, 2000);
    setTimeout(() => {
      setInvitesSendStatus("idle");
    }, 4000);
  };

  return (
    <div>
      <div
        className={`mb-6 flex items-center justify-center gap-3 text-center ${
          mode === "dark" ? "text-white" : "text-black"
        } `}
      >
        <p className="text-2xl font-semibold">Done! Ready to get feedback?</p>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <p>Send email invites:</p>
        <InputGroup size="md">
          <Input
            placeholder="email1@gmail.com, email2@gmail.com, etc."
            value={invitesInputText}
            name="emailInvites"
            focusBorderColor={"purple.500"}
            borderColor={"purple.500"}
            className={classNames("mb-4 pr-4", {
              "text-white": mode === "dark",
              "text-black": mode === "light",
            })}
            onChange={(e) => setInvitesInputText(e.target.value)}
          />
          <InputRightElement>
            <button
              className={classNames({
                "cursor-pointer": invitesSendStatus === "idle",
                "cursor-not-allowed":
                  invitesSendStatus === "loading" ||
                  invitesSendStatus === "done",
              })}
              onClick={handleSendInvites}
            >
              {["idle", "loading"].includes(invitesSendStatus) && (
                <SendIcon
                  className={classNames(
                    "h-5 w-5 text-purple-500 hover:text-gray-500",
                    {
                      "animate-pulse": invitesSendStatus === "loading",
                    }
                  )}
                />
              )}
              {invitesSendStatus === "done" && (
                <SendCompleteIcon className="h-5 w-5 text-purple-500" />
              )}
            </button>
          </InputRightElement>
        </InputGroup>
      </div>
      <div className="my-4 flex flex-col gap-2">
        <p
          className={classNames("text-center text-2xl", {
            "text-gray-400": mode === "dark",
            "text-gray-500": mode === "light",
          })}
        >
          OR
        </p>
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <p>Share the link:</p>
        <InputGroup size="md">
          <Input
            value={reviewImageUrl}
            disabled
            name="url"
            focusBorderColor={"purple.500"}
            borderColor={"purple.500"}
            className={classNames("mb-4 pr-4", {
              "text-white": mode === "dark",
              "text-black": mode === "light",
            })}
          />
          <InputRightElement>
            <button onClick={() => onCopyImageUrl()}>
              {hasCopiedImageUrl ? (
                <ClipboardCopiedIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ClipboardIcon className="h-5 w-5 cursor-pointer text-purple-500 hover:text-gray-500" />
              )}
            </button>
          </InputRightElement>
        </InputGroup>
      </div>
      {password && (
        <div className="mb-4 flex flex-col gap-2">
          <p>Password:</p>
          <InputGroup size="md">
            <Input
              value={password}
              disabled
              name="password"
              focusBorderColor={"purple.500"}
              borderColor={"purple.500"}
              className={classNames("mb-4 pr-4", {
                "text-white": mode === "dark",
                "text-black": mode === "light",
              })}
              resize={"none"}
            />
            <InputRightElement>
              <button onClick={() => onCopyPassword()}>
                {hasCopiedPassword ? (
                  <ClipboardCopiedIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ClipboardIcon className="h-5 w-5 cursor-pointer text-purple-500 hover:text-gray-500" />
                )}
              </button>
            </InputRightElement>
          </InputGroup>
        </div>
      )}
      <div className="flex flex-col items-center">
        <button
          className="btn-p py-2"
          onClick={() => {
            setUploadingState("not-started"), clearFile();
          }}
        >
          Upload Another Design
        </button>
      </div>
    </div>
  );
};

export default ImageUploadSuccess;
