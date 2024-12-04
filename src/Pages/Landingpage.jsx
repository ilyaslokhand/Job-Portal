import React from "react";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import Compaines from "../Data/Compaines.json";
import { CarouselContent } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import banner from "../assets/banner.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FAQs from "../Data/Faqs.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landingpage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center ">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find your dream job{" "}
          <span className=" flex items-center  gap-2 sm:gap-6">
            and get
            <img
              src={logo}
              alt="Hired Logo"
              className="h-14 sm:h-24 lg:h-32"
            ></img>
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        <Link to={"/Job-listing"}>
          <Button variant="blue" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to={"/Post-job"}>
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {Compaines.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <img src={banner} className="w-full" />
      <section className="flex " style={{ gap: "10px" }}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      <Accordion type="multiple" className="w-full ">
        {FAQs.map((FAQ, index) => (
          <AccordionItem key={index} value={index + 1}>
            <AccordionTrigger>{FAQ.question}</AccordionTrigger>
            <AccordionContent>{FAQ.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default Landingpage;
