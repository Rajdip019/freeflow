import { IReviewImageData } from "@/interfaces/ReviewImageData";
import React from "react";
import SendInvitesIconModal from "../Modal/SendInvitesIconModal";
import Copy from "../shared/Copy";
import { APP_URL } from "@/utils/constants";
import PublicAndPrivate from "./PublicAndPrivate";
import { Popconfirm, message, Tooltip, Button } from "antd";
import { FFButton } from "@/theme/themeConfig";
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useImageContext } from "@/contexts/ImagesContext";
import { useFeedbackContext } from "@/contexts/FeedbackContext";

const ReviewImageToolbarAdmin: React.FC = () => {

  const { deleteImage } = useImageContext();
  const { isCompareView, setIsCompareView, imageData, isAdmin } = useFeedbackContext();

  const confirm = async () => {
    await deleteImage(imageData as IReviewImageData);
    message.success('File Deleted');
  };


  return (
    <div className="flex items-center gap-5">
      {imageData?.imageURL[1] && (
        <Tooltip title="Toggle Comparison View">
          <FFButton className=" border-none shadow-none" icon={isCompareView ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => setIsCompareView(!isCompareView)}></FFButton>
        </Tooltip>
      )}
      <Copy value={`${APP_URL}/review-image/${imageData?.id}`} />
      {isAdmin && (
        <>
          <SendInvitesIconModal image={imageData as IReviewImageData} />
          <div className="-ml-3.5">
            <Popconfirm
              title="Do you want to delete the file?"
              description="By deleting this file you will also delete any feedback on it."
              onConfirm={async () => { await confirm() }}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <FFButton className=" border-none shadow-none" icon={<DeleteOutlined />}></FFButton>
            </Popconfirm>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewImageToolbarAdmin;
