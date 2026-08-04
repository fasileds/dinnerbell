import SideNav from "@/app/ui/dashboard/sidenav";
import IntroVideo from "@/components/introVideo";

export const experimental_ppr = true;
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow bg-slate-50/50 p-4 md:overflow-y-auto md:p-8">{children}</div>
    </div>
  );
}
