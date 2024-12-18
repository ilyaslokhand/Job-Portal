import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplyToJob } from "@/Api/ApiApplication";
import useFetch from "@/Hooks/useFetch";
import { BarLoader } from "react-spinners";

const schema = z.object({
  Experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  Skills: z.string().min(1, { message: "Skills are required" }),
  Education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resumes: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

const ApplyJobDrawer = ({ user, datajobs, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    fn: fnapplyjob,
    error: errorapplyjob,
    loading: loadingapplyjob,
  } = useFetch(ApplyToJob);

  const onSubmit = (data) => {
    const file = data.resumes[0]; // Extract the file from the form data
    fnapplyjob({
      ...data,
      resumes: file,
      job_id: datajobs.id,
      Candidate_id: user.id,
      Name: user.fullName,
      status: "Applied",
    })
      .then(() => {
        fetchJob();
        reset();
      })
      .catch((error) => {
        console.error("Submission Error:", error);
      });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={datajobs?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!datajobs?.isOpen || applied}
        >
          {datajobs?.isOpen ? (applied ? "applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply For {datajobs.title} at {datajobs?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please Fill the form below</DrawerDescription>
        </DrawerHeader>
        <form
          className="flex flex-col gap-4 p-4 pb-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("Experience", { valueAsNumber: true })}
          />
          {errors.Experience && (
            <p className="text-red-500">{errors.Experience.message}</p>
          )}
          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("Skills")}
          />
          {errors.Skills && (
            <p className="text-red-500">{errors.Skills.message}</p>
          )}
          <Controller
            name="Education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.Education && (
            <p className="text-red-500">{errors.Education.message}</p>
          )}
          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resumes")}
          />
          {errors.resumes && (
            <p className="text-red-500">{errors.resumes.message}</p>
          )}
          {errorapplyjob?.message && (
            <p className="text-red-500">{errorapplyjob?.message}</p>
          )}
          {loadingapplyjob && <BarLoader width={"100%"} color="#36d7b7" />}
          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
