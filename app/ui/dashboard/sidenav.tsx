"use client"; // Add this at the top to make it a client component

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-lg bg-green-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        <div className="hidden h-auto w-full grow rounded-lg bg-gray-50 md:block"></div>
        <button
          onClick={() => signOut({ callbackUrl: "/pages/login" })}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-lg bg-gray-200 p-3 text-sm font-medium hover:bg-green-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 transition duration-300"
        >
          <PowerIcon className="w-6" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
