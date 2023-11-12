import {
  IReviewImage,
  IReviewImageVersion,
} from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import ImageUploaderDropzone from "../ImageDropZones/ImageUploaderDropzone";
import { Button, Modal, Typography, message } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { FFButton } from "@/theme/themeConfig";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getPlan } from "@/utils/plans";

interface Props {
  prevImage: IReviewImage;
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
  const [fileSize, setFileSize] = useState<number>(0);
  const router = useRouter();
  const { workspaceId, designId } = router.query;
  const { renderWorkspace, currentUserInWorkspace } = useWorkspaceContext();
  const workspace_id = workspaceId || renderWorkspace?.id;
  const image_id = designId || prevImage.id;

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { user } = useUserContext();
  const { authUser } = useAuth();

  const showModal = () => {
    setOpen(true);
  };

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setFileSize(Math.round(file.size / 1024));
    setImageName(file.name);
  };

  const clearFile = () => {
    setImage("");
    setUploadedFile(null);
    setImageName("");
    setFileSize(0);
  };

  const uploadFile = async () => {
    setConfirmLoading(true);
    if (
      currentUserInWorkspace.filter((user) => user.id === authUser?.uid)[0]
        .role === "viewer"
    ) {
      if (
        renderWorkspace &&
        renderWorkspace?.storageUsed + fileSize >
          getPlan(renderWorkspace?.subscription).storage
      ) {
        if (
          renderWorkspace?.subscription &&
          fileSize < getPlan(renderWorkspace?.subscription).fileLimit
        ) {
          setUploadingState("uploading");
          const docRef = doc(
            collection(
              db,
              `workspaces/${workspace_id}/designs/${image_id}/versions`
            )
          );
          const imagePath = `designs/${workspace_id}/${image_id}/versions/${imageName}-${Date.now()}-v${
            prevImage.latestVersion + 1
          }`;
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
              },
              (error) => {
                console.error(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );

                const data: IReviewImageVersion = {
                  id: docRef.id,
                  imageURL: downloadURL,
                  size: fileSize,
                  timeStamp: Date.now(),
                  version: prevImage.latestVersion + 1,
                  imagePath: imagePath,
                  uploadedBy: user?.name as string,
                  uploadedByEmail: user?.email as string,
                  uploadedById: authUser?.uid as string,
                };

                await setDoc(docRef, data);
                message.success("Version updated successfully");
                setOpen(false);
                setConfirmLoading(false);
              }
            );
          } catch (error) {
            message.error("Something went wrong. Please try again");
            setUploadingState("error");
            setConfirmLoading(false);
          }
        } else {
          message.error("File size too large, Upgrade now to add large files");
        }
      } else {
        message.error("Storage limit exceeded, Upgrade now to add more files");
      }
    } else {
      message.error("You do not have permission to upload new version");
    }
    setConfirmLoading(false);
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
