"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-linear-to-br from-[#e0f4ff] via-[#E8F4F1] to-[#caf0f8] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[20rem] h-80 bg-[radial-gradient(circle,#61a5c250,transparent_70%)] rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-32 -right-32 w-[20rem] h-80 bg-[radial-gradient(circle,#0B5D4E50,transparent_70%)] rounded-full blur-3xl animate-pulse-slow"></div>

      {/* Food Illustration */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        {/* <Link href={"/game"}> */}
        <Image
          src="/404-illustration.png"
          alt="Delicious Food Illustration"
          width={280}
          height={280}
          className="rounded-2xl drop-shadow-lg"
        />
        {/* </Link> */}
      </motion.div>

      {/* 404 Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-[6rem] md:text-[8rem] font-extrabold leading-none bg-linear-to-r from-[#0B5D4E] via-[#2a6f97] to-[#61a5c2] bg-clip-text text-transparent animate-gradient-move"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3"
      >
        Oops! Page not found.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-gray-600 max-w-md mb-10 text-base"
      >
        Looks like the page you’re looking for has been moved or no longer
        exists.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-[#E8F4F1] bg-[#0B5D4E] hover:bg-[#013f70] transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Footer */}
      <p className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} JAHAK HUB All rights reserved.
      </p>

      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-move {
          background-size: 200% auto;
          animation: gradientMove 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
