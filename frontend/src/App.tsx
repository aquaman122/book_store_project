import React from "react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Error from "./components/common/Error";
import { BookStoreThemeProvider } from "./context/themeContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
    errorElement: <Error />,
  },
  {
    path: "/books",
    element: <Layout><div>도서 목록</div></Layout>,
  },
])

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
