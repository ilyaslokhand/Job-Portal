import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { useUser } from "@clerk/clerk-react";
import { Heart, MapPinIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/Hooks/useFetch";
import { deleteJob, saveJob } from "@/Api/ApiJobs";

const Jobcard = ({
  datajob = {},
  isMyJob = false,
  savedInit = false,
  onJobAction = () => {},
}) => {
  const [saved, setsaved] = useState(savedInit);

  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJob,
  } = useFetch(saveJob);

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: datajob.id,
  });

  console.log("Job ID to delete:", datajob.id);

  const { user } = useUser();

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: datajob.id,
    });

    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob(); // Call delete API
    onJobAction(); // Trigger state update in parent component
  };

  useEffect(() => {
    if (savedJob !== undefined) setsaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "300px",
      }}
    >
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {datajob.title}
          {!isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-col gap-4 flex-1"
        style={{ flexGrow: 1 }} // Makes CardContent take up remaining space
      >
        <div className="flex justify-between">
          {datajob?.company && (
            <img
              src={datajob.company.logo_url}
              className="h-6"
              style={{ width: "80px", height: "25px" }}
            />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {datajob?.Location}
          </div>
        </div>
        <hr />
        {datajob?.Discription
          ? datajob.Discription.substring(
              0,
              datajob.Discription.indexOf(".")
            ) || datajob.Discription
          : "No description available."}
      </CardContent>

      <CardFooter style={{ marginTop: "auto" }} className="gap-2">
        <Link to={`/Job/${datajob?.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Jobcard;
