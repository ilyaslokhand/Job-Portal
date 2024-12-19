import { getApplications } from "@/Api/ApiApplication";
import useFetch from "@/Hooks/useFetch";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";
import { useUser } from "@clerk/clerk-react";

const CreatedApplications = () => {
  const { user } = useUser();
  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, [user.id]); // Add user.id as a dependency

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications && applications.length > 0 ? (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
            title={application.Jobs?.title ?? "No title"} // Safe access with fallback
            companyName={application.Jobs?.company?.name ?? "No company name"} // Safe access with fallback
          />
        ))
      ) : (
        <div>No applications found.</div>
      )}
    </div>
  );
};

export default CreatedApplications;
