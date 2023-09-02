import { useState } from "react";
import FirebaseAuth, {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";

import { sendEmailVerification } from "@firebase/auth";
import React, { useContext, useEffect } from "react";
import { Spin, message } from "antd";

export interface IAuthContext {
  authUser: FirebaseAuth.User | null;
  signUpWithGoogle: () => any;
  signupWithEmail: (email: string, password: string) => any;
  signinWithEmail: (email: string, password: string) => any;
  sendEmailVerificationToUser: () => any;
  logout: () => any;
}

const defaultValues: IAuthContext = {
  authUser: null,
  signUpWithGoogle: () => {},
  signupWithEmail: () => {},
  signinWithEmail: () => {},
  sendEmailVerificationToUser: () => {},
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

  const signupWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(result.user);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const signinWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      if (user.emailVerified === false) {
        message.error("Please verify your email");
        return;
      }
      if (user) {
        setAuthUser(user);
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const sendEmailVerificationToUser = async () => {
    try {
      auth.currentUser && (await sendEmailVerification(auth.currentUser));
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
    signupWithEmail,
    signinWithEmail,
    sendEmailVerificationToUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className=" flex h-screen items-center justify-center">
          <Spin />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
