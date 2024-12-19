import React, { useEffect, useState, memo } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { CardHeader, CardTitle } from "./ui/card";
import { useUser } from "@clerk/clerk-react";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/Hooks/useFetch";
import { deletejob, saveJob } from "@/Api/ApiJobs";
import { BarLoader } from "react-spinners";

const Jobcard = memo(
  ({
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
    } = useFetch(saveJob, {
      alreadySaved: saved,
    });

    const { fn: fndeletejob, loading: loadingdeletejob } = useFetch(deletejob, {
      Job_id: datajob.id,
    });

    const handledeletejob = async () => {
      await fndeletejob();
      onJobAction();
    };

    const { user } = useUser();

    useEffect(() => {
      if (savedJob !== undefined) setsaved(savedJob?.length > 0);
    }, [savedJob]);

    const handleToggleSaveJob = async () => {
      await fnSavedJob({
        user_id: user.id,
        Job_id: datajob.id,
      });
      onJobAction();
    };

    return (
      <Card
        style={{ display: "flex", flexDirection: "column", minHeight: "300px" }}
      >
        {loadingdeletejob && (
          <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
        )}
        <CardHeader className="flex">
          <CardTitle className="flex justify-between font-bold">
            {datajob.title}
            {!isMyJob && (
              <Trash2Icon
                fill="red"
                size={18}
                className="text-red-300 cursor-pointer"
                onClick={handledeletejob}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent
          className="flex flex-col gap-4 flex-1"
          style={{ flexGrow: 1 }}
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
              <MapPinIcon size={15} /> {datajob?.location}
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
              onClick={handleToggleSaveJob}
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
  }
);

export default Jobcard;
