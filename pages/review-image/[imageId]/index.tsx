import AddEmailAndPassword from "@/components/ImageReview/AddEmailAndPassword";
import Markings from "@/components/ImageReview/Markings";
import ReviewImageToolbarAdmin from "@/components/ImageReview/ReviewImageToolbarAdmin";
import ReviewImageToolbar from "@/components/ImageReview/ReviewToolbar";
import SidebarComments from "@/components/ImageReview/SidebarComments";
import ThreadsExpanded from "@/components/ImageReview/ThreadsExpanded";
import Navbar from "@/components/LandingPage/Navbar";
import ReviewImageMobile from "@/components/MobileView/ReviewImageMobile";
import VersionUploadModal from "@/components/VersionControl/VersionUploadModal";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import {
  defaultHighlightedThread,
  defaultNewThread,
} from "@/helpers/constants";
import { IImageDimension } from "@/interfaces/Image";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { IThread, INewThread } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

const ReviewImage = () => {
  const router = useRouter();
  const { imageId } = router.query;
  const [imageData, setImageData] = useState<IReviewImageData>();
  const [error, setError] = useState<boolean>(false);
  const [threads, setThreads] = useState<IThread[]>([]);
  const [isNewThreadAddLoading, setIsNewThreadAddLoading] =
    useState<boolean>(false);
  const [isCommentsOn, setIsCommentsOn] = useState<boolean>(true);
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
  const [uname, setUname] = useState<string | undefined>("");
  const [isUnameValid, setIsUnameValid] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [version, setVersion] = useState<number>();

  const { authUser } = useAuth();
  const { user } = useUserContext();

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const { left, top } = commentRef.current!.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    setNewThread((prev: any) => {
      return {
        ...prev,
        pos: { top: y, left: x },
        comment: { value: "" },
        color: "purple-500",
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
    onSnapshot(
      doc(db, "reviewImages", imageId as string),
      (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          setImageData(docSnap.data() as IReviewImageData);
          setVersion(docSnap.data().currentVersion);
        } else {
          setError(true);
          console.log("No such document!");
        }
      }
    );
  };

  // Get each thread on an image
  const getThreads = async () => {
    const q = query(
      collection(db, `reviewImages/${imageId}/threads`),
      orderBy("timeStamp", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const _comments: unknown[] = [];
      querySnapshot.forEach((doc) => {
        _comments.push({ ...doc.data(), id: doc.id });
      });
      setThreads(_comments as IThread[]);
    });
  };

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
      console.error("Error", error);
      toast({
        title: "Something went wring please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    getImageDetails();
  }, []);

  // Handle initial Image and threads load
  useEffect(() => {
    if (!authUser) {
      if (uname) {
        getThreads();
      }
    } else {
      getThreads();
    }
  }, [authUser, uname]);

  // Handle image rendering with different width and height
  const handleImage = () => {
    const width = imageRef.current?.clientWidth;
    setImageDimension({
      width: width as number,
      height: imageRef.current?.clientHeight as number,
    });
  };

  useEffect(() => {
    if (router.isReady) {
      handleImage();
      let isVisited = localStorage.getItem("isVisited");
      if (isVisited) {
        const visited_arr = isVisited.split(",");
        if (!visited_arr.includes(imageId as string)) {
          if (imageData) {
            isVisited = isVisited + "," + imageId;
            localStorage.setItem("isVisited", isVisited);
            updateDoc(doc(db, `reviewImages`, imageId as string), {
              views: (imageData?.views as number) + 1,
            });
          }
        }
      } else {
        if (imageData) {
          isVisited = imageId as string;
          localStorage.setItem("isVisited", isVisited);
          updateDoc(doc(db, `reviewImages`, imageId as string), {
            views: (imageData?.views as number) + 1,
          });
        }
      }
    }
  }, [imageData, imageRef, router.isReady]);

  useEffect(() => {
    const handleContextmenu = (e: any) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  useEffect(() => {
    if (authUser) {
      if (authUser.uid === imageData?.uploadedById) {
        setIsAdmin(true);
        setIsUnameValid(true);
      }
    }
  }, [authUser, imageData?.uploadedById]);

  return (
    <>
      {error ? (
        <>
          <Head>
            <title>FreeFlow | Invalid Link</title>
          </Head>
          <div className="flex h-screen flex-col bg-gray-900 ">
            <Navbar />
            <div className="flex flex-col items-center justify-center">
              <p className=" mt-40 text-4xl text-white">Invalid URL</p>
              <button
                onClick={() => {
                  if (user) {
                    router.push("/dashboard");
                  } else {
                    router.push("/");
                  }
                }}
                className=" btn-p mt-5 w-fit py-2 text-xl"
              >
                Go back
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {isUnameValid ? (
            <>
              <Head>
                <title>
                  {imageData?.imageName ? imageData.imageName : "Loading..."}
                </title>
              </Head>
              <div className=" md:hidden">
                <ReviewImageMobile imageData={imageData as IReviewImageData} />
              </div>
              <div className="hidden h-screen overflow-hidden bg-gray-900 text-white md:block">
                <div className="flex h-16 items-center justify-between bg-gray-800 px-5">
                  <div
                    className="flex cursor-pointer gap-2"
                    onClick={() => router.push("/")}
                  >
                    <img src="/freeflow.png" alt="" className=" w-32" />
                  </div>
                  <p className=" flex items-center justify-center gap-2 font-semibold">
                    {imageData?.imageName}{" "}
                    {imageData?.currentVersion ? (
                      <Menu>
                        <MenuButton className="rounded bg-purple-500 p-1 text-xs font-semibold text-white focus:outline-none">
                          {`v${version}`} <ChevronDownIcon />
                        </MenuButton>
                        <MenuList bgColor={"#475569"} border={0}>
                          {isAdmin && (
                            <MenuItem
                              className=" flex w-full justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                              bgColor={"#475569"}
                            >
                              <VersionUploadModal
                                prevImage={imageData as IReviewImageData}
                                pos="mid"
                              />
                            </MenuItem>
                          )}
                          {imageData?.imageURL.map((_, index) => {
                            return (
                              <MenuItem
                                className="font-sec flex justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                                bgColor={"#475569"}
                                key={index}
                                onClick={() => {
                                  setHighlightedComment(
                                    defaultHighlightedThread
                                  );
                                  setIsFocusedThread(false);
                                  setVersion(imageData.imageURL.length - index);
                                }}
                              >
                                {`Version ${imageData.imageURL.length - index}`}
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </Menu>
                    ) : (
                      <p className="text-sm text-red-500">Deprecated</p>
                    )}
                  </p>
                  {isAdmin ? (
                    <ReviewImageToolbarAdmin
                      imageData={imageData as IReviewImageData}
                      isCommentsOn={isCommentsOn}
                      setIsCommentsOn={setIsCommentsOn}
                    />
                  ) : (
                    <ReviewImageToolbar
                      imageData={imageData as IReviewImageData}
                      isCommentsOn={isCommentsOn}
                      setIsCommentsOn={setIsCommentsOn}
                    />
                  )}
                </div>
                <div className=" flex h-[calc(100vh-4rem)]">
                  <div className="w-9/12">
                    <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-10 ">
                      <>
                        <div className=" relative">
                          {isCommentsOn && (
                            <>
                              {threads.map((thread) => {
                                return (
                                  <>
                                    {version === thread.version && (
                                      <Markings
                                        setIsFocusedThread={setIsFocusedThread}
                                        highlightedComment={
                                          highlightedComment as IThread
                                        }
                                        thread={thread}
                                        imageDimension={
                                          imageDimension as IImageDimension
                                        }
                                        setHighlightedComment={
                                          setHighlightedComment as React.Dispatch<
                                            React.SetStateAction<IThread>
                                          >
                                        }
                                      />
                                    )}
                                  </>
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
                              className={`absolute flex text-gray-800 ${
                                newThread.pos.top > 550
                                  ? "items-end"
                                  : "items-start"
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
                                    className={`h-7 w-7 rounded-r-full rounded-t-full bg-${newThread.color} border border-white`}
                                  ></div>
                                  <div
                                    className={` absolute w-72 rounded bg-gray-800 p-2 text-white ${
                                      newThread.pos.left > 500
                                        ? "right-10"
                                        : "left-10"
                                    }  z-50`}
                                  >
                                    <div className=" mb-2 flex items-center justify-between">
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
                                                name: uname
                                                  ? uname.slice(
                                                      0,
                                                      uname.indexOf("@")
                                                    )
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
                          <div
                            // style={{ width: imageDimension.width, height: imageDimension.height }}
                            ref={commentRef}
                            className="flex items-center justify-center"
                          >
                            {imageData?.currentVersion ? (
                              <>
                                {version === imageData?.currentVersion && (
                                  <div
                                    onClick={handleClick}
                                    className="cursor-[url(/cursor/cursor.svg),_pointer] transition-all"
                                  >
                                    <img
                                      src={
                                        imageData?.imageURL[
                                          (version as number) - 1
                                        ]
                                      }
                                      ref={imageRef}
                                      className=" max-h-[85vh]"
                                      onClick={handleClick}
                                      onLoad={handleImage}
                                    />
                                  </div>
                                )}
                                {version !== imageData?.currentVersion && (
                                  <div>
                                    <img
                                      src={
                                        imageData?.imageURL[
                                          (version as number) - 1
                                        ]
                                      }
                                      ref={imageRef}
                                      className=" max-h-[85vh]"
                                      onLoad={handleImage}
                                    />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div>
                                <img
                                  src={
                                    imageData?.currentVersion
                                      ? imageData?.imageURL[
                                          (version as number) - 1
                                        ]
                                      : (imageData?.imageURL as any)
                                  }
                                  ref={imageRef}
                                  className=" max-h-[85vh]"
                                  onLoad={handleImage}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    </div>
                  </div>
                  <div className=" h-[calc(100vh-4rem)] w-3/12 bg-gray-800">
                    <div className=" h-[calc(100vh-4rem)] overflow-y-scroll">
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
                            <div className=" mt-2 flex flex-col gap-1.5">
                              <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
                              <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
                              <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
                              <div className=" mx-2 h-14 animate-pulse rounded bg-gray-700"></div>
                            </div>
                          ) : (
                            <>
                              <div className=" sticky top-0 flex gap-3 border-y border-black bg-gray-800 py-2 pl-2">
                                <p className=" font-sec font-semibold">
                                  Threads
                                </p>
                                <p className=" flex h-6 w-6 justify-center rounded-full bg-gray-600">
                                  {threads.length}
                                </p>
                              </div>
                              {threads.length > 0 ? (
                                <div>
                                  {threads.map((thread, index) => {
                                    return (
                                      <>
                                        {thread.imageDimension ? (
                                          <SidebarComments
                                            key={index}
                                            thread={thread}
                                            version={version as number}
                                            setHighlightedComment={
                                              setHighlightedComment as React.Dispatch<
                                                React.SetStateAction<IThread>
                                              >
                                            }
                                            setIsFocusedThread={
                                              setIsFocusedThread
                                            }
                                          />
                                        ) : (
                                          <div className=" mt-5 px-2 text-center font-semibold">
                                            This version is outdated. <br />
                                            Please switch to new version by
                                            uploading the image again.
                                          </div>
                                        )}
                                      </>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="mt-32 flex flex-col justify-center">
                                  <div className="p-4 text-center">
                                    <img src="/no-comments.png" alt="" />
                                    <p className=" font-sec">No Comments yet</p>
                                    <div className="my-10 h-0.5 w-full bg-gray-700"></div>
                                    <img
                                      src="/no-comments-left-arrow.png"
                                      alt=""
                                      className="p-10"
                                    />
                                    <p className=" font-sec text-gray-500">
                                      Click anywhere on the image to add a
                                      thread
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <AddEmailAndPassword
                imageData={imageData}
                setIsUnameValid={setIsUnameValid}
                uname={uname as string}
                setUname={setUname}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ReviewImage;
