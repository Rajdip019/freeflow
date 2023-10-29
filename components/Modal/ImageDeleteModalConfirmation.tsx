import { useImageContext } from "@/contexts/ImagesContext";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { DeleteOutlined } from "@ant-design/icons";
import { Modal, Space, Typography } from "antd";
import React from "react";

interface Props {
  image: IReviewImageData;
  onlyIcon?: boolean;
}

const ImageDeleteModalConfirmation: React.FC<Props> = ({ image, onlyIcon }) => {
  const { deleteImage } = useImageContext();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      {onlyIcon ? (
        <DeleteOutlined onClick={() => setOpen(true)} />
      ) : (
        <Space onClick={() => setOpen(true)}>
          <DeleteOutlined />
          <Typography className="text-white">Delete design</Typography>
        </Space>
      )}

      <Modal
        open={open}
        okText="Delete"
        onOk={async () => {
          await deleteImage(image);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      >
        <div className="flex flex-col items-center justify-center">
          <Typography.Text className=" font-sec mb-6 mt-8 text-center text-xl text-white">
            Are you sure tou want to delete <br />{" "}
            <span className=" font-semibold">{image.imageName} </span>?
          </Typography.Text>
          <div className=" mb-6 flex w-10/12 justify-center">
            <div className=" w-1 bg-red-500"></div>
            <div className="font-sec bg-[#FECDD3] px-3 py-2">
              <Typography.Text className="text-lg font-bold text-red-700">
                Warning
              </Typography.Text>
              <Typography.Paragraph className=" text-black">
                By deleting this file you will also delete any feedback on it{" "}
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageDeleteModalConfirmation;
