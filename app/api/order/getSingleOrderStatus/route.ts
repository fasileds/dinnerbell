import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export async function GET(req: NextRequest) {
  const menuId = req.nextUrl.searchParams.get("menuId");

  if (!menuId) {
    return NextResponse.json(
      { error: "menuId parameter is required" },
      { status: 400 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        menuId: menuId as string,
      },
      include: {
        menu: true,
      },
    });
    const monthlyIncomeData = orders.reduce((acc, order) => {
      const month = order.createdAt.toISOString().slice(5, 7);
      const price = order.menu?.price || 0;
      if (!acc[month]) {
        acc[month] = { month, income: price };
      } else {
        acc[month].income = Math.min(acc[month].income, price);
      }

      return acc;
    }, {} as Record<string, { month: string; income: number }>);
    const allMonthlyData = months.map((monthName, index) => {
      const monthKey = (index + 1).toString().padStart(2, "0");
      return {
        month: monthName,
        income: monthlyIncomeData[monthKey]?.income || 0,
      };
    });

    return NextResponse.json(allMonthlyData, { status: 200 });
  } catch (error) {
    console.error("Error fetching monthly income data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
