import { useVideoContext } from "@/app/context/VideoContext";
import { Dialog } from "@headlessui/react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import { generateEmailTemplate } from "@/utils/generateEmailTemplate";
import { trackTikTokEvent } from "@/app/lib/tiktok";

interface PaymentModalProps {
  budget: number;
}
interface CreateRestorantResponse {
  id: string;
}

const CheckoutForm: React.FC<PaymentModalProps> = ({ budget }) => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  console.log("the last part must work", token);
  const { handleVideoUpload } = useVideoContext();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { formData } = useVideoContext();
  const [uploading, setUploading] = useState(false); 

  const sendReceiptEmail = async () => {
    const emailContent = generateEmailTemplate({ budgett: budget });

    const response = await fetch("/api/send-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        subject: "Your Receipt from Dinner Bell",
        htmlContent: emailContent,
      }),
    });
  };
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
        const response = await fetch("/api/payment_intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: budget, currency: "usd" }),
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
          setUploading(true);
          await saveRestorantInformation();
          console.log("Calling handleVideoUpload...");
          await handleVideoUpload();
          console.log("handleVideoUpload completed.");
          await trackTikTokEvent("CompletePayment", {
            value: budget / 100,
            currency: "USD",
            platforms: formData.selectedPlatforms.join(","),
          });
          await sendReceiptEmail();
          setUploading(false);

          Swal.fire({
            title: "Payment Successful!",
            text: "Your payment has been processed successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });


        }
      } else if (paymentMethod === "bank_transfer") {
        console.log("Bank transfer selected. Implement logic here.");
      }
    } catch (error) {
      setErrorMessage("Payment processing error.");
      console.error(error);

      Swal.fire({
        title: "Payment Error",
        text: "An unexpected error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  const saveRestorantInformation = async () => {
    try {
      const res = await axios.post<{
        user: {
          id: string;
          restorantName: string;
          description: string;
          streetAddress: string;
          city: string;
          state: string;
          zipCode: string;
        };
      }>("/api/restorant/createRestorant", {
        restorantName: formData.restorant,
        description: formData.description,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.country,
        zipCode: formData.zipCode,
      });
      const { id, restorantName, city } = res.data.user;
      console.log("Restaurant ID:", id);
      console.log("Restaurant Name:", restorantName);
      console.log("City:", city);
      formData.restorantId = id;
      console.log("Restaurant ID From The Part:", formData.restorantId);
    } catch (error) {
      console.error("Error saving restaurant information:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Checkout</h2>
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
  );
};

export default CheckoutForm;
