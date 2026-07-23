"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaGavel, FaCheckCircle, FaShieldAlt, FaUserShield } from "react-icons/fa";
import AcmeLogo from "@/app/ui/acme-logo";

const TermsPage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[#F8FAFC] py-16 px-6">
      {/* Decorative Background Mesh/Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      
      {/* 🍕 Floating Food Garden - Terms Edition */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] hidden lg:block text-6xl opacity-20"
        >
          🍕
        </motion.div>
        <motion.div 
          animate={{ y: [0, 40, 0], rotate: [0, -15, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[5%] hidden lg:block text-7xl opacity-20"
        >
          🍔
        </motion.div>
        <motion.div 
          animate={{ x: [-20, 20, -20], rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[10%] hidden lg:block text-5xl opacity-20"
        >
          🍎
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors mb-12 group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
            <FaArrowLeft className="text-[10px]" />
          </div>
          Back to Home
        </Link>

        {/* Branding */}
        <div className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="inline-block bg-white p-4 rounded-3xl shadow-xl border border-gray-50">
            <div className="scale-75 origin-center">
              <AcmeLogo />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-slate-500 font-medium text-lg mt-1 underline decoration-emerald-500/30">Last Updated: March 2026</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-[0_32px_96px_-12px_rgba(0,0,0,0.06)] border border-white/50">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Quick Summary Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                <h3 className="text-emerald-900 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaCheckCircle /> Quick Summary
                </h3>
                <ul className="space-y-4 text-sm text-emerald-800/80 font-medium">
                  <li>• We facilitate local ads for restaurants.</li>
                  <li>• You must provide valid business info.</li>
                  <li>• Payments are handled securely via Stripe.</li>
                  <li>• You own your data.</li>
                </ul>
              </div>

              <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                <h3 className="text-blue-900 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaShieldAlt /> Safety First
                </h3>
                <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                  We use bank-level encryption to protect your restaurant's financial and identity data.
                </p>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="lg:col-span-2 space-y-12 text-slate-700 leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-black">01</span>
                  Acceptance of Terms
                </h2>
                <p>
                  By accessing or using Dinner Bell Ads ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-black">02</span>
                  Account Registration
                </h2>
                <p>
                  To use our Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process (Restaurant Name, Owner ID, and Food Safety License). You are responsible for safeguarding your account access credentials.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-black">03</span>
                  Advertising Standards
                </h2>
                <p>
                  All advertisements must comply with local laws and regulations. Dinner Bell reserves the right to reject or remove any advertisement that is deemed inappropriate, misleading, or violates our community standards.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-black">04</span>
                  Payments & Refunds
                </h2>
                <p>
                  Payment for ad campaigns is processed in advance. Refunds are subject to our refund policy and are typically issued only in cases of documented service failure.
                </p>
              </section>

              <div className="pt-8 border-t border-slate-100">
                <p className="text-slate-400 text-sm font-medium italic">
                  Questions about our terms? Contact our support team at legal@dinnerbell.com
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-16 text-center space-y-4 opacity-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Official Governance Document</p>
          <div className="flex justify-center gap-6 text-xs font-bold text-slate-400 px-6">
             <Link href="/pages/privacyPolicy" className="hover:text-emerald-600 transition-colors flex items-center gap-1"><FaUserShield /> Privacy Policy</Link>
             <span>•</span>
             <p className="flex items-center gap-1"><FaGavel /> Terms of Use</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
