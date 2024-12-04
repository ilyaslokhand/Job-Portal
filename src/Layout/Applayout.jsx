import React from "react";
import { Outlet } from "react-router-dom";
import "../../src/App.css";
import Header from "@/components/Header";

const Applayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="container mx-auto px-4 min-h-screen">
        <Header />

        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Ilyas Lokhandwala
      </div>
    </div>
  );
};

export default Applayout;
