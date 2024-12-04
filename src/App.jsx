import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Applayout from "./Layout/Applayout";
import Landingpage from "./Pages/Landingpage";
import Onboarding from "./Pages/Onboarding";
import Myjob from "./Pages/Myjob";
import Joblisting from "./Pages/Joblisting";
import Job from "./Pages/Job";
import Savedjob from "./Pages/Savedjob";
import Postjob from "./Pages/Postjob";
import { ThemeProvider } from "./components/Theme-provider";
import ProtectedRoute from "./components/Route/Protected-Route";

// Define the router variable
const router = createBrowserRouter([
  {
    element: <Applayout />,
    children: [
      {
        path: "/",
        element: <Landingpage />,
      },
      {
        path: "/Onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/My-jobs",
        element: (
          <ProtectedRoute>
            <Myjob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Job-listing",
        element: (
          <ProtectedRoute>
            <Joblisting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Job/:id",
        element: (
          <ProtectedRoute>
            <Job />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Saved-job",
        element: (
          <ProtectedRoute>
            <Savedjob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Post-job",
        element: (
          <ProtectedRoute>
            <Postjob />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

// Use the defined router in the App component
const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
