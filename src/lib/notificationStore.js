// import { create } from "zustand";
// import apiRequest from "./apiRequest";

// export const useNotificationStore = create((set) => ({
//   number: 0,
//   fetch: async () => {
//     const res = await apiRequest("/users/notification");
//     set({ number: res.data });
//   },
//   decrease: () => {
//     set((prev) => ({ number: prev.number - 1 }));
//   },
//   reset: () => {
//     set({ number: 0 });
//   },
// }));

import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      // Retrieve user object from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // console.log(storedUser.user.token);

      if (!storedUser || !storedUser.user.token) {
        console.error("No user token found, can't fetch notifications");
        return;
      }

      const token = storedUser.user.token; // Get the token from the user object

      const res = await apiRequest.get("/users/notification", {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      });

      set({ number: res.data });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      set({ number: 0 });
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
