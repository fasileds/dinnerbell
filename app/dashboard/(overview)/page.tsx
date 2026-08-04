"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { RevenueChartSkeleton, LatestInvoicesSkeleton } from "@/app/ui/skeletons";
import { FaEye, FaMousePointer, FaChartLine, FaVideo, FaSyncAlt } from "react-icons/fa";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  
  // Ensure user is in DB even if they bypassed registration flow
  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/registre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
      .then(res => res.json())
      .then(data => {
        const user = data.user || data.existingUser;
        // SECONDARY LOCK: If they bypassed everything and landed here with no data, kick them back
        if (user && (!user.restaurantName || !user.ownerIdNumber || !user.foodInspectionNumber)) {
          router.push("/");
        }
      })
      .catch(err => console.error("Auto-registration check failed:", err));
    }
  }, [session, router]);

  const embedUrl = "https://www.youtube.com/embed/xjUw6_LyHT8";

  return (
    <main className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">Welcome back, {session?.user?.name || "Partner"}! Here's how your ads are performing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <FaSyncAlt className="text-slate-400" /> Refresh Data
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-emerald-200 transition-all active:scale-95">
            Create New Ad
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Video & Performance */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Video Player Card */}
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden group">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FaVideo className="text-emerald-600" />
                </div>
                <span className="font-black text-slate-800 tracking-tight uppercase text-sm">Active Campaign Ad</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">Live</span>
            </div>
            <div className="aspect-video bg-slate-900 relative">
              <iframe
                className="w-full h-full"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Performance Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <FaEye className="text-blue-600 text-xl" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Impressions</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter">1,284</h4>
              <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">
                <FaChartLine /> +12% this week
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <FaMousePointer className="text-indigo-600 text-lg" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Clicks</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter">420</h4>
              <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">
                <FaChartLine /> +5.4% this week
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl text-white">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <FaChartLine className="text-emerald-400 text-xl" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Conversion Rate</p>
              <h4 className="text-3xl font-black text-white tracking-tighter">3.2%</h4>
              <button className="mt-6 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black transition-all">
                Optimize Ads
              </button>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Revenue Analytics</h3>
            <Suspense fallback={<RevenueChartSkeleton />}>
              <RevenueChart invoiceId={selectedInvoiceId} />
            </Suspense>
          </div>
        </div>

        {/* Right Section: Activity */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm min-h-[600px]">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Recent Payments</h3>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
              <LatestInvoices onInvoiceSelect={setSelectedInvoiceId} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
