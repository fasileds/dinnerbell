"use client";

import {
  EyeIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteInvoice } from "@/app/lib/actions";

export function CreateInvoice() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleAgree = () => {
    setShowModal(false);
    router.push("/dashboard/uploadeVideo");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">Create Add</span>
        <PlusIcon className="h-5 md:ml-4" />
      </button>

    {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full mx-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Terms & Conditions
      </h2>
      <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto px-1">
        <p>
          By proceeding to create an advertisement, you confirm that you have read and agree to the following:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>You cannot cancel or change your advertisement once posted.</strong>
          </li>
          <li>
            You are responsible for how your advertisement portrays the product and its effects on potential customers.
          </li>
          <li>
            You are solely responsible for the quality and legality of your advertisement, including ethical and legal implications of the business/product you represent.
          </li>
          <li>
            Your advertisement must accurately depict the product and align with customer expectations.
          </li>
          <li>
            You are accountable for any customer issues arising from the product or advertisement.
          </li>
          <li>
            Your advertisement must be for a <strong>legal product</strong> and must represent it <strong>truthfully</strong>.
          </li>
        </ul>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium transition"
        >
          Cancel
        </button>
        <button
          onClick={handleAgree}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold shadow-sm transition"
        >
          Agree & Continue
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
