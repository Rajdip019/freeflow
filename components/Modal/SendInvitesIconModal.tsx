import { IReviewImageData } from "@/interfaces/ReviewImageData";
import React, { useState } from "react";
import { isEmpty } from "lodash-es";
import { formatCommaSeparatedStringToArray } from "@/utils/formatters";
import { postJson } from "@/lib/fetch";
import { SendOutlined } from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";
import { Tooltip, Input, message, Modal, Typography } from "antd";

interface Props {
  image: IReviewImageData;
  isTooltip?: boolean;
  isMenuItem?: boolean;
  type?: "text" | "icon" | "both";
}

const SendInvitesIconModal: React.FC<Props> = ({
  image,
  isTooltip = true,
  isMenuItem = false,
  type = "icon",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [invitesInputText, setInvitesInputText] = useState("");

  const handleSendInvites = async () => {
    try {
      const _emails = formatCommaSeparatedStringToArray(invitesInputText);
      console.log("_emails", _emails);
      await postJson(`/api/review-image/${image.id}/send-invites`, {
        emails: _emails,
      });
      message.success("Invites sent successfully");
      setIsModalOpen(false);
    } catch (err) {
      message.error(
        "There was an error sending invites. Please try again or contact us for support."
      );
    }
  };

  return (
    <div>
      {!isMenuItem ? (
        isTooltip ? (
          <Tooltip title={"Send email invites"}>
            <FFButton
              onClick={showModal}
              className=" flex w-full border-none shadow-none"
            >
            {type === "text" && "Send Invites"}
            {type === "icon" && <SendOutlined />}
            </FFButton>
          </Tooltip>
        ) : (
          <FFButton
            onClick={showModal}
            className=" flex w-full border-none shadow-none"
          >
            {type === "text" && "Send Invites"}
            {type === "icon" && <SendOutlined />}
          </FFButton>
        )
      ) : (
        <Typography.Text onClick={showModal} className="gap-2">
          <SendOutlined className="mr-2" />
          {"Send Invites"}
        </Typography.Text>
      )}

      <Modal
        title="Send email invites"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSendInvites}
        okText="Send"
      >
        <div className="my-4">
          <Input
            placeholder="email1@gmail.com, email2@gmail.com, etc."
            value={invitesInputText}
            name="emailInvites"
            className={"font-sec mb-4 pr-4 text-white"}
            onChange={(e) => setInvitesInputText(e.target.value)}
          />
        </div>
        {!isEmpty(image.sentEmailInvites) && (
          <div className="mt-4">
            <Typography.Text className=" mt-5 font-semibold">
              Invites have already been sent to:
            </Typography.Text>
            <ul className="list-inside">
              {image.sentEmailInvites?.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SendInvitesIconModal;
