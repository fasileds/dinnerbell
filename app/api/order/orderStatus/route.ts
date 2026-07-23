import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const orders = await prisma.order.findMany({
      where: {
        menu: {
          userId: userId,
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
      include: {
        menu: true,
      },
    });
    let dailyIncome = 0;
    let weeklyIncome = 0;
    let monthlyIncome = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const income = order.menu.price;
      monthlyIncome += income;
      if (orderDate >= startOfWeek) {
        weeklyIncome += income;
      }
      if (orderDate >= startOfDay) {
        dailyIncome += income;
      }
    });

    return NextResponse.json({
      dailyIncome,
      weeklyIncome,
      monthlyIncome,
    });
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
