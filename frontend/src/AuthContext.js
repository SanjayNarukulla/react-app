import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (userToken) => {
    setToken(userToken);
    localStorage.setItem("token", userToken); // Optionally store token
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token"); // Optionally remove token
  };

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
