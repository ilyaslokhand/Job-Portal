import { getcompanies } from "@/Api/ApiCompanies";
import { addNewJob } from "@/Api/ApiJobs";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/Hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const Postjob = () => {
  // Validation Schema using Zod
  const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    Discription: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    company_id: z.string().min(1, { message: "Select or add a company" }),
    Requirenments: z.string().min(1, { message: "Requirements are required" }),
  });

  const { isLoaded, user } = useUser();
  const Navigate = useNavigate();

  const {
    fn: fnCompanies,
    data: Compaines,
    loading: loadingcompanies,
  } = useFetch(getcompanies);

  // Fetch companies when user data is loaded
  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      Discription: "",
      location: "",
      company_id: "",
      Requirenments: "",
    },
    resolver: zodResolver(schema), // Attach resolver for validation
  });

  const {
    fn: fnaddNewJob,
    data: addNewJobdata,
    error: erroraddnewjob,
    loading: loadingaddNewJob,
  } = useFetch(addNewJob);

  // Form submission handler
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    fnaddNewJob({
      ...data,
      location: data.location,
      Recruiter_id: user.id,
    });
  };

  // Redirect to job listing on successful submission
  useEffect(() => {
    if (addNewJobdata?.length > 0) {
      Navigate("/Job-listing");
    }
  }, [addNewJobdata, Navigate]);

  if (!isLoaded || loadingcompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Restrict access to recruiters
  if (user?.unsafeMetadata?.role !== "Recruiter") {
    return <Navigate to="/My-jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        className="flex flex-col gap-4 p-4 pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Job Title */}
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Job Description */}
        <Textarea placeholder="Job Description" {...register("Discription")} />
        {errors.Discription && (
          <p className="text-red-500">{errors.Discription.message}</p>
        )}

        {/* Location and Company Selection */}
        <div className="flex gap-4 items-center">
          {/* Location */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
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
            )}
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}

          {/* Company */}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? Compaines?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
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
            )}
          />
          {errors.company_id && (
            <p className="text-red-500">{errors.company_id.message}</p>
          )}

          {/* Add Company */}
          <AddCompanyDrawer FetchCompanies={fnCompanies} />
        </div>

        {/* Requirements */}
        <Controller
          name="Requirenments"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.Requirenments && (
          <p className="text-red-500">{errors.Requirenments.message}</p>
        )}

        {/* Error and Loading States */}
        {erroraddnewjob?.message && (
          <p className="text-red-500">{erroraddnewjob?.message}</p>
        )}
        {loadingaddNewJob && <BarLoader width={"100%"} color="#36d7b7" />}

        {/* Submit Button */}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Postjob;
