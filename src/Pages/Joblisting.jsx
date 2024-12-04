import { getJobs } from "@/Api/ApiJobs";
import { Input } from "@/components/ui/input";
import UseFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Jobcard from "@/components/Jobcard";

const Joblisting = () => {
  const [location, setlocation] = useState("");
  const [company_id, setcompany_id] = useState("");
  const [searchQuery, setsearchQuery] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnjobs,
    data: datajobs,
    loading: loadingjobs,
  } = UseFetch(getJobs, { location, company_id, searchQuery });

  useEffect(() => {
    if (isLoaded) {
      fnjobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      <form className="h-14 flex flex-row w-full gap-2 items-center mb-3">
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          className="  h-full flex-1  px-4 text-md"
        />
        <Button type="submit" className=" h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      {loadingjobs && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      {!loadingjobs && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datajobs?.length ? (
            datajobs.map((datajob) => (
              <div>
                {" "}
                {/* Ensure a unique key for each job */}
                <Jobcard key={datajob.id} datajob={datajob} />
              </div>
            ))
          ) : (
            <p>No jobs available</p> // Message for empty datajobs
          )}
        </div>
      )}
    </div>
  );
};

export default Joblisting;
