import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { db } from "@/lib/firebaseConfig";
import {
  Input,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import React from "react";
import PasswordCopy from "../PasswordCopy";

interface Props {
  image: IReviewImageData;
  isText?: boolean;
}

const PublicAndPrivate: React.FC<Props> = ({ image, isText = false }) => {
  const [password, setPassword] = React.useState<string>(
    image.private?.password ? image.private.password : ""
  );
  const [isPrivate, setIsPrivate] = React.useState<boolean>(
    image?.isPrivate ? true : false
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const toast = useToast();

  const generatePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setPassword(randomPassword);
  };

  const lockImage = async () => {
    setIsLoading(true);
    await updateDoc(doc(db, "reviewImages", image.id), {
      isPrivate: true,
    });
    await setDoc(
      doc(db, "reviewImages", image.id as string, "private/password"),
      {
        password,
      }
    );
    toast({
      title: "Image Locked",
      description: "Your image is now locked",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
    setIsPrivate(true);
    setIsLoading(false);
  };

  const unlockImage = async () => {
    setIsLoading(true);
    await updateDoc(doc(db, "reviewImages", image.id), {
      isPrivate: false,
    });
    toast({
      title: "Image Unlocked",
      description: "Your image is now unlocked",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
    setIsPrivate(false);
    setIsLoading(false);
  };

  return (
    <Popover>
      <div className=" mr-2">
        {isPrivate ? (
          <>{isText && <PasswordCopy value={password} />} </>
        ) : (
          <>{isText && <p className="text-gray-400">Public</p>}</>
        )}
      </div>
      <PopoverTrigger>
        {isPrivate ? (
          <div className=" flex items-center gap-2">
            <svg
              className=" w-5 cursor-pointer text-gray-400 transition-all hover:text-gray-50"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              />
            </svg>
          </div>
        ) : (
          <div className=" flex items-center gap-2">
            <svg
              className=" w-5 cursor-pointer text-gray-400 transition-all hover:text-gray-50"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
            </svg>
          </div>
        )}
      </PopoverTrigger>
      <div className="absolute z-20">
        <PopoverContent bgColor={"#475569"} border={0}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            {isPrivate ? (
              <div>
                <p className=" mt-4 text-center text-lg font-semibold">
                  Unlock Image
                </p>
                <button
                  className=" btn-p mb-3 mt-2 w-full py-2"
                  disabled={isLoading}
                  onClick={unlockImage}
                >
                  {isLoading ? <Spinner size={"sm"} /> : "Unlock"}
                </button>
              </div>
            ) : (
              <div>
                <div className="mt-5">
                  <p className="mb-2 text-left text-sm text-gray-200">
                    Enter Password
                  </p>
                  <Input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    bgColor={"#334155"}
                    type="text"
                    focusBorderColor="purple.500"
                    borderColor={"purple.500"}
                    color={"white"}
                    _placeholder={{ color: "gray.400" }}
                    className=" text-gray-200"
                    placeholder="Enter a password for image review"
                  />
                  <button
                    className=" mt-2 flex items-center text-sm text-purple-400 underline underline-offset-4"
                    onClick={generatePassword}
                  >
                    Generate random password{" "}
                    <svg
                      fill="currentColor"
                      className=" ml-2 w-4"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  disabled={!!!password || isLoading}
                  onClick={lockImage}
                  className=" btn-p my-3 w-full px-6 py-2"
                >
                  {isLoading ? <Spinner size={"sm"} /> : "Lock"}
                </button>
              </div>
            )}
          </PopoverBody>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default PublicAndPrivate;
