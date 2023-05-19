import { useUserContext } from "@/contexts/UserContext";
import { IImageDimension } from "@/interfaces/Image";
import { INewThread } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { Textarea, Spinner, useToast } from "@chakra-ui/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React from "react";

interface Props {
  newThread: INewThread;
  setNewThread: React.Dispatch<React.SetStateAction<INewThread>>;
  isNewThreadAddLoading: boolean;
  uname: string;
  version: number;
  imageDimension: IImageDimension;
  imageId: string;
}

const NewThread: React.FC<Props> = ({
  newThread,
  setNewThread,
  isNewThreadAddLoading,
  uname,
  version,
  imageDimension,
  imageId,
}) => {
  const { user } = useUserContext();
  const toast = useToast();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // makes the textarea focus
  React.useEffect(() => {
    if (newThread.isHidden) return;
    textareaRef.current?.focus();
  }, [newThread.isHidden]);

  // Adds a new thread
  const addNewThread = async () => {
    try {
      setNewThread((prev: any) => {
        return {
          ...prev,
          isHidden: true,
        };
      });
      await addDoc(collection(db, `reviewImages/${imageId}/threads`), {
        top: newThread.pos.top,
        left: newThread.pos.left,
        imageDimension: imageDimension,
        name: newThread.comment.name,
        initialComment: newThread.comment.value,
        timeStamp: Date.now(),
        color: newThread.color,
        version: version,
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
      setNewThread((prev: any) => {
        return {
          ...prev,
          isHidden: true,
        };
      });
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

  return (
    <div>
      {newThread.isHidden ? null : (
        <div
          style={{
            top: newThread.pos.top,
            left: newThread.pos.left,
          }}
          className={`absolute flex text-gray-800 ${
            newThread.pos.top > 550 ? "items-end" : "items-start"
          } ${newThread.pos.left > 500 ? "flex-row-reverse" : " flex-row"}`}
        >
          {!isNewThreadAddLoading ? (
            <>
              <div className=" hidden text-red-500"></div>
              <div className=" hidden text-green-500"></div>
              <div className=" hidden text-blue-500"></div>
              <div
                className={`h-7 w-7 rounded-r-full rounded-t-full bg-${newThread.color} border border-white`}
              ></div>
              <div
                className={` absolute w-72 rounded bg-gray-800 p-2 text-white ${
                  newThread.pos.left > 500 ? "right-10" : "left-10"
                }  z-50`}
              >
                <div className=" mb-2 flex items-center justify-between">
                  <p className=" text-sm font-semibold">Add your comment</p>
                  <button
                    onClick={() => {
                      setNewThread((prev: any) => {
                        return {
                          ...prev,
                          isHidden: true,
                        };
                      });
                    }}
                  >
                    <svg
                      fill="currentColor"
                      className=" w-5"
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
                  </button>
                </div>
                <div className=" flex flex-col items-end">
                  <Textarea
                    className="h-5"
                    size="sm"
                    ref={textareaRef}
                    placeholder="Write your message..."
                    focusBorderColor="purple.500"
                    value={newThread.comment.value}
                    onChange={(e) => {
                      setNewThread((prev: any) => {
                        return {
                          ...prev,
                          comment: {
                            value: e.target.value as string,
                            name: uname
                              ? uname.slice(0, uname.indexOf("@"))
                              : user?.email?.slice(
                                  0,
                                  user?.email?.indexOf("@")
                                ),
                          },
                        };
                      });
                    }}
                    //   onKeyPress={(e) => {
                    //     if(newThread.comment.value === "") return;
                    //     if (e.key === "Enter") {
                    //       addNewThread();
                    //     }
                    // }}
                  />
                  <div className=" mt-3 flex gap-2">
                    <div
                      onClick={() => {
                        setNewThread((prev) => {
                          return {
                            ...prev,
                            color: "gray-900",
                          };
                        });
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full bg-gray-900 ring-1 active:ring-4"
                    ></div>
                    <div
                      onClick={() => {
                        setNewThread((prev) => {
                          return {
                            ...prev,
                            color: "white",
                          };
                        });
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full bg-white ring-2 active:ring-4"
                    ></div>
                    <div
                      onClick={() => {
                        setNewThread((prev) => {
                          return {
                            ...prev,
                            color: "purple-500",
                          };
                        });
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full bg-purple-500 ring-1 active:ring-4"
                    ></div>
                    <div
                      onClick={() => {
                        setNewThread((prev) => {
                          return {
                            ...prev,
                            color: "green-500",
                          };
                        });
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full bg-green-500 ring-2 active:ring-4"
                    ></div>
                    <div
                      onClick={() => {
                        setNewThread((prev) => {
                          return {
                            ...prev,
                            color: "blue-500",
                          };
                        });
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full bg-blue-500 ring-2 active:ring-4"
                    ></div>
                    <div
                      onClick={() => {
                        setNewThread((prev) => {
                          return {
                            ...prev,
                            color: "red-500",
                          };
                        });
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full bg-red-500 ring-2 active:ring-4"
                    ></div>
                    <button
                      disabled={!!!newThread.comment.value}
                      className="ml-2 rounded bg-purple-500 p-1  px-2 transition-all hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                      onClick={addNewThread}
                    >
                      <svg
                        className="w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Spinner color="gray.800" />
          )}
        </div>
      )}
    </div>
  );
};

export default NewThread;
