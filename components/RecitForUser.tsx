import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCode } from "antd";

interface ReceiptProps {
  id: string;
  price: number;
  restorantName: string;
}

const ReceiptForUser: React.FC<ReceiptProps> = ({
  id,
  price,
  restorantName,
}) => {
  const handleDownloadPDF = async () => {
    const receiptElement = document.getElementById("receipt");
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
      pdf.save("receipt.pdf");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div id="receipt" className="w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Receipt
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Thank you for your order from {restorantName}!
        </p>

        <div className="border-t border-gray-300 py-4">
          <div className="flex justify-between text-gray-700 mb-2">
            <span className="font-semibold">Restaurant:</span>
            <span>{restorantName}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span className="font-semibold">Order ID:</span>
            <span>{id}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span className="font-semibold">Total Price:</span>
            <span>${price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center mt-6">
          <QRCode value={id} size={100} />
          <p className="text-sm text-gray-500 mt-2">
            Scan this QR code for your order details.
          </p>
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-8 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default ReceiptForUser;
