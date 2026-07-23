"use client";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import React, { useState } from "react";
import Porture from "./porture";
import LandScape from "./landScape";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useVideoContext } from "@/app/context/VideoContext";
import PaymentModal from "@/components/PaymentModal";
import { useAuth } from "@/app/context/AuthContext";

export default function Page() {
  const { RangePicker } = DatePicker;
  const [isModalOpen, setModalOpen] = useState(false);

  const handleProceedToPayment = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const { formData, setFormData } = useVideoContext();
  const [timeRanges, setTimeRanges] = useState<
    Array<[dayjs.Dayjs | null, dayjs.Dayjs | null]>
  >(
    formData.businessHours.length > 0 ? formData.businessHours : [[null, null]]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    index: number
  ) => {
    if (dates) {
      const newTimeRanges = [...timeRanges];
      newTimeRanges[index] = dates;
      setTimeRanges(newTimeRanges);
      setFormData((prevData) => ({
        ...prevData,
        businessHours: newTimeRanges,
      }));
    }
  };
  const addTimeRange = () => {
    setTimeRanges([...timeRanges, [null, null]]);
  };
  const removeTimeRange = (index: number) => {
    const newTimeRanges = timeRanges.filter((_, i) => i !== index);
    setTimeRanges(newTimeRanges);
    setFormData((prevData) => ({ ...prevData, businessHours: newTimeRanges }));
  };
  const handleSearchRadiusChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSearchRadius = [...formData.searchRadius];
    const value = parseFloat(e.target.value);
    updatedSearchRadius[index] = isNaN(value) ? 0 : value;
    setFormData((prevData) => ({
      ...prevData,
      searchRadius: updatedSearchRadius,
    }));
  };

  const addSearchRadius = () => {
    setFormData((prevData) => ({
      ...prevData,
      searchRadius: [...prevData.searchRadius, 0],
    }));
  };

  const removeSearchRadius = (index: number) => {
    const updatedSearchRadius = formData.searchRadius.filter(
      (_, i) => i !== index
    );
    setFormData((prevData) => ({
      ...prevData,
      searchRadius: updatedSearchRadius,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Upload Video", href: "/dashboard/uploadeVideo" },
          {
            label: "Create Video",
            href: "/dashboard/uploadeVideo",
            active: true,
          },
        ]}
      />
      <span className="block text-lg font-bold text-gray-800 mb-2 ml-4">
        Make an attractive video of your favorite dish that is under 24 seconds.
        <span className="block text-gray-600 font-medium mt-1">
          On iPhone, you can use iMovie; on Android, you can use CapCut Video
          Editor.
        </span>
      </span>

      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
        <div className="flex md:space-x-6 mb-6">
          <Porture />
          <LandScape />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Video Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price $
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter price"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="dish"
              className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300"
            >
              Product / Service
            </label>
            <input
              type="text"
              name="dish"
              id="dish"
              value={formData.dish}
              onChange={handleInputChange}
              placeholder="Enter the name for the product/service"
              className="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="restorant"
            className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300"
          >
            Company Name
          </label>
          <input
            type="text"
            name="restorant"
            id="restorant"
            value={formData.restorant}
            onChange={handleInputChange}
            placeholder="Enter your companies name"
            className="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
        </div>
        <div className="border-t border-gray-300 mt-6 pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Location of Company & Budget
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter zip code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget $
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter budget"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter duration"
              />
            </div>
            <div className=" bg-white  rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Zip Codes To Show Ads In
              </h2>
              {formData.searchRadius.map((radius, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <input
                    type="text"
                    name={`searchRadius-${index}`}
                    value={radius}
                    onChange={(e) => handleSearchRadiusChange(e, index)}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-800 placeholder-gray-400"
                    placeholder={`Enter search radius ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeSearchRadius(index)}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              ))}
              <Button type="dashed" onClick={addSearchRadius} className="mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add Zip Code
              </Button>
            </div>
            <div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Keywords / Tags
  </label>
  <div className="flex flex-wrap gap-2 mb-3">
    {formData.keywords?.map((keyword, index) => (
      <span
        key={index}
        className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
      >
        {keyword}
        <button
          type="button"
          onClick={() => {
            const updated = formData.keywords.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, keywords: updated }));
          }}
          className="ml-2 text-blue-500 hover:text-red-500"
        >
          &times;
        </button>
      </span>
    ))}
  </div>
  <input
    type="text"
    placeholder="Type keyword and press Enter"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        if (value && !formData.keywords.includes(value)) {
          setFormData((prev) => ({
            ...prev,
            keywords: [...prev.keywords, value],
          }));
        }
        e.currentTarget.value = "";
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div>

          </div>
        </div>
        <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-lg shadow-md mt-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-2">
              Advertisement Hours:
            </label>
            {timeRanges.map((timeRange, index) => (
              <div key={index} className="flex items-center gap-2 mb-4">
                <RangePicker
                  use12Hours
                  placeholder={["Open Time", "Close Time"]}
                  picker="time"
                  showTime={{ format: "hh:mm a" }}
                  format="hh:mm a"
                  onChange={(dates) => handleRangeChange(dates, index)}
                  value={timeRange}
                  className="mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{
                    width: "300px",
                    height: "40px",
                    fontSize: "14px",
                  }}
                />
                <Button
                  type="primary"
                  danger
                  onClick={() => removeTimeRange(index)}
                  className="ml-2"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={addTimeRange} className="mt-2">
              Add Time Slot
            </Button>
          </div>

          <div>
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
                          className="absolute h-2 bg-blue-500 rounded-full"
                          style={{
                            left: `${startPercentage}%`,
                            width: `${endPercentage - startPercentage}%`,
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No time slots added yet.</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="attestCheckbox"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 checked:bg-blue-600"
            />
            <label
              htmlFor="attestCheckbox"
              className="text-gray-700 text-sm font-medium"
            >
              I attest that the information provided is true and accurate in its
              representation of my restaurant and its food.
            </label>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button type="primary" onClick={handleProceedToPayment}>
            Proceed to Payment <ArrowRightIcon className="h-5 w-5 inline" />
          </Button>
        </div>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        buget={formData.budget ? Number(formData.budget) : 0}
      />
    </main>
  );
}
