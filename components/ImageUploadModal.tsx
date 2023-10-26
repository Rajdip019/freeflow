import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useEffect, useState } from "react";
import ImageUploaderDropzone from "./ImageDropZones/ImageUploaderDropzone";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useImageContext } from "@/contexts/ImagesContext";
import ImageUploadSuccess from "./ImageUploadSuccess";
import { Button, Input, Modal, Progress, Typography, message } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
const { TextArea } = Input;

interface Props {
  visible?: boolean;
  propFile?: File;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  propImage?: string;
}

const ImageUploadModal = ({
  visible = false,
  propFile,
  setShowModal,
  propImage,
}: Props) => {
  const [imageName, setImageName] = useState<string>();
  const [description, setDescription] = useState<string>("");
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

  useEffect(() => {
    if (visible && propFile && propImage) {
      handleFileUploaded(propFile);
      setImage(propImage);
    }
  }, []);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setFileSize(Math.round(file.size / (1024 * 1024)));
    setImageName(file.name.split(".")[file.name.split(".").length - 2]);
    console.log("File uploaded:", file);
  };

  const clearFile = () => {
    setImage("");
    setUploadedFile(null);
    setImageName("");
  };

  const [uploadPercentage, setUploadPercentage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(visible);
  const uploadFile = async () => {
    if (fileSize < 75) {
      if (user?.storage) {
        if (storageUsed <= user.storage) {
          setUploadingState("uploading");
          const docRef = doc(collection(db, "reviewImages"));
          const data: Partial<IReviewImageData> = {
            id: docRef.id,
            uploadedBy: user?.name as string,
            uploadedByEmail: authUser?.email ?? "",
            uploadedById: authUser?.uid,
            timeStamp: Date.now(),
            imageName: imageName as string,
            imageDescription: description,
            views: 0,
            threads: 0,
            lastUpdated: Date.now(),
            newUpdate: "Uploaded",
            isPrivate: false,
            currentVersion: 1,
          };
          await setDoc(docRef, data)
          const imagePath = `reviewImages/${authUser?.uid}/${docRef.id}/versions/${imageName}_${Date.now()}`;
          try {
            const storageRef = ref(
              storage,
              imagePath
            );
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
                setUploadPercentage(Math.round(progress));
              },
              (error) => {
                console.error(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                console.log("File available at", downloadURL);
                const data: Partial<IReviewImageData> = {
                  imageURL: [downloadURL],
                  size: bytes / (1024 * 1024),
                  lastUpdated: Date.now(),
                  newUpdate: "Uploaded",
                  imagePath: [imagePath]
                };
                await updateDoc(docRef, data);
                message.success("Image uploaded successfully");
                setUploadingState("success");
                setUploadedImageId(docRef.id);
              }
            );
          } catch (error) {
            message.error("Some error occurred");
            setUploadingState("error");
          }
        } else {
          message.error("You have exceeded your storage limit");
        }
      }
    } else {
      message.error("File size should be less than 75MB");
    }
  };

  return (
    <>
      {!visible && (
        <Button
          onClick={() => {
            setOpen(true);
            clearFile();
            setUploadingState("not-started");
          }}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
        >
          Upload
        </Button>
      )}
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setShowModal && setShowModal(false);
        }}
        footer={null}
        title="Upload Design"
      >
        <div className="mx-auto rounded-2xl pb-4 text-white  md:mx-0 ">
          {(uploadingState === "not-started" ||
            uploadingState === "uploading") && (
            <>
              {image && (
                <div className=" flex justify-end">
                  <CloseOutlined
                    onClick={() => {
                      clearFile();
                    }}
                    className="cursor-pointer text-2xl"
                  />
                </div>
              )}
              <div className=" mt-6 cursor-pointer">
                <ImageUploaderDropzone
                  onFileUploaded={handleFileUploaded}
                  image={image}
                  setImage={setImage}
                />
              </div>
              {image && (
                <>
                  <div className="mt-5">
                    <Typography.Text className=" mb-2 text-sm text-gray-500">
                      Title
                    </Typography.Text>
                    <Input
                      value={imageName?.substring(0, 24)}
                      onChange={(e) => {
                        setImageName(e.target.value);
                      }}
                      type="text"
                      color="purple"
                      placeholder="Enter design title"
                      maxLength={24}
                      size="middle"
                      allowClear
                      className="mb-4"
                    />
                    <Typography.Text className=" mb-2 text-sm text-gray-500">
                      Description (optional)
                    </Typography.Text>
                    <TextArea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      color="purple"
                      placeholder="Enter design description"
                      maxLength={100}
                      size="middle"
                      allowClear
                    />
                  </div>
                </>
              )}
              <div>
                {uploadingState === "uploading" && (
                  <div className="mt-5 flex w-full items-center justify-center">
                    <Progress
                      type="circle"
                      percent={uploadPercentage}
                      width={50}
                    />
                    <Typography.Text className="ml-5 text-lg">
                      Uploading file....
                    </Typography.Text>
                  </div>
                )}
                {uploadingState === "not-started" && (
                  <Button
                    disabled={!!!image || !!!imageName}
                    type="primary"
                    className="mt-6 w-full"
                    size="large"
                    onClick={uploadFile}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </>
          )}
          {uploadingState === "success" && (
            <ImageUploadSuccess
              imageId={uploadedImageId}
              setUploadingState={setUploadingState}
              clearFile={clearFile}
              mode="dark"
            />
          )}
          {uploadingState === "error" && (
            <div className=" flex w-full flex-col items-center justify-center">
              <Typography.Text className=" text-center text-xl font-semibold text-red-500">
                Some error occurred
              </Typography.Text>
              <Button
                type="primary"
                className="mt-5"
                color="purple"
                onClick={() => setUploadingState("not-started")}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ImageUploadModal;
