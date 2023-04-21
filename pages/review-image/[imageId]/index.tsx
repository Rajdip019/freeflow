import Comments from "@/components/ImageReview/Comments";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { db } from "@/lib/firebaseConfig";
import { Input, Spinner, Switch, useToast } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

interface INewThread {
  pos: {
    top: number;
    left: number;
  };
  comment: {
    name: string;
    value: string;
  };
  isHidden: boolean;
}

const ReviewImage = () => {
  const router = useRouter();
  const { imageId, uname } = router.query;
  const [imageData, setImageData] = useState<IReviewImageData>();
  const [error, setError] = useState<boolean>(false);
  const [threads, setThreads] = useState<{ top: number; left: number, id: string }[]>([]);
  const [isNewThreadAddLoading, setIsNewThreadAddLoading] = useState<boolean>(false);
  const [isCommentsOn, setIsCommentsOn] = useState<number>(1);
  const toast = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);
  const [newThread, setNewThread] = useState<INewThread>({
    pos: {
      top: 0,
      left: 0,
    },
    comment: {
      name: "",
      value: "",
    },
    isHidden: true,
  });

  const [imageDimension, setImageDimension] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({ width: undefined, height: undefined });

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const { left, top } = commentRef.current!.getBoundingClientRect();
    const x = event.clientX - left - 12;
    const y = event.clientY - top - 12;
    setNewThread((prev: any) => {
      return {
        ...prev,
        pos: { top: y, left: x },
        comment: { value: "" },
        isHidden: false,
      };
    });
    console.log(`Mouse position inside comment div: ${x}, ${y}`);
  };

  useEffect(() => {
    setImageDimension({
      width: imageRef.current?.width,
      height: imageRef.current?.height,
    });
  }, [imageRef.current]);


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

  const getThreads = async () => {
    const _comments: unknown[] = [];
    const querySnapshot = await getDocs(
      collection(db, `reviewImages/${imageId}/threads`)
    );
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      _comments.push({ ...doc.data(), id: doc.id });
    });
    setThreads(_comments as { top: number; left: number, id: string }[]);
  };

  const addNewThread = async () => {
    setIsNewThreadAddLoading(true);
    try {
      const docRef = await addDoc(
        collection(db, `reviewImages/${imageId}/threads`),
        {
          top: newThread.pos.top,
          left: newThread.pos.left,
        }
      );
      await addDoc(
        collection(
          db,
          `reviewImages/${imageId}/threads/${docRef.id as string}/comments`
        ),
        {
          name: newThread.comment.name,
          comment: newThread.comment.value,
          timeStamp: Date.now(),
        }
      );
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
      setIsNewThreadAddLoading(false)
    } catch (e) {
      console.error("Error", error);
      toast({
        title: "Something went wring please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      setIsNewThreadAddLoading(false)
    }

  };

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

  return (
    <div className="w-full flex flex-col h-screen bg-gray-900 text-white">
      <div className=" flex px-5 items-center justify-between py-10">
        <div className=" flex gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <img src="/logo.png" alt="" className=" w-10" />
          <p className=" text-lg font-semibold">FreeFlow</p>
        </div>
        <p className=" font-semibold">Click on the image anywhere to start commenting</p>
        <div className=" flex items-center gap-2">
          <p className=" font-semibold">Show Comments</p>
          <Switch color="purple.500" colorScheme="purple" defaultChecked value={isCommentsOn} onChange={() => { isCommentsOn === 1 ? setIsCommentsOn(0) : setIsCommentsOn(1) }} />
        </div>
      </div>
      {error ? (
        <div className=" flex justify-center flex-col items-center h-[80vh] w-screen text-4xl bg-gray-900">
          <p>Invalid URL</p>
          <button onClick={() => router.push("/")} className=" btn-p py-2 mt-5">
            Go back
          </button>
        </div>
      ) : (
        <>
          <div className="w-full flex h-[75vh] justify-center">
            {imageData?.imageURL ? (
              <>
                <div
                  className=" relative"
                  style={{
                    width: imageDimension.width,
                    height: imageDimension.height,
                  }}
                >
                  {isCommentsOn === 1 && (
                    <>
                      {threads.map((thread) => {
                        return (
                          <Comments uname={uname as string} imageId={imageId as string} top={thread.top} left={thread.left} key={thread.id} id={thread.id} />
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
                      className={`absolute text-gray-800 flex ${newThread.pos.top > 550 ? 'items-end' : 'items-start'} ${newThread.pos.left > 500 ? 'flex-row-reverse' : ' flex-row'}`}
                    >
                      {!isNewThreadAddLoading ? (
                        <>
                          <svg
                            fill="currentColor"
                            className="w-8 mb-1"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              clipRule="evenodd"
                              fillRule="evenodd"
                              d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z"
                            />
                          </svg>
                          <div className={` text-white bg-gray-800 w-64 p-2 rounded absolute ${newThread.pos.left > 500 ? 'right-10' : 'left-10'}  z-50`}>
                            <div className=" flex justify-between items-center mb-2">
                              <p className=" text-sm font-semibold">
                                Add your comment
                              </p>
                              <button onClick={() => {
                                setNewThread((prev: any) => {
                                  return {
                                    ...prev,
                                    isHidden: true,
                                  };
                                });
                              }}>
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
                            <div className=" flex">
                              <Input
                                className="h-5"
                                size="sm"
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
                        </>) : (<Spinner color="gray.800" />)}
                    </div>
                  )}
                  <div
                    // style={{ width: imageDimension.width, height: imageDimension.height }}
                    ref={commentRef}
                    className="flex justify-center h-[80vh] items-center"
                  >
                    <div
                      onClick={handleClick}
                      className="cursor-crosshair w-fit"
                    >
                      <img
                        src={imageData.imageURL}
                        ref={imageRef}
                        className=" h-[80vh] rounded-lg"
                        onClick={handleClick}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-11/12 h-[500px] mx-auto animate-pulse bg-gray-400 rounded-xl"></div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewImage;
