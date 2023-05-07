/* eslint-disable no-undef */
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { IUser } from "../interfaces/User";
import { useAuth } from "./AuthContext";
import { useToast } from "@chakra-ui/react";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
  user: null | Partial<IUser>;
  setUser: Dispatch<SetStateAction<Partial<IUser> | null>>;
  createUser: (uid: string, data: Partial<IUser>) => any;
  getUserData: () => any;
}

const defaultValues: IDefaultValues = {
  user: null,
  setUser: () => {},
  createUser: () => {},
  getUserData: () => {},
};

const userContext = createContext(defaultValues);

export function useUserContext() {
  return useContext(userContext);
}

export const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Partial<IUser> | null>(defaultValues.user);
  const { authUser } = useAuth();
  const toast = useToast();

  const createUser = async (uid: string, data: Partial<IUser>) => {
    await setDoc(doc(db, "users", uid), data);
  };

  const getUserData = useCallback(async () => {
    try {
      if (authUser) {
        const uid = authUser.uid;
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          await createUser(authUser.uid, {
            name: authUser.displayName as string,
            email: authUser.email as string,
            imageURL: authUser.photoURL as string,
            createTime: Date.now(),
            storage: 1024,
          });
          setUser({
            name: authUser.displayName as string,
            email: authUser.email as string,
            imageURL: authUser.photoURL as string,
            createTime: Date.now(),
            storage: 1024,
          });
          toast({
            title: "Freeflow Account created.",
            description: "We've created your account for you.",
            status: "success",
            position: "bottom-right",
            duration: 5000,
            isClosable: true,
          });
          console.log("New user created!");
        }
      }
    } catch (e) {
      toast({
        title: "Something went wrong.",
        description: "Please try agin later.",
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });
      console.error(e);
    }
  }, [authUser]);

  console.log("user :", user);

  useEffect(() => {
    getUserData();
  }, [authUser, getUserData]);

  const value = {
    user,
    setUser,
    createUser,
    getUserData,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
