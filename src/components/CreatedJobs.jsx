import { getmyjobs } from "@/Api/ApiCompanies";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import Jobcard from "./Jobcard";

const CreatedJobs = () => {
  const { user } = useUser();
  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getmyjobs, {
    Recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
  }, []); // Only fetch jobs once, when component mounts

  // Log the jobs data to check its structure
  useEffect(() => {
    if (createdJobs) {
      console.log("Created Jobs Data:", createdJobs);
    }
  }, [createdJobs]); // This will log the data whenever createdJobs changes

  return (
    <div>
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => (
              <Jobcard
                key={job.id}
                datajob={job}
                onJobAction={fnCreatedJobs}
                isMyJob
              />
            ))
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
