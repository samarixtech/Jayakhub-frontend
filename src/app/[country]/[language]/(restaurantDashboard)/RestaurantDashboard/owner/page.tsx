"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MdPerson,
  MdPhone,
  MdMail,
  MdLocationOn,
  MdEdit,
  MdClose,
  MdOutlineTimer,
  MdSearch,
  MdVisibility,
  MdDeleteForever,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { motion } from "framer-motion";

// -----------------------------------------
// TYPES
// -----------------------------------------
interface OwnerType {
  name: string;
  phone: string;
  email: string;
  address: string;
  joiningDate: string;
  status: "Active" | "Inactive";
  commissionRate: string;
  totalRestaurants: number;
}

interface RestaurantType {
  id: number;
  name: string;
  category: string;
  location: string;
  status: "Active" | "Inactive";
  orders: number;
  revenue: string;
  rating: number;
  menuItems: number;
}

// -----------------------------------------
// SMALL COMPONENTS
// -----------------------------------------
interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  full?: boolean;
}

function InfoRow({ icon, label, value, full }: InfoProps) {
  return (
    <div className={`flex items-start gap-3 ${full ? "col-span-full" : ""}`}>
      <span className="text-[#0B5D4E] text-xl mt-1">{icon}</span>
      <p className="text-gray-700 text-sm">
        <strong className="font-semibold text-gray-900">{label}: </strong>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center
      ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-1 ${
          status === "Active" ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      {status}
    </span>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[#2C2C2C]/60 backdrop-blur-sm flex justify-center items-center p-6 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-[#E8F4F1] rounded-xl p-6 w-full max-w-lg relative shadow-2xl border border-gray-300"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 bg-[#FFF9EE] p-1 rounded-full hover:bg-[#FFF9EE] transition"
        >
          <MdClose size={22} className="text-gray-500" />
        </button>

        {children}
      </motion.div>
    </div>
  );
}

// -----------------------------------------
// MAIN COMPONENT
// -----------------------------------------
export default function OwnerDetail() {
  const [owner, setOwner] = useState<OwnerType>({
    name: "Vikram Sharma",
    phone: "+91 98765 43210",
    email: "vikram.sharma@example.com",
    address: "H.No 45, DLF Phase 1, Gurgaon, India",
    joiningDate: "2021-08-15",
    status: "Active",
    commissionRate: "15%",
    totalRestaurants: 3,
  });

  const [restaurants, setRestaurants] = useState<RestaurantType[]>([
    {
      id: 1,
      name: "Italiano Kitchen",
      category: "Italian",
      location: "Delhi",
      status: "Active",
      orders: 431,
      revenue: "₹78,300",
      rating: 4.7,
      menuItems: 38,
    },
    {
      id: 2,
      name: "Burger Hub",
      category: "Fast Food",
      location: "Gurgaon",
      status: "Inactive",
      orders: 81,
      revenue: "₹15,900",
      rating: 4.2,
      menuItems: 22,
    },
    {
      id: 3,
      name: "Royal Biryani House",
      category: "Indian",
      location: "Noida",
      status: "Active",
      orders: 538,
      revenue: "₹1,12,200",
      rating: 4.9,
      menuItems: 41,
    },
  ]);

  const [editModal, setEditModal] = useState(false);
  const [ownerDraft, setOwnerDraft] = useState(owner);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const uniqueCategories = ["All", ...new Set(restaurants.map((r) => r.category))];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      const matchCategory = filterCategory === "All" || r.category === filterCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [restaurants, search, filterStatus, filterCategory]);

  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(filteredRestaurants.length / perPage);

  const paginatedRestaurants = filteredRestaurants.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const deleteRestaurant = (id: number) => {
    setRestaurants(restaurants.filter((r) => r.id !== id));
  };

  const saveOwner = () => {
    setOwner(ownerDraft);
    setEditModal(false);
  };

  // Animated counter for stats
  const [animatedTotal, setAnimatedTotal] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = owner.totalRestaurants;
    const step = Math.ceil(end / 50);
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setAnimatedTotal(end);
        clearInterval(interval);
      } else setAnimatedTotal(start);
    }, 20);
    return () => clearInterval(interval);
  }, [owner.totalRestaurants]);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800">
            👤 Owner Details
          </h1>
          <button
            onClick={() => {
              setOwnerDraft(owner);
              setEditModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <MdEdit size={18} /> Edit Owner
          </button>
        </div>

        {/* OWNER CARD */}
        <div className="bg-[#E8F4F1] rounded-xl p-6 shadow-xl border border-gray-300">
          <h2 className="text-xl font-bold border border-gray-300 border-b pb-2 p-3 rounded-xl  bg-green-50 mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
            <InfoRow icon={<MdPerson />} label="Full Name" value={owner.name} />
            <InfoRow icon={<MdOutlineTimer />} label="Partner Since" value={owner.joiningDate} />
            <InfoRow icon={<MdPhone />} label="Phone" value={owner.phone} />
            <InfoRow icon={<MdMail />} label="Email" value={owner.email} />
            <div className="col-span-full">
              <InfoRow icon={<MdLocationOn />} label="Address" value={owner.address} full />
            </div>
          </div>
        </div>

        {/* BUSINESS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-gray-300 p-6 rounded-xl shadow">
            <p className="text-sm font-semibold text-[#0B5D4E] mb-2">Account Status</p>
            <StatusBadge  status={owner.status} />
          </div>

          <div className="bg-green-50 border border-gray-300 p-6 rounded-xl shadow">
            <p className="text-sm font-semibold text-green-600 mb-2">Commission Rate</p>
            <p className="text-3xl font-extrabold text-green-700">{owner.commissionRate}</p>
          </div>

          <div className="bg-purple-50 border border-gray-300 p-6 rounded-xl shadow">
            <p className="text-sm font-semibold text-purple-600 mb-2">Total Restaurants</p>
            <p className="text-3xl font-extrabold text-purple-700">{animatedTotal}</p>
          </div>
        </div>

        {/* RESTAURANTS TABLE */}
        <div className="bg-[#E8F4F1] p-6 rounded-xl shadow-xl border border-gray-300">
          <h2 className="text-xl font-bold mb-4">Restaurants Managed ({filteredRestaurants.length})</h2>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="flex items-center gap-2 bg-[#FFF9EE] px-3 py-2 rounded-lg border border-gray-300">
              <MdSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search restaurant..."
                className="bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="bg-[#FFF9EE] px-3 py-2 rounded-lg border border-gray-300 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              className="bg-[#FFF9EE] px-3 py-2 rounded-lg border border-gray-300 text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {uniqueCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-[#FFF9EE] text-gray-600 text-sm uppercase">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Orders</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Menu Items</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRestaurants.map((r) => (
                  <tr key={r.id} className="border border-gray-300 border-b hover:bg-[#0B5D4E]/50 transition">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">{r.category}</td>
                    <td className="px-4 py-3">{r.location}</td>
                    <td className="px-4 py-3">{r.orders}</td>
                    <td className="px-4 py-3 text-green-700">{r.revenue}</td>
                    <td className="px-4 py-3">{r.rating} ⭐</td>
                    <td className="px-4 py-3">{r.menuItems}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 flex gap-3 justify-center">
                      <button className="text-[#0B5D4E] hover:bg-[#0B5D4E] p-2 rounded">
                        <MdVisibility size={20} />
                      </button>

                      <button
                        onClick={() => deleteRestaurant(r.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedRestaurants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No restaurants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filteredRestaurants.length)} of {filteredRestaurants.length}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-full hover:bg-[#FFF9EE] disabled:opacity-50"
                >
                  <MdChevronLeft size={22} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm ${page === i + 1 ? "bg-[#0B5D4E] text-[#E8F4F1]" : "bg-[#FFF9EE] hover:bg-[#FFF9EE]"}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-full hover:bg-[#FFF9EE] disabled:opacity-50"
                >
                  <MdChevronRight size={22} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* OWNER EDIT MODAL */}
        {editModal && (
          <Modal onClose={() => setEditModal(false)}>
            <h2 className="text-xl font-bold mb-4">Edit Owner Details</h2>
            <div className="flex flex-col gap-3">
              <input
                className="input"
                value={ownerDraft.name}
                onChange={(e) => setOwnerDraft({ ...ownerDraft, name: e.target.value })}
                placeholder="Owner Name"
              />
              <input
                className="input"
                value={ownerDraft.phone}
                onChange={(e) => setOwnerDraft({ ...ownerDraft, phone: e.target.value })}
                placeholder="Phone"
              />
              <input
                className="input"
                value={ownerDraft.email}
                onChange={(e) => setOwnerDraft({ ...ownerDraft, email: e.target.value })}
                placeholder="Email"
              />
              <input
                className="input"
                value={ownerDraft.address}
                onChange={(e) => setOwnerDraft({ ...ownerDraft, address: e.target.value })}
                placeholder="Address"
              />
              <input
                className="input"
                value={ownerDraft.commissionRate}
                onChange={(e) => setOwnerDraft({ ...ownerDraft, commissionRate: e.target.value })}
                placeholder="Commission Rate (e.g. 15%)"
              />
              <select
                className="input"
                value={ownerDraft.status}
                onChange={(e) => setOwnerDraft({ ...ownerDraft, status: e.target.value as "Active" | "Inactive" })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-[#FFF9EE]"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={saveOwner}>
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
