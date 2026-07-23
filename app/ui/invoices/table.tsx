"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { QRCode } from "antd";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatus from "@/app/ui/invoices/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import QRScanner from "@/components/QRScanner";

interface Menu {
  id: string;
  videoUrl: string;
  description: string;
  userId: string;
  price: number;
}

interface OrderItem {
  id: string;
  location: string;
  menuId: string;
  menu: Menu;
  createdAt: string;
}

export default function InvoicesTable() {
  const [user, setUser] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<OrderItem | null>(
    null
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);

    const getOrders = async () => {
      try {
        const res: any = await axios.get(
          "/api/order/getAllOrders?userId=1ce953eb-23d6-4f24-aaa2-27d9c5eb6ecf"
        );
        setOrder(res.data.order);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, []);

  const handleScan = (data: string) => {
    if (data) {
      setQrCode(data);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const handleScannerButtonClick = () => {
    if (isMobile) {
      setIsScannerVisible(true);
    } else {
      alert("QR scanner is only available on mobile devices.");
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="inline-block min-w-full align-middle bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:hidden">
          {order.map((invoice) => (
            <div
              key={invoice.id}
              onClick={() => setSelectedInvoice(invoice)} // Open modal on click
              className="mb-4 w-full rounded-lg bg-white p-4 shadow-md cursor-pointer hover:shadow-lg transition-all ease-in-out duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <p className="text-lg font-semibold text-gray-800 truncate">
                  {invoice.menu.id}
                </p>
                <p className="text-lg font-bold text-gray-600">
                  ${invoice.menu.price}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-500">
                  {formatDateToLocal(invoice.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <table className="hidden min-w-full text-gray-900 md:table">
          <thead className="text-sm font-semibold text-left bg-gradient-to-r from-blue-200 to-blue-100">
            <tr className="border-b border-gray-200">
              <th
                scope="col"
                className="px-6 py-3 text-sm font-medium text-gray-700 uppercase"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-sm font-medium text-gray-700 uppercase"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-sm font-medium text-gray-700 uppercase"
              >
                Date
              </th>
              <th scope="col" className="relative py-3 pl-6 pr-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {order.map((invoice) => (
              <tr
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                className="w-full border-b border-gray-200 py-3 text-sm cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                <td className="whitespace-nowrap px-6 py-4 text-gray-600 font-medium">
                  {invoice.menu.id}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-600 font-medium">
                  ${invoice.menu.price}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-600 font-medium">
                  {formatDateToLocal(invoice.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-gray-600 font-medium">
                  <button
                    onClick={handleScannerButtonClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 ease-in-out"
                  >
                    Open QR Scanner
                  </button>
                  {isMobile && isScannerVisible && (
                    <QRScanner onScan={handleScan} onError={handleError} />
                  )}

                  {qrCode && (
                    <div>
                      <h3>Scanned QR Code:</h3>
                      <p>{qrCode}</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-500 ease-in-out scale-105 md:scale-100">
            <button
              onClick={() => setSelectedInvoice(null)} // Close modal
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition-colors duration-200 shadow-lg focus:outline-none"
              aria-label="Close"
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Order Details
              </h2>

              <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
                <p className="text-gray-700">
                  <strong>Location:</strong> {selectedInvoice.location}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Description:</strong>{" "}
                  {selectedInvoice.menu.description}
                </p>
              </div>

              <div className="mt-4 flex flex-col items-center mb-4">
                <strong className="text-gray-800 mb-3">
                  QR Code for Order ID
                </strong>
                <QRCode value={selectedInvoice.id} size={150} level="H" />
              </div>

              <div className="mt-4">
                <strong className="text-gray-800 mb-2">Video:</strong>
                <div className="relative w-full h-48 mt-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <iframe
                    src={getEmbedUrl(selectedInvoice.menu.videoUrl)}
                    className="w-full h-full rounded-lg"
                    title="Video"
                    allow="fullscreen"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com")) {
    return url.replace("watch?v=", "embed/");
  } else if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}
