import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const getStoredUser = () => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    if (!storedData) return null;

    const now = new Date().getTime();

    if (now > storedData.expiry) {
      localStorage.removeItem("user");
      return null;
    }
    return storedData.user;
  };

  const [currentUser, setCurrentUser] = useState(getStoredUser());

  const updateUser = (data, expirationMinutes = 10080) => {
    const expiry = new Date().getTime() + expirationMinutes * 60 * 1000;

    const userData = { user: data, expiry };
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(data);

    console.log(data);

    scheduleAutoLogOut(expiry - new Date().getTime());
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const scheduleAutoLogOut = (remainingTime) => {
    setTimeout(() => {
      logout();
    }, remainingTime);
  };

  useEffect(() => {
    if (currentUser) {
      const storedData = JSON.parse(localStorage.getItem("user"));

      if (storedData) {
        const now = new Date().getTime();
        const remainingTime = storedData.expiry - now;

        if (remainingTime > 0) {
          scheduleAutoLogOut(remainingTime);
        } else {
          logout();
        }
      }
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
