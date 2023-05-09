import { validateEmail } from "@/helpers/validators";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
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
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClick = async () => {
    let isInputValid = validateEmail(emailInput);
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
            type="email"
            name="email"
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
            <InputGroup size="md">
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                name="password"
                type={showPassword ? "text" : "password"}
                focusBorderColor={"purple.500"}
                borderColor={"purple.500"}
                className="mb-4 text-black"
                placeholder="Enter the password for the file"
              />
              <InputRightElement width="3.5rem">
                <Button
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      fill="currentColor"
                      className="text-p w-5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      fill="currentColor"
                      className=" text-p w-5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                    </svg>
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
        )}
        {errorMessage && (
          <div>
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
