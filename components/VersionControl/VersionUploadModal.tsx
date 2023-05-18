import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import {
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import ImageUploaderDropzone from "../ImageDropZones/ImageUploaderDropzone";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useImageContext } from "@/contexts/ImagesContext";
import ImageUploadSuccess from "../ImageUploadSuccess";
import { newReviewImageEvent } from "@/lib/events";

interface Props {
  prevImage: IReviewImageData;
  pos: "start" | "mid" | "end";
}

const VersionUploadModal: React.FC<Props> = ({ prevImage, pos }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageName, setImageName] = useState<string>();
  const [password, setPassword] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [image, setImage] = useState<string | null>(null);
  const [uploadingState, setUploadingState] = useState<
    "not-started" | "uploading" | "success" | "error"
  >("not-started");
  const [uploadedImageId, setUploadedImageId] = useState<string>("{imageId}");
  const [fileSize, setFileSize] = useState<number>(0);

  const toast = useToast();
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
                setUploadPercentage(progress);
              },
              (error) => {
                console.error(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                console.log("File available at", downloadURL);

                const docRef = doc(db, "reviewImages", prevImage.id);

                const data: Partial<IReviewImageData> = {
                  imageURL: [...prevImage.imageURL, downloadURL],
                  size: (prevImage.size as number) + bytes / (1024 * 1024),
                  lastUpdated: Date.now(),
                  newUpdate: "New Version Uploaded",
                  currentVersion: prevImage.currentVersion + 1,
                };

                await updateDoc(docRef, data);

                toast({
                  title: "Version Updated successfully",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom-right",
                });
                onClose();
                setUploadedImageId(docRef.id);
              }
            );
          } catch (error) {
            toast({
              title: "Something went wrong",
              description: "Please try again",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            });
            setUploadingState("error");
          }
        } else {
          toast({
            title: "Your storage is full.",
            description: "Delete some images and try uploading.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      }
    } else {
      toast({
        title: "File size is too large",
        description: "Please upload a file less than 75 MB",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => {
          onOpen();
          clearFile();
          setUploadingState("not-started");
        }}
        className={`font-sec hidden w-full items-center gap-3 hover:text-white ${
          pos === "start" && "md:flex"
        } ${pos === "mid" && "md:block"} ${
          pos === "end" && "md: justify-end"
        } md:block`}
      >
        {/* <svg
          fill="currentColor"
          className="w-4 text-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
          />
        </svg> */}
        Upload new version
      </button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={"gray.800"} color={"white"}>
          <ModalHeader>Upload Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mx-auto rounded-2xl pb-10 text-white  md:mx-0 ">
              {(uploadingState === "not-started" ||
                uploadingState === "uploading") && (
                <>
                  {image && (
                    <div className=" flex justify-end">
                      <svg
                        onClick={() => {
                          clearFile();
                        }}
                        fill="currentColor"
                        className="w-6 cursor-pointer"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className=" mt-2 cursor-pointer">
                    <ImageUploaderDropzone
                      onFileUploaded={handleFileUploaded}
                      image={image}
                      setImage={setImage}
                    />
                  </div>

                  <div>
                    {uploadingState === "uploading" && (
                      <div className="mt-5 flex w-full items-center justify-center">
                        <CircularProgress
                          value={uploadPercentage}
                          color="purple.500"
                        />
                        <p className="ml-5 text-lg">Updating version....</p>
                      </div>
                    )}
                    {uploadingState === "not-started" && (
                      <button
                        disabled={!!!image}
                        className=" btn-p mt-5 w-full py-2"
                        onClick={uploadFile}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </>
              )}
              {/* {uploadingState === "success" && (
                <ImageUploadSuccess
                  imageId={uploadedImageId}
                  setUploadingState={setUploadingState}
                  clearFile={clearFile}
                  password={password}
                  mode="dark"
                />
              )} */}
              {uploadingState === "error" && (
                <div className=" flex w-full flex-col items-center justify-center">
                  <p className=" text-center text-xl font-semibold text-red-500">
                    Some error occurred
                  </p>
                  <button
                    className=" btn-p mt-5"
                    onClick={() => setUploadingState("not-started")}
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VersionUploadModal;
