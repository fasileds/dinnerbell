"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaApple, FaGoogle, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AcmeLogo from "@/app/ui/acme-logo";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home or wherever needed
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl: window.location.origin,
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* Decorative Background Mesh/Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      
      {/* Floating Food Elements - Simple and Clean */}
      <motion.div 
        animate={{ 
          y: [0, -60, 0],
          rotate: [0, 15, -15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] hidden lg:block text-7xl select-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
      >
        🍕
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 80, 0],
          rotate: [0, -20, 20, 0],
          scale: [1, 1.25, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[15%] right-[5%] hidden lg:block text-8xl select-none filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)]"
      >
        🍔
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 100, 0],
          x: [0, -40, 0],
          rotate: [0, 360],
          scale: [0.8, 1.1, 0.8]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] right-[12%] hidden lg:block text-6xl select-none filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.1)]"
      >
        🍊
      </motion.div>

      <motion.div 
        animate={{ 
          x: [-20, 50, -20],
          y: [0, -40, 0],
          rotate: [0, 45, -45, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[15%] hidden lg:block text-7xl select-none filter drop-shadow-[0_12px_12px_rgba(0,0,0,0.1)]"
      >
        🍌
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, -100, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [0.7, 1.3, 0.7]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[45%] hidden lg:block text-5xl select-none filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.1)]"
      >
        🥗
      </motion.div>

      <motion.div 
        animate={{ 
          rotate: [0, -360],
          scale: [0.9, 1.4, 0.9]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[35%] left-[5%] hidden lg:block text-5xl select-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
      >
        🌮
      </motion.div>

      <motion.div 
        animate={{ 
          y: [-20, 120, -20],
          x: [0, -30, 0],
          rotate: [0, 30, -30, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] right-[25%] hidden lg:block text-6xl select-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
      >
        🍎
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [0.8, 1.5, 0.8],
          opacity: [0.3, 0.9, 0.3],
          rotate: [0, 360]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] right-[30%] hidden lg:block text-4xl select-none filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.1)]"
      >
        🥑
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          x: [-30, 30, -30],
          rotate: [0, 360]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute top-[60%] left-[40%] hidden lg:block text-4xl select-none filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.1)]"
      >
        🍩
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          y: [0, -20, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[45%] left-[25%] hidden lg:block text-5xl select-none filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
      >
        🍦
      </motion.div>

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-6 my-12"
      >
        {/* Back to Home Link */}
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
        <div className="mb-10 text-center">
          <div className="inline-block bg-white p-4 rounded-3xl shadow-2xl shadow-emerald-100 border border-gray-50 mb-6">
            <div className="scale-75 origin-center">
                <AcmeLogo />
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg px-8">Sign in to manage your Dinner Bell campaigns.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-[0_32px_96px_-12px_rgba(0,0,0,0.08)] border border-white/50">
          <h2 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Secure Account Access</h2>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <button
              onClick={() => handleSignIn("google")}
              className="group relative flex items-center justify-center w-full bg-white border border-gray-200 text-slate-700 font-bold py-5 rounded-[1.25rem] transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg active:scale-[0.98]"
            >
              <FaGoogle className="absolute left-6 text-xl text-red-500" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
              <span className="bg-white px-3 py-1 rounded-full border border-gray-50">Secure Authentication</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">
              New to Dinner Bell?{" "}
              <Link href="/pages/privacyPolicy" className="text-emerald-600 font-bold hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center space-y-3 opacity-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Business Network</p>
          <div className="flex justify-center gap-4 text-xs font-bold text-slate-400">
            <Link href="/pages/privacyPolicy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/pages/privacyPolicy" className="hover:text-emerald-600 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/pages/privacyPolicy" className="hover:text-emerald-600 transition-colors">Support</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
