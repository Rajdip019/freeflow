import { useState } from "react";
import React, { useContext, useEffect } from "react";
import { IReviewImage, IReviewImageVersion } from "@/interfaces/ReviewImageData";
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
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";
import AddEmailAndPassword from "@/components/ImageReview/AddEmailAndPassword";
import ErrorFeedback from "@/components/ImageReview/ErrorFeedback";
import { defaultHighlightedThread } from "@/utils/constants";
import { useWorkspaceContext } from "./WorkspaceContext";

export interface IFeedbackContext {
  image: IReviewImage | undefined;
  imageData: IReviewImageVersion[];
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
  image: undefined,
  imageData: [],
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
  const { renderWorkspace } = useWorkspaceContext();
  const { designId, workspaceId } = router.query;
  const workspace_id = workspaceId || renderWorkspace?.id;
  const [imageData, setImageData] = useState<IReviewImageVersion[]>(
    defaultValues.imageData
  );
  const [image, setImage] = useState<IReviewImage | undefined>(defaultValues.image);
  const [error, setError] = useState<boolean>(false);
  const [threads, setThreads] = useState<IReview[]>(defaultValues.threads);
  const [uname, setUname] = useState<string | undefined>(defaultValues.uname);
  const [version, setVersion] = useState<number>(defaultValues.version);
  const [isUnameValid, setIsUnameValid] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
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
      doc(db, `workspaces/${workspaceId}/designs/${designId}`),
      (docSnap: DocumentSnapshot<DocumentData>) => {
        if (docSnap.exists()) {
          setImage(docSnap.data() as IReviewImage);
          setVersion(docSnap.data().latestVersion);
        } else {
          setError(true);
        }
      }
    );
  };  

  const getVersions = async () => {
    const q = query(collection(db, `workspaces/${workspace_id}/designs/${designId}/versions`), orderBy("version", "asc"));
    onSnapshot(q, (querySnapshot) => {
        const _versions: IReviewImageVersion[] = [];
        querySnapshot.forEach((doc) => {
          _versions.push({ ...doc.data(), id: doc.id } as IReviewImageVersion);
        });
        setImageData((prev : any) => {
          return _versions as IReviewImageVersion[] ;
        });
      }
    )
  }

  // Get each thread on an image
  const getThreads = async () => {
    const q = query(
      collection(db, `workspaces/${workspace_id}/designs/${designId}/comments`),
      orderBy("version", "desc")
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
    getVersions();
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

  useEffect(() => {
    const handleContextmenu = (e: any) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);  

  const value = {
    image,
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
              imageData={image}
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
