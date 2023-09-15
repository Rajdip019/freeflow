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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { authUser } = useAuth();

  useEffect(() => {
    const verified = authUser?.emailVerified;
    if (authUser) {
      if (user) {
        setIsLoading(false);
      }
    } else {
      if (isAuthRequired && !verified) {
        router.push("/auth");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
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
