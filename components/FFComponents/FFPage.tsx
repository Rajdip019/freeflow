import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { IWorkspaceInUser } from "@/interfaces/User";
import { IWorkspace } from "@/interfaces/Workspace";
import { Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import LogoLoading from "../../public/LogoLoading.json";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Props {
  isAuthRequired: boolean;
  children: ReactElement;
}

const FFPage: React.FC<Props> = ({ children, isAuthRequired }) => {
  const { user, fetchWorkspaceInUser, getUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { authUser } = useAuth();
  const { fetchWorkspace } = useWorkspaceContext();

  const checkPath = async () => {
    // setIsLoading(true);
    if (authUser) {
      const uid = authUser.uid;
      let user;
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        user = docSnap.data();
      }
      if (authUser.emailVerified === false) {
        router.push("/auth");
      } else if (user) {
        const WorkUser: IWorkspaceInUser[] = await fetchWorkspaceInUser(
          authUser.uid
        );
        if (!user.name) {
          router.push("/auth");
        } else if (
          WorkUser &&
          WorkUser.filter((w) => w.role === "owner") &&
          WorkUser.filter((w) => w.role === "owner").length &&
          WorkUser.filter((w) => w.role === "owner")[0].id
        ) {
          const data: IWorkspace = await fetchWorkspace(
            WorkUser.filter((w) => w.role === "owner")[0].id
          );
          if (data?.isCompleted === false) {
            router.push("/auth");
          } else if (router.pathname === "/auth") {
            router.push("/");
          }
        } else if (router.pathname === "/auth") {
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
    // setIsLoading(false);
  };

  useEffect(() => {
    checkPath();
  }, [authUser]);

  return (
    <div>
      {isLoading ? (
        <div className=" flex h-screen items-center justify-center bg-black">
          <Lottie
            loop
            style={{ width: 200, height: 200 }}
            animationData={LogoLoading}
            play
          />
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default FFPage;
