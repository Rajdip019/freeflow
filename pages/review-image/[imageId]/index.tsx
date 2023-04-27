import Markings from "@/components/ImageReview/Markings";
import SidebarComments from "@/components/ImageReview/SidebarComments";
import ThreadsExpanded from "@/components/ImageReview/ThreadsExpanded";
import {
  defaultHighlightedThread,
  defaultNewThread,
} from "@/helpers/constants";
import { IImageDimension } from "@/interfaces/Image";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { IThread, INewThread } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { Spinner, Switch, Textarea, useToast } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";

const ReviewImage = () => {
  const router = useRouter();
  const { imageId, uname } = router.query;
  const [imageData, setImageData] = useState<IReviewImageData>();
  const [error, setError] = useState<boolean>(false);
  const [threads, setThreads] = useState<IThread[]>([]);
  const [isNewThreadAddLoading, setIsNewThreadAddLoading] =
    useState<boolean>(false);
  const [isCommentsOn, setIsCommentsOn] = useState<number>(1);
  const [highlightedComment, setHighlightedComment] = useState<IThread>(
    defaultHighlightedThread
  );
  const toast = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocusedThread, setIsFocusedThread] = useState<boolean>(false);
  const [newThread, setNewThread] = useState<INewThread>(defaultNewThread);
  const [imageDimension, setImageDimension] = useState<IImageDimension>();
  const [isThreadsLoading, setIsThreadsLoading] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const { left, top } = commentRef.current!.getBoundingClientRect();
    const x = event.clientX - left - 12;
    const y = event.clientY - top - 12;
    setNewThread((prev: any) => {
      return {
        ...prev,
        pos: { top: y, left: x },
        comment: { value: "" },
        color: "gray-900",
        isHidden: false,
      };
    });
    console.log(`Mouse position inside comment div: ${x}, ${y}`);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef, handleClick]);

  // Get the details of the image
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

  // Get each thread on an image
  const getThreads = async () => {
    setIsThreadsLoading(true);
    const _comments: unknown[] = [];
    const querySnapshot = await getDocs(
      query(
        collection(db, `reviewImages/${imageId}/threads`),
        orderBy("timeStamp", "desc")
      )
    );
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      _comments.push({ ...doc.data(), id: doc.id });
    });
    setThreads(_comments as IThread[]);
    setIsThreadsLoading(false);
  };

  // Adds a new thread
  const addNewThread = async () => {
    setIsNewThreadAddLoading(true);
    try {
      await addDoc(collection(db, `reviewImages/${imageId}/threads`), {
        top: newThread.pos.top,
        left: newThread.pos.left,
        imageDimension: imageDimension,
        name: newThread.comment.name,
        initialComment: newThread.comment.value,
        timeStamp: Date.now(),
        color: newThread.color,
      });
      toast({
        title: "Comment added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      getThreads();
      setNewThread((prev: any) => {
        return {
          ...prev,
          isHidden: true,
        };
      });
      setIsNewThreadAddLoading(false);
    } catch (e) {
      console.error("Error", error);
      toast({
        title: "Something went wring please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      setIsNewThreadAddLoading(false);
    }
  };

  // Handle initial Image and threads load
  useEffect(() => {
    if (router.isReady) {
      if (!uname) {
        router.push(`/review-image/${imageId}/name`);
      } else {
        getImageDetails();
        getThreads();
      }
    }
  }, [router.isReady]);

  // Handle image rendering with different width and height
  const handleImage = () => {
    const width = imageRef.current?.clientWidth;
    setImageDimension({
      width: width as number,
      height: imageRef.current?.clientHeight as number,
    });
  };

  useEffect(() => {
    handleImage();
  }, [imageData, imageRef]);

  console.log(newThread.color);

  return (
    <div className="w-full flex flex-col h-screen bg-gray-900 text-white">
      {error ? (
        <div className=" flex justify-center flex-col items-center h-[80vh] w-screen text-4xl bg-gray-900">
          <p>Invalid URL</p>
          <button onClick={() => router.push("/")} className=" btn-p py-2 mt-5">
            Go back
          </button>
        </div>
      ) : (
        <div className=" flex w-full h-screen">
          <div className=" w-9/12">
            <div className=" flex items-center justify-between h-[8vh] bg-gray-800 px-5">
              <div
                className=" flex gap-2 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <img src="/logo.png" alt="" className=" w-10" />
                <p className=" text-lg font-semibold">FreeFlow</p>
              </div>
              <p className=" font-semibold">
                Click on the image anywhere to start commenting
              </p>
              <div className=" flex items-center gap-2">
                <p className=" font-semibold">Show Comments</p>
                <Switch
                  color="purple.500"
                  colorScheme="purple"
                  defaultChecked
                  value={isCommentsOn}
                  onChange={() => {
                    isCommentsOn === 1
                      ? setIsCommentsOn(0)
                      : setIsCommentsOn(1);
                  }}
                />
              </div>
            </div>
            <div className="h-[92vh] flex items-center px-10 justify-center ">
              <>
                <div className=" relative">
                  {isCommentsOn === 1 && (
                    <>
                      {threads.map((thread) => {
                        return (
                          <Markings
                            setIsFocusedThread={setIsFocusedThread}
                            highlightedComment={highlightedComment as IThread}
                            thread={thread}
                            imageDimension={imageDimension as IImageDimension}
                            setHighlightedComment={
                              setHighlightedComment as React.Dispatch<
                                React.SetStateAction<IThread>
                              >
                            }
                          />
                        );
                      })}
                    </>
                  )}
                  {newThread.isHidden ? null : (
                    <div
                      style={{
                        top: newThread.pos.top,
                        left: newThread.pos.left,
                      }}
                      className={`absolute text-gray-800 flex ${
                        newThread.pos.top > 550 ? "items-end" : "items-start"
                      } ${
                        newThread.pos.left > 500
                          ? "flex-row-reverse"
                          : " flex-row"
                      }`}
                    >
                      {!isNewThreadAddLoading ? (
                        <>
                          <div className=" hidden text-red-500"></div>
                          <div className=" hidden text-green-500"></div>
                          <div className=" hidden text-blue-500"></div>
                          <div
                            className={`w-7 h-7 rounded-t-full rounded-r-full bg-${newThread.color} ring ring-white`}
                          ></div>
                          <div
                            className={` text-white bg-gray-800 w-72 p-2 rounded absolute ${
                              newThread.pos.left > 500 ? "right-10" : "left-10"
                            }  z-50`}
                          >
                            <div className=" flex justify-between items-center mb-2">
                              <p className=" text-sm font-semibold">
                                Add your comment
                              </p>
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
                                        name: uname,
                                      },
                                    };
                                  });
                                }}
                              />
                              <div className=" mt-3 flex gap-2">
                                <div
                                  onClick={() => {
                                    setNewThread((prev) => {
                                      return { ...prev, color: "gray-900" };
                                    });
                                  }}
                                  className="rounded-full ring-2 w-5 h-5 bg-gray-900 cursor-pointer active:ring-4"
                                ></div>
                                <div
                                  onClick={() => {
                                    setNewThread((prev) => {
                                      return { ...prev, color: "white" };
                                    });
                                  }}
                                  className="rounded-full ring-2 w-5 h-5 bg-white cursor-pointer active:ring-4"
                                ></div>
                                <div
                                  onClick={() => {
                                    setNewThread((prev) => {
                                      return { ...prev, color: "green-500" };
                                    });
                                  }}
                                  className="rounded-full ring-2 w-5 h-5 bg-green-500 cursor-pointer active:ring-4"
                                ></div>
                                <div
                                  onClick={() => {
                                    setNewThread((prev) => {
                                      return { ...prev, color: "blue-500" };
                                    });
                                  }}
                                  className="rounded-full ring-2 w-5 h-5 bg-blue-500 cursor-pointer active:ring-4"
                                ></div>
                                <div
                                  onClick={() => {
                                    setNewThread((prev) => {
                                      return { ...prev, color: "red-500" };
                                    });
                                  }}
                                  className="rounded-full ring-2 w-5 h-5 bg-red-500 cursor-pointer active:ring-4"
                                ></div>
                                <button
                                  disabled={!!!newThread.comment.value}
                                  className="bg-purple-500 hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-400  ml-2 p-1 rounded px-2 transition-all"
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
                  <div
                    // style={{ width: imageDimension.width, height: imageDimension.height }}
                    ref={commentRef}
                    className="flex justify-center items-center"
                  >
                    <div onClick={handleClick} className="cursor-crosshair">
                      <img
                        src={imageData?.imageURL}
                        ref={imageRef}
                        className=" rounded-lg"
                        onClick={handleClick}
                        onLoad={handleImage}
                      />
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
          <div className=" bg-gray-800 w-3/12 h-screen">
            <div className="h-[8vh] bg-purple-500 flex flex-col justify-center items-center">
              <h2 className=" text-lg font-semibold">{imageData?.imageName}</h2>
              <div className=" flex gap-2 flex-wrap">
                <p className=" text-sm">Uploaded by {imageData?.uploadedBy}</p>
                <Moment fromNow className="text-sm">
                  {imageData?.timeStamp}
                </Moment>
              </div>
            </div>
            <div className=" h-[92vh] overflow-y-scroll">
              {isFocusedThread ? (
                <ThreadsExpanded
                  setHighlightedComment={setHighlightedComment}
                  setIsFocusedThread={setIsFocusedThread}
                  uname={uname as string}
                  imageId={imageId as string}
                  highlightedComment={highlightedComment as IThread}
                />
              ) : (
                <div>
                  {isThreadsLoading ? (
                    <div className=" flex flex-col gap-1.5 mt-2">
                      <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                      <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                      <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                      <div className=" rounded h-14 mx-2 animate-pulse bg-gray-700"></div>
                    </div>
                  ) : (
                    <>
                      {threads.length > 0 ? (
                        <div>
                          {threads.map((thread, index) => {
                            return (
                              <>
                                {thread.imageDimension ? (
                                  <SidebarComments
                                    key={index}
                                    thread={thread}
                                    setHighlightedComment={
                                      setHighlightedComment as React.Dispatch<
                                        React.SetStateAction<IThread>
                                      >
                                    }
                                    setIsFocusedThread={setIsFocusedThread}
                                  />
                                ) : (
                                  <div className=" text-center mt-5 font-semibold px-2">
                                    This version is outdated. <br />
                                    Please switch to new version by uploading
                                    the image again.
                                  </div>
                                )}
                              </>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className=" font-semibold mt-4">
                            No reviews on this image !
                          </p>
                          <p className=" mt-1">Add first to add a review.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewImage;
