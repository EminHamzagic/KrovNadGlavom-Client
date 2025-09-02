import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";

interface UserContextType {
  setLoginData: (token: string, user: User) => void;
  isUserLogged: () => boolean;
  token: string;
  logout: () => void;
  getRole: () => string | null;
  getId: () => string | number | null;
  user: User;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export default function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [token, setToken] = useState<string>("");

  const setLoginData = (token: string, user: User) => {
    setToken(token);
    setUser(user);
  };

  const isUserLogged = () => token !== "";

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
    setToken("");
  };

  return (
    <UserContext.Provider
      value={{
        setLoginData,
        isUserLogged,
        token,
        logout,
        getRole,
        getId,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
