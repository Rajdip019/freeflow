import { useState } from "react";
import FirebaseAuth, {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "@firebase/auth";

import { sendEmailVerification } from "@firebase/auth";
import React, { useContext, useEffect } from "react";
import { Spin, message } from "antd";
import { useUserContext } from "./UserContext";

export interface IAuthContext {
  authUser: FirebaseAuth.User | null;
  signUpWithGoogle: () => any;
  signupWithEmail: (email: string, password: string) => any;
  signinWithEmail: (email: string, password: string) => any;
  sendEmailVerificationToUser: () => any;
  forgotPassword: (email: string) => any;
  logout: () => any;
}

const defaultValues: IAuthContext = {
  authUser: null,
  signUpWithGoogle: () => {},
  signupWithEmail: () => {},
  signinWithEmail: () => {},
  sendEmailVerificationToUser: () => {},
  forgotPassword: () => {},
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
  const { setUser } = useUserContext();

  const googleAuthProvider = new GoogleAuthProvider();

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      if (user) {
        setAuthUser(user);
        return user;
      }
    } catch {
      message.error("Failed to authenticate with Google");
    }
  };

  const signupWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      if (user) {
        await sendEmailVerificationToUser();
        setAuthUser(user);
        return user;
      }
    } catch {
      message.error("Failed to create account: check your email and password");
    }
  };

  const signinWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (user) {
        setAuthUser(user);
        if (user.emailVerified === false) {
          message.error("Please verify your email");
        }
        return user;
      }
    } catch {
      message.error("Failed to authenticate: check your email and password");
    }
  };

  const sendEmailVerificationToUser = async () => {
    try {
      auth.currentUser && (await sendEmailVerification(auth.currentUser));
      message.success("Verification email sent successfully");
    } catch {
      message.error("Failed to send verification email, Wrong mail");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAuthUser(null);
    setUser(null);
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
    forgotPassword,
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
