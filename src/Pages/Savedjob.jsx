import { getSavedjobs } from "@/Api/ApiCompanies";
import Jobcard from "@/components/Jobcard";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";

const Savedjob = () => {
  const { isLoaded } = useUser();

  const {
    fn: fngetSavedjobs,
    error: errorgetSavedjobs,
    data: SavedJobs,
    loading: loadinggetSavedjobs,
  } = useFetch(getSavedjobs);

  useEffect(() => {
    if (isLoaded) {
      fngetSavedjobs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (SavedJobs) {
      console.log(SavedJobs); // Log the fetched SavedJobs data to verify its structure
    }
  }, [SavedJobs]);

  if (!isLoaded || loadinggetSavedjobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>
      {loadinggetSavedjobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SavedJobs?.length ? (
            SavedJobs.map((saved) => (
              <Jobcard
                key={saved.id}
                savedInit={true}
                datajob={saved?.Jobs}
                onJobAction={fngetSavedjobs}
              />
            ))
          ) : (
            <p>No Saved jobs available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Savedjob;
