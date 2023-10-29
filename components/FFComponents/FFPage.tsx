import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspaceInUser } from "@/interfaces/User";
import { IWorkspace } from "@/interfaces/Workspace";
import { Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

interface Props {
  isAuthRequired: boolean;
  children: ReactElement;
}

const FFPage: React.FC<Props> = ({ children, isAuthRequired }) => {
  const { user, fetchWorkspaceInUser } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { authUser } = useAuth();
  const { fetchWorkspace } = useWorkspaceContext();

  const checkPath = async () => {
    setIsLoading(true);
    if (authUser) {
      if (authUser.emailVerified === false) {
        router.push("/auth");
      } else if (user) {
        const WorkUser: IWorkspaceInUser[] = await fetchWorkspaceInUser(
          authUser.uid
        );
        if (!user.name) router.push("/auth");
        else if (
          WorkUser &&
          WorkUser.filter((w) => w.role === "owner") &&
          WorkUser.filter((w) => w.role === "owner").length &&
          WorkUser.filter((w) => w.role === "owner")[0].id
        ) {
          const data: IWorkspace = await fetchWorkspace(
            WorkUser.filter((w) => w.role === "owner")[0].id
          );
          if (data?.isCompleted === false) router.push("/auth");
          else router.push("/");
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
  };

  useEffect(() => {
    checkPath();
  }, [user, authUser]);

  return (
    <div>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-black">
          <Spin size="large" />
          <Typography className="ml-3 text-white">Loading...</Typography>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default FFPage;
