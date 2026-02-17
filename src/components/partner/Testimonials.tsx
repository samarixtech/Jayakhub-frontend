"use client";

import { FaStar } from "react-icons/fa";
import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ali Khan",
      role: "Restaurant Owner",
      text: "Working with JAYAK HUB  increased my business reach and boosted daily orders.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      name: "Sara Ahmed",
      role: "Bakery Owner",
      text: "The platform is easy to use and brought so many new customers to my bakery!",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
    },
    {
      name: "Omar Latif",
      role: "Cafe Owner",
      text: "JAYAK HUB  makes managing orders simple and efficient. Highly recommended.",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-[#FFF9EE] w-full">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
        What our <span className="text-[#0B5D4E]">partners say</span>
      </h2>

      <div className="max-w-6xl mx-auto px-6 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="bg-[#E8F4F1] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            style={{ animation: `fadeInUp 0.5s ease forwards`, animationDelay: `${i * 0.2}s`, opacity: 0 }}
          >
            <div className="flex flex-col items-center text-center">
              <Image
                width={200}
                height={200}
                src={item.avatar}
                alt={item.name}
                className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-[#0B5D4E]"
              />

              <p className="text-gray-700 italic mb-4">&ldquo;{item.text}&rdquo;</p>

              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: item.rating }).map((_, idx) => (
                  <FaStar key={idx} className="text-yellow-400 mx-0.5" />
                ))}
              </div>

              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.role}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
