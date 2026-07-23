import { useVideoContext } from "@/app/context/VideoContext";
import { Dialog } from "@headlessui/react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState, useRef } from "react";
import Loader from "./Loader";
import { Button, QRCode } from "antd";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

interface PaymentModalProps {
  budget: number;
  location: string;
  id: string;
  customerId: string;
}

const CheckoutFormOrder: React.FC<PaymentModalProps> = ({
  budget,
  location,
  id,
  customerId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [receipt, setReceipt] = useState<{
    amount: number;
    email: string;
    orderId: string;
  } | null>(null);
  const { formData } = useVideoContext();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      if (paymentMethod === "card") {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setErrorMessage("Card element not found.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/payment_intent_for_food_order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: budget,
            currency: "usd",
            customerId: customerId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent.");
        }

        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name,
              email,
            },
          },
        });

        if (result.error) {
          setErrorMessage(result.error.message || "Payment failed.");
        } else if (result.paymentIntent?.status === "succeeded") {
          await savedOrder();
          setReceipt({ amount: budget, email, orderId: id });
        }
      } else if (paymentMethod === "bank_transfer") {
        console.log("Bank transfer selected. Implement logic here.");
      }
    } catch (error) {
      setErrorMessage("Payment processing error.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const savedOrder = async () => {
    if (!id || !location) {
      console.error("Invalid input: id or location is missing");
      return;
    }

    try {
      const apiUrl = "/api/order/createOrder";
      const res = await axios.post(apiUrl, {
        menuId: id,
        location: location,
      });
      if (res.status === 200) {
        console.log("Order saved successfully:", res.data);
      } else {
        console.error("Failed to save order:", res.data);
      }
    } catch (error: any) {
      console.error(
        "Error while saving order:",
        error.response?.data || error.message
      );
    }
  };

  const downloadAsImage = async () => {
    if (receiptRef.current) {
      const dataUrl = await htmlToImage.toPng(receiptRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `receipt-${receipt?.orderId}.png`;
      link.click();
    }
  };

  const downloadAsPDF = async () => {
    if (receiptRef.current) {
      const pdf = new jsPDF();
      const dataUrl = await htmlToImage.toPng(receiptRef.current);
      pdf.addImage(dataUrl, "PNG", 10, 10, 180, 160);
      pdf.save(`receipt-${receipt?.orderId}.pdf`);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      {receipt ? (
        <div
          ref={receiptRef}
          className="bg-white border rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            Payment Receipt
          </h2>
          <p className="text-lg font-medium text-gray-600 mb-1">
            Thank you for your purchase!
          </p>
          <div className="my-4 border-b border-gray-300"></div>

          <div className="text-left mb-4">
            <p className="text-sm font-semibold text-gray-800">
              <span className="text-blue-600">Amount Paid:</span>
              <span className="ml-2 text-gray-700">
                ${(receipt.amount / 100).toFixed(2)}
              </span>
            </p>
            <p className="text-sm font-semibold text-gray-800">
              <span className="text-blue-600">Email:</span>
              <span className="ml-2 text-gray-700">{receipt.email}</span>
            </p>
            <p className="text-sm font-semibold text-gray-800">
              <span className="text-blue-600">Order ID:</span>
              <span className="ml-2 text-gray-700">{receipt.orderId}</span>
            </p>
          </div>

          <div className="mt-6 flex justify-center ">
            <QRCode
              value={receipt.orderId}
              size={140}
              style={{
                padding: "10px",
                background: "white",
                borderRadius: "8px",
              }}
            />
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={downloadAsImage}
              type="primary"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
            >
              Download as Image
            </Button>
            <Button
              onClick={downloadAsPDF}
              type="default"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
            >
              Download as PDF
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Checkout
          </h2>
          <Dialog.Description className="mt-2 text-center text-gray-600">
            Please fill in your payment details.
          </Dialog.Description>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 transition duration-150"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 transition duration-150"
              placeholder="example@example.com"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="payment-method"
            >
              Payment Method
            </label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 transition duration-150"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {paymentMethod === "card" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Card Information
              </label>
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: { fontSize: "16px", color: "#32325d" },
                    invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-2 px-4 font-semibold rounded-lg text-white ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200`}
          >
            {loading ? <Loader isLoading={loading} /> : "Pay"}
          </button>

          {errorMessage && (
            <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default CheckoutFormOrder;
