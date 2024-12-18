import { getJobs } from "@/Api/ApiJobs";
import { Input } from "@/components/ui/input";
import UseFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Jobcard from "@/components/Jobcard";
import { getcompanies } from "@/Api/ApiCompanies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const Joblisting = () => {
  const [location, setlocation] = useState("");
  const [company_id, setcompany_id] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(3);

  const { isLoaded } = useUser();

  const {
    fn: fnjobs,
    data: datajobs,
    loading: loadingjobs,
  } = UseFetch(getJobs, { location, company_id, searchQuery });

  const { fn: fnCompanies, data: Compaines } = UseFetch(getcompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      fnjobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const handlesearch = (e) => {
    e.preventDefault();
    const query = e.target["search-query"].value;
    if (query) {
      setsearchQuery(query);
    }
  };

  const filteredJobs = datajobs?.filter((job) => {
    const jobTitle = job?.title?.toLowerCase() || ""; // Safely access title
    const query = searchQuery?.toLowerCase() || "";
    return jobTitle.includes(query);
  });

  const clearFilters = () => {
    setcompany_id("");
    setlocation("");
    setsearchQuery("");
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs?.length / jobsPerPage);

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      <form
        className="h-14 flex flex-row w-full gap-2 items-center mb-3"
        onSubmit={handlesearch}
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          className="  h-full flex-1  px-4 text-md"
          name="search-query"
        />
        <Button type="submit" className=" h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setlocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter By Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem value={name} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={company_id}
          onValueChange={(value) => setcompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter By Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Compaines?.map(({ name, id }) => (
                <SelectItem value={id} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingjobs && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      {!loadingjobs && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentJobs?.length ? (
            currentJobs.map((datajob) => (
              <div key={datajob.id}>
                <Jobcard
                  datajob={datajob}
                  savedInit={datajob?.saved?.length > 0}
                />
              </div>
            ))
          ) : (
            <p>No jobs available</p>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-center gap-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Joblisting;
