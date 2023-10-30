import { IReviewImageData } from "@/interfaces/ReviewImageData";
import { IWorkspace, IUserInWorkspace } from "@/interfaces/Workspace";
import { db } from "@/lib/firebaseConfig";
import { message } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

export interface IWorkspaceContext {
  currentWorkspace: IWorkspace;
  currentUserInWorkspace: IUserInWorkspace[];
  currentDesignInWorkspace: IReviewImageData[];
  fetchWorkspace: (workspaceId: string) => any;
  createWorkspace: (workspaceData: IWorkspace) => any;
  updateWorkspace: (workspaceId: string, workspaceData: IWorkspace) => any;
  deleteWorkspace: (workspaceId: string) => any;
  addUserInWorkspace: (workspaceId: string, userData: IUserInWorkspace) => any;
  fetchUserInWorkspace: (workspaceId: string) => any;
  fetchDesignInWorkspace: (workspaceId: string) => any;
}

const defaultValues: IWorkspaceContext = {
  currentWorkspace: {} as IWorkspace,
  currentUserInWorkspace: {} as IUserInWorkspace[],
  currentDesignInWorkspace: {} as IReviewImageData[],
  fetchWorkspace: () => {},
  createWorkspace: () => {},
  updateWorkspace: () => {},
  deleteWorkspace: () => {},
  addUserInWorkspace: () => {},
  fetchUserInWorkspace: () => {},
  fetchDesignInWorkspace: () => {},
};

const WorkspaceContext = createContext<IWorkspaceContext>(defaultValues);

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}

export function WorkspaceContextProvider({ children }: any) {
  const [currentWorkspace, setCurrentWorkspace] = useState<IWorkspace>(
    defaultValues.currentWorkspace
  );
  const [currentUserInWorkspace, setCurrentUserInWorkspace] = useState<
    IUserInWorkspace[]
  >(defaultValues.currentUserInWorkspace);
  const [currentDesignInWorkspace, setCurrentDesignInWorkspace] = useState<
    IReviewImageData[]
  >(defaultValues.currentDesignInWorkspace);
  const fetchWorkspace = async (workspaceId: string) => {
    try {
      const WorkspaceRef = doc(db, "workspaces", workspaceId);
      const WorkspaceSnap = await getDoc(WorkspaceRef);
      if (WorkspaceSnap.exists()) {
        return WorkspaceSnap.data() as IWorkspace;
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch workspace");
    }
  };

  const createWorkspace = async (workspaceData: IWorkspace) => {
    try {
      const WorkspaceRef = collection(db, "workspaces");
      const WorkspaceSnap = await addDoc(WorkspaceRef, workspaceData);
      if (WorkspaceSnap) {
        return WorkspaceSnap.id;
      }
    } catch (error) {
      message.error("Failed to create workspace");
    }
  };

  const addUserInWorkspace = async (
    workspaceId: string,
    userData: IUserInWorkspace
  ) => {
    try {
      const WorkUserRef = doc(
        db,
        "workspaces",
        workspaceId,
        "collaborators",
        userData.id
      );
      await setDoc(WorkUserRef, userData);
    } catch (error) {
      message.error("Failed to add user in workspace");
    }
  };

  const fetchUserInWorkspace = async (workspaceId: string) => {
    try {
      const WorkUserRef = collection(
        db,
        "workspaces",
        workspaceId,
        "collaborators"
      );
      const WorkUserSnap = await getDocs(WorkUserRef);
      let data: IUserInWorkspace[] = [];
      WorkUserSnap.forEach((doc) => {
        doc.data().status === "Accepted" &&
          data.push(doc.data() as IUserInWorkspace);
      });
      return data;
    } catch (error) {
      message.error("Failed to fetch user in workspace");
    }
  };

  const updateWorkspace = async (
    workspaceId: string,
    workspaceData: IWorkspace
  ) => {
    try {
      const WorkspaceRef = doc(db, "workspaces", workspaceId);
      await updateDoc(WorkspaceRef, { ...workspaceData });
    } catch (error) {
      message.error("Failed to update workspace");
      console.log(error);
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      const WorkspaceRef = doc(db, "workspaces", workspaceId);
      await deleteDoc(WorkspaceRef);
    } catch (error) {
      message.error("Failed to delete workspace");
    }
  };

  const fetchDesignInWorkspace = async (workspaceId: string) => {
    try {
      const DesignRef = collection(db, "workspaces", workspaceId, "designs");
      const DesignSnap = await getDocs(DesignRef);
      let DesignData: IReviewImageData[] = [];
      DesignSnap.forEach((design) => {
        DesignData.push(design.data() as IReviewImageData);
      });
      return DesignData;
    } catch (error) {
      message.error("Failed to fetch design in workspace");
    }
  };

  const preFetch = async (workspaceId: string) => {
    const workData: IWorkspace = (await fetchWorkspace(
      workspaceId
    )) as IWorkspace;
    setCurrentWorkspace(workData);
    const userData: IUserInWorkspace[] = (await fetchUserInWorkspace(
      workspaceId
    )) as IUserInWorkspace[];
    setCurrentUserInWorkspace(userData);
    const designData: IReviewImageData[] = (await fetchDesignInWorkspace(
      workspaceId
    )) as IReviewImageData[];
    setCurrentDesignInWorkspace(designData);
  };

  useEffect(() => {
    const currentWorkspaceId = localStorage.getItem("currentWorkspaceId");
    if (currentWorkspaceId) {
      preFetch(currentWorkspaceId);
    }
  }, []);

  const value = {
    currentWorkspace,
    currentUserInWorkspace,
    currentDesignInWorkspace,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addUserInWorkspace,
    fetchUserInWorkspace,
    fetchDesignInWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
