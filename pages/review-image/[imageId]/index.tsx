import AddEmailAndPassword from "@/components/ImageReview/AddEmailAndPassword";
import CompareView from "@/components/ImageReview/CompareView";
import Markings from "@/components/ImageReview/Markings";
import NewThread from "@/components/ImageReview/NewThread";
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
  useToast,
} from "@chakra-ui/react";
import {
  DocumentData,
  DocumentSnapshot,
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
  const [isCompareView, setIsCompareView] = useState<boolean>(false);

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
                    {isCompareView ? "" : imageData?.imageName}{" "}
                    {imageData?.currentVersion ? (
                      <>
                        {!isCompareView && (
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
                                      setVersion(
                                        imageData.imageURL.length - index
                                      );
                                    }}
                                  >
                                    {`Version ${
                                      imageData.imageURL.length - index
                                    }`}
                                  </MenuItem>
                                );
                              })}
                              <MenuItem
                                className=" flex w-full justify-center p-2 py-1 text-sm text-white hover:bg-purple-500"
                                bgColor={"#475569"}
                                onClick={() => {
                                  setIsCompareView(true);
                                }}
                              >
                                Compare Versions
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-red-500">Deprecated</p>
                    )}
                  </p>
                  {isAdmin ? (
                    <ReviewImageToolbarAdmin
                      imageData={imageData as IReviewImageData}
                      isCommentsOn={isCommentsOn}
                      setIsCommentsOn={setIsCommentsOn}
                      isCompareView={isCompareView}
                      setIsCompareView={setIsCompareView}
                    />
                  ) : (
                    <ReviewImageToolbar
                      imageData={imageData as IReviewImageData}
                      isCommentsOn={isCommentsOn}
                      setIsCommentsOn={setIsCommentsOn}
                      isCompareView={isCompareView}
                      setIsCompareView={setIsCompareView}
                    />
                  )}
                </div>
                <div className=" flex h-[calc(100vh-4rem)]">
                  {isCompareView ? (
                    <CompareView
                      imageData={imageData as IReviewImageData}
                      currentVersion={imageData?.currentVersion as number}
                    />
                  ) : (
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
                                          setIsFocusedThread={
                                            setIsFocusedThread
                                          }
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
                            <NewThread
                              newThread={newThread}
                              setNewThread={setNewThread}
                              isNewThreadAddLoading={isNewThreadAddLoading}
                              uname={uname as string}
                              version={version as number}
                              imageDimension={imageDimension as IImageDimension}
                              imageId={imageId as string}
                            />
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
                  )}
                  {isCompareView ? null : (
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
                                    {
                                      threads.filter(
                                        ({ version: versionDB }) =>
                                          versionDB === version
                                      ).length
                                    }
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
                                      <p className=" font-sec">
                                        No Comments yet
                                      </p>
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
                  )}
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
