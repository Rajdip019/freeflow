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
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import ImageUploaderDropzone from "./ImageUploaderDropzone";
import { useUserContext } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useImageContext } from "@/contexts/ImagesContext";
import ImageUploadSuccess from "./ImageUploadSuccess";

const ImageUploadModal = () => {
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
  const { storage: storageUsed, getImages } = useImageContext();

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

                const docRef = doc(collection(db, "reviewImages"));

                const data: IReviewImageData = {
                  id: docRef.id,
                  imageURL: downloadURL,
                  uploadedBy: user?.name as string,
                  uploadedById: authUser?.uid,
                  timeStamp: Date.now(),
                  imageName: imageName as string,
                  size: bytes / (1024 * 1024),
                  views: 0,
                  threads: 0,
                  lastUpdated: Date.now(),
                  newUpdate: "Uploaded",
                  isPrivate: Boolean(password),
                };

                await setDoc(docRef, data);
                await setDoc(
                  doc(db, "reviewImages", docRef.id, "private/password"),
                  {
                    password,
                  }
                );

                toast({
                  title: "Image uploaded successfully",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom-right",
                });

                setUploadingState("success");
                setUploadedImageId(docRef.id);
                getImages();
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

  //generate random password
  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
  };

  return (
    <>
      <button
        onClick={() => {
          onOpen();
          clearFile();
          setUploadingState("not-started");
        }}
        className=" font-sec btn-p flex items-center gap-3 rounded px-1 py-1 font-semibold md:px-6 md:py-3"
      >
        <svg
          fill="currentColor"
          className="md-w-6 w-8 text-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
          />
        </svg>
        <p className=" hidden md:block">Upload Photo </p>
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
                  {image && (
                    <>
                      <div className="mt-5">
                        <p className=" mb-2 text-sm text-gray-500">Title</p>
                        <Input
                          value={imageName}
                          onChange={(e) => {
                            setImageName(e.target.value);
                          }}
                          type="text"
                          focusBorderColor="purple.500"
                          borderColor={"purple.500"}
                          className=" text-gray-200"
                          placeholder="Enter photo title"
                        />
                      </div>
                      <div className="mt-5">
                        <span className=" font-semibold">Image name: </span>
                        <span>{imageName}</span>
                      </div>
                      <div className="mt-5">
                        <p className="mb-2 text-sm text-gray-500">
                          Password (optional)
                        </p>
                        <Input
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          type="text"
                          focusBorderColor="purple.500"
                          borderColor={"purple.500"}
                          className=" text-gray-200"
                          placeholder="Enter a password for image review"
                        />
                        <button
                          className=" mt-2 flex items-center text-sm text-purple-400 underline underline-offset-4"
                          onClick={generatePassword}
                        >
                          Generate random password{" "}
                          <svg
                            fill="currentColor"
                            className=" ml-2 w-4"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              clipRule="evenodd"
                              fillRule="evenodd"
                              d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                  <div>
                    {uploadingState === "uploading" && (
                      <div className="mt-5 flex w-full items-center justify-center">
                        <CircularProgress
                          value={uploadPercentage}
                          color="purple.500"
                        />
                        <p className="ml-5 text-lg">Uploading file....</p>
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

export default ImageUploadModal;
