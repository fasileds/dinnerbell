"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { lusitana } from "@/app/ui/fonts";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface RevenueChartProps {
  invoiceId: string | null;
}
export default function RevenueChart({ invoiceId }: RevenueChartProps) {
  const [revenue, setRevenue] = useState<{ month: string; income: number }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRevenue = async () => {
    if (!invoiceId) return;
    try {
      const response: any = await axios.get(
        `http://localhost:3000/api/order/getSingleOrderStatus?menuId=${invoiceId}`
      );
      setRevenue(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [invoiceId]);

  const chartHeight = 350;

  if (loading) {
    return <p className="mt-4 text-gray-400">Loading...</p>;
  }

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }
  const shortenMonthName = (month: string) => {
    const months: { [key: string]: string } = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    };
    return months[month as keyof typeof months] || month;
  };

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Revenue for Selected Invoice
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-gradient-to-t from-blue-500 to-blue-300 shadow-lg"
                style={{
                  height: `${(chartHeight / 100) * month.income}px`,
                }}
              ></div>
              <p className="-rotate-90 text-xs text-gray-500 sm:rotate-0">
                {shortenMonthName(month.month)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
