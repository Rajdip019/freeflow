import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import ImageUploaderDropzone from "./ImageDropZones/ImageUploaderDropzone";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useImageContext } from "@/contexts/ImagesContext";
import ImageUploadSuccess from "./ImageUploadSuccess";
import { newReviewImageEvent } from "@/lib/events";
import {
  Button,
  Input,
  Modal,
  Progress,
  Space,
  Typography,
  message,
} from "antd";
import { CloseOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";

const ImageUploadModal = () => {
  const [imageName, setImageName] = useState<string>();
  const [password, setPassword] = useState<string>("");
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

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setFileSize(Math.round(file.size / (1024 * 1024)));
    setImageName(file.name);
    console.log("File uploaded:", file);
  };

  const clearFile = () => {
    setImage("");
    setUploadedFile(null);
    setImageName("");
    setPassword("");
  };

  const [uploadPercentage, setUploadPercentage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const uploadFile = () => {
    if (fileSize < 75) {
      if (user?.storage) {
        if (storageUsed <= user.storage) {
          setUploadingState("uploading");
          try {
            const storageRef = ref(
              storage,
              `reviewImages/${authUser?.uid}/public/${imageName}_${Date.now()}`
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

                const docRef = doc(collection(db, "reviewImages"));

                const data: IReviewImageData = {
                  id: docRef.id,
                  imageURL: [downloadURL],
                  uploadedBy: user?.name as string,
                  uploadedByEmail: authUser?.email ?? "",
                  uploadedById: authUser?.uid,
                  timeStamp: Date.now(),
                  imageName: imageName as string,
                  size: bytes / (1024 * 1024),
                  views: 0,
                  threads: 0,
                  lastUpdated: Date.now(),
                  newUpdate: "Uploaded",
                  isPrivate: Boolean(password),
                  currentVersion: 1,
                };

                await setDoc(docRef, data);
                await setDoc(
                  doc(db, "reviewImages", docRef.id, "private/password"),
                  {
                    password,
                  }
                );
                message.success("Image uploaded successfully");
                newReviewImageEvent(data);
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

  //generate random password
  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          clearFile();
          setUploadingState("not-started");
        }}
        size="large"
        icon={<UploadOutlined />}
      >
        Upload
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
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
                      placeholder="Enter photo title"
                      maxLength={24}
                      size="middle"
                      allowClear
                    />
                  </div>
                  <div className="mt-5">
                    <Typography.Text className="mb-2 text-sm text-gray-500">
                      Password (optional)
                    </Typography.Text>
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        type="text"
                        color="purple"
                        placeholder="Enter a password for image review"
                        size="middle"
                        allowClear
                      />
                      <Button
                        type="primary"
                        color="purple"
                        onClick={generatePassword}
                        icon={<SyncOutlined />}
                        size="middle"
                      >
                        Generate
                      </Button>
                    </Space.Compact>
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
                    shape="round"
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
              password={password}
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
