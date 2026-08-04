"use client"; // Add this at the top to make it a client component

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-3 bg-white border-r border-slate-100 shadow-sm">
      <Link
        className="mb-3 flex h-20 items-end justify-start rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 md:h-28 shadow-md shadow-emerald-200/50 hover:shadow-lg transition-shadow"
        href="/"
      >
        <div className="w-32 text-white md:w-36">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-1.5">
        <NavLinks />

        <div className="hidden h-auto w-full grow rounded-xl md:block"></div>
        <button
          onClick={() => signOut({ callbackUrl: "/pages/login" })}
          className="flex h-11 w-full grow items-center justify-center gap-2 rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-600 hover:bg-emerald-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 transition-colors duration-200"
        >
          <PowerIcon className="w-6" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
