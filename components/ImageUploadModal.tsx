import { IReviewImageData } from '@/interfaces/ReviewImageData';
import { storage, db } from '@/lib/firebaseConfig';
import { CircularProgress, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react'
import ImageUploaderDropzone from './ImageUploaderDropzone';
import { useUserContext } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useImageContext } from '@/contexts/ImagesContext';


const ImageUploadModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imageName, setImageName] = useState<string>();
    const [uploadedFile, setUploadedFile] = useState<File | null>();
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const toast = useToast();
    const { user } = useUserContext();
    const { authUser } = useAuth();
    const { storage: storageUsed, getImages } = useImageContext();

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
        if (user?.storage) {
            if (storageUsed <= user.storage) {

                setIsUploading(true);
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
                                threads: 0
                            }

                            await addDoc(collection(db, "reviewImages"), data);
                            toast({
                                title: "Image uploaded successfully",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom-right",
                            });
                            setIsUploading(false);
                            getImages();
                            onClose();
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

    };
    return (
        <>
            <button onClick={() => { onOpen(); clearFile(); }} className=" font-semibold font-sec btn-p flex items-center gap-3 px-6">
                <svg
                    fill="currentColor"
                    className="w-6 text-white"
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
                Upload Photo{" "}
            </button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bgColor={'gray.800'} color={'white'}>
                    <ModalHeader>Upload Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="mx-auto md:mx-0 text-white rounded-2xl  pb-10 ">
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
                                            className=" text-gray-200"
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
                                        disabled={!!!image}
                                        className=" btn-p py-2 w-full mt-5"
                                        onClick={uploadFile}
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ImageUploadModal