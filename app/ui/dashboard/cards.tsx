"use client";
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { lusitana } from "@/app/ui/fonts";
import { useState, useEffect } from "react"; // Adding hooks for state management

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default function CardWrapper() {
  const [dailyIncome, setDailyIncome] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/order/orderStatus",
          {
            params: { userId: "c2f3f184-bf16-4d31-988b-742d0d726c65" },
          }
        );
        const { dailyIncome, weeklyIncome, monthlyIncome }: any = response.data;
        setDailyIncome(dailyIncome);
        setWeeklyIncome(weeklyIncome);
        setMonthlyIncome(monthlyIncome);
      } catch (error) {
        console.error("Error fetching income data:", error);
        setDailyIncome(0);
        setWeeklyIncome(0);
        setMonthlyIncome(0);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card
        title="Daily Income"
        value={`$${dailyIncome.toFixed(2)}`}
        type="collected"
      />
      <Card
        title="Weekly Income"
        value={`$${weeklyIncome.toFixed(2)}`}
        type="collected"
      />
      <Card
        title="Monthly Income"
        value={`$${monthlyIncome.toFixed(2)}`}
        type="collected"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
