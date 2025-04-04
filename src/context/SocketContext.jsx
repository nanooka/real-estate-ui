import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const URL = import.meta.env.VITE_SOCKET_URL_LOCAL;
// const URL = import.meta.env.VITE_SOCKET_URL_DEPLOYMENT;

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   setSocket(io("http://localhost:4000"));
  // }, []);

  // useEffect(() => {
  //   setSocket(io("https://real-estate-socket-v13t.onrender.com"));
  // }, []);

  useEffect(() => {
    setSocket(io(URL));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
