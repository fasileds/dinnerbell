"use client";
import { motion } from "framer-motion";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { Button } from "antd";
import PaymentModalOrder from "./PaymentModalOrder";

interface DishProps {
  id: string;
  videoUrl: string;
  userId: string;
  price: number;
  description?: string;
  customerId: string;
}

function Dish({
  id,
  videoUrl,
  description,
  price,
  userId,
  customerId,
}: DishProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoUrl}`;

  const handleProceedToPayment = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-lg border border-gray-200 shadow-md relative overflow-hidden text-center transition duration-300 ease-in-out hover:shadow-xl hover:scale-105"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="absolute top-4 right-4"
        initial={{ x: 60, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {description && (
          <a
            href="#"
            className="h-10 w-10 text-red-600 bg-gray-200 rounded-full flex justify-center items-center transition duration-300 ease-in-out hover:bg-red-500 hover:text-white"
            title="Favorite"
          >
            <FaHeart />
          </a>
        )}
      </motion.div>
      <motion.div
        className="absolute top-4 left-4"
        initial={{ x: -60, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {description && (
          <a
            href="#"
            className="h-10 w-10 text-blue-600 bg-gray-200 rounded-full flex justify-center items-center transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
            title="View Details"
          >
            <FaEye />
          </a>
        )}
      </motion.div>

      <iframe
        className="h-48 w-full object-cover rounded-lg transition duration-300 mb-4"
        src={embedUrl}
        title={description}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <h3 className="text-xl font-semibold text-gray-800 mb-2 transition duration-300">
        {description}
      </h3>

      {description && (
        <p className="text-gray-600 text-lg py-1 leading-relaxed mb-4">
          {description}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-green-600 font-bold text-2xl">{`$${price}`}</span>
        <Button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold transition duration-300 hover:bg-green-700 flex items-center"
          type="primary"
          onClick={handleProceedToPayment}
        >
          <FaShoppingCart className="mr-2" />
          Order
        </Button>
      </div>

      <PaymentModalOrder
        customerId={customerId}
        location="Addis Ababa"
        id={id}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        buget={price * 100}
      />
    </motion.div>
  );
}

export default Dish;
