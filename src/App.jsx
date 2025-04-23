import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ListPage from "./routes/listPage/ListPage";
import HomePage from "./routes/homePage/HomePage";
import { Layout, RequireAuth } from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/SinglePage";
import Login from "./routes/login/Login";
import ProfilePage from "./routes/profilePage/ProfilePage";
import Register from "./routes/register/Register";
import ProfileUpdatePage from "./routes/profileUpdatePage/ProfileUpdatePage";
import NewPostPage from "./routes/newPostPage/NewPostPage";
import FaqsPage from "./routes/faqsPage/FaqsPage";
import {
  homePageLoader,
  // listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders";
import ContactPage from "./routes/contactPage/ContactPage";
import AboutUs from "./routes/aboutUsPage/AboutUs";
import User from "./routes/user/User";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          loader: homePageLoader,
        },
        // {
        //   path: "/listing",
        //   element: <ListPage />,
        //   loader: listPageLoader,
        // },
        {
          path: "/user/:userId",
          element: <User />,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/faqs",
          element: <FaqsPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        { path: "/aboutUs", element: <AboutUs /> },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
