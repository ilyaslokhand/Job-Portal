import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Boxes,
  Briefcase,
  BriefcaseBusiness,
  Download,
  School,
} from "lucide-react";
import useFetch from "@/Hooks/useFetch";
import { updateappliations } from "@/Api/ApiApplication";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resumes;
    link.target = "_blank";
    link.click();
  };

  const {
    fn: fnupdateappliations,
    error: errorupdateappliations,
    loading: loadingupdateappliations,
  } = useFetch(updateappliations, {
    Job_id: application.job_id,
  });

  const handlestatuschange = (status) => {
    fnupdateappliations(status);
  };

  return (
    <Card>
      {loadingupdateappliations && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.Jobs?.title} at ${application?.Jobs?.company?.name}`
            : application?.Name}

          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} />
            {application?.Experience} years of experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.Education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} />
            Skills: {application?.Skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status:{application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handlestatuschange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
