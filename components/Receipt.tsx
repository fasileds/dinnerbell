import React from "react";

export default function Receipt() {
  return (
    <div className="bg-green-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-sm">
        <div className="text-center mb-4">
          <img
            src="/images/restaurant-logo.png"
            alt="Restaurant Logo"
            className="w-24 h-24 mx-auto rounded-full shadow-md"
          />
          <h1 className="text-2xl font-bold text-green-600 mt-4">
            Welcome to GreenBites
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Fresh, Delicious, and Healthy Meals Delivered to Your Doorstep
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-green-600">
            Our Specialties
          </h2>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              <span className="inline-block bg-green-200 text-green-700 font-semibold px-3 py-1 rounded-full mr-2">
                ✓
              </span>
              Organic Ingredients
            </li>
            <li className="flex items-center">
              <span className="inline-block bg-green-200 text-green-700 font-semibold px-3 py-1 rounded-full mr-2">
                ✓
              </span>
              Gluten-Free Options
            </li>
            <li className="flex items-center">
              <span className="inline-block bg-green-200 text-green-700 font-semibold px-3 py-1 rounded-full mr-2">
                ✓
              </span>
              Vegan and Vegetarian Dishes
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-green-600">Contact Us</h3>
          <p className="text-gray-600 text-sm mt-2">
            Address: 123 Green Street, Food City
            <br />
            Email: info@greenbites.com
            <br />
            Phone: (555) 123-4567
          </p>
        </div>

        <div className="mt-6">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-green-200">
                <th className="border px-2 py-1 text-left text-green-700">
                  Item
                </th>
                <th className="border px-2 py-1 text-left text-green-700">
                  Qty
                </th>
                <th className="border px-2 py-1 text-left text-green-700">
                  Sub Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Salad Bowl</td>
                <td className="border px-2 py-1">2</td>
                <td className="border px-2 py-1">$15.00</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Avocado Toast</td>
                <td className="border px-2 py-1">1</td>
                <td className="border px-2 py-1">$8.50</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Smoothie</td>
                <td className="border px-2 py-1">2</td>
                <td className="border px-2 py-1">$10.00</td>
              </tr>
              <tr className="bg-green-100 font-semibold">
                <td className="border px-2 py-1">Tax</td>
                <td className="border px-2 py-1">-</td>
                <td className="border px-2 py-1">$2.35</td>
              </tr>
              <tr className="bg-green-200 font-semibold">
                <td className="border px-2 py-1">Total</td>
                <td className="border px-2 py-1">-</td>
                <td className="border px-2 py-1">$35.85</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <strong>Thank you for choosing GreenBites!</strong> Payments are
            expected within 31 days. Late invoices will incur a 5% monthly
            interest charge.
          </p>
        </div>
      </div>
    </div>
  );
}
