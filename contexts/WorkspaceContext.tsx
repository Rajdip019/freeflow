import { IWorkspace } from "@/interfaces/Workspace";
import { db } from "@/lib/firebaseConfig";
import { message } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useState } from "react";

export interface IWorkspaceContext {
  workspaceId: string;
  workspaceData: IWorkspace;
  fetchWorkspace: (workspaceId: string) => any;
  createWorkspace: (workspaceData: IWorkspace) => any;
  updateWorkspace: (workspaceId: string, workspaceData: IWorkspace) => any;
  deleteWorkspace: (workspaceId: string) => any;
}

const defaultValues: IWorkspaceContext = {
  workspaceId: "",
  workspaceData: {} as IWorkspace,
  fetchWorkspace: () => {},
  createWorkspace: () => {},
  updateWorkspace: () => {},
  deleteWorkspace: () => {},
};

const WorkspaceContext = createContext<IWorkspaceContext>(defaultValues);

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}

export function WorkspaceContextProvider({ children }: any) {
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [workspaceData, setWorkspaceData] = useState<IWorkspace>(
    defaultValues.workspaceData
  );
  const fetchWorkspace = async (workspaceId: string) => {
    try {
      const WorkspaceRef = doc(db, "workspace", workspaceId);
      const WorkspaceSnap = await getDoc(WorkspaceRef);
      if (WorkspaceSnap.exists()) {
        setWorkspaceData(WorkspaceSnap.data() as IWorkspace);
        return WorkspaceSnap.data() as IWorkspace;
      }
    } catch (error) {
      message.error("Failed to fetch workspace");
    }
  };

  const createWorkspace = async (workspaceData: IWorkspace) => {
    try {
      const WorkspaceRef = collection(db, "workspace");
      const WorkspaceSnap = await addDoc(WorkspaceRef, workspaceData);
      if (WorkspaceSnap) {
        setWorkspaceId(WorkspaceSnap.id);
        return WorkspaceSnap.id;
      }
    } catch (error) {
      message.error("Failed to create workspace");
    }
  };

  const updateWorkspace = async (
    workspaceId: string,
    workspaceData: IWorkspace
  ) => {
    console.log(workspaceId);

    try {
      const WorkspaceRef = doc(db, "workspace", workspaceId);
      await updateDoc(WorkspaceRef, { ...workspaceData });
    } catch (error) {
      message.error("Failed to update workspace");
      console.log(error);
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      const WorkspaceRef = doc(db, "workspace", workspaceId);
      await deleteDoc(WorkspaceRef);
    } catch (error) {
      message.error("Failed to delete workspace");
    }
  };

  const value = {
    workspaceId: workspaceId,
    workspaceData: workspaceData,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
