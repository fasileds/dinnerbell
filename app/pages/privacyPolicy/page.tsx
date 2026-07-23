// app/pages/privacyPolicy/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { FaStore, FaIdCard, FaFileContract, FaCheckCircle, FaArrowRight, FaChevronLeft, FaGoogle, FaShieldAlt, FaUserTie, FaUserCheck } from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function PrivacyPolicy() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerIdNumber: "",
    foodInspectionNumber: "",
    foodInspectionDate: "",
    isAggent: false,
    nameOffAgnet: "",
  });

  // Handle auto-submission after login
  useEffect(() => {
    const handlePendingData = async () => {
      const pendingData = localStorage.getItem("pendingOnboarding");
      if (session?.user?.email && pendingData) {
        setIsSubmitting(true);
        try {
          const parsedData = JSON.parse(pendingData);
          const res = await fetch("/api/registre", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              ...parsedData,
              agreedToTerms: true,
            }),
          });

          if (res.ok) {
            localStorage.removeItem("pendingOnboarding");
            router.push("/dashboard");
          } else {
            const data = await res.json();
            setError(data.error || "Failed to sync your details.");
            // If it fails, maybe stay on the page to let them try again
            setFormData(parsedData);
            setStep(2);
            setAgreed(true);
          }
        } catch (err) {
          console.error("Error syncing pending data:", err);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    handlePendingData();
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const nextStep = () => {
    if (!formData.restaurantName || !formData.ownerIdNumber || !formData.foodInspectionNumber || !formData.foodInspectionDate) {
      setError("Please fill in all business details before proceeding.");
      return;
    }
    if (formData.isAggent && !formData.nameOffAgnet) {
      setError("Please provide the full legal name of the agent.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    if (!agreed) return;

    if (!session?.user?.email) {
      // User is not logged in - show step 3 for authentication
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Verify Restaurant Health Score
      const verifyRes = await fetch("/api/verify-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantName: formData.restaurantName }),
      });
      
      const verifyData = await verifyRes.json();

      if (verifyData.status === "failed") {
        setIsSubmitting(false);
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: verifyData.message || `Your restaurant did not pass the health inspection.`,
          confirmButtonColor: '#3B82F6',
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
          confirmButtonColor: '#3B82F6',
        });
        return;
      }

      if (verifyData.status !== "passed") {
        setIsSubmitting(false);
        Swal.fire({
          icon: 'error',
          title: 'System Error',
          text: verifyData.message || verifyData.error || 'There was a problem verifying your restaurant.',
          confirmButtonColor: '#3B82F6',
        });
        return;
      }

      // Step 2: If explicitly passed, Save to DB
      const res = await fetch("/api/registre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          ...formData,
          agreedToTerms: true,
        }),
      });

      if (res.ok) {
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

  const handleFinalLogin = async () => {
    // Save data to localStorage before redirecting to login
    localStorage.setItem("pendingOnboarding", JSON.stringify(formData));
    await signIn("google", { callbackUrl: "/pages/privacyPolicy" });
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative Background Mesh/Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* 🍕 Floating Food Garden - Onboarding Edition */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] hidden xl:block text-7xl filter drop-shadow-xl opacity-40"
        >
          🍕
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 40, 0], rotate: [0, -20, 20, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] right-[10%] hidden xl:block text-8xl filter drop-shadow-xl opacity-30"
        >
          🍔
        </motion.div>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -40, 0], rotate: [0, 360] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[15%] left-[5%] hidden xl:block text-6xl filter drop-shadow-lg opacity-30"
        >
          🍊
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.4, 1], rotate: [0, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[3%] hidden lg:block text-7xl filter drop-shadow-lg opacity-40"
        >
          🌮
        </motion.div>

        <motion.div 
          animate={{ y: [0, -80, 0], scale: [0.7, 1.2, 0.7], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[35%] left-[45%] hidden lg:block text-5xl opacity-40"
        >
          🥗
        </motion.div>

        <motion.div 
          animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.2, 0.6, 0.2], rotate: [0, 360] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[35%] hidden xl:block text-5xl opacity-30"
        >
          🥑
        </motion.div>
      </div>

      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white/50 relative z-10 animate-slideUp">
        
        {/* Left Sidebar - Branding & Progress */}
        <div className="md:w-[320px] bg-[#1E293B] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FaFileContract className="text-white text-xl" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Dinner Bell</span>
            </div>

            <h2 className="text-2xl font-bold leading-tight mb-8">Setup your business profile</h2>
            
            <div className="space-y-6">
              {/* Step 1 Indicator */}
              <div className={`flex items-start gap-4 transition-all duration-300 ${step === 1 ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}>
                  {step > 1 ? <FaCheckCircle /> : "1"}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Business Details</h3>
                  <p className="text-xs text-gray-400 mt-1">Official identifiers & info</p>
                </div>
              </div>

              <div className="w-[2px] h-6 bg-gray-700 ml-4" />

              {/* Step 2 Indicator */}
              <div className={`flex items-start gap-4 transition-all duration-300 ${step === 2 ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}>
                  {step > 2 ? <FaCheckCircle /> : "2"}
                </div>
                <div>
                  <h3 className="font-bold text-sm">Legal Agreement</h3>
                  <p className="text-xs text-gray-400 mt-1">Privacy & Terms sign-off</p>
                </div>
              </div>

              <div className="w-[2px] h-6 bg-gray-700 ml-4" />

              {/* Step 3 Indicator */}
              <div className={`flex items-start gap-4 transition-all duration-300 ${step === 3 ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step === 3 ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}>
                  3
                </div>
                <div>
                  <h3 className="font-bold text-sm">Secure Account</h3>
                  <p className="text-xs text-gray-400 mt-1">Authentication & Finish</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-10">
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Join thousands of restaurants scaling their local reach with Dinner Bell Ads.
            </p>
          </div>
          
          {/* Abstract Design Elements */}
          <div className="absolute bottom-[-100px] left-[-50px] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8 md:p-14 bg-white relative">
          {error && (
            <div className="absolute top-8 left-8 right-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-shake z-20">
              <div className="flex items-center gap-2">
                <span className="font-bold">Error:</span> {error}
              </div>
            </div>
          )}

          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            {step === 1 && (
              <div className="animate-slideUp space-y-8">
                <header className="mb-2">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tell us about your restaurant</h1>
                  <p className="text-gray-500 mt-2 font-medium">Enter your official business information to proceed.</p>
                </header>

                <div className="space-y-6">
                  {/* Restaurant Name Input */}
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
                      Official Restaurant Name
                    </label>
                    <div className="relative">
                      <FaStore className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleInputChange}
                        placeholder="e.g. Blue Ribbon Grill"
                        className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] pl-12 pr-6 py-5 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  {/* Owner ID Input */}
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
                      Tax/Owner ID Number
                    </label>
                    <div className="relative">
                      <FaIdCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        name="ownerIdNumber"
                        value={formData.ownerIdNumber}
                        onChange={handleInputChange}
                        placeholder="Registration or SSN"
                        className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] pl-12 pr-6 py-5 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  {/* Food Inspection Input */}
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
                      Food Safety License
                    </label>
                    <div className="relative">
                      <FaFileContract className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                      <input
                        type="text"
                        name="foodInspectionNumber"
                        value={formData.foodInspectionNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. FI-2024-XXXX"
                        className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] pl-12 pr-6 py-5 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  {/* Food Inspection Date Input */}
                  <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-600">
                      Date of Last Food Inspection
                    </label>
                    <div className="relative">
                      <FaFileContract className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                      <input
                        type="date"
                        name="foodInspectionDate"
                        value={formData.foodInspectionDate}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] pl-12 pr-6 py-5 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  {/* Agent Status Toggle */}
                  <div className="space-y-4 pt-2">
                    <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.25rem] cursor-pointer hover:bg-gray-100 transition-all group border-2 border-transparent has-[:checked]:border-blue-500/20 has-[:checked]:bg-blue-50/10">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isAggent"
                          checked={formData.isAggent}
                          onChange={handleInputChange}
                          className="peer w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer accent-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-black text-gray-800 flex items-center gap-2">
                          <FaUserTie className="text-blue-500" /> I am an authorized agent
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium">Toggle this if you are representing the owner</p>
                      </div>
                    </label>

                    {formData.isAggent && (
                      <div className="space-y-2 group animate-fadeIn">
                        <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                          Agent Full Name
                        </label>
                        <div className="relative">
                          <FaUserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" />
                          <input
                            type="text"
                            name="nameOffAgnet"
                            value={formData.nameOffAgnet}
                            onChange={handleInputChange}
                            placeholder="Enter your legal name"
                            className="w-full bg-blue-50/30 border border-blue-100 rounded-[1.25rem] pl-12 pr-6 py-4 focus:bg-white focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] outline-none transition-all font-semibold text-gray-800 placeholder:text-gray-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={nextStep}
                    className="w-full h-[70px] bg-[#1E293B] hover:bg-black text-white font-bold text-lg rounded-[1.5rem] shadow-xl hover:translate-y-[-2px] hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                  >
                    Continue <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-slideUp space-y-8">
                <header>
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-6 hover:-translate-x-1 transition-transform"
                  >
                    <FaChevronLeft className="text-xs" /> Back to details
                  </button>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Review our data policies</h1>
                  <p className="text-gray-500 mt-2 font-medium">Finalize your onboarding by accepting our terms.</p>
                </header>

                <div className="h-[320px] overflow-y-auto border-2 border-gray-100 rounded-[1.5rem] p-6 text-[13px] text-gray-600 bg-gray-50/30 space-y-4 leading-relaxed scrollbar-thin scrollbar-thumb-gray-200">
                  <p className="font-bold text-gray-900">Privacy Policy for {formData.restaurantName}</p>
                  <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information. We collect business-related identifiers (Owner ID: {formData.ownerIdNumber}) to verify legitimacy.</p>
                  <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
                  
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mt-6">Core Definitions</h3>
                  <ul className="list-disc list-inside space-y-1 ml-1 opacity-80">
                    <li>Account: A unique access point for Dinner Bell.</li>
                    <li>Company: Dinner Bell Ads Network.</li>
                    <li>Personal Data: Information relating to you.</li>
                  </ul>
                  <p className="text-[11px] bg-blue-50 p-3 rounded-xl border border-blue-100/50">
                    <span className="font-bold text-blue-700 uppercase">Verification Check:</span> Your food inspection number <strong>{formData.foodInspectionNumber}</strong> will be validated against local regulatory databases.
                  </p>
                </div>

                <div className="space-y-6">
                  <label className="flex items-start gap-4 p-6 bg-white border-2 border-gray-100 rounded-[1.5rem] cursor-pointer hover:border-blue-500/30 transition-all select-none group has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/20">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="peer opacity-0 absolute w-6 h-6 cursor-pointer"
                      />
                      <div className="w-6 h-6 border-2 border-gray-200 rounded-lg group-hover:border-blue-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center text-white">
                        <FaCheckCircle className="text-[10px]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-gray-700">I certify that the information provided is correct</span>
                      <p className="text-[11px] text-gray-400 mt-1 font-medium">Agreement includes Dinner Bell <Link href="/pages/privacyPolicy" className="text-blue-600 hover:underline">Privacy Policy</Link> & <Link href="/pages/terms" className="text-blue-600 hover:underline">Terms</Link>.</p>
                    </div>
                  </label>

                  <button
                    disabled={!agreed || isSubmitting}
                    onClick={handleFinalSubmit}
                    className="w-full h-[70px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg rounded-[1.5rem] shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)] hover:translate-y-[-2px] disabled:opacity-50 disabled:grayscale transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Complete Registration <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-slideUp space-y-10 text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                  <FaShieldAlt className="text-blue-500 text-4xl" />
                </div>
                
                <header>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Secure your account</h1>
                  <p className="text-gray-500 mt-3 font-medium px-4">
                    Final step! Sign in with Google to securely link your restaurant profile to your account.
                  </p>
                </header>

                <div className="space-y-4">
                  <button
                    onClick={handleFinalLogin}
                    className="w-full h-[75px] bg-white border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all rounded-[1.5rem] flex items-center justify-center gap-4 text-gray-700 font-bold text-lg group"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <FaGoogle className="text-red-500" />
                    </div>
                    Sign in with Google
                  </button>
                  
                  <p className="text-[11px] text-gray-400 font-medium">
                    By continuing, you agree to our <Link href="/pages/terms" className="text-blue-600 hover:underline">Terms</Link> and <Link href="/pages/privacyPolicy" className="text-blue-600 hover:underline">Privacy Policy</Link>. Your data will be saved immediately after successful login.
                  </p>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  <FaChevronLeft className="text-xs" /> Back to agreement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-8 flex items-center gap-2 opacity-30">
        <span className="text-sm font-black tracking-widest uppercase">Secure Business Verification 2026</span>
      </div>
    </div>
  );
}
