"use client";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamic content based on the current route
  const getBrandingContent = () => {
    if (pathname.includes("/login")) {
      return {
        title: (
          <>
            Welcome <br /> Back!
          </>
        ),
        description:
          "Login to access your account, track orders, and enjoy our premium services.",
        showBack: true,
      };
    }
    if (pathname.includes("/register")) {
      return {
        title: "Join Us Today!",
        description:
          "Create an account to experience our premium services and free delivery.",
        showBack: true,
      };
    }
    if (pathname.includes("/verify-otp")) {
      return {
        title: (
          <>
            Secure <br /> Access
          </>
        ),
        description:
          "One more step to keep your account safe. Please enter the verification code sent to your device.",
        showBack: false,
      };
    }
    if (pathname.includes("/forget-password")) {
      return {
        title: (
          <>
            Forgot <br /> Password?
          </>
        ),
        description:
          "Don't worry! It happens. Please enter the email associated with your account.",
        showBack: false,
      };
    }
    if (pathname.includes("/restaurant-register")) {
      return {
        title: (
          <>
            Grow Your <br /> Business
          </>
        ),
        description:
          "Join our network of top-rated restaurants and start reaching thousands of new customers today.",
        showBack: true,
      };
    }
    // Default/New Password
    return {
      title: (
        <>
          Secure <br /> Update
        </>
      ),
      description:
        "Please choose a strong new password to keep your account safe.",
      showBack: false,
    };
  };

  const content = getBrandingContent();

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#F7FBFA]">
      {/* LEFT PANEL: Branding & Illustration */}
      <div className="hidden md:flex bg-emerald-bg text-white flex-col justify-between overflow-hidden relative">
        {content.showBack && (
          <LocalizedLink href="/restaurants" className="m-5 inline-block w-fit">
            <ArrowLeft className="hover:text-emerald-400 transition-colors" />
          </LocalizedLink>
        )}

        <div className="p-12 mt-8">
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
            {content.title}
          </h1>
          <div className="h-1.5 w-20 bg-emerald-400 mb-6"></div>
          <p className="text-lg text-emerald-100/80 max-w-sm leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="relative w-full h-[45%] mt-auto">
          <Image
            src="/Chef.png"
            alt="Authentication Illustration"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom" }}
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      {/* RIGHT PANEL: Form Content */}
      <div className="flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
