import {
  InputGroup,
  Input,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import classNames from "classnames";
import SendCompleteIcon from "@/components/Icons/SendCompleteIcon";
import SendIcon from "@/components/Icons/SendIcon";
import { useState } from "react";
import { validateCommaSeparatedEmails } from "@/helpers/validators";
import { formatCommaSeparatedStringToArray } from "@/helpers/formatters";
import { postJson } from "@/lib/fetch";

interface Props {
  imageId: string;
  wrapperClassName?: string;
  inputClassName?: string;
  onSuccess?: () => void;
}

const SendInvitesInput = ({
  imageId,
  wrapperClassName,
  inputClassName,
  onSuccess = () => {},
}: Props) => {
  const toast = useToast();

  const [invitesInputText, setInvitesInputText] = useState("");
  const [invitesSendStatus, setInvitesSendStatus] = useState<
    "idle" | "loading" | "done"
  >("idle");

  const handleSendInvites = async () => {
    setInvitesSendStatus("loading");
    try {
      await postJson(`/api/review-image/${imageId}/send-invites`, {
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
      onSuccess();
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
  return (
    <div className={classNames(wrapperClassName, "flex flex-col gap-2")}>
      <p>Send email invites:</p>
      <InputGroup size="md">
        <Input
          placeholder="email1@gmail.com, email2@gmail.com, etc."
          value={invitesInputText}
          name="emailInvites"
          focusBorderColor={"purple.500"}
          borderColor={"purple.500"}
          className={classNames(inputClassName, "mb-4 pr-4")}
          onChange={(e) => setInvitesInputText(e.target.value)}
        />
        <InputRightElement>
          <button
            className={classNames({
              "cursor-pointer":
                invitesInputText &&
                invitesSendStatus === "idle" &&
                validateCommaSeparatedEmails(invitesInputText),
              "cursor-not-allowed":
                invitesSendStatus === "loading" ||
                invitesSendStatus === "done" ||
                !invitesInputText ||
                !validateCommaSeparatedEmails(invitesInputText),
            })}
            disabled={
              invitesSendStatus !== "idle" ||
              !invitesInputText ||
              !validateCommaSeparatedEmails(invitesInputText)
            }
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
  );
};

export default SendInvitesInput;
