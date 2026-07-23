import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json(); // Parse the incoming request

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
      });
    }

    const passwordChecked = await bcrypt.compare(password, (user as any).password || "");
    if (!passwordChecked) {
      return new Response(JSON.stringify({ error: "Invalid credentials." }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: (user as any).isAdmin ?? false },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user as any;
    return new Response(JSON.stringify({ token, user: userWithoutPassword }), {
      status: 200,
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
