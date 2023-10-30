/* eslint-disable no-undef */
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { IUser, IWorkspaceInUser } from "../interfaces/User";
import { useAuth } from "./AuthContext";
import { message } from "antd";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

interface IDefaultValues {
  user: null | Partial<IUser>;
  setUser: Dispatch<SetStateAction<Partial<IUser> | null>>;
  createUser: (uid: string, data: Partial<IUser>) => any;
  getUserData: () => any;
  updateUser: (data: Partial<IUser>) => any;
  addWorkspaceInUser: (userId: string, workspaceData: IWorkspaceInUser) => any;
  fetchWorkspaceInUser: (userId: string) => any;
}

const defaultValues: IDefaultValues = {
  user: null,
  setUser: () => {},
  createUser: () => {},
  getUserData: () => {},
  updateUser: () => {},
  addWorkspaceInUser: () => {},
  fetchWorkspaceInUser: () => {},
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

  const addWorkspaceInUser = async (
    userId: string,
    workspaceData: IWorkspaceInUser
  ) => {
    try {
      const UserWorkRef = doc(
        db,
        "users",
        userId,
        "workspaces",
        workspaceData.id
      );
      await setDoc(UserWorkRef, workspaceData);
    } catch (error) {
      message.error("Failed to add workspace in user");
    }
  };

  const fetchWorkspaceInUser = async (userId: string) => {
    try {
      const UserWorkRef = collection(db, "users", userId, "workspaces");
      const UserWorkSnap = await getDocs(UserWorkRef);
      let data: IWorkspaceInUser[] = [];
      UserWorkSnap.forEach((doc) => {
        data.push(doc.data() as IWorkspaceInUser);
      });
      return data;
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch workspace in user");
    }
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
    addWorkspaceInUser,
    fetchWorkspaceInUser,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
