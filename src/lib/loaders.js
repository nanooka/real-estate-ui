import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.user?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const singlePageLoader = async ({ params }) => {
  const res = await apiRequest(`/posts/${params.id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const homePageLoader = async ({ request }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest(`/posts${query ? `?${query}` : ""}`, {
    headers: getAuthHeaders(),
  });

  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts", {
    headers: getAuthHeaders(),
  });
  const chatPromise = apiRequest("/chats", {
    headers: getAuthHeaders(),
  });
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
