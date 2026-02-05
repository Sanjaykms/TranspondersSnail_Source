import React, { createContext, useContext, useState } from "react";

// -----------------------------
// TYPES
// -----------------------------

export interface UserInfo {
  userId: string;
  userType: string;
}

export interface AuthContextType {
  isLogged: boolean;
  userInfo: UserInfo;
  loginHandler: (userId: string, userType: string) => void;
  logoutHandler: () => void;
}

// -----------------------------
// DEFAULT CONTEXT
// -----------------------------
const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  userInfo: { userId: "", userType: "" },
  loginHandler: () => {},
  logoutHandler: () => {},
});

// -----------------------------
// PROVIDER
// -----------------------------
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    userType: "",
  });

  const loginHandler = (userId: string, userType: string) => {
    setIsLogged(true);
    setUserInfo({ userId, userType });
    console.log({ userId, userType });
    console.log(isLogged);
  };

  const logoutHandler = () => {
    setIsLogged(false);
    setUserInfo({ userId: "", userType: "" });
  };

  return (
    <AuthContext.Provider
      value={{
        isLogged,
        userInfo,
        loginHandler,
        logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------
// HOOK
// -----------------------------
export const useAuthCxt = () => useContext(AuthContext);

export default AuthContextProvider;
