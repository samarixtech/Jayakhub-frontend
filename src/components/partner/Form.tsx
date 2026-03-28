"use client";
import { useState } from "react";
import { PhoneInput } from "@/components/ui/phone-input";

export default function PartnerForm() {
  const [form, setForm] = useState<any>({
    businessName: "",
    firstName: "",
    lastName: "",
    businessType: "",
    email: "",
    phone: "",
    samePhone: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handlePhoneChange = (value: string) => {
    setForm({ ...form, phone: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Sanitize phone for backend (numeric only)
    const sanitizedData = {
      ...form,
      phone: form.phone.replace(/\D/g, ""),
    };
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#E8F4F1] p-6 rounded-xl shadow-lg text-[#2C2C2C] w-full max-w-sm space-y-3 animate-fadeIn"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 text-center">
        Boost Your Sales
      </h2>

      {/* Inputs */}
      <div className="space-y-2">
        <input
          type="text"
          name="businessName"
          placeholder="Business Name *"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] outline-none text-sm"
          onChange={handleChange}
        />

        <input
          type="text"
          name="firstName"
          placeholder="First & Middle Name *"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] outline-none text-sm"
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name *"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] outline-none text-sm"
          onChange={handleChange}
        />

        <select
          name="businessType"
          required
          className="w-full p-2 border border-gray-300 rounded-md bg-[#E8F4F1] focus:ring-1 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] outline-none text-sm"
          onChange={handleChange}
        >
          <option value="">Business type *</option>
          <option value="restaurant">Restaurant</option>
          <option value="grocery">Grocery</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="bakery">Bakery</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Business Email *"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] outline-none text-sm"
          onChange={handleChange}
        />

        <PhoneInput
          defaultCountry="PK"
          placeholder="Mobile Number *"
          required
          className="w-full"
          value={form.phone}
          onChange={handlePhoneChange}
        />

        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="samePhone"
            checked={form.samePhone}
            onChange={handleChange}
            className="mt-1 h-3 w-3 text-[#0B5D4E] border-gray-300 rounded focus:ring-[#0B5D4E]"
          />
          <span className="text-gray-700">
            My Business Phone is the same as Mobile Number
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#0B5D4E] text-[#E8F4F1] py-2 rounded-md font-semibold text-sm hover:bg-[#0B5D4E] transition-all"
      >
        Get Started
      </button>

      {/* Footer Links */}
      <div className="text-xs text-center text-gray-500 space-y-1">
        <p>
          Already have an account?{" "}
          <a className="text-[#0B5D4E] font-medium hover:underline" href="#">
            Login
          </a>
        </p>
        <p>
          Want to be an JAYAK HUB rider?{" "}
          <a className="text-[#0B5D4E] font-medium hover:underline" href="#">
            Click here
          </a>
        </p>
        <p className="leading-tight">
          Protected by reCAPTCHA. Google Privacy Policy and Terms apply.
        </p>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}
