import { IReviewImageData } from '@/interfaces/ReviewImageData';
import { storage, db } from '@/lib/firebaseConfig';
import { useToast, Input, CircularProgress } from '@chakra-ui/react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react'
import ImageUploaderDropzone from './ImageUploaderDropzone';
import { useAuth } from '@/contexts/AuthContext';
import { useUserContext } from '@/contexts/UserContext';
import { useImageContext } from '@/contexts/ImagesContext';
import ImageUploadSuccess from './ImageUploadSuccess';

const ImageUploader = () => {
    const [imageName, setImageName] = useState<string>();
    const [uploadedFile, setUploadedFile] = useState<File | null>();
    const [image, setImage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>();
    const [uploadingState, setUploadingState] = useState<"not-started" | "uploading" | "success" | "error">('not-started');
    const [uploadedImageId, setUploadedImageId] = useState<string>('{imageId}');
    const [emailValidation, setEmailValidation] = useState<boolean>(true);
    const [fileSize, setFileSize] = useState<number>(0);

    const toast = useToast();
    const { authUser } = useAuth();
    const { user } = useUserContext();
    const { getImages, storage: storageUsed } = useImageContext();

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
        setEmailValidation(true)
    };

    const [uploadPercentage, setUploadPercentage] = useState<number>(0);

    function ValidateEmail() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email as string)) {
            return true;
        }
        return false;
    }

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
                        let bytes: number = 0
                        const uploadTask = uploadBytesResumable(storageRef, uploadedFile as File);
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
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                                console.log("File available at", downloadURL);

                                const data: IReviewImageData = {
                                    imageURL: downloadURL,
                                    uploadedBy: user?.name as string,
                                    uploadedById: authUser?.uid,
                                    timeStamp: Date.now(),
                                    imageName: imageName as string,
                                    size: bytes / (1024 * 1024),
                                    views: 0,
                                    threads: 0,
                                    lastUpdated: Date.now(),
                                    newUpdate: "Uploaded"
                                }

                                const docRef = await addDoc(collection(db, "reviewImages"), data);
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
            } else {
                const isValidEmail = ValidateEmail();
                if (isValidEmail) {
                    setEmailValidation(true)
                    setUploadingState("uploading");
                    try {
                        const storageRef = ref(
                            storage,
                            `reviewImages/anonymous/${imageName}_${Date.now()}`
                        );

                        const uploadTask = uploadBytesResumable(storageRef, uploadedFile as File);
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
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                                console.log("File available at", downloadURL);

                                const data: IReviewImageData = {
                                    imageURL: downloadURL,
                                    uploadedBy: email ? email?.slice(0, email?.indexOf('@')) as string : "",
                                    timeStamp: Date.now(),
                                    imageName: imageName as string,
                                    lastUpdated: Date.now(),
                                    newUpdate: "Uploaded"
                                }

                                const docRef = await addDoc(collection(db, "reviewImages"), data);
                                toast({
                                    title: "Image uploaded successfully",
                                    status: "success",
                                    duration: 5000,
                                    isClosable: true,
                                    position: "bottom-right",
                                });
                                setUploadingState("success");
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
                    setEmailValidation(false)
                }
            }
        } else {
            toast({
                title: "File size is too large",
                description: "Please upload a file less than 75MB",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    };

    return (
        <div>
            <div className="md:w-96 mx-auto md:mx-0 bg-white rounded-2xl p-10 min-h-[400px] flex justify-center flex-col ">
                {(uploadingState === "not-started" || uploadingState === "uploading") && (
                    <>
                        <div className=" flex items-center text-center justify-center gap-3 mb-8">
                            <p className=" font-semibold text-2xl text-black">Upload Photo</p>
                        </div>
                        {authUser ? (null) : (
                            <div className="mt-5">
                                <div className=" flex items-center mb-2 gap-1">
                                    <p className=" text-sm text-gray-500">Email </p>
                                </div>
                                <Input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    type="text"
                                    focusBorderColor={'purple.500'}
                                    borderColor={`${emailValidation ? 'purple.500' : 'red.500'} `}
                                    className=" text-black mb-4"
                                    placeholder="Enter your email"
                                />
                                {!emailValidation ? (
                                    <p className=" text-xs text-red-500">
                                        Please enter a valid email.
                                    </p>
                                ) : null}
                            </div>
                        )}
                        {image && (
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
                                    <p className=" text-sm text-gray-500 mb-2">Title</p>
                                    <Input
                                        value={imageName}
                                        onChange={(e) => {
                                            setImageName(e.target.value);
                                        }}
                                        type="text"
                                        focusBorderColor="purple.500"
                                        borderColor={"purple.500"}
                                        className=" text-black"
                                        placeholder="Enter photo title"
                                    />
                                </div>
                                <div className="mt-5 text-black">
                                    <span className=" font-semibold">Image name: </span>
                                    <span>{imageName}</span>
                                </div>
                            </>
                        )}
                        <div>
                            {uploadingState === "uploading" && (
                                <div className="mt-5 flex w-full justify-center items-center">
                                    <CircularProgress value={uploadPercentage} color="purple.500" />
                                    <p className="ml-5 text-lg">Uploading file....</p>
                                </div>
                            )}
                            {uploadingState === "not-started" && (
                                <>
                                    {authUser ? (
                                        <button
                                            disabled={!!!image}
                                            className=" btn-p py-2 w-full mt-5"
                                            onClick={uploadFile}
                                        >
                                            Upload
                                        </button>
                                    ) : (

                                        <button
                                            disabled={!!!image || !!!email}
                                            className=" btn-p py-2 w-full mt-5"
                                            onClick={uploadFile}
                                        >
                                            Upload
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
                {uploadingState === "success" && (
                    <ImageUploadSuccess imageId={uploadedImageId} setUploadingState={setUploadingState} clearFile={clearFile} mode='light' />
                )}
                {uploadingState === 'error' && (
                    <div className=' flex justify-center w-full flex-col items-center'>
                        <p className=' text-red-500 text-center font-semibold text-xl'>Some error occurred</p>
                        <button className=' btn-p mt-5' onClick={() => setUploadingState("not-started")}>Try again</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageUploader