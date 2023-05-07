import { useState } from "react";
import FirebaseAuth, {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "@firebase/auth";
import React, { useContext, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

export interface IAuthContext {
  authUser: FirebaseAuth.User | null;
  signUpWithGoogle: () => any;
  logout: () => any;
}

const defaultValues: IAuthContext = {
  authUser: null,
  signUpWithGoogle: () => {},
  logout: () => {},
};

const AuthContext = React.createContext(defaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [userInitialized, setUserInitialized] = useState<boolean>(false)
  const [authUser, setAuthUser] = useState<FirebaseAuth.User | null>(
    defaultValues.authUser
  );
  const auth = getAuth();

  const googleAuthProvider = new GoogleAuthProvider();

  const signUpWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleAuthProvider);

    try {
      const user = result.user;
      if (user) {
        setAuthUser(user);
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/auth/signup";
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setAuthUser(user);
      setIsLoading(false);
    });
  }, [auth]);

  const value = {
    authUser,
    signUpWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className=" flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
