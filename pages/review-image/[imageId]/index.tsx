import AddEmailAndPassword from "@/components/ImageReview/AddEmailAndPassword";
import CompareView from "@/components/ImageReview/CompareView";
import PreviewCanvas from "@/components/ImageReview/PreviewCanvas";
import ReviewCanvas from "@/components/ImageReview/ReviewCanvas";
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
} from "@/helpers/constants";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { IReview } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  const [threads, setThreads] = useState<IReview[]>([]);
  const [isCommentsOn, setIsCommentsOn] = useState<boolean>(true);
  const [highlightedComment, setHighlightedComment] = useState<IReview>(
    defaultHighlightedThread
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const [isFocusedThread, setIsFocusedThread] = useState<boolean>(false);
  const [isThreadsLoading, setIsThreadsLoading] = useState<boolean>(false);
  const [uname, setUname] = useState<string | undefined>("");
  const [isUnameValid, setIsUnameValid] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [version, setVersion] = useState<number>();
  const [isCompareView, setIsCompareView] = useState<boolean>(false);

  const { authUser } = useAuth();
  const { user } = useUserContext();

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
      setThreads(_comments as IReview[]);
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
  useEffect(() => {
    if (router.isReady) {
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
                                    {`Version ${imageData.imageURL.length - index
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
                      <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-5 ">
                        <>
                        {highlightedComment.imageURL ? (
                          <div className=" w-full">
                            <PreviewCanvas imageSrc={highlightedComment.imageURL} height="85vh" />
                          </div>
                        ) : (
                          <div className=" w-full">
                            <ReviewCanvas imageSrc={imageData?.currentVersion
                              ? imageData?.imageURL[
                                (version as number) - 1
                              ]
                              : (imageData?.imageURL as any)}
                              imageId={imageId as string}
                              version={version as number}
                              imageData={imageData as IReviewImageData}
                              uname={uname as string}
                              />
                          </div>
                        )}
                        </>
                      </div>
                    </div>
                  )}
                  {isCompareView ? null : (
                    <div className=" h-[calc(100vh-4rem)] w-3/12 bg-gray-800">
                      <div className=" h-[calc(100vh-4rem)] overflow-y-scroll">
                        {isFocusedThread ? (
                          <ThreadsExpanded
                             highlightedComment={highlightedComment as IReview}
                            setHighlightedComment={setHighlightedComment}
                            setIsFocusedThread={setIsFocusedThread}
                            uname={uname as string}
                            imageId={imageId as string}
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
                                          {thread.imageURL ? (
                                            <SidebarComments
                                              key={index}
                                              thread={thread}
                                              version={version as number}
                                              setHighlightedComment={
                                                setHighlightedComment as React.Dispatch<
                                                  React.SetStateAction<IReview>
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
