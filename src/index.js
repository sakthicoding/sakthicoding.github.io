//Updated: 19-nov-2023 @Sakthi

//Import React Libraries
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Import Webpages
import Home from "./components/Home/home"
import HomeAdmin from "./components/Home/homeadmin"
import Payment from "./components/Payment/MakePayment/payment";
import ErrorPage from "./components/Error/errorPage"
import AddBeneficiary from "./components/Payment/AddBeneficiary/addBeneficiary";
import Login from "./components/Login/login";
import Signup from "./components/Signup/signup"
import Signout from "./components/Signout/signout";


//Routing Browser - Default
const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/payment",
    element: <Payment />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/homeadmin",
    element: <HomeAdmin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/addbeneficiary",
    element: <AddBeneficiary />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signout",
    element: <Signout />,
    errorElement: <ErrorPage />,
  }
])

//Creating a roor for rendering - Default
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode> 
  //enabling React Strict mode renders useEffect twice
  <RouterProvider router={router} />
  //</React.StrictMode>
);