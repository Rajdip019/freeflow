import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { storage, db } from "@/lib/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useImageContext } from "@/contexts/ImagesContext";
import ImageUploadSuccess from "./ImageUploadSuccess";
import { validateEmail } from "@/utils/validators";
import { newReviewImageEvent } from "@/lib/events";
import ImageUploadDropZoneLandingPage from "./ImageDropZones/ImageUploadDropZoneLandingPage";
import { Progress, Input, message } from "antd";

const ImageUploader = () => {
  const [imageName, setImageName] = useState<string>();
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [uploadingState, setUploadingState] = useState<
    "not-started" | "uploading" | "success" | "error"
  >("not-started");
  const [uploadedImageId, setUploadedImageId] = useState<string>("{imageId}");
  const [emailValidation, setEmailValidation] = useState<boolean>(true);
  const [fileSize, setFileSize] = useState<number>(0);

  const { authUser } = useAuth();
  const { user } = useUserContext();
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
    setEmailValidation(true);
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
              `reviewImages/${authUser?.uid}/public/${imageName}-${Date.now()}`
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
                  imageURL: [downloadURL],
                  uploadedBy: user?.name as string,
                  uploadedByEmail: email,
                  uploadedById: authUser?.uid,
                  timeStamp: Date.now(),
                  imageName: imageName as string,
                  size: bytes / (1024 * 1024),
                  views: 0,
                  threads: 0,
                  lastUpdated: Date.now(),
                  newUpdate: "Uploaded",
                  isPrivate: false,
                  currentVersion: 1,
                };

                await setDoc(docRef, data);

                message.success("Image uploaded successfully");
                newReviewImageEvent(data);
                setUploadingState("success");
                setUploadedImageId(docRef.id);
              }
            );
          } catch (error) {
            message.error("Something went wrong. Please try again");
            setUploadingState("error");
          }
        } else {
          message.error(
            "You have exceeded your storage limit. Please upgrade your plan"
          );
        }
      } else {
        const isValidEmail = validateEmail(email);
        if (isValidEmail) {
          setEmailValidation(true);
          setUploadingState("uploading");
          try {
            const storageRef = ref(
              storage,
              `reviewImages/anonymous/${imageName}_${Date.now()}`
            );

            const uploadTask = uploadBytesResumable(
              storageRef,
              uploadedFile as File
            );
            uploadTask.on(
              "state_changed",
              (snapshot: { bytesTransferred: number; totalBytes: number }) => {
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
                  imageURL: [downloadURL],
                  uploadedBy: email
                    ? (email?.slice(0, email?.indexOf("@")) as string)
                    : "",
                  uploadedByEmail: email,
                  timeStamp: Date.now(),
                  imageName: imageName as string,
                  lastUpdated: Date.now(),
                  newUpdate: "Uploaded",
                  isPrivate: false,
                  currentVersion: 1,
                };

                await setDoc(docRef, data);

                message.success("Image uploaded successfully");
                newReviewImageEvent(data);
                setUploadingState("success");
                setUploadedImageId(docRef.id);
              }
            );
          } catch (error) {
            message.error("Something went wrong. Please try again");
            setUploadingState("error");
          }
        } else {
          setEmailValidation(false);
        }
      }
    } else {
      message.error("File size should be less than 75MB");
    }
  };

  return (
    <div>
      <div className="mx-auto flex min-h-[400px] flex-col justify-center rounded-2xl bg-white p-5 md:mx-0 md:w-96 ">
        {(uploadingState === "not-started" ||
          uploadingState === "uploading") && (
          <>
            {/* {image && (
                <div className=" flex justify-end">
                  <svg
                    onClick={() => {
                      clearFile();
                    }}
                    fill="currentColor"
                    className="w-6 cursor-pointer text-black"
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
              )} */}
            <div className=" cursor-pointer">
              {/* <ImageUploaderDropzone
                  onFileUploaded={handleFileUploaded}
                  image={image}
                  setImage={setImage}
                /> */}
              <ImageUploadDropZoneLandingPage
                onFileUploaded={handleFileUploaded}
                image={image}
                setImage={setImage}
              />
            </div>
            <>
              <div className="mt-5 border-y border-gray-400 py-2">
                <p className=" mb-2 text-sm text-gray-500">Image name</p>

                <Input
                  value={imageName}
                  onChange={(e) => {
                    setImageName(e.target.value);
                  }}
                  className="bg-white text-black"
                  placeholder="Enter image name"
                />
              </div>
              {/* <div className="mt-5 text-black">
                    <span className=" font-semibold">Image name: </span>
                    <span>{imageName}</span>
                  </div> */}
            </>
            {authUser ? (
              <div className="mt-5 border-b border-gray-400">
                <div className=" mb-2 flex items-center gap-1">
                  <p className=" b text-sm text-gray-500">Email </p>
                </div>
                <Input
                  value={authUser?.email as string}
                  // onChange={(e) => {
                  //   setEmail(e.target.value);
                  // }}
                  disabled
                  type="text"
                  // borderColor={`${emailValidation ? "purple.500" : "red.500"} `}
                  className=" mb-4 text-black"
                  placeholder="Enter your email"
                />
              </div>
            ) : (
              <div className="mt-3 border-b border-gray-400">
                <div className=" mb-2 flex items-center gap-1">
                  {email && <p className=" text-sm text-gray-500">Email </p>}
                </div>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="text"
                  className=" mb-4 text-black"
                  placeholder="Enter your email"
                />
                {!emailValidation ? (
                  <p className=" text-xs text-red-500">
                    Please enter a valid email.
                  </p>
                ) : null}
              </div>
            )}
            <div>
              {uploadingState === "uploading" && (
                <div className="mt-5 flex w-full items-center justify-center">
                  <Progress percent={uploadPercentage} type="circle" />
                  <p className="ml-5 text-lg">Generating link....</p>
                </div>
              )}
              {uploadingState === "not-started" && (
                <>
                  {authUser ? (
                    <button
                      disabled={!!!imageName || !!!image}
                      className=" btn-p mt-5 w-full py-2"
                      onClick={uploadFile}
                    >
                      Get Link
                    </button>
                  ) : (
                    <button
                      disabled={!!!image || !!!email}
                      className=" btn-p mt-5 w-full py-2"
                      onClick={uploadFile}
                    >
                      Get Link
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {uploadingState === "success" && (
          <ImageUploadSuccess
            imageId={uploadedImageId}
            setUploadingState={setUploadingState}
            clearFile={clearFile}
            mode="light"
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
    </div>
  );
};

export default ImageUploader;
