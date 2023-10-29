import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspace } from "@/interfaces/Workspace";
import { Spin } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

interface Props {
  isAuthRequired: boolean;
  children: ReactElement;
}

const FFPage: React.FC<Props> = ({ children, isAuthRequired }) => {
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { authUser } = useAuth();
  const { fetchWorkspace } = useWorkspaceContext();

  const checkWorkspace = async () => {
    if (user) {
      const data: IWorkspace =
        user.workspaces && (await fetchWorkspace(user.workspaces[0].id));

      if (data?.isCompleted === false) router.push("/auth");
      else router.push("/");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    console.log(user);
    if (authUser) {
      if (authUser.emailVerified === false) {
        router.push("/auth");
      } else if (user) {
        if (!user.name) router.push("/auth");
        else if (user.workspaces && user.workspaces[0].id) {
          checkWorkspace();
        } else {
          router.push("/");
        }
      } else {
        router.push("/auth");
      }
    } else {
      if (isAuthRequired) {
        router.push("/auth");
      }
    }
    setIsLoading(false);
  }, [user, authUser]);

  return (
    <div>
      {isLoading ? (
        <div className=" flex h-screen items-center justify-center bg-black">
          <Spin size="large" />
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default FFPage;
