import { validateEmail } from "@/utils/validators";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import React, { useState } from "react";
import { Image, Input, Typography } from "antd";
import { FFButton } from "@/theme/themeConfig";
import { useRouter } from "next/router";

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");

  const router = useRouter();

  const handleClick = async () => {
    let isInputValid = validateEmail(emailInput);
    if (!isInputValid) {
      setErrorMessage("Please enter a valid email.");
      return;
    }else{
      setUname(emailInput);
      setIsUnameValid(true);
    }
  };

  if (!imageData) {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black ">
      <div className="w-96 rounded-2xl p-8 bg-sec ">
          <Image src="/freeflow.png" width={150} />
        <div className="mb-6 mt-5">
          <Typography.Title level={4}> You are invited to review <span className=" text-p">{imageData?.imageName}</span> </Typography.Title>
        </div>
        <div className="mt-10">
          <div className="mb-2 flex items-center gap-1">
            <Typography.Text>
              Enter your email to continue
            </Typography.Text>
          </div>
          <Input
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="Enter your email"
          />
        </div>
        {errorMessage && (
          <div>
            <p className="text-xs text-red-500">{errorMessage}</p>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
        <FFButton
            onClick={() => {router.push("/");}}
          >
            Cancel
          </FFButton>
          <FFButton
            disabled={!emailInput}
            onClick={() => handleClick()}
            type="primary"
          >
            Review Image
          </FFButton>
        </div>
      </div>
    </div>
  );
};

export default AddEmailAndPassword;
