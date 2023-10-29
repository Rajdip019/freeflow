import DesignHomePage from "@/components/DesignHomePage";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspaceInUser } from "@/interfaces/User";
import { IWorkspace } from "@/interfaces/Workspace";
import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";

type Props = {};

const Design = (props: Props) => {
  const {
    fetchWorkspace,
    currentWorkspace,
    currentDesignInWorkspace,
    currentUserInWorkspace,
  } = useWorkspaceContext();
  const { user, fetchWorkspaceInUser } = useUserContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [workspaceInUser, setWorkspaceInUser] = useState<IWorkspaceInUser[]>(
    []
  );
  const [renderWorkspace, setRenderWorkspace] = useState<IWorkspace>();
  const [workspaceTab, setWorkspaceTab] = useState<string>();

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

  // return loading ? (
  //   <Spin />
  // ) : (
  //   <>
  //     <div className="flex justify-center items-center h-screen w-screen">
  //       <Select
  //         placeholder="select workspace"
  //         value={workspaceTab}
  //         onChange={(val) => setWorkspaceTab(val)}
  //         style={{ width: "200px" }}
  //         options={[
  //           {
  //             label: "WewxGgOYy9drH9wq0US1",
  //             value: "WewxGgOYy9drH9wq0US1",
  //           },
  //           {
  //             label: "otXNSBP16flRjlSr1tVG",
  //             value: "otXNSBP16flRjlSr1tVG",
  //           },
  //         ]}
  //       />
  //     </div>
  //   </>
  // );
  return loading ? <Spin /> : <DesignHomePage />;
};

export default Design;
