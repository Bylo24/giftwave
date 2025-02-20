
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FrontCard } from "./pages/FrontCard";
import PreviewAnimation from "./pages/PreviewAnimation";
import GiftToken from "./pages/GiftToken";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FrontCard />,
  },
  {
    path: "/frontcard",
    element: <FrontCard />,
  },
  {
    path: "/previewanimation",
    element: <PreviewAnimation />,
  },
  {
    path: "/gifttoken",
    element: <GiftToken />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
