import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { Input } from "@chakra-ui/react";
import React, { useState } from "react";

interface Props {
  imageData?: IReviewImageData;
  uname: string;
  setUname: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsUnameValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEmailAndPassword: React.FC<Props> = ({
  imageData,
  setUname,
  setIsUnameValid,
}) => {
  const [password, setPassword] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");

  function validateEmail() {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput as string)
    ) {
      return true;
    }
    return false;
  }

  const handleClick = async () => {
    let isInputValid = validateEmail();
    if (!isInputValid) {
      setErrorMessage("Please enter a valid email.");
      return;
    } else {
      setIsEmailValid(true);
    }
    if (imageData?.isPrivate) {
      try {
        const response = await fetch(
          `/api/review-image/${imageData?.id}/verify-password?password=${password}`
        );
        if (response.status !== 200) {
          isInputValid = false;
          setErrorMessage("Could not verify password. Please try again.");
          return;
        }
        const data = await response.json();
        if (data?.verified) {
          isInputValid = true;
        }
      } catch (e) {
        console.log("🚀 > e:", e);
        isInputValid = false;
        setErrorMessage("Could not verify password. Please try again.");
      }
    }
    if (isInputValid) {
      setUname(emailInput);
      setIsUnameValid(true);
    }
  };

  if (!imageData) {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-black">
      <div className="w-96 rounded-2xl bg-white p-10 ">
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">You are invited to review</p>
          <p className="text-2xl font-semibold">{imageData?.imageName}</p>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-1">
            <p className="text-sm text-gray-500">
              Enter your email to continue
            </p>
          </div>
          <Input
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
            }}
            type="text"
            focusBorderColor={"purple.500"}
            borderColor={`${isEmailValid ? "purple.500" : "red.500"} `}
            className="mb-4 text-black"
            placeholder="Enter your email"
          />
        </div>
        {imageData?.isPrivate && (
          <div className="mt-2">
            <div className="mb-2 flex items-center gap-1">
              <p className="text-sm text-gray-500">Password</p>
            </div>
            <Input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="text"
              focusBorderColor={"purple.500"}
              borderColor={"purple.500"}
              className="mb-4 text-black"
              placeholder="Enter the password for the file"
            />
          </div>
        )}
        {errorMessage && (
          <div className="mt-5">
            <p className="text-xs text-red-500">{errorMessage}</p>
          </div>
        )}
        <div className="mt-5 flex flex-col items-center gap-2">
          <button
            disabled={!emailInput || (imageData?.isPrivate && !password)}
            onClick={() => handleClick()}
            className="btn-p py-2"
          >
            Review Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmailAndPassword;
