import { useState } from "react";
import React, { useContext, useEffect } from "react";
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { IReview } from "@/interfaces/Thread";
import { db } from "@/lib/firebaseConfig";
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
import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";
import AddEmailAndPassword from "@/components/ImageReview/AddEmailAndPassword";
import ErrorFeedback from "@/components/ImageReview/ErrorFeedback";
import { defaultHighlightedThread } from "@/utils/constants";

export interface IFeedbackContext {
  imageData: IReviewImageData | undefined;
  threads: IReview[];
  version: number;
  setVersion: React.Dispatch<React.SetStateAction<number>>;
  isAdmin: boolean;
  uname: string | undefined;
  highlightedComment: IReview | undefined;
  setHighlightedComment: React.Dispatch<React.SetStateAction<IReview>>;
  isCompareView: boolean;
  setIsCompareView: React.Dispatch<React.SetStateAction<boolean>>;
  isFocusedThread: boolean;
  setIsFocusedThread: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: IFeedbackContext = {
  imageData: undefined,
  threads: [],
  version: 0,
  isAdmin: false,
  uname: "",
  highlightedComment: defaultHighlightedThread,
  setHighlightedComment: () => {},
  isCompareView: false,
  setIsCompareView: () => {},
  setVersion: () => {},
  isFocusedThread: false,
  setIsFocusedThread: () => {},
};

const FeedbackContext = React.createContext(defaultValues);

export function useFeedbackContext() {
  return useContext(FeedbackContext);
}

export function FeedbackContextProvider({ children }: any) {
  const router = useRouter();
  const { imageId } = router.query;
  const [imageData, setImageData] = useState<IReviewImageData | undefined>(
    defaultValues.imageData
  );
  const [error, setError] = useState<boolean>(false);
  const [threads, setThreads] = useState<IReview[]>(defaultValues.threads);
  const [uname, setUname] = useState<string | undefined>(defaultValues.uname);
  const [version, setVersion] = useState<number>(defaultValues.version);
  const [isUnameValid, setIsUnameValid] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(defaultValues.isAdmin);
  const [highlightedComment, setHighlightedComment] = useState<IReview>(
    defaultValues.highlightedComment as IReview
  );
  const [isCompareView, setIsCompareView] = useState<boolean>(
    defaultValues.isCompareView
  );
  const [isFocusedThread, setIsFocusedThread] = useState<boolean>(
    defaultValues.isFocusedThread
  );

  const { authUser } = useAuth();

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
  }, [imageData, router.isReady]);

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

  const value = {
    imageData,
    threads,
    version,
    isAdmin,
    uname,
    highlightedComment,
    setHighlightedComment,
    isCompareView,
    setIsCompareView,
    setVersion,
    isFocusedThread,
    setIsFocusedThread,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {error ? (
        <ErrorFeedback />
      ) : (
        <>
          {isUnameValid ? (
            <>{children}</>
          ) : (
            <AddEmailAndPassword
              imageData={imageData}
              setIsUnameValid={setIsUnameValid}
              uname={uname as string}
              setUname={setUname}
            />
          )}
        </>
      )}
    </FeedbackContext.Provider>
  );
}
