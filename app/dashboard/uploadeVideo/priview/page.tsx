"use client";
import React, { useState } from "react";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { useVideoContext } from "@/app/context/VideoContext";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PaymentModal from "@/components/PaymentModal";

export default function Page() {
  const { formData, portraitVideoData, landscapeVideoData } = useVideoContext();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleProceedToPayment = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Upload Video", href: "/dashboard/uploadVideo" },
          {
            label: "Preview",
            href: "/dashboard/uploadVideo/preview",
            active: true,
          },
        ]}
      />

      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600">
        Preview
      </h1>

      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Portrait Video
          </h2>
          {portraitVideoData ? (
            <div className="relative w-[300px] h-[550px]  rounded-[40px] border-4 border-gray-800 shadow-lg mb-4 p-2 flex items-center justify-center">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80px] h-[20px] bg-gray-700 rounded-b-lg"></div>

              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[60px] h-[5px] bg-gray-600 rounded-full"></div>

              <div className="absolute top-2 right-[30px] w-[8px] h-[8px] bg-gray-600 rounded-full"></div>

              <video
                className="w-[281px] h-[500px] rounded-lg border border-gray-300"
                controls
                src={URL.createObjectURL(portraitVideoData)}
              />
            </div>
          ) : (
            <p className="text-gray-500 italic">No portrait video available.</p>
          )}
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Landscape Video
          </h2>
          {landscapeVideoData ? (
            <div className="relative w-[800px] h-[450px]  rounded-lg border-4 border-gray-800 shadow-lg mb-8 p-2 flex items-center justify-center">
              <video
                className="w-full h-full rounded-lg border border-gray-300"
                controls
                src={URL.createObjectURL(landscapeVideoData)}
              />
              <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-gray-700 rounded-t-lg shadow-md"></div>
              <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[100px] h-[10px] bg-gray-700 rounded-b-md shadow-md"></div>
              <div className="absolute top-2 left-4 w-[15px] h-[15px] bg-red-500 rounded-full"></div>
              <div className="absolute bottom-[-75px] w-full h-[40px] flex justify-center">
                <div className="w-[200px] h-[10px] bg-gray-800 rounded-md"></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No landscape video available.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-blue-600">
          Other Information
        </h1>

        <p className="mb-4 text-gray-700">
          <strong>Description:</strong> {formData.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">
              <strong>Price:</strong> ${formData.price}
            </span>
            <span className="font-medium">
              <strong>Duration:</strong> {formData.duration} mins
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">
              <strong>Budget:</strong> ${formData.budget}
            </span>
            <span className="font-medium">
              <strong>Address:</strong> {formData.address}
            </span>
          </div>
          <p className="text-gray-600">
            <strong>Search Radius:</strong> {formData.searchRadius}
          </p>
          <div className="flex items-center mb-2">
            <label className="mr-2 text-gray-800">Color:</label>
            <div
              className="w-[150px] h-[40px] rounded-md"
              style={{ backgroundColor: formData.color }}
            />
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Advertiznent Hours
          </h2>
          {formData.businessHours.length > 0 ? (
            formData.businessHours.map((time, index) => {
              const startTime = time[0];
              const endTime = time[1];

              const startHour = startTime ? startTime.hour() : 0;
              const endHour = endTime ? endTime.hour() : 0;

              const startPercentage = (startHour / 24) * 100;
              const endPercentage = (endHour / 24) * 100;
              return (
                <div key={index} className="text-gray-600 mb-4">
                  <div className="flex items-center mb-1">
                    <span>
                      Starts: {startTime ? startTime.format("HH:mm") : "N/A"}
                    </span>
                    <span className="mx-2">|</span>
                    <span>
                      Ends: {endTime ? endTime.format("HH:mm") : "N/A"}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    {startTime && endTime ? (
                      <div
                        className="absolute h-full bg-blue-500 rounded-full"
                        style={{
                          left: `${startPercentage}%`,
                          width: `${endPercentage - startPercentage}%`,
                        }}
                      ></div>
                    ) : (
                      <div className="absolute h-full bg-red-400 rounded-full w-full" />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <span
                        key={hour}
                        style={{ width: `${100 / 24}%` }}
                        className="text-center"
                      >
                        {hour}:00
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No business hours available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleProceedToPayment}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 flex items-center"
        >
          Proceed to Payment
          <ArrowRightIcon className="h-5 md:ml-3" />
        </button>
      </div>
      <PaymentModal
        buget={Number(formData.budget)}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
