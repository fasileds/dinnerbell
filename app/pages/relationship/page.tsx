"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import sampleUsers from "./sampleData.json";
import { Dialog } from "@headlessui/react";

// Extended user type with new fields
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  agency?: string;
  description?: string;
  department?: string;
  location?: string;
  permissions?: string[];
  join_date?: string;
};

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const resolvedUsers = Array.isArray(sampleUsers)
        ? sampleUsers
        : (sampleUsers as { default?: User[] }).default ?? [];
      setUsers(resolvedUsers);
    }, 500);
  }, []);

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex flex-col items-center py-14 px-6">
      <h1 className="text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg text-center">
        👥 User Directory
      </h1>
      <p className="text-white/90 mb-12 text-lg text-center max-w-2xl">
        Browse through our amazing users. Use the search bar to quickly find
        someone by <span className="font-semibold">name</span>,{" "}
        <span className="font-semibold">email</span>, or{" "}
        <span className="font-semibold">role</span>.
      </p>

      <div className="relative w-full max-w-xl mb-12">
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/90 text-gray-800 
                     placeholder-gray-500 shadow-md focus:ring-2 focus:ring-indigo-400 
                     focus:outline-none transition"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      {users.length === 0 ? (
        <p className="text-white text-lg animate-pulse">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-white text-lg">❌ No users found</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => openModal(user)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                         p-6 transform transition duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-indigo-500 mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span
                  className={`mt-3 inline-block px-3 py-1 text-sm font-semibold rounded-full 
                    ${
                      user.role === "Admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "Manager"
                        ? "bg-yellow-100 text-yellow-700"
                        : user.role === "Moderator"
                        ? "bg-green-100 text-green-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedUser && (
        <Dialog
  open={isModalOpen}
  onClose={closeModal}
  className="fixed inset-0 z-50 flex items-center justify-center px-4"
>
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300" aria-hidden="true" />

  <div className="relative z-50 w-full max-w-3xl rounded-3xl bg-white shadow-2xl p-10 md:p-12 border-t-[10px] border-indigo-500 animate-fadeIn">
    <Dialog.Title className="text-4xl font-black text-gray-900 mb-6 text-center tracking-tight">
      {selectedUser.name}
    </Dialog.Title>

    <div className="flex flex-col items-center text-center">
      <Image
        src={selectedUser.avatar}
        alt={selectedUser.name}
        width={130}
        height={130}
        className="rounded-full border-4 border-indigo-500 shadow-xl mb-6"
      />
      <p className="text-gray-600 text-sm mb-2">{selectedUser.email}</p>
      <div className="flex flex-wrap justify-center gap-2 mt-3 mb-6">
        <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
          {selectedUser.role}
        </span>
        <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
          {selectedUser.agency}
        </span>
        <span className="bg-green-200 text-green-800 text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
          {selectedUser.department}
        </span>
        <span className="bg-pink-200 text-pink-800 text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
          {selectedUser.location}
        </span>
        <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
          Joined: {selectedUser.join_date}
        </span>
      </div>
      <p className="text-gray-700 text-lg font-medium mb-6 max-w-xl">
        "{selectedUser.description}"
      </p>

      {/* Updated Permissions Style */}
      <div className="w-full">
        <h3 className="text-md font-bold text-gray-800 mb-3 text-left">Permissions</h3>
        <div className="flex flex-wrap gap-2">
          {selectedUser.permissions?.map((perm, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>

    <button
      onClick={closeModal}
      className="mt-10 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-2xl shadow-md transition duration-300"
    >
      ✕ Close Profile
    </button>
  </div>
</Dialog>


      )}
    </div>
  );
};

export default UserListPage;
<style jsx>{`
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>