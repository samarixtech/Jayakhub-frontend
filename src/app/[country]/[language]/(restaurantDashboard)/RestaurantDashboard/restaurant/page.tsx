"use client";

import { useState, useMemo } from "react";
import {
  MdLocationOn,
  MdPhone,
  MdMail,
  MdStore,
  MdEdit,
  MdAdd,
  MdClose,
  MdSearch,
  MdPerson,
  MdDeleteForever,
  MdChevronLeft, 
  MdChevronRight,
} from "react-icons/md";

// -----------------------------------------
// TYPES
// -----------------------------------------
interface RestaurantType {
  name: string;
  owner: string;
  status: "Active" | "Inactive";
  phone: string;
  email: string;
  address: string;
  description: string;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  status: "Active" | "Inactive";
}

// -----------------------------------------
// MAIN COMPONENT
// -----------------------------------------
export default function RestaurantDetail() {
  const [restaurant, setRestaurant] = useState<RestaurantType>({
    name: "Italiano Kitchen",
    owner: "John Doe",
    status: "Active",
    phone: "+1 987-654-3210",
    email: "italiano@gmail.com",
    address: "123 Main Street, New York, USA",
    description:
      "Premium Italian restaurant serving authentic pizza, pasta and desserts. We pride ourselves on using the freshest local ingredients.",
  });

  // Example data extended for pagination testing
  const initialMenuItems: MenuItem[] = [
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: "$12", status: "Active" },
    { id: 2, name: "Classic Beef Burger", category: "Burger", price: "$10", status: "Active" },
    { id: 3, name: "Creamy Pasta Alfredo", category: "Pasta", price: "$14", status: "Inactive" },
    { id: 4, name: "Lava Chocolate Cake", category: "Dessert", price: "$8", status: "Active" },
    { id: 5, name: "Pepperoni Pizza", category: "Pizza", price: "$15", status: "Active" },
    { id: 6, name: "Veggie Burger", category: "Burger", price: "$9", status: "Inactive" },
    { id: 7, name: "Spaghetti Carbonara", category: "Pasta", price: "$16", status: "Active" },
    { id: 8, name: "Tiramisu", category: "Dessert", price: "$7", status: "Active" },
    { id: 9, name: "Hawaiian Pizza", category: "Pizza", price: "$13", status: "Inactive" },
    { id: 10, name: "Chicken Burger", category: "Burger", price: "$11", status: "Active" },
    { id: 11, name: "Lasagna", category: "Pasta", price: "$18", status: "Active" },
    { id: 12, name: "Cheesecake", category: "Dessert", price: "$6", status: "Active" },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const [editRestaurantModal, setEditRestaurantModal] = useState<boolean>(false);
  const [itemModal, setItemModal] = useState<boolean>(false);

  const [currentRestaurantDraft, setCurrentRestaurantDraft] = useState<RestaurantType>(restaurant);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);

  // -----------------------------------------
  // PAGINATION STATE
  // -----------------------------------------
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 5;


  // -----------------------------------------
  // RESTAURANT SAVE
  // -----------------------------------------
  const saveRestaurant = () => {
    setRestaurant(currentRestaurantDraft);
    setEditRestaurantModal(false);
  };

  // -----------------------------------------
  // FILTERED MENU ITEMS (Memoized for efficiency)
  // -----------------------------------------
  const filteredItems = useMemo(() => {
    setCurrentPage(1); // Reset page on filter/search change
    return menuItems.filter((item) => {
      const matchStatus = filterStatus === "All" || item.status === filterStatus;
      const matchCategory = filterCategory === "All" || item.category === filterCategory;
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
  
      return matchStatus && matchCategory && matchSearch;
    });
  }, [menuItems, search, filterStatus, filterCategory]);

  const uniqueCategories = ["All", ...new Set(menuItems.map(item => item.category))];
  
  // -----------------------------------------
  // PAGINATION LOGIC
  // -----------------------------------------
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  

  // -----------------------------------------
  // SAVE ITEM (ADD/EDIT)
  // -----------------------------------------
  const saveItem = () => {
    if (!currentItem) return;

    if (currentItem.name === "" || currentItem.category === "" || currentItem.price === "") {
        alert("Please fill in all item fields.");
        return;
    }

    if (currentItem.id && currentItem.id !== 0) {
      setMenuItems(menuItems.map((i) => (i.id === currentItem.id ? currentItem : i)));
    } else {
      setMenuItems([...menuItems, { ...currentItem, id: Date.now() }]);
    }

    setItemModal(false);
    setCurrentItem(null);
  };

  // -----------------------------------------
  // DELETE ITEM
  // -----------------------------------------
  const deleteItem = (id: number) => {
    if(window.confirm("Are you sure you want to delete this menu item?")) {
        setMenuItems(menuItems.filter((i) => i.id !== id));
        // Recalculate page after deletion if the current page becomes empty
        if (currentPage > 1 && currentItems.length === 1) {
            setCurrentPage(prev => prev - 1);
        }
    }
  };


  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* PAGE HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800">🍽️ Restaurant Details</h1>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCurrentRestaurantDraft(restaurant); 
                setEditRestaurantModal(true);
              }}
              className="bg-[#0B5D4E] text-[#E8F4F1] px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-[#0B5D4E] transition btn-primary"
            >
              <MdEdit size={18} /> Edit Restaurant
            </button>

            <button
              onClick={() => {
                setCurrentItem({
                  id: 0,
                  name: "",
                  category: "",
                  price: "",
                  status: "Active",
                });
                setItemModal(true);
              }}
              className="bg-green-600 text-[#E8F4F1] px-4 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-green-700 transition font-medium"
            >
              <MdAdd size={18} /> Add Menu Item
            </button>
          </div>
        </div>

        <hr className="border-[#FFF9EE]" />

        {/* BASIC INFO */}
        <div className="bg-[#E8F4F1] p-6 rounded-xl shadow-lg border border-[#FFF9EE]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
          <p className="text-gray-600 mb-4 italic">{restaurant.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <InfoRow icon={<MdStore />} label="Status" value={restaurant.status} />
            <InfoRow icon={<MdPerson />} label="Owner" value={restaurant.owner} />
            <InfoRow icon={<MdPhone />} label="Phone" value={restaurant.phone} />
            <InfoRow icon={<MdMail />} label="Email" value={restaurant.email} />
            <InfoRow
              icon={<MdLocationOn />}
              label="Address"
              value={restaurant.address}
              full
            />
          </div>
        </div>

        {/* MENU ITEMS */}
        <div className="bg-[#E8F4F1] p-6 rounded-xl shadow-lg border border-[#FFF9EE]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">📜 Menu Items ({filteredItems.length} found)</h2>

          {/* SEARCH + FILTERS */}
          <div className="flex flex-wrap items-center gap-3 mb-6">

            <div className="flex items-center gap-2 bg-[#FFF9EE] px-3 py-2 rounded-lg border border-[#FFF9EE] focus-within:border-[#0B5D4E]">
              <MdSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search item name..."
                className="bg-transparent outline-none text-sm w-40 sm:w-60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="bg-[#FFF9EE] px-3 py-2 rounded-lg text-sm border border-[#FFF9EE] cursor-pointer hover:bg-[#FFF9EE] transition"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              className="bg-[#FFF9EE] px-3 py-2 rounded-lg text-sm border border-[#FFF9EE] cursor-pointer hover:bg-[#FFF9EE] transition"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
                {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
          </div>

          {/* MENU TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto min-w-[600px]">
              <thead>
                <tr className="bg-[#FFF9EE] text-gray-600 text-sm uppercase">
                  <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Price</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold rounded-tr-lg">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                    <tr key={item.id} className="border-b border-[#FFF9EE] hover:bg-[#0B5D4E]/50 transition duration-150">
                        <td className="px-4 py-3 text-gray-800">{item.name}</td>
                        <td className="px-4 py-3 text-gray-600">{item.category}</td>
                        <td className="px-4 py-3 text-green-700 font-medium">{item.price}</td>
                        <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                        </td>

                        {/* ACTION COLUMN WITH ICONS */}
                        <td className="px-4 py-3 flex justify-center gap-3 text-sm">
                        <button
                            onClick={() => {
                            setCurrentItem(item);
                            setItemModal(true);
                            }}
                            title="Edit Item"
                            className="text-[#0B5D4E] hover:text-[#B6932F] transition p-1 rounded-full hover:bg-[#0B5D4E]"
                        >
                            <MdEdit size={20} />
                        </button>

                        <button
                            onClick={() => deleteItem(item.id)}
                            title="Delete Item"
                            className="text-red-600 hover:text-red-800 transition p-1 rounded-full hover:bg-red-100"
                        >
                            <MdDeleteForever size={20} />
                        </button>
                        </td>
                        {/* END ACTION COLUMN */}

                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500 italic">
                            No menu items found matching your criteria.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#FFF9EE]">
                <p className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} results
                </p>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF9EE] transition"
                        title="Previous Page"
                    >
                        <MdChevronLeft size={24} />
                    </button>

                    <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                                    currentPage === index + 1
                                        ? 'bg-[#0B5D4E] text-[#E8F4F1] shadow-md'
                                        : 'bg-[#FFF9EE] text-gray-700 hover:bg-[#FFF9EE]'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF9EE] transition"
                        title="Next Page"
                    >
                        <MdChevronRight size={24} />
                    </button>
                </div>
            </div>
          )}
        </div>

        {/* EDIT RESTAURANT MODAL (Unchanged) */}
        {editRestaurantModal && (
          <Modal onClose={() => setEditRestaurantModal(false)}>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Restaurant Details</h2>
            <div className="flex flex-col gap-3">
                <input
                    className="input"
                    placeholder="Restaurant Name"
                    value={currentRestaurantDraft.name}
                    onChange={(e) => setCurrentRestaurantDraft({ ...currentRestaurantDraft, name: e.target.value })}
                />
                <input
                    className="input"
                    placeholder="Owner Name"
                    value={currentRestaurantDraft.owner}
                    onChange={(e) => setCurrentRestaurantDraft({ ...currentRestaurantDraft, owner: e.target.value })}
                />
                <input
                    className="input"
                    placeholder="Phone"
                    value={currentRestaurantDraft.phone}
                    onChange={(e) => setCurrentRestaurantDraft({ ...currentRestaurantDraft, phone: e.target.value })}
                />
                <input
                    className="input"
                    placeholder="Email"
                    value={currentRestaurantDraft.email}
                    onChange={(e) => setCurrentRestaurantDraft({ ...currentRestaurantDraft, email: e.target.value })}
                />
                <textarea
                    className="input resize-none h-24"
                    placeholder="Description"
                    value={currentRestaurantDraft.description}
                    onChange={(e) =>
                        setCurrentRestaurantDraft({ ...currentRestaurantDraft, description: e.target.value })
                    }
                />
                <input
                    className="input"
                    placeholder="Address"
                    value={currentRestaurantDraft.address}
                    onChange={(e) => setCurrentRestaurantDraft({ ...currentRestaurantDraft, address: e.target.value })}
                />
                <select
                    className="input cursor-pointer"
                    value={currentRestaurantDraft.status}
                    onChange={(e) =>
                        setCurrentRestaurantDraft({ ...currentRestaurantDraft, status: e.target.value as "Active" | "Inactive" })
                    }
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <div className="flex justify-end gap-3 mt-4">
                    <button className="px-4 py-2 rounded-md border border-gray-300 hover:bg-[#FFF9EE] transition font-medium" onClick={() => setEditRestaurantModal(false)}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={saveRestaurant}>
                        Save Details
                    </button>
                </div>
            </div>
          </Modal>
        )}

        {/* ADD/EDIT ITEM MODAL (Unchanged) */}
        {itemModal && currentItem && (
          <Modal onClose={() => setItemModal(false)}>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {currentItem.id && currentItem.id !== 0 ? "✏️ Edit Menu Item" : "✨ Add New Menu Item"}
            </h2>
            <div className="flex flex-col gap-3">
                <input
                    className="input"
                    placeholder="Item Name"
                    value={currentItem.name}
                    onChange={(e) =>
                        setCurrentItem({ ...currentItem, name: e.target.value })
                    }
                />
                <input
                    className="input"
                    placeholder="Category (e.g., Pizza, Dessert)"
                    value={currentItem.category}
                    onChange={(e) =>
                        setCurrentItem({ ...currentItem, category: e.target.value })
                    }
                />
                <input
                    className="input"
                    placeholder="Price (e.g., $14.99)"
                    value={currentItem.price}
                    onChange={(e) =>
                        setCurrentItem({ ...currentItem, price: e.target.value })
                    }
                />
                <select
                    className="input cursor-pointer"
                    value={currentItem.status}
                    onChange={(e) =>
                        setCurrentItem({ ...currentItem, status: e.target.value as "Active" | "Inactive" })
                    }
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <div className="flex justify-end gap-3 mt-4">
                    <button className="px-4 py-2 rounded-md border border-gray-300 hover:bg-[#FFF9EE] transition font-medium" onClick={() => setItemModal(false)}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={saveItem}>
                        {currentItem.id && currentItem.id !== 0 ? "Update Item" : "Create Item"}
                    </button>
                </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------
// SMALL COMPONENTS (Unchanged)
// -----------------------------------------
interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}

function InfoRow({ icon, label, value, full }: InfoProps) {
  return (
    <div className={`flex items-start gap-3 ${full ? "col-span-1 sm:col-span-2 lg:col-span-4" : "col-span-1"}`}>
      <span className="text-[#0B5D4E] text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <p className="text-gray-700 text-sm leading-snug">
        <strong className="font-semibold text-gray-900">{label}: </strong>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  const baseStyle = "px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center";
  return (
    <span
      className={`${baseStyle} ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span className={`w-2 h-2 rounded-full mr-1 ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
      {status}
    </span>
  );
}

// Modal Component
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-[#2C2C2C]/60 bg-opacity-50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#E8F4F1] p-6 rounded-xl shadow-2xl w-full max-w-lg relative animate-scaleIn border border-[#FFF9EE]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition p-1 rounded-full bg-gray-50 hover:bg-[#FFF9EE]"
        >
          <MdClose size={24} />
        </button>

        {children}
      </div>
    </div>
  );
}