/* eslint-disable no-undef */
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
  user: null | Partial<IUser>;
  setUser: Dispatch<SetStateAction<Partial<IUser> | null>>;
  createUser: (uid: string, data: Partial<IUser>) => any;
  getUserData: () => any;
  updateUser: (data: Partial<IUser>) => any;
}

const defaultValues: IDefaultValues = {
  user: null,
  setUser: () => {},
  createUser: () => {},
  getUserData: () => {},
  updateUser: () => {},
};

const userContext = createContext(defaultValues);

export function useUserContext() {
  return useContext(userContext);
}

export const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Partial<IUser> | null>(defaultValues.user);
  const { authUser } = useAuth();

  const createUser = async (uid: string, data: Partial<IUser>) => {
    await setDoc(doc(db, "users", uid), data);
    setUser(data);
  };

  const getUserData = useCallback(async () => {
    try {
      if (authUser && authUser.emailVerified) {
        const uid = authUser.uid;
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [authUser]);

  const updateUser = async (data: Partial<IUser>) => {
    try {
      if (authUser) {
        const uid = authUser.uid;
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, data);
        setUser((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getUserData();
  }, [authUser, getUserData]);

  const value = {
    user,
    setUser,
    createUser,
    getUserData,
    updateUser,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
