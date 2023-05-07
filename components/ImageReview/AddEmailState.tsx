import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { db } from "@/lib/firebaseConfig";
import { Input } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  uname: string;
  setUname: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsUnameValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEmailState: React.FC<Props> = ({
  uname,
  setUname,
  setIsUnameValid,
}) => {
  const router = useRouter();
  const { imageId } = router.query;
  const [imageData, setImageData] = useState<IReviewImageData>();
  const [error, setError] = useState<boolean>(false);
  const [emailValidation, setEmailValidation] = useState<boolean>(true);

  function ValidateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(uname as string)) {
      return true;
    }
    return false;
  }

  const getImageDetails = async () => {
    const docRef = doc(db, "reviewImages", imageId as string);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setImageData(docSnap.data() as IReviewImageData);
    } else {
      setError(true);
      console.log("No such document!");
    }
  };

  const handleClick = () => {
    const validateResult = ValidateEmail();
    if (validateResult) {
      setEmailValidation(true);
      setIsUnameValid(true);
    } else {
      setEmailValidation(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      getImageDetails();
    }
  }, []);

  console.log(uname);

  return (
    <>
      {error ? (
        <div className=' bg-gray-900" flex h-screen w-screen flex-col items-center justify-center text-4xl '>
          <p>Invalid URL</p>
          <button onClick={() => router.push("/")} className=" btn-p mt-5 py-2">
            Go back
          </button>
        </div>
      ) : (
        <div className=" flex h-screen items-center justify-center bg-gray-900 text-black">
          <div className="w-96 rounded-2xl bg-white p-10 ">
            <div className=" mb-6 text-center">
              <p className=" text-xl font-semibold">
                You are invited to review
              </p>
              <p className=" text-2xl font-semibold">{imageData?.imageName}</p>
            </div>
            <div className="mt-5">
              <div className=" mb-2 flex items-center gap-1">
                <p className=" text-sm text-gray-500">
                  Enter your email to continue
                </p>
              </div>
              <Input
                value={uname}
                onChange={(e) => {
                  setUname(e.target.value);
                }}
                type="text"
                focusBorderColor={"purple.500"}
                borderColor={`${emailValidation ? "purple.500" : "red.500"} `}
                className=" mb-4 text-black"
                placeholder="Enter your email"
              />
              {!emailValidation ? (
                <p className=" text-xs text-red-500">
                  Please enter a valid email.
                </p>
              ) : null}
            </div>
            <div className=" mt-5 flex flex-col items-center gap-2">
              <button
                disabled={!!!uname}
                onClick={() => handleClick()}
                className="btn-p py-2"
              >
                Review Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmailState;
