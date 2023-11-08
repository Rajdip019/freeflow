import { IReviewImage, IReviewImageVersion } from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useEffect, useState } from "react";
import ImageUploaderDropzone from "./ImageDropZones/ImageUploaderDropzone";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import ImageUploadSuccess from "./ImageUploadSuccess";
import { Button, Input, Modal, Progress, Typography, message } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
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
  const { renderWorkspace } = useWorkspaceContext();

  useEffect(() => {
    if (visible && propFile && propImage) {
      handleFileUploaded(propFile);
      setImage(propImage);
    }
  }, []);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setFileSize(file.size / 1024);
    setImageName(file.name.split(".")[file.name.split(".").length - 2]);
  };

  const clearFile = () => {
    setImage("");
    setUploadedFile(null);
    setImageName("");
    setFileSize(0);
  };

  const [uploadPercentage, setUploadPercentage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(visible);
  const workspaceId = renderWorkspace?.id;
  const uploadFile = async () => {
    if ((fileSize/1024) < 75) {
      setUploadingState("uploading");
      const docRef = doc(collection(db, `workspaces/${workspaceId}/designs`));
      const data: IReviewImage = {
        id: docRef.id,
        imageName: imageName as string,
        imageDescription: description,
        lastUpdated: Date.now(),
        newUpdate: "Uploaded",
        latestVersion: 1,
        latestImageURL: "",
        totalSize : 0,
        createdAt: Date.now(),
      };
      await setDoc(docRef, data);
      const imagePath = `designs/${workspaceId}/${
        docRef.id
      }/versions/${imageName}-${Date.now()}-v1`;
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
            setUploadPercentage(Math.round(progress));
          },
          (error) => {
            console.error(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const versionRef = doc(collection(db, `workspaces/${workspaceId}/designs/${docRef.id}/versions`));
            const versionData : IReviewImageVersion = {
              id : versionRef.id,
              version : 1,
              imageURL : downloadURL,
              imagePath : imagePath,
              size : fileSize,
              timeStamp : Date.now(),
              uploadedBy : user?.name as string,
              uploadedByEmail : authUser?.email as string,
              uploadedById : authUser?.uid as string,
            }
            await setDoc(versionRef, versionData);
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
