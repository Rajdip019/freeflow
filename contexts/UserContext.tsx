/* eslint-disable no-undef */
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  deleteDoc,
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
import Lottie from "react-lottie-player";
import LogoLoading from "../public/LogoLoading.json";
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
  removeWorkspaceInUser: (userId: string, workspaceDataId: string) => any;
  fetchWorkspaceInUser: (userId: string) => any;
}

const defaultValues: IDefaultValues = {
  user: null,
  setUser: () => {},
  createUser: () => {},
  getUserData: () => {},
  updateUser: () => {},
  addWorkspaceInUser: () => {},
  removeWorkspaceInUser: () => {},
  fetchWorkspaceInUser: () => {},
};

const userContext = createContext(defaultValues);

export function useUserContext() {
  return useContext(userContext);
}

export const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Partial<IUser> | null>(defaultValues.user);
  const { authUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

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

  const removeWorkspaceInUser = async (
    userId: string,
    workspaceDataId: string
  ) => {
    try {
      const UserWorkRef = doc(
        db,
        "users",
        userId,
        "workspaces",
        workspaceDataId
      );
      await deleteDoc(UserWorkRef);
    } catch (error) {
      message.error("Failed to remove workspace in user");
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
        setLoading(true);
        const uid = authUser.uid;
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
        setLoading(false);
        return docSnap.data();
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
    removeWorkspaceInUser,
    addWorkspaceInUser,
    fetchWorkspaceInUser,
  };

  return (
    <>
      {loading ? (
        <div className=" flex h-screen items-center justify-center bg-black">
          <Lottie
            loop
            style={{ width: 200, height: 200 }}
            animationData={LogoLoading}
            play
          />
        </div>
      ) : (
        <userContext.Provider value={value}>{children}</userContext.Provider>
      )}
    </>
  );
};
