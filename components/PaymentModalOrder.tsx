"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CheckoutFormOrder from "./CheckoutFormOrder";

interface PaymentModalProps {
  isOpen: boolean;
  buget: number;
  onClose: () => void;
  id: string;
  location: string;
  customerId: string;
}
("");
const PaymentModalOrder: React.FC<PaymentModalProps> = ({
  buget,
  isOpen,
  onClose,
  location,
  id,
  customerId,
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);

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

          <Elements stripe={stripePromise}>
            <CheckoutFormOrder
              customerId={customerId}
              location={location}
              id={id}
              budget={buget}
            />
          </Elements>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaymentModalOrder;
