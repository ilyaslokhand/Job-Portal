import { addnewcompanies } from "@/Api/ApiCompanies";
import useFetch from "@/Hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file?.length > 0 &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only PNG or JPEG images are allowed" }
    ),
});

const AddCompanyDrawer = ({ FetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema), // Enforce zod schema validation
  });

  const {
    fn: fnaddnewcompanies,
    error: erroraddnewcompanies,
    data: dataaddnewcompanies,
    loading: loadingaddnewcompanies,
  } = useFetch(addnewcompanies);

  useEffect(() => {
    if (dataaddnewcompanies?.length > 0) {
      FetchCompanies();
      reset(); // Reset form fields after successful submission
    }
  }, [dataaddnewcompanies, FetchCompanies, reset]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    fnaddnewcompanies({
      ...data,
      logo: data.logo[0], // Ensure the logo is properly extracted from the FileList
    });
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form
          className="flex gap-2 p-4 pb-0"
          onSubmit={handleSubmit(onSubmit)} // Properly bind handleSubmit
        >
          <Input placeholder="Company Name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <Input
            type="file"
            accept="image/*"
            className="file:text-gray-500"
            {...register("logo")}
          />
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

          <Button type="submit" variant="destructive" className="w-40">
            Add
          </Button>
        </form>
        <DrawerFooter>
          {erroraddnewcompanies?.message && (
            <p className="text-red-500">{erroraddnewcompanies.message}</p>
          )}
          {loadingaddnewcompanies && (
            <BarLoader width={"100%"} color="#36d7b7" />
          )}
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
