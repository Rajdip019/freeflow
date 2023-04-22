import { IReviewImageData } from '@/interfaces/ReviewImageData';
import { storage, db } from '@/lib/firebaseConfig';
import { useToast, Tooltip, Input, CircularProgress } from '@chakra-ui/react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import ImageUploaderDropzone from './ImageUploaderDropzone';

const ImageUploader = () => {
    const [imageName, setImageName] = useState<string>();
    const [uploadedFile, setUploadedFile] = useState<File | null>();
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState<string>();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const toast = useToast();

    const handleFileUploaded = (file: File) => {
        setUploadedFile(file);
        setImageName(file.name);
        console.log("File uploaded:", file);
    };

    const clearFile = () => {
        setImage("");
        setUploadedFile(null);
        setImageName("");
    };

    const [uploadPercentage, setUploadPercentage] = useState<number>(0);

    const uploadFile = () => {
        setIsUploading(true);
        try {
            const storageRef = ref(
                storage,
                `reviewImages/${imageName}_${Date.now()}`
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

                    const data : IReviewImageData = {
                        imageURL: downloadURL,
                        uploadedBy: name as string,
                        timeStamp: Date.now(),
                        imageName : imageName as string
                    }

                    const docRef = await addDoc(collection(db, "reviewImages"),  data);
                    toast({
                        title: "Image uploaded successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                    setIsUploading(false);
                    router.push(`/upload-image/success?ref=${docRef.id}`);
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
            setIsUploading(false);
        }
        
    };
    
  return (
    <div>
        <div className="md:w-96 mx-auto md:mx-0 bg-white rounded-2xl p-10 ">
                <div className=" flex items-center text-center justify-center gap-3 mb-8">
                    <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className=" w-10 text-purple-500"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                        ></path>
                    </svg>
                    <p className=" font-semibold text-2xl">Upload Photo</p>
                </div>
                <div className="mt-5">
                    <div className=" flex items-center mb-2 gap-1">
                        <p className=" text-sm text-gray-500">Name </p>
                        <Tooltip label="💡 Tip : You can use your anonymous name.">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="w-5 text-purple-500"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                />
                            </svg>
                        </Tooltip>
                    </div>
                    <Input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        type="text"
                        focusBorderColor="purple.500"
                        borderColor={"purple.500"}
                        className=" text-black mb-4"
                        placeholder="Enter your name"
                    />
                </div>
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
                        <div className="mt-5">
                            <span className=" font-semibold">Image name: </span>
                            <span>{imageName}</span>
                        </div>
                    </>
                )}
                <div>
                    {isUploading ? (
                        <div className="mt-5 flex w-full justify-center items-center">
                            <CircularProgress value={uploadPercentage} color="purple.500" />
                            <p className="ml-5 text-lg">Uploading file....</p>
                        </div>
                    ) : (
                        <button
                            disabled={!!!image || !!!name}
                            className=" btn-p py-2 w-full mt-5"
                            onClick={uploadFile}
                        >
                            Upload
                        </button>
                    )}
                </div>
            </div>
    </div>
  )
}

export default ImageUploader