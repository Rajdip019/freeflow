/* eslint-disable no-undef */
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
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
import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { useToast } from "@chakra-ui/react";
import { useUserContext } from "./UserContext";
import { useRouter } from "next/router";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
  images: IReviewImageData[];
  setImages: Dispatch<SetStateAction<IReviewImageData[]>>;
  storage: number;
  getImages: () => any;
  deleteImage: (image: IReviewImageData) => any;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const defaultValues: IDefaultValues = {
  images: [],
  setImages: () => {},
  storage: 0,
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
  const [images, setImages] = useState<IReviewImageData[]>(
    defaultValues.images
  );
  const [storage, setStorage] = useState<number>(defaultValues.storage);
  const { authUser } = useAuth();
  const toast = useToast();
  const { user } = useUserContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const { onCopy, hasCopied } = useClipboard(value);

  const getImages = useCallback(async () => {
    if (authUser) {
      const imagesRef = collection(db, "reviewImages");
      const q = query(imagesRef, where("uploadedById", "==", authUser?.uid));
      onSnapshot(q, async (querySnapshot) => {
        const promises = querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as IReviewImageData;
          let password;
          if (data.isPrivate) {
            const passDocSnap = await getDoc(
              doc(db, "reviewImages", docSnap.id, "private/password")
            );
            password = passDocSnap.data()?.password;
          }
          const finalData = {
            // @ts-expect-error //
            id: docSnap.id,
            ...(password && { private: { password } }),
            ...data,
          } as IReviewImageData;
          return finalData;
        });
        const _images = await Promise.all(promises);
        setImages(_images);
        if (_images.length !== 0) {
          const sum = _images.reduce((accumulator, object: any) => {
            return accumulator + object.size;
          }, 0);
          const finalSum =
            Math.round((Math.round(sum * 100) / 100 / 1024) * 100) / 100;
          setStorage(finalSum);
        }
      });
    }
  }, [authUser]);

  const deleteImage = async (image: IReviewImageData) => {
    await deleteDoc(doc(db, "reviewImages", image.id as string));
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
  }, [authUser]);

  const value = {
    images,
    setImages,
    storage,
    getImages,
    deleteImage,
    searchQuery,
    setSearchQuery,
  };

  return (
    <imagesContext.Provider value={value}>{children}</imagesContext.Provider>
  );
};
