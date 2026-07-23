"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AcmeLogo from "@/app/ui/acme-logo";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignUp = async (provider: string) => {
    setErrorMessage(null);
    try {
      await signIn(provider, { callbackUrl: window.location.origin });
    } catch (err) {
      setErrorMessage(`Unexpected error during sign up: ${String(err)}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* Decorative Background Mesh/Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      
      {/* 🍕 Floating Food Garden - SignUp Edition */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -50, 0], rotate: [0, 20, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] hidden lg:block text-7xl filter drop-shadow-xl opacity-40"
        >
          🍕
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 60, 0], rotate: [0, -30, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[12%] hidden lg:block text-8xl filter drop-shadow-xl opacity-30"
        >
            🍩
        </motion.div>

        <motion.div 
          animate={{ x: [-30, 30, -30], rotate: [0, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[10%] hidden lg:block text-6xl opacity-30"
        >
          🍎
        </motion.div>

        <motion.div 
          animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-[20%] hidden lg:block text-5xl"
        >
          🥗
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-6 my-12"
      >
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
            <FaArrowLeft className="text-[10px]" />
          </div>
          Back to Home
        </Link>

        {/* Brand Header */}
        <div className="mb-10 text-center text-indigo-950 font-black">
          <div className="inline-block bg-white p-4 rounded-3xl shadow-2xl shadow-emerald-100 border border-gray-50 mb-6">
            <div className="scale-75 origin-center text-black">
                <AcmeLogo />
            </div>
          </div>
          <h1 className="text-4xl tracking-tight leading-tight">Start Your Campaign</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg px-8 tracking-normal">Join the network of top local advertisers.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-[0_32px_96px_-12px_rgba(0,0,0,0.08)] border border-white/50">
          <h2 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Register in Seconds</h2>
          
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <button
              onClick={() => handleSignUp("google")}
              className="group relative flex items-center justify-center w-full bg-white border border-gray-200 text-slate-700 font-bold py-5 rounded-[1.25rem] transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg active:scale-[0.98]"
            >
              <FaGoogle className="absolute left-6 text-xl text-red-500" />
              <span>Sign up with Google</span>
            </button>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
              <span className="bg-white px-3 py-1 rounded-full border border-gray-50">One-Click Setup</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-400 tracking-tight">
              Using a business email?{" "}
              <Link href="/pages/privacyPolicy" className="text-emerald-600 font-bold hover:underline transition-all">
                Learn about verification
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/pages/login" className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">
            Already have an account? Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
