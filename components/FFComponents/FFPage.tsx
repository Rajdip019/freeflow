import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserContext";
import { Spin } from "antd";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

interface Props {
  isAuthRequired: boolean;
  children: ReactElement;
}

const FFPage: React.FC<Props> = ({ children, isAuthRequired }) => {
  const { user } = useUserContext();
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (authUser && authUser.emailVerified) {
      if (user) {
        setIsLoading(false);
      }
    } else {
      if (isAuthRequired) {
        router.push("/auth/signup");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [user]);

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
