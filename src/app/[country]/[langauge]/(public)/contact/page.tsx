"use client";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

const SectionHeading = ({ title, subtitle, color = "text-gray-700" }: any) => (
  <div className="text-center mb-16">
    <h2 className={`text-4xl md:text-5xl font-extrabold ${color} mb-4`}>
      {title}
    </h2>
    <p className="text-xl text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const Contact = () => {
  const t = useTranslations("Contact");

  const primaryyellow = "#0B5D4E";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    alert(t("form_submit_alert"));
  };

  return (
    <div className="bg-linear-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#E8F4F1]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image and Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-b from-[#2C2C2C]/60 via-[#2C2C2C]/40 to-[#2C2C2C]/30 z-10"></div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 py-30 text-center text-[#E8F4F1]">
          <p className="text-yellow-300 font-semibold uppercase tracking-wider mb-3 animate-fade-in-up">
            {t("hero_tagline")}
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-up">
            {t("hero_title_p1")}{" "}
            <span className="text-yellow-400">{t("hero_title_p2")}</span>{" "}
          </h1>
          <p className="text-lg md:text-xl text-[#E8F4F1]/90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t("hero_subtitle")}
          </p>
        </div>

        <div className="absolute -bottom-1 left-0 w-full h-20 bg-linear-to-t from-[#E8F4F1] to-transparent"></div>
      </section>

      {/* Contact Info Section */}
      <section className="py-14 bg-[#E8F4F1] relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("info_heading")}
            subtitle={t("info_subheading")}
            color="text-gray-800"
          />

          <div className="grid md:grid-cols-3 gap-10">
            {/* Address */}
            <div className="group bg-linear-to-br from-[#E8F4F1] to-yellow-50/30 border border-yellow-100 p-10 rounded-3xl text-center shadow-lg hover:shadow-[0_0_25px_#0ea5e9aa] transition-all duration-500">
              <div className="bg-yellow-100 w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-yellow-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {t("card_address_title")}
              </h3>
              <p className="text-gray-600">{t("card_address_line1")}</p>
            </div>

            {/* Phone */}
            <div className="group bg-linear-to-br from-[#E8F4F1] to-yellow-50/30 border border-yellow-100 p-10 rounded-3xl text-center shadow-lg hover:shadow-[0_0_25px_#0ea5e9aa] transition-all duration-500">
              <div className="bg-yellow-100 w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-yellow-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {t("card_phone_title")}
              </h3>
              <p className="text-gray-600">{t("card_phone_line1")}</p>
              <p className="text-gray-600">{t("card_phone_line2")}</p>
            </div>

            {/* Email */}
            <div className="group bg-linear-to-br from-[#E8F4F1] to-yellow-50/30 border border-yellow-100 p-10 rounded-3xl text-center shadow-lg hover:shadow-[0_0_25px_#0ea5e9aa] transition-all duration-500">
              <div className="bg-yellow-100 w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-yellow-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {t("card_email_title")}
              </h3>
              <p className="text-gray-600">{t("card_email_line1")}</p>
              <p className="text-gray-600">{t("card_email_line2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-linear-to-br from-[#E8F4F1] to-yellow-50/30 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div>
            <p className="text-yellow-700 font-semibold uppercase tracking-wider mb-2">
              {t("form_tagline")}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t("form_title")}
            </h2>
            <p className="text-lg text-gray-600 mb-6">{t("form_subtitle")}</p>
            <div className="flex items-center space-x-4 mt-8">
              <Building2 className="w-8 h-8 text-yellow-600" />
              <p className="text-gray-700 text-lg">{t("form_hq_label")}</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-xl bg-[#E8F4F1]/80 p-10 rounded-3xl shadow-2xl border border-yellow-100 space-y-6 transition-all duration-300"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t("field_name_label")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder:text-gray-400"
                placeholder={t("field_name_placeholder")}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t("field_email_label")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder:text-gray-400"
                placeholder={t("field_email_placeholder")}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t("field_message_label")}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all placeholder:text-gray-400 resize-none"
                placeholder={t("field_message_placeholder")}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="group w-full py-4 font-bold text-[#E8F4F1] rounded-xl bg-linear-to-r from-yellow-600 to-[#0B5D4E] shadow-lg hover:shadow-yellow-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>{t("form_submit_button")}</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>

      {/* Map Section */}
      {/* <section className="py-20 bg-[#E8F4F1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden shadow-[0_0_35px_#bae6fd] border border-yellow-100">
            <iframe
              Map URL placeholder
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019025274348!2d-122.4013775236881!3d37.79292761218107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f2d91e8d%3A0x8deebca2c2e9c8d8!2sSalesforce%20Tower!5e0!3m2!1sen!2sus!4v1697200000000!5m2!1sen!2sus"
              width="100%"
              height="420"
              allowFullScreen
              loading="lazy"
              className="border-0 w-full"
            ></iframe>
          </div>
        </div>
      </section> */}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Contact;
