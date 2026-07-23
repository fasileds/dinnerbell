"use client";

import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { 
  FaGoogle, 
  FaApple, 
  FaArrowRight, 
  FaCheckCircle, 
  FaPlay, 
  FaRocket, 
  FaShieldAlt, 
  FaStore,
  FaIdCard,
  FaFileContract,
  FaUserTie,
  FaUserCheck
} from "react-icons/fa";
import { NextResponse } from "next/server";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Onboarding Status
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerIdNumber, setOwnerIdNumber] = useState("");
  const [foodInspectionNumber, setFoodInspectionNumber] = useState("");
  const [foodInspectionDate, setFoodInspectionDate] = useState("");
  const [isAggent, setIsAggent] = useState(false);
  const [nameOffAgnet, setNameOffAgnet] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const playSound = () => {
    const audio = new Audio("/bellSound.mp3");
    audio.play().catch((error) => console.error("Error playing sound:", error));
  };

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    customPaging: (i: number) => (
      <div className="w-3 h-3 bg-white/20 rounded-full mt-4 hover:bg-white/40 transition-all peer-checked:bg-white" />
    )
  };

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl: window.location.origin,
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  const checkUserStatus = async () => {
    if (session?.user?.email) {
      setIsChecking(true);
      try {
        const res = await fetch("/api/registre", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();
        const user = data.user || data.existingUser;

        if (user && (!user.restaurantName || !user.ownerIdNumber || !user.foodInspectionNumber)) {
          // User exists but has missing info, OR was just created (status === "created")
          setShowModal(true);
        } else if (user) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error checking user status:", err);
      } finally {
        setIsChecking(false);
      }
    }
  };

  const handleGetStarted = () => {
    if (status === "unauthenticated") {
      router.push("/pages/privacyPolicy");
    } else if (status === "authenticated") {
      checkUserStatus();
    }
  };

  const handleOnboardingSubmit = async () => {
    if (!restaurantName || !ownerIdNumber || !foodInspectionNumber || !foodInspectionDate || !agreedToTerms) {
      setError("Please complete all fields.");
      return;
    }
    if (isAggent && !nameOffAgnet) {
      setError("Please provide the agent name.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Verify Restaurant Health Score
      const verifyRes = await fetch("/api/verify-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantName }),
      });
      
      const verifyData = await verifyRes.json();

      if (verifyData.status === "failed") {
        setIsSubmitting(false);
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: verifyData.message || `Your restaurant did not pass the health inspection.`,
          confirmButtonColor: '#10B981',
          backdrop: `rgba(15, 23, 42, 0.8)`
        });
        return;
      }

      if (verifyData.status === "not_found") {
        setIsSubmitting(false);
        Swal.fire({
          icon: 'warning',
          title: 'Restaurant Not Found',
          text: verifyData.message || `We could not find your restaurant in the database.`,
          confirmButtonColor: '#10B981',
        });
        return;
      }

      if (verifyData.status !== "passed") {
        setIsSubmitting(false);
        Swal.fire({
          icon: 'error',
          title: 'System Error',
          text: verifyData.message || verifyData.error || 'There was a problem verifying your restaurant.',
          confirmButtonColor: '#10B981',
        });
        return;
      }

      // Step 2: If explicitly passed, save to DB
      const res = await fetch("/api/registre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          restaurantName,
          ownerIdNumber,
          foodInspectionNumber,
          foodInspectionDate,
          agreedToTerms,
          isAggent,
          nameOffAgnet,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save details.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check registration status when session is active
  useEffect(() => {
    if (status === "authenticated") {
      checkUserStatus();
    }
  }, [session, status, router]);

  return (
    <main className="flex flex-col min-h-screen bg-[#F8FAFC] selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Loading Overlay */}
      {isChecking && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4" />
          <p className="text-emerald-900 font-bold tracking-tight animate-pulse">Checking your profile...</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-5 px-6 md:px-12">
          <div className="hover:scale-105 transition-transform cursor-pointer">
            <AcmeLogo />
          </div>
          <div className="flex items-center gap-6">
            <a href="/pages/privacyPolicy" className="hidden md:block text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">
              Pricing
            </a>
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl px-6 py-3.5 text-sm font-black shadow-lg shadow-emerald-200 transition-all hover:translate-y-[-2px] active:scale-95"
            >
              Get Started <FaRocket className="text-[12px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px] -z-10" />

        {/* 🍕 Floating Food Garden - Hero Edition */}
        <div className="absolute inset-0 pointer-events-none -z-5 overflow-hidden">
          <motion.div 
            animate={{ y: [0, -40, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[5%] hidden xl:block text-6xl filter drop-shadow-xl opacity-60"
          >
            🍕
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 50, 0], rotate: [0, -20, 20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[15%] hidden xl:block text-7xl filter drop-shadow-xl opacity-50"
          >
            🍔
          </motion.div>

          <motion.div 
            animate={{ x: [0, 30, 0], y: [0, -30, 0], rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[20%] left-[10%] hidden xl:block text-5xl filter drop-shadow-lg opacity-40"
          >
            🍊
          </motion.div>

          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[25%] right-[5%] hidden lg:block text-6xl filter drop-shadow-lg opacity-50"
          >
            🌮
          </motion.div>

          <motion.div 
            animate={{ y: [0, -60, 0], scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[45%] hidden lg:block text-4xl"
          >
            🥗
          </motion.div>

          <motion.div 
            animate={{ y: [-20, 40, -20], x: [0, 20, 0], rotate: [0, 45, -45, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[35%] hidden xl:block text-5xl filter drop-shadow-lg opacity-50"
          >
            🍎
          </motion.div>

          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3], rotate: [0, 360] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] right-[40%] hidden xl:block text-4xl"
          >
            🥑
          </motion.div>

          <motion.div 
            animate={{ y: [0, -30, 0], x: [-20, 20, -20], rotate: [0, 360] }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
            className="absolute top-[60%] left-[5%] hidden lg:block text-4xl opacity-30"
          >
            🍩
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 space-y-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next-Gen Local Ads
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Scale your restaurant with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Video Ads</span>.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Dinner Bell lets local businesses create and target stunning video advertisements across specific zip codes with a few simple clicks.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
               {session ? (
                 <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-gray-100 shadow-lg shadow-slate-100">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500">
                            <Image src={session.user?.image || "/bb.png"} width={48} height={48} alt="User" />
                        </div>
                        <div className="pr-6">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                            <p className="font-bold text-slate-900">{session.user?.name}</p>
                        </div>
                    </div>
                    <button 
                      onClick={handleGetStarted}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 transition-all hover:translate-y-[-2px] active:scale-95"
                    >
                      Go to Dashboard
                    </button>
                 </div>
               ) : (
                 <div className="flex flex-col gap-4 w-full sm:w-auto">
                   <div className="flex gap-3">
                     <button 
                      onClick={() => handleSignIn("google")}
                      className="flex items-center gap-4 bg-white border border-gray-200 px-10 py-5 rounded-2.5xl font-black text-slate-800 hover:bg-gray-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.05)] active:scale-95"
                     >
                       <FaGoogle className="text-red-500 text-xl" /> Sign In with Google
                     </button>
                   </div>
                   <p className="text-xs font-bold text-slate-400 ml-2">No credit card required. Start in 2 minutes.</p>
                 </div>
               )}
            </div>
          </div>

          <div className="lg:w-1/2 w-full animate-fadeIn">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                <Slider {...sliderSettings}>
                  {[
                    { src: "/beef-dish-restaurant.jpg", price: "$25", restaurant: "Awesome Restaurant", dish: "Beef Dish" },
                    { src: "/delicious-indian-food-tray.jpg", price: "$30", restaurant: "Indian Spice", dish: "Indian Platter" },
                    { src: "/delicious-tacos-arrangement.jpg", price: "$15", restaurant: "Taco Fiesta", dish: "Tacos" },
                  ].map((item, index) => (
                    <div key={index} className="relative aspect-[4/3]">
                      <Image
                        src={item.src}
                        fill
                        alt={item.dish}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Price Tag */}
                      <div className="absolute top-6 right-6">
                        <div className="flex items-center bg-white rounded-2xl shadow-xl p-1.5 pr-5">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center cursor-pointer pointer-events-auto" onMouseEnter={playSound}>
                            <img src="/bell1.png" className="w-5 h-5 invert" alt="Bell" />
                          </div>
                          <span className="ml-3 font-black text-slate-900 tracking-tight">{item.price}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-white/60 font-black uppercase text-[10px] tracking-[0.2em] mb-1">{item.restaurant}</p>
                        <h3 className="text-white text-3xl font-bold tracking-tight">{item.dish}</h3>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <footer className="mt-auto py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <span className="font-black text-xl tracking-tighter uppercase italic">Coca-Cola</span>
            <span className="font-black text-xl tracking-tighter uppercase italic">Uber Eats</span>
            <span className="font-black text-xl tracking-tighter uppercase italic">Starbucks</span>
          </div>
          <p className="text-sm font-bold text-slate-400">© 2026 Dinner Bell Ads Network. Secure Verification Enabled.</p>
        </div>
      </footer>

      {/* 🌟 Hyper-Premium Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-start justify-center bg-[#0F172A]/80 backdrop-blur-xl z-[100] p-4 sm:p-8 overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.5)] w-full max-w-xl my-auto animate-slideUp overflow-hidden flex flex-col">
            
            {/* Modal Header - Fixed at top of modal */}
            <div className="bg-emerald-600 p-10 text-center relative overflow-hidden shrink-0">
               <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                     <FaStore className="text-emerald-600 text-3xl" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Business Verification</h3>
                  <p className="text-emerald-50 mt-2 font-medium opacity-80">Finalize your profile to unlock the platform.</p>
               </div>
            </div>

            <div className="p-10 pt-8 space-y-7 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg animate-shake">
                  {error}
                </div>
              )}

              <div className="grid gap-6">
                {/* Restaurant Name */}
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Restaurant Name</label>
                  <div className="relative">
                    <FaStore className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder="The Golden Spatula"
                      className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-6 py-5 focus:bg-white focus:border-emerald-500 focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] outline-none transition-all font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Owner ID */}
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Owner Identification</label>
                  <div className="relative">
                    <FaIdCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={ownerIdNumber}
                      onChange={(e) => setOwnerIdNumber(e.target.value)}
                      placeholder="Official ID Number"
                      className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-6 py-5 focus:bg-white focus:border-emerald-500 focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] outline-none transition-all font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Food Inspection */}
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Food Inspection Number</label>
                  <div className="relative">
                    <FaFileContract className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={foodInspectionNumber}
                      onChange={(e) => setFoodInspectionNumber(e.target.value)}
                      placeholder="FI-8822-2026"
                      className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-6 py-5 focus:bg-white focus:border-emerald-500 focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] outline-none transition-all font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Food Inspection Date */}
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-emerald-600 transition-colors">Date of Last Food Inspection</label>
                  <div className="relative">
                    <FaFileContract className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="date"
                      value={foodInspectionDate}
                      onChange={(e) => setFoodInspectionDate(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] pl-14 pr-6 py-5 focus:bg-white focus:border-emerald-500 focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] outline-none transition-all font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Agent Status */}
                <div className="space-y-4 pt-2">
                  <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-gray-100 transition-all group border-2 border-transparent has-[:checked]:border-emerald-500/20 has-[:checked]:bg-emerald-50/30">
                    <input
                      type="checkbox"
                      checked={isAggent}
                      onChange={(e) => setIsAggent(e.target.checked)}
                      className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer"
                    />
                    <div className="flex-1">
                      <h4 className="text-[13px] font-black text-gray-800 flex items-center gap-2">
                        <FaUserTie className="text-emerald-500" /> I am an authorized agent
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium">Toggle if you represent the owner</p>
                    </div>
                  </label>

                  {isAggent && (
                    <div className="space-y-1.5 group animate-fadeIn">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Agent Name</label>
                      <div className="relative">
                        <FaUserCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input
                          type="text"
                          value={nameOffAgnet}
                          onChange={(e) => setNameOffAgnet(e.target.value)}
                          placeholder="Your Legal Name"
                          className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[1.5rem] pl-14 pr-6 py-4 focus:bg-white focus:border-emerald-500 focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] outline-none transition-all font-bold text-gray-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] cursor-pointer hover:bg-gray-100 transition-all group border-2 border-transparent has-[:checked]:border-emerald-500/20 has-[:checked]:bg-emerald-50/30">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-6 h-6 accent-emerald-600 rounded-lg"
                />
                <div className="text-[13px] font-bold text-gray-600 leading-tight">
                  Agree to <button onClick={(e) => { e.preventDefault(); router.push('/pages/terms'); }} className="text-emerald-700 hover:underline">Terms of Service</button> & <button onClick={(e) => { e.preventDefault(); router.push('/pages/terms'); }} className="text-emerald-700 hover:underline">Privacy Policy</button>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-5 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-5 rounded-[1.5rem] bg-gray-100 hover:bg-gray-200 text-gray-600 font-black transition-all active:scale-95"
                >
                  Skip
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleOnboardingSubmit}
                  className="px-8 py-5 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-200 transition-all hover:translate-y-[-2px] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


