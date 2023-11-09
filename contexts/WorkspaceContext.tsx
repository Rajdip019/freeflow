import { IReviewImage } from "@/interfaces/ReviewImageData";
import { IUser, IWorkspaceInUser } from "@/interfaces/User";
import { IWorkspace, IUserInWorkspace } from "@/interfaces/Workspace";
import { db } from "@/lib/firebaseConfig";
import { Spin, message } from "antd";
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
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useUserContext } from "./UserContext";
import Lottie from "react-lottie-player";
import LogoLoading from "../public/LogoLoading.json";

export interface IWorkspaceContext {
  renderWorkspace: IWorkspace | null;
  setRenderWorkspace: Dispatch<SetStateAction<IWorkspace | null>>;
  setWorkspaceInUser: Dispatch<SetStateAction<IWorkspaceInUser[]>>;
  setCurrentUserInWorkspace: Dispatch<SetStateAction<IUserInWorkspace[]>>;
  workspaceInUser: IWorkspaceInUser[];
  currentUserInWorkspace: IUserInWorkspace[];
  currentDesignInWorkspace: IReviewImage[];
  fetchFullWorkspace: (workspaceId: string) => any;
  fetchWorkspace: (workspaceId: string) => any;
  createWorkspace: (workspaceData: IWorkspace) => any;
  updateWorkspace: (workspaceId: string, workspaceData: IWorkspace) => any;
  deleteWorkspace: (workspaceId: string) => any;
  addUserInWorkspace: (workspaceId: string, userData: IUserInWorkspace) => any;
  removeUserFromWorkspace: (workspaceId: string, userId: string) => any;
  fetchUserInWorkspace: (workspaceId: string) => any;
  fetchDesignInWorkspace: (workspaceId: string) => any;
  fetchInitialWorkspace: () => any;
}

const defaultValues: IWorkspaceContext = {
  renderWorkspace: null,
  setRenderWorkspace: () => {},
  setWorkspaceInUser: () => {},
  fetchFullWorkspace: () => {},
  workspaceInUser: [] as IWorkspaceInUser[],
  currentUserInWorkspace: {} as IUserInWorkspace[],
  currentDesignInWorkspace: {} as IReviewImage[],
  setCurrentUserInWorkspace: () => {},
  fetchWorkspace: () => {},
  createWorkspace: () => {},
  updateWorkspace: () => {},
  deleteWorkspace: () => {},
  addUserInWorkspace: () => {},
  removeUserFromWorkspace: () => {},
  fetchUserInWorkspace: () => {},
  fetchDesignInWorkspace: () => {},
  fetchInitialWorkspace: () => {},
};

const WorkspaceContext = createContext<IWorkspaceContext>(defaultValues);

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}

export function WorkspaceContextProvider({ children }: any) {
  const [currentUserInWorkspace, setCurrentUserInWorkspace] = useState<
    IUserInWorkspace[]
  >(defaultValues.currentUserInWorkspace);
  const [currentDesignInWorkspace, setCurrentDesignInWorkspace] = useState<
    IReviewImage[]
  >(defaultValues.currentDesignInWorkspace);
  const [renderWorkspace, setRenderWorkspace] = useState<IWorkspace | null>(
    defaultValues.renderWorkspace
  );
  const [workspaceInUser, setWorkspaceInUser] = useState<IWorkspaceInUser[]>(
    defaultValues.workspaceInUser
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [sideLoading, setSideLoading] = useState<boolean>(false);
  const { fetchWorkspaceInUser } = useUserContext();

  const { authUser } = useAuth();

  const fetchWorkspace = async (workspaceId: string) => {
    try {
      const WorkspaceRef = doc(db, "workspaces", workspaceId);
      const WorkspaceSnap = await getDoc(WorkspaceRef);
      if (WorkspaceSnap.exists()) {
        return {
          id: WorkspaceSnap.id,
          ...WorkspaceSnap.data(),
        } as IWorkspace;
      }
    } catch (error) {
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

  const removeUserFromWorkspace = async (
    workspaceId: string,
    userId: string
  ) => {
    try {
      const WorkUserRef = doc(
        db,
        "workspaces",
        workspaceId,
        "collaborators",
        userId
      );
      await deleteDoc(WorkUserRef);
    } catch (error) {
      message.error("Failed to remove user in workspace");
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
      let DesignData: IReviewImage[] = [];
      DesignSnap.forEach((design) => {
        DesignData.push(design.data() as IReviewImage);
      });
      return DesignData;
    } catch (error) {
      message.error("Failed to fetch design in workspace");
    }
  };

  useEffect(() => {
    fetchInitialWorkspace();
  }, []);

  const fetchInitialWorkspace = async () => {
    try {
      setLoading(true);
      // Get the initial workspace from local storage
      const currentWorkspaceId = localStorage.getItem("currentWorkspaceId");
      if (authUser) {
        // fetch current users workspace and filter by accepted ones
        const allWorkspace = await fetchWorkspaceInUser(authUser.uid);
        const newWorkspace = allWorkspace.filter(
          (workspace: IWorkspaceInUser) => workspace.status === "Accepted"
        );
        setWorkspaceInUser(newWorkspace);

        if (currentWorkspaceId) {
          // fetch user in this workspace, check if current user is allowed, then fetch all other necessary information
          const userInWorkspace = await fetchUserInWorkspace(
            currentWorkspaceId
          );
          if (
            userInWorkspace?.some((user) => user.id === authUser.uid) &&
            userInWorkspace.filter((user) => user.id === authUser.uid)[0]
              .status === "Accepted"
          ) {
            const workspaceData = await fetchWorkspace(currentWorkspaceId);
            const workspaceDesigns = await fetchDesignInWorkspace(
              currentWorkspaceId
            );
            setCurrentUserInWorkspace(userInWorkspace);
            workspaceData && setRenderWorkspace(workspaceData);
            workspaceDesigns && setCurrentDesignInWorkspace(workspaceDesigns);
            // else case fetch from the users workspace
          } else await fetchFullWorkspace(newWorkspace[0].id);
        } else await fetchFullWorkspace(newWorkspace[0].id);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // const fetchInitialWorkspace = async () => {
  //   if (authUser) {
  //     const workspaceInUser = await fetchWorkspaceInUser(authUser.uid);
  //     const filteredWorkspace = workspaceInUser.filter(
  //       (workspace: IWorkspaceInUser) => workspace.status === "Accepted"
  //     );
  //     setWorkspaceInUser(filteredWorkspace as IWorkspaceInUser[]);
  //     const currentWorkspaceId = localStorage.getItem("currentWorkspaceId");
  //     if (currentWorkspaceId) {
  //       const _currentWorkspace = await fetchWorkspace(currentWorkspaceId);
  //       const userInWorkspace = await fetchUserInWorkspace(currentWorkspaceId);
  //       if (
  //         userInWorkspace &&
  //         userInWorkspace?.filter(
  //           (user: IUserInWorkspace) => user.id === authUser.uid
  //         ).length > 0 &&
  //         userInWorkspace?.filter(
  //           (user: IUserInWorkspace) => user.id === authUser.uid
  //         )[0].status === "Accepted"
  //       ) {
  //         setRenderWorkspace(_currentWorkspace as IWorkspace);
  //         setCurrentUserInWorkspace(userInWorkspace as IUserInWorkspace[]);
  //         const designInWorkspace = await fetchDesignInWorkspace(
  //           currentWorkspaceId
  //         );
  //         setCurrentDesignInWorkspace(designInWorkspace as IReviewImageData[]);
  //       } else {
  //         fetchOtherWorkspace();
  //       }
  //     } else {
  //       fetchOtherWorkspace();
  //     }
  //   }
  // };

  // const fetchOtherWorkspace = async () => {
  //   if (authUser) {
  //     const _workspaceInUser = await fetchWorkspaceInUser(authUser?.uid);
  //     const workspaceInUser = _workspaceInUser.filter(
  //       (workspace: IWorkspaceInUser) => workspace.status === "Accepted"
  //     );
  //     if (workspaceInUser && workspaceInUser.length > 0) {
  //       const _currentWorkspace = await fetchWorkspace(workspaceInUser[0].id);
  //       setRenderWorkspace(_currentWorkspace as IWorkspace);
  //       const userInWorkspace = await fetchUserInWorkspace(
  //         workspaceInUser[0].id
  //       );
  //       setCurrentUserInWorkspace(userInWorkspace as IUserInWorkspace[]);
  //       const designInWorkspace = await fetchDesignInWorkspace(
  //         workspaceInUser[0].id
  //       );
  //       setCurrentDesignInWorkspace(designInWorkspace as IReviewImageData[]);
  //     }
  //   }
  // };

  const fetchFullWorkspace = async (workspaceId: string) => {
    setSideLoading(true);
    const workspace = await fetchWorkspace(workspaceId);
    const userInWorkspace = await fetchUserInWorkspace(workspaceId);
    const designInWorkspace = await fetchDesignInWorkspace(workspaceId);
    setRenderWorkspace(workspace as IWorkspace);
    setCurrentUserInWorkspace(userInWorkspace as IUserInWorkspace[]);
    setCurrentDesignInWorkspace(designInWorkspace as IReviewImage[]);
    setSideLoading(false);
  };

  const value = {
    renderWorkspace,
    setRenderWorkspace,
    setWorkspaceInUser,
    setCurrentUserInWorkspace,
    fetchFullWorkspace,
    workspaceInUser,
    fetchInitialWorkspace,
    currentUserInWorkspace,
    currentDesignInWorkspace,
    fetchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addUserInWorkspace,
    removeUserFromWorkspace,
    fetchUserInWorkspace,
    fetchDesignInWorkspace,
  };

  return loading ? (
    <div className=" flex h-screen items-center justify-center bg-black">
      <Lottie
        loop
        style={{ width: 200, height: 200 }}
        animationData={LogoLoading}
        play
      />
    </div>
  ) : (
    <WorkspaceContext.Provider value={value}>
      <Spin
        wrapperClassName="bg-black h-screen"
        spinning={sideLoading}
        indicator={
          <Lottie
            loop
            style={{ width: 200, height: 200 }}
            animationData={LogoLoading}
            play
          />
        }
      >
        {children}
      </Spin>
    </WorkspaceContext.Provider>
  );
}
