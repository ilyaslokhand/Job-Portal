import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { BarLoader } from "react-spinners";

const Myjob = () => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "Candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>
      {user?.unsafeMetadata?.role === "Candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default Myjob;
