/* eslint-disable no-undef */
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { IReviewImage } from "@/interfaces/ReviewImageData";
import { useToast } from "@chakra-ui/react";
import { useUserContext } from "./UserContext";
import { useRouter } from "next/router";
import { useWorkspaceContext } from "./WorkspaceContext";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
  images: IReviewImage[];
  setImages: Dispatch<SetStateAction<IReviewImage[]>>;
  getImages: () => any;
  deleteImage: (image: IReviewImage) => any;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const defaultValues: IDefaultValues = {
  images: [],
  setImages: () => {},
  getImages: () => {},
  deleteImage: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
};

const imagesContext = createContext(defaultValues);

export function useImageContext() {
  return useContext(imagesContext);
}

export const ImageContextProvider = ({ children }: Props) => {
  const [images, setImages] = useState<IReviewImage[]>(
    defaultValues.images
  );
  const { authUser } = useAuth();
  const toast = useToast();
  const { user } = useUserContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { workspaceId } = router.query;
  const { renderWorkspace } = useWorkspaceContext();
  const workspace_id = workspaceId || renderWorkspace?.id;

  const getImages = useCallback(async () => {
    if (authUser) {
      const imagesRef = collection(db, `workspaces/${renderWorkspace?.id}/designs`);
      onSnapshot(imagesRef, async (querySnapshot) => {
        const promises = querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as IReviewImage;
          const finalData = {
            // @ts-ignore
            id: docSnap.id,
            ...data,
          } as IReviewImage;
          return finalData;
        });
        const _images = await Promise.all(promises);
        setImages(_images);
      });
    }
  }, [authUser, renderWorkspace?.id]);

  const deleteImage = async (design: IReviewImage) => {
    await deleteDoc(doc(db, `workspaces/${workspace_id}/designs/${design.id}`));
    toast({
      title: "Design Deleted Successfully.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
    if (user && router.pathname !== "/") {
      router.push("/");
    } else if (router.pathname === "/") {
      // console.log("🚀 > deleteImage > router.pathname", router.pathname);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    getImages();
  }, [authUser, renderWorkspace?.id]);

  console.log("🚀 > images", images);

  const value = {
    images,
    setImages,
    getImages,
    deleteImage,
    searchQuery,
    setSearchQuery,
  };

  return (
    <imagesContext.Provider value={value}>{children}</imagesContext.Provider>
  );
};
