"use client";
import React from "react";
import Header from "@/components/Header";
import Main from "@/components/Main";
import Loader from "@/components/Loader";
type LendingPageProps = {
  params: {
    id: string;
  };
};
export default function Page({ params }: LendingPageProps) {
  const { id } = params;
  console.log("the id is here:", id);
  return (
    <div>
      <Header />
      <Main id={id} />
      <div className=" bottom-0 left-0 right-0 z-50 p-4 px-7 flex items-center justify-center bg-green-600 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <span className="text-sm md:text-base text-white">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </span>
      </div>
    </div>
  );
}
