import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { pathname } = useLocation();

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />;
  }

  if (
    user !== undefined &&
    !user.unsafeMetadata.role &&
    pathname != "/Onboarding"
  ) {
    return <Navigate to="/Onboarding" />;
  }

  return children;
};

export default ProtectedRoute;
