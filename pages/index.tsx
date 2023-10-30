import DesignHomePage from "@/components/DesignHomePage";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IUser, IWorkspaceInUser } from "@/interfaces/User";
import { IUserInWorkspace, IWorkspace } from "@/interfaces/Workspace";
import { db } from "@/lib/firebaseConfig";
import { Button, Input, Select, Spin, message } from "antd";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

type Props = {};

const Design = (props: Props) => {
  const {
    fetchWorkspace,
    currentWorkspace,
    currentDesignInWorkspace,
    currentUserInWorkspace,
    addUserInWorkspace,
  } = useWorkspaceContext();
  const { user, fetchWorkspaceInUser, addWorkspaceInUser } = useUserContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [workspaceInUser, setWorkspaceInUser] = useState<IWorkspaceInUser[]>(
    []
  );
  const [renderWorkspace, setRenderWorkspace] = useState<IWorkspace>();
  const [workspaceTab, setWorkspaceTab] = useState<string>();
  const [wrongInviteEmail, setWrongInviteEmail] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<string>("viewer");
  const [acceptWorkspaceID, setAcceptWorkspaceID] = useState<string>("");

  const fetchUserWork = async () => {
    if (authUser) {
      setLoading(true);
      const _workspaceInUser: IWorkspaceInUser[] = await fetchWorkspaceInUser(
        authUser.uid
      );
      setWorkspaceInUser(_workspaceInUser);
      if (
        currentWorkspace?.name &&
        currentUserInWorkspace?.filter((w) => w.id === authUser.uid).length > 0
      ) {
        setRenderWorkspace(currentWorkspace);
      } else {
        const idToFetch = _workspaceInUser?.filter(
          (user) => user.role === "owner"
        )[0]?.id;
        localStorage.setItem("currentWorkspaceId", idToFetch);
        const _workspaceData = await fetchWorkspace(idToFetch);
        setRenderWorkspace(_workspaceData);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWork();
  }, []);

  const fetchNewWorkspace = async () => {
    if (workspaceTab) {
      setLoading(true);
      const data = await fetchWorkspace(workspaceTab);
      setRenderWorkspace(data);
      localStorage.setItem("currentWorkspaceId", workspaceTab);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewWorkspace();
  }, [workspaceTab]);

  const handleInviteInWorkspace = async (email: string, role: string) => {
    const emailUserRef = collection(db, "users");
    const q = query(emailUserRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setWrongInviteEmail(true);
      message.error("No user found with this email");
    } else {
      const userData: IUser = querySnapshot.docs[0].data() as IUser;
      inviteUser(userData, querySnapshot.docs[0].id, role);
    }
  };

  const inviteUser = async (userData: IUser, id: string, role: string) => {
    if (renderWorkspace) {
      const currentWorkspaceId = localStorage.getItem("currentWorkspaceId");
      if (currentWorkspaceId) {
        const newUserInWorkspaceData: IUserInWorkspace = {
          id: id,
          role: role as "owner" | "admin" | "editor" | "viewer",
          name: userData.name,
          email: userData.email,
          inviteTime: Date.now(),
          imageURL: userData?.imageURL || "",
          status: "Pending",
        };

        // add workspace to the user sub collection

        const newWorkspaceInUserData: IWorkspaceInUser = {
          id: currentWorkspaceId as string,
          role: role as "owner" | "admin" | "editor" | "viewer",
          name: renderWorkspace.name,
          avatarUrl: "",
          status: "Pending",
        };
        try {
          await addUserInWorkspace(currentWorkspaceId, newUserInWorkspaceData);
          await addWorkspaceInUser(id, newWorkspaceInUserData);
          message.success("User invited successfully");
        } catch (err) {
          message.error("Failed to invite user");
        }
      }
    }
  };

  const acceptInvite = async (workspaceId: string) => {
    try {
      if (authUser) {
        const userRef = doc(
          db,
          "users",
          authUser.uid,
          "workspaces",
          workspaceId
        );
        const workRef = doc(
          db,
          "workspaces",
          workspaceId,
          "collaborators",
          authUser.uid
        );
        await updateDoc(userRef, { status: "Accepted" });
        await updateDoc(workRef, { status: "Accepted" });
        message.success("Invite accepted successfully");
      }
    } catch (err) {
      message.error("Failed to accept invite");
    }
  };

  // return loading ? (
  //   <Spin />
  // ) : (
  //   <>
  //     <div className="flex flex-col justify-center items-center h-screen w-screen">
  //       <Input
  //         placeholder="Enter user email"
  //         type="email"
  //         className="w-1/4"
  //         onChange={(e) => setInviteEmail(e.target.value)}
  //       />
  //       <Select
  //         className="w-[150px]"
  //         placeholder="Select role"
  //         defaultValue="viewer"
  //         onChange={(value) => setInviteRole(value)}
  //       >
  //         <Select.Option value="viewer">Viewer</Select.Option>
  //         <Select.Option value="editor">Editor</Select.Option>
  //         <Select.Option value="admin">Admin</Select.Option>
  //         <Select.Option value="owner">Owner</Select.Option>
  //       </Select>
  //       <Button
  //         onClick={() => handleInviteInWorkspace(inviteEmail, inviteRole)}
  //       >
  //         Invite
  //       </Button>

  //       <Input
  //         type="text"
  //         placeholder="Invite code"
  //         onChange={(e) => setAcceptWorkspaceID(e.target.value)}
  //       />
  //       <Button onClick={() => acceptInvite(acceptWorkspaceID)}>
  //         Accept Invite
  //       </Button>
  //     </div>
  //   </>
  // );
  return loading ? <Spin /> : <DesignHomePage />;
};

export default Design;
