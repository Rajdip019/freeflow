import classNames from "classnames";
import { useState } from "react";
import { validateCommaSeparatedEmails } from "@/utils/validators";
import { formatCommaSeparatedStringToArray } from "@/utils/formatters";
import { postJson } from "@/lib/fetch";
import { Button, Input, Space, message } from "antd";

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
      message.success("Invites sent!");
      onSuccess();
    } catch (err) {
      setInvitesSendStatus("idle");
      message.error("Error sending invites");
    }
  };
  return (
    <div className={classNames(wrapperClassName, "flex flex-col gap-2")}>
      <p>Send email invites:</p>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="email1@gmail.com, email2@gmail.com, etc."
          value={invitesInputText}
          name="emailInvites"
          color={"purple"}
          className={classNames(inputClassName, "mb-4 pr-4")}
          onChange={(e) => setInvitesInputText(e.target.value)}
          size="large"
        />
        <Button
          size="large"
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
          Send
        </Button>
      </Space.Compact>
    </div>
  );
};

export default SendInvitesInput;
