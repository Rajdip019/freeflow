import { IReviewImage } from "@/interfaces/ReviewImageData";

import React, { useState } from "react";
import classNames from "classnames";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { Input, Modal, Tooltip, Typography, message } from "antd";
import { SwapOutlined } from "@ant-design/icons";

interface Props {
  image: IReviewImage;
}

const ChangeFileNameModal: React.FC<Props> = ({ image }) => {
  const [fileName, setFileName] = useState(image.imageName);
  const [open, setOpen] = useState<boolean>(false);
  const changeFileName = async () => {
    try {
      await updateDoc(doc(db, "reviewImages", image.id), {
        imageName: fileName,
      });
      setOpen(false);
      message.success("File name changed successfully");
    } catch (err) {
      message.error(
        "There was an error changing file name. Please try again or contact us for support."
      );
    }
  };

  return (
    <div>
      <Typography.Text onClick={() => setOpen(true)}>
        {" "}
        <SwapOutlined size={10} className="mr-2" /> {"Change File Name"}
      </Typography.Text>

      <Modal
        title="Change File Name"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={changeFileName}
        okText="Save"
      >
        <div className="my-4">
          <Input
            placeholder="File Name"
            value={fileName}
            name="changeFileName"
            className={"font-sec mb-4 pr-4 text-white"}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChangeFileNameModal;
