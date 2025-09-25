import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Tokens, User } from "../types/user";
import Cookies from "js-cookie";

interface UserContextType {
  setLoginData: (accessToken: string, refreshToken: string, user: User) => void;
  isUserLogged: () => boolean;
  tokens: Tokens;
  logout: () => void;
  getRole: () => string | null;
  getId: () => string | number | null;
  getUserType: () => string;
  user: User;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export default function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [tokens, setTokens] = useState<Tokens>({} as Tokens);

  const setLoginData = (accessToken: string, refreshToken: string, user: User) => {
    setTokens({
      accessToken,
      refreshToken,
    });
    setUser(user);

    Cookies.set("accessToken", accessToken, { expires: 2 / 24 });
    Cookies.set("refreshToken", refreshToken, { expires: 2 / 24 });
    Cookies.set("user", JSON.stringify(user), { expires: 2 / 24 });
  };

  const isUserLogged = () => tokens.accessToken !== "";

  const getRole = () => {
    const userRole = user.role;
    return userRole || null;
  };

  const getId = () => {
    const id = user.id;
    return id || null;
  };

  const logout = () => {
    setUser({} as User);
    setTokens({} as Tokens);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
  };

  const getUserType = () => {
    if (user.role === "Admin") {
      return "Admin";
    }
    else if (user.role === "Manager") {
      if (user.agencyId)
        return "Agency";
      else
        return "Company";
    }
    else {
      return "User";
    }
  };

  return (
    <UserContext.Provider
      value={{
        setLoginData,
        isUserLogged,
        tokens,
        logout,
        getRole,
        getId,
        getUserType,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
