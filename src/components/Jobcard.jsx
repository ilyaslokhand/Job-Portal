import React from "react";
import { Card } from "./ui/card";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { useUser } from "@clerk/clerk-react";

const Jobcard = ({
  datajob,
  savedinitialvalue = false,
  onjobsaved = () => {},
}) => {
  const { user } = useUser();

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>{datajob.title}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Jobcard;
