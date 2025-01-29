import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const getStoredUser = () => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    if (!storedData) return null;

    const now = new Date().getTime();

    console.log("Stored expiry:", storedData.expiry, "Current time:", now);

    if (now > storedData.expiry) {
      console.log("User session expired. Removing from storage.");
      localStorage.removeItem("user");
      return null;
    }
    return storedData.user;
  };

  // const [currentUser, setCurrentUser] = useState(
  //   JSON.parse(localStorage.getItem("user")) || null
  // );
  const [currentUser, setCurrentUser] = useState(getStoredUser());

  // const updateUser = (data) => {
  //   setCurrentUser(data);
  // };

  const updateUser = (data, expirationMinutes = 10080) => {
    const expiry = new Date().getTime() + expirationMinutes * 60 * 1000;
    console.log("New expiry set:", expiry);

    const userData = { user: data, expiry };
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(data);

    scheduleAutoLogOut(expiry - new Date().getTime());
  };

  const logout = () => {
    console.log("Logging out user.");
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const scheduleAutoLogOut = (remainingTime) => {
    console.log(`Scheduled auto-logout in ${remainingTime / 1000} seconds`);
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

        console.log(`Remaining session time: ${remainingTime / 1000} seconds`);

        if (remainingTime > 0) {
          scheduleAutoLogOut(remainingTime);
        } else {
          logout();
        }
      }
    }
  }, [currentUser]);

  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(currentUser));
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
