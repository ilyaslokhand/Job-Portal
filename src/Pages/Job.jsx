import { getJobs, getSingleJob, UpdateHiringStatus } from "@/Api/ApiJobs";
import ApplicationCard from "@/components/ApplicationCard";
import ApplyJobDrawer from "@/components/Apply-Job";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
  SelectGroup,
} from "@/components/ui/select";
import UseFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MagnetIcon,
  MapPinIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobPage = () => {
  const { user, isLoaded } = useUser();

  const { id } = useParams();
  const {
    fn: fnjobs,
    data: datajobs,
    loading: loadingjobs,
  } = UseFetch(getSingleJob, { job_id: id });

  const {
    fn: fnHiringStatus,

    loading: loadingHiringStatus,
  } = UseFetch(UpdateHiringStatus, { job_id: id });

  const HandleStatusChange = (value) => {
    const isOpen = value === "Open";
    fnHiringStatus(isOpen).then(() => fnjobs());
  };

  useEffect(() => {
    if (isLoaded) fnjobs();
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (!datajobs) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {datajobs?.title}
        </h1>
        <img
          src={datajobs?.company?.logo_url}
          style={{ height: "48px" }}
          alt={datajobs?.title}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {datajobs?.Location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {datajobs?.Application?.length} Applicants
        </div>
        <div className="flex gap-2">
          {datajobs?.isOpen ? (
            <>
              <DoorOpen />
              Open
            </>
          ) : (
            <div>
              <DoorClosed /> Closed
            </div>
          )}
        </div>
      </div>
      {loadingHiringStatus && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      {datajobs?.Recruiter_id == user?.id && (
        <Select onValueChange={HandleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              datajobs?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" + (datajobs?.isOpen ? "(Open)" : "(Closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{datajobs?.Discription}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={datajobs?.Requirenments}
        className="bg-transparent sm:text-lg"
      />
      {datajobs?.Recruiter_id !== user?.id && (
        <ApplyJobDrawer
          datajobs={datajobs}
          user={user}
          fetchJob={fnjobs}
          applied={datajobs?.Application?.find(
            (ap) => ap.Candidate_id === user.id
          )}
        />
      )}
      {datajobs?.Application?.length > 0 &&
        datajobs?.Recruiter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
            {datajobs.Application.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        )}
    </div>
  );
};

export default JobPage;
