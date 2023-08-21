import React from "react";
import {
    createDefaultColorOptions,
    createMarkupEditorShapeStyleControls,
    createMarkupEditorToolbar,
    getEditorDefaults,
} from "@pqina/pintura";
import { PinturaEditor } from "@pqina/react-pintura";
import { Input, Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { db, storage } from "@/lib/firebaseConfig";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { useUserContext } from "@/contexts/UserContext";
import { useImageContext } from "@/contexts/ImagesContext";
import { useAuth } from "@/contexts/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { IReviewImageData } from "@/interfaces/ReviewImageData";

interface ReviewCanvasProps {
    imageSrc: string;
    imageId: string;
    version: number;
    imageData: IReviewImageData;
    uname: string;
}

const ReviewCanvas: React.FC<ReviewCanvasProps> = ({
    imageSrc,
    imageId,
    version,
    imageData,
    uname,
}) => {
    const cachedImage = imageSrc.replace(
        "https://firebasestorage.googleapis.com",
        "https://ik.imagekit.io/freeflow"
    );
    const editorRef = React.useRef(null);
    const [comment, setComment] = React.useState("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const toast = useToast();
    const { user } = useUserContext();
    const { authUser } = useAuth();
    const { storage: storageUsed } = useImageContext();

    const addNewReviewToDatabase = async (blob: Blob) => {
        try {
            const storageRef = ref(
                storage,
                `reviewImages/${authUser?.uid}/public/${imageData.imageName
                }/comments/${imageData.imageName}-${Date.now()}.png`
            );
            let bytes: number = 0;
            const uploadTask = uploadBytesResumable(storageRef, blob as File);
            uploadTask.on(
                "state_changed",
                (snapshot: { bytesTransferred: number; totalBytes: number }) => {
                    bytes = snapshot.totalBytes;
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.error(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log("File available at", downloadURL);
                    await addDoc(collection(db, `reviewImages/${imageId}/threads`), {
                        name: user?.name?.split("@")[0] || uname?.split("@")[0],
                        initialComment: comment,
                        timeStamp: Date.now(),
                        version: version,
                        imageURL: downloadURL,
                    });
                    await updateDoc(doc(db, `reviewImages`, imageId as string), {
                        lastUpdated: Date.now(),
                        newUpdate: "New Thread",
                    });
                    toast({
                        title: "Thread added successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                }
            );
        } catch (e) {
            console.error("Error", e);
            toast({
                title: "Something went wring please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    };

    const fileToDataURL = (file: any) => {
        return new Promise((resolve, reject) => {
            // Encode the file using the FileReader API
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const addThread = async () => {
        setIsLoading(true);
        //@ts-ignore
        const imageWriterResult = await editorRef?.current?.editor.processImage();
        const dataURL = await fileToDataURL(imageWriterResult.dest);
        const base64Response = await fetch(dataURL as string);
        const blob = await base64Response.blob();
        await addNewReviewToDatabase(blob);
        //@ts-ignore
        await editorRef?.current?.editor.loadImage(cachedImage);
        setComment("");
        setIsLoading(false);
    };

    const editorPdfconfig = getEditorDefaults({});
    return (
        <div className=" flex flex-col items-center">
            <div className=" h-[80vh] w-full">
                <PinturaEditor
                    {...editorPdfconfig}
                    previewUpscale={true}
                    ref={editorRef}
                    src={cachedImage}
                    utils={["annotate"]}
                    markupEditorToolbar={createMarkupEditorToolbar([
                        [
                            "sharpie",
                            "Pen",
                            {
                                icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>',
                            },
                        ],
                        "arrow",
                        "rectangle",
                        "ellipse",
                        "text",
                    ])}
                    markupEditorShapeStyleControls={createMarkupEditorShapeStyleControls({
                        myStyle: createDefaultColorOptions(),
                        strokeWidthOptions: [2, 4, 8],
                        lineEndStyleOptions: false,
                        lineHeightOptions: false,
                    })}
                    enableToolbar={false}
                    enableButtonExport={false}
                    cropEnableZoomInput={false}
                    cropEnableRotationInput={false}
                    cropEnableButtonFlipHorizontal={false}
                    cropEnableButtonRotateLeft={false}
                    cropEnableImageSelection={false}
                ></PinturaEditor>
            </div>
            <div className=" flex w-9/12 items-center gap-3">
                <Input
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                    }}
                    type="text"
                    focusBorderColor={"purple.500"}
                    borderColor={"purple.500"}
                    className=" mb-4 text-white"
                    placeholder="Enter Comment"
                />
                <button
                    className=" btn-p mb-4 rounded px-2 py-2 "
                    disabled={isLoading || !comment}
                    onClick={addThread}
                >
                    {isLoading ? (
                        <Spinner size={"xs"} />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ReviewCanvas;
