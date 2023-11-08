import React from "react";
import {
  createDefaultColorOptions,
  createMarkupEditorShapeStyleControls,
  createMarkupEditorToolbar,
  getEditorDefaults,
} from "@pqina/pintura";
import { PinturaEditor } from "@pqina/react-pintura";
import { db, storage } from "@/lib/firebaseConfig";
import { addDoc, collection, updateDoc, doc, setDoc } from "firebase/firestore";
import { useUserContext } from "@/contexts/UserContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input, message, notification } from "antd";
import { useFeedbackContext } from "@/contexts/FeedbackContext";
import { FFButton } from "@/theme/themeConfig";
import { ArrowRightOutlined } from "@ant-design/icons";

interface ReviewCanvasProps {
  imageSrc: string;
  imageId: string;
  workspaceId: string;
  open?: boolean;
}

const ReviewCanvas: React.FC<ReviewCanvasProps> = ({
  imageSrc,
  imageId,
  workspaceId,
  open,
}) => {
  const cachedImage = imageSrc.replace(
    "https://firebasestorage.googleapis.com",
    "https://ik.imagekit.io/freeflow"
  );
  const editorRef = React.useRef(null);
  const [comment, setComment] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { user } = useUserContext();

  const { uname, image, version, setVersion } = useFeedbackContext();

  const addNewReviewToDatabase = async (blob: Blob, editorRef: any) => {
    try {
      const docRef = doc(collection(db, `workspaces/${workspaceId}/designs/${imageId}/comments`));
      const imagePath = `designs/${workspaceId}/${docRef.id}/${image?.imageName}-${Date.now()}`;
      const storageRef = ref(storage, imagePath);
      let bytes: number = 0;
      const uploadTask = uploadBytesResumable(storageRef, blob as File);
      uploadTask.on(
        "state_changed",
        (snapshot: { bytesTransferred: number; totalBytes: number }) => {
          bytes = snapshot.totalBytes;
        },
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await setDoc(docRef, {
            name: user?.name?.split("@")[0] || uname?.split("@")[0],
            initialComment: comment,
            timeStamp: Date.now(),
            version: version,
            imageURL: downloadURL,
            imagePath : imagePath,
          });
          message.success("Thread added successfully");
          await editorRef?.current?.editor.loadImage(cachedImage);
          setVersion(version);
          setIsLoading(false);
        }
      );
    } catch (e) {
      console.error("Error", e);
      message.error("Something went wrong. Please try again");
      await editorRef?.current?.editor.loadImage(cachedImage);
      setVersion(version);
      setComment("");
      setIsLoading(false);
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
    await addNewReviewToDatabase(blob, editorRef);
  };

  const editorConfig = getEditorDefaults({});
  return (
    <div className=" flex flex-col items-center">
      <div className=" h-[80vh] w-full">
        <PinturaEditor
          {...editorConfig}
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
          enableButtonExport={false}
          cropEnableZoomInput={false}
          cropEnableRotationInput={false}
          cropEnableButtonFlipHorizontal={false}
          cropEnableButtonRotateLeft={false}
          cropEnableImageSelection={false}
        ></PinturaEditor>
      </div>
      <div
        className={`flex w-11/12 ${
          open ? "md:w-8/12" : "md:w-6/12"
        } items-center gap-3`}
      >
        <Input
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          type="text"
          className=" mb-4 text-white"
          placeholder="Enter Feedback"
          disabled={isLoading}
        />
        <FFButton
          className="mb-4 rounded px-2 py-2 "
          disabled={isLoading || !comment}
          onClick={addThread}
          type="primary"
          loading={isLoading}
        >
          Add Feedback <ArrowRightOutlined />
        </FFButton>
      </div>
    </div>
  );
};

export default ReviewCanvas;
