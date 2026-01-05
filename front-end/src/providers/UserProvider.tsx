import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { UserContext } from "../contexts/UserContext";
import type { User } from "../contexts/UserContext";
import type { UserContextType } from "../contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import type { JWTTokenPayload } from "../types/JWTTokenPayload";
import { getAdmin, getDonor } from "@/services/auth"; // Importe as funções

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode<JWTTokenPayload>(token);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expirado, a remover o utilizador.");
          localStorage.removeItem("authToken");
          setUserState(null);
        } else {
          const fetchUserData = async () => {
            try {
              let userData;
              if (decoded.role === "DONOR") {
                userData = await getDonor(decoded.id, token);
              } else if (decoded.role === "ADMIN") {
                userData = await getAdmin(decoded.id, token);
              } else {
                throw new Error("Role inválida no token.");
              }
              setUserState(userData);
            } catch (error) {
              console.error("Falha ao buscar dados do usuário:", error);
              localStorage.removeItem("authToken");
              setUserState(null);
            }
          };

          fetchUserData();
        }
      } catch (err) {
        console.error("Token inválido:", err);
        localStorage.removeItem("authToken");
        setUserState(null);
      }
    }
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("authToken", user.accessToken);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUserState(null);
  };

  const contextValue: UserContextType = {
    user,
    setUser,
    logout,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
