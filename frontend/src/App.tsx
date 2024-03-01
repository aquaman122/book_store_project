import React from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Error from "./components/common/Error";
import ResetPassword from "./pages/ResetPassword"
import { BookStoreThemeProvider } from "./context/themeContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import OrderList from "./pages/OrderList";

const routerList = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/books",
    element: <Books />,
  },
  {
    path: "/signup",
    element: (      
      <Signup />      
    ),
  },
  {
    path: "/reset",
    element: (      
      <ResetPassword />      
    ),
  },
  {
    path: "/login",
    element: (      
      <Login />      
    ),
  },
  {
    path: "/book/:bookId",
    element: (      
      <BookDetail />      
    ),
  },
  {
    path: "/cart",
    element: (      
      <Cart />      
    ),
  },
  {
    path: "/order",
    element: (      
      <Order />
    ),
  },
  {
    path: "/orderlist",
    element: (
      <OrderList />
    ),
  },
];

const newRouteList = routerList.map((route) => {
  return {
    ...route,
    element: <Layout>{route.element}</Layout>,
    errorElemet: <Error />,
  }
})

const router = createBrowserRouter(newRouteList);

function App() {
  return (
    <>
    <BookStoreThemeProvider>
      <RouterProvider router={router} />
    </BookStoreThemeProvider>
    </>
  );
}

export default App;
