"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useVideoContext } from "@/app/context/VideoContext";
import { trackTikTokEvent } from "@/app/lib/tiktok";

interface PaymentModalProps {
  isOpen: boolean;
  buget: number;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  buget,
  isOpen,
  onClose,
}) => {
  const { formData, setFormData } = useVideoContext();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const platformOptions = [
    { key: "tiktok", label: "TikTok" },
    { key: "snapshot", label: "Snapshot" },
    { key: "x", label: "X" },
    { key: "google_ads", label: "Google Ads" },
    { key: "linkedin", label: "LinkedIn" },
  ];

  const selectedPlatformCount = formData.selectedPlatforms.length;
  const splitBudget =
    selectedPlatformCount > 0 ? buget / selectedPlatformCount : 0;

  const togglePlatform = async (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(platform)
        ? prev.selectedPlatforms.filter((item) => item !== platform)
        : [...prev.selectedPlatforms, platform],
    }));
    await trackTikTokEvent("SelectPlatform", {
      platform,
      budget: buget,
    });
  };

  useEffect(() => {
    const loadStripePromise = async () => {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      setStripePromise(stripe);
    };
    loadStripePromise();
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg p-8 max-w-lg mx-auto shadow-lg transition-transform transform hover:scale-105 duration-300 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <Dialog.Title className="text-2xl font-bold text-center text-gray-800">
            Payment
          </Dialog.Title>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Choose platforms to publish to
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              The budget will be split evenly across the selected platforms.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {platformOptions.map((platform) => {
                const checked = formData.selectedPlatforms.includes(platform.key);
                return (
                  <label
                    key={platform.key}
                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlatform(platform.key)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{platform.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              {selectedPlatformCount > 0 ? (
                <p>
                  Budget split: ${splitBudget.toFixed(2)} per platform for {selectedPlatformCount} platform(s).
                </p>
              ) : (
                <p className="text-red-600">Select at least one platform to continue.</p>
              )}
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm budget={buget * 100} />
          </Elements>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaymentModal;
