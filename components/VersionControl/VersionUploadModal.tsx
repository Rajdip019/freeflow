import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import ImageUploaderDropzone from "../ImageDropZones/ImageUploaderDropzone";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useImageContext } from "@/contexts/ImagesContext";
import { Button, Modal, Typography, message } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";

interface Props {
  prevImage: IReviewImageData;
  pos: "start" | "mid" | "end";
  isText?: boolean;
  isMenu?: boolean;
}

const VersionUploadModal: React.FC<Props> = ({
  prevImage,
  pos,
  isText = true,
  isMenu = false,
}) => {
  const [imageName, setImageName] = useState<string>();
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [image, setImage] = useState<string | null>(null);
  const [uploadingState, setUploadingState] = useState<
    "not-started" | "uploading" | "success" | "error"
  >("not-started");
  const [uploadedImageId, setUploadedImageId] = useState<string>("{imageId}");
  const [fileSize, setFileSize] = useState<number>(0);
  const { user } = useUserContext();
  const { authUser } = useAuth();
  const { storage: storageUsed } = useImageContext();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setFileSize(Math.round(file.size / (1024 * 1024)));
    setImageName(file.name);
  };

  const clearFile = () => {
    setImage("");
    setUploadedFile(null);
    setImageName("");
  };

  const [uploadPercentage, setUploadPercentage] = useState<number>(0);

  const uploadFile = async () => {
    setConfirmLoading(true);
    if (fileSize < 75) {
      setUploadingState("uploading");
      const docRef = doc(db, "reviewImages", prevImage.id);
      const workspaceId = localStorage.getItem("currentWorkspaceId");
      const imagePath = `designs/${workspaceId}/${
        docRef.id
      }/${imageName}_${Date.now()}_v${prevImage.currentVersion + 1}`;
      try {
        const storageRef = ref(storage, imagePath);
        let bytes: number = 0;
        const uploadTask = uploadBytesResumable(
          storageRef,
          uploadedFile as File
        );
        uploadTask.on(
          "state_changed",
          (snapshot: { bytesTransferred: number; totalBytes: number }) => {
            bytes = snapshot.totalBytes;
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadPercentage(progress);
          },
          (error) => {
            console.error(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const data: Partial<IReviewImageData> = {
              imageURL: [...prevImage.imageURL, downloadURL],
              size: (prevImage.size as number) + bytes / (1024 * 1024),
              lastUpdated: Date.now(),
              newUpdate: "New Version Uploaded",
              currentVersion: prevImage.currentVersion + 1,
              imagePath: [...prevImage.imagePath, imagePath],
            };

            await updateDoc(docRef, data);
            message.success("Version updated successfully");
            setOpen(false);
            setUploadedImageId(docRef.id);
            setConfirmLoading(false);
          }
        );
      } catch (error) {
        message.error("Something went wrong. Please try again");
        setUploadingState("error");
        setConfirmLoading(false);
      }
    } else {
      message.error(
        "File size is too large. Please upload a file less than 75 MB"
      );
      setConfirmLoading(false);
    }
  };

  return (
    <>
      {!isMenu ? (
        <Typography.Text
          onClick={() => {
            showModal();
            clearFile();
            setUploadingState("not-started");
          }}
          className={`hidden w-full items-center gap-2 hover:text-white ${
            pos === "start" && "md:flex"
          } ${pos === "mid" && "md:block"} ${
            pos === "end" && "md: justify-end"
          } md:block`}
        >
          <PlusOutlined />
          {isText && <Typography.Text>Upload new version</Typography.Text>}
        </Typography.Text>
      ) : (
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            showModal();
            clearFile();
            setUploadingState("not-started");
          }}
          size="small"
        />
      )}

      <Modal
        title="Upload new Version"
        open={open}
        onCancel={() => {
          setOpen(false), clearFile();
        }}
        okText="Upload"
        onOk={uploadFile}
        okButtonProps={{ loading: confirmLoading, disabled: !uploadedFile }}
      >
        <div className="mx-auto my-6 rounded-2xl text-white  md:mx-0 ">
          {(uploadingState === "not-started" ||
            uploadingState === "uploading") && (
            <>
              {image && (
                <div className=" flex justify-end">
                  <CloseOutlined
                    onClick={() => {
                      clearFile();
                    }}
                  />
                </div>
              )}
              <div className=" mt-2 cursor-pointer">
                <ImageUploaderDropzone
                  onFileUploaded={handleFileUploaded}
                  image={image}
                  setImage={setImage}
                />
              </div>
            </>
          )}
          {uploadingState === "error" && (
            <div className=" flex w-full flex-col items-center justify-center">
              <Typography.Text className=" text-center text-xl font-semibold text-red-500">
                Some error occurred
              </Typography.Text>
              <FFButton
                className="mt-5"
                type="primary"
                onClick={() => setUploadingState("not-started")}
              >
                Try again
              </FFButton>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default VersionUploadModal;
