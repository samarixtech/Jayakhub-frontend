"use client";

import { ArrowRight, Tag, Calendar, ChevronDown, Rss } from "lucide-react";
import Link from "next/link";

// --- Theme Constants (Using Tailwind Classes) ---
const PRIMARY_yellow = "#0B5D4E";
const ACCENT_yellow = "yellow-600";
const ACCENT_BG = "bg-yellow-100";
const NEUTRAL_BG = "bg-gray-50";
const SECTION_BG = "bg-[#E8F4F1]";

const SectionHeading = ({ title, subtitle, color = "text-gray-800" }: any) => (
  <div className="text-left mb-12">
    <h2
      className={`text-3xl md:text-4xl font-[#2C2C2C] ${color} mb-3 border-l-4 border-yellow-500 pl-4`}
    >
      {title}
    </h2>
    {subtitle && <p className="text-xl text-gray-500 max-w-2xl">{subtitle}</p>}
  </div>
);

const NewsCard = ({ type, title, date, image, tags, large = false }: any) => {
  // Theme colors
  //   const primaryyellow = "#0B5D4E";
  //   const accentyellow = "#06b6d4";
  //   const softPrimary = `text-[${primaryyellow}]`;
  //   const softSecondary = `text-[${accentyellow}]`;

  // Dynamic styling based on size
  const cardClasses = large
    ? "col-span-12 lg:col-span-8 flex flex-col md:flex-row bg-[#E8F4F1] rounded-3xl shadow-2xl hover:shadow-yellow-400/30 transition-all duration-500 overflow-hidden border border-[#FFF9EE] transform hover:scale-[1.01] cursor-pointer group"
    : "col-span-12 sm:col-span-6 lg:col-span-4 bg-[#E8F4F1] rounded-3xl shadow-xl hover:shadow-yellow-300/40 transition-all duration-500 overflow-hidden border border-[#FFF9EE] transform hover:-translate-y-2 cursor-pointer group";

  const imageClasses = large
    ? "md:w-1/2 w-full h-72 md:h-auto bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
    : "w-full h-60 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]";

  const contentClasses = large
    ? "p-8 md:w-1/2 flex flex-col justify-center"
    : "p-6 flex flex-col h-full";

  const titleClasses = large
    ? "text-3xl font-extrabold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors leading-tight"
    : "text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors leading-snug";

  return (
    <a href="#" className={cardClasses}>
      {/* Card Image */}
      <div
        className={imageClasses}
        style={{ backgroundImage: `url(${image})` }}
        aria-label={`Image for ${title}`}
      ></div>

      {/* Card Content */}
      <div className={contentClasses}>
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div
            className={`flex items-center font-bold text-xs tracking-widest uppercase text-${ACCENT_yellow} border-b-2 border-yellow-300 pb-1`}
          >
            <Tag className="w-4 h-4 mr-1 opacity-90" />
            {type}
          </div>
          <div className="flex items-center text-gray-500 text-xs font-medium">
            <Calendar className="w-4 h-4 mr-1 opacity-70" />
            {date}
          </div>
        </div>
        <h3 className={titleClasses}>{title}</h3>
        {tags && (
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[#FFF9EE]">
            {tags.map((tag: string, index: string | number) => (
              <span
                key={index}
                className={`text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};


const mainHeadline = {
  type: "STRATEGY",
  title:
    "Aliquam Tincidunt: Global Platform Integrates Secure Payment Solutions Across Continental Markets",
  date: "29 Oct 2024",
  image:
    "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
};

const latestNews = [
  {
    type: "PRESS RELEASE",
    title:
      "Vestibulum Ante: Company Strengthens Regional Alliances Through New Memorandum of Understanding",
    date: "27 Jan 2024",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["CORPORATE", "PARTNERSHIP"],
  },
  {
    type: "BUSINESS",
    title:
      "Donec Elementum: Annual Report 2024 Key Performance Indicators Unveiled",
    date: "27 Jan 2024",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["REPORTS", "INFOGRAPHICS"],
  },
  {
    type: "BUSINESS",
    title:
      "Mauris Euismod: New Partnership Enables Streamlined and Secure Digital Transactions Across Asia",
    date: "29 Oct 2024",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["FINTECH", "PRESS RELEASE"],
  },
  {
    type: "PRESS RELEASE",
    title:
      "Nullam Dignissim: Inaugural Safety Campaign Launched in Collaboration with Local Authorities",
    date: "07 Dec 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["SAFETY", "OPERATIONS"],
  },
  {
    type: "PRESS RELEASE",
    title:
      "Curabitur Aliquet: Regional Division Initiates Program for Flexible Income Opportunities",
    date: "14 Aug 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["WORKFORCE", "REGIONAL"],
  },
  {
    type: "BUSINESS",
    title:
      "Praesent Velit: Strategic Initiative Brings Specialty Goods to Local Neighborhoods with Free Delivery Incentives",
    date: "12 Aug 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["CAMPAIGN", "LOGISTICS"],
  },
];

const additionalNews = [
  {
    type: "MERCHANTS",
    title:
      "Integer Lacinia: Company Collaborates with Regional Telco to Support Partner Vendors",
    date: "08 Jul 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["PARTNERSHIP", "ECOSYSTEM"],
  },
  {
    type: "PRESS RELEASE",
    title:
      "Fusce Quisque: Supporting Community Growth and Welfare for Delivery Partners and their Families",
    date: "05 Jul 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["CSR", "COMMUNITY"],
  },
  {
    type: "LOGISTICS",
    title:
      "Vivamus Ipsum: Driving Partner Expansion to Enhance Customer Choice and Experience",
    date: "29 Jun 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["CUSTOMER EXPERIENCE"],
  },
];

const bottomNews = [
  {
    type: "PRODUCT",
    title:
      "Sed Dictum: Launch of Optimized Meal Options for Solo Consumers Across Multiple Regions",
    date: "07 Jul 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["CAMPAIGN", "MARKETING"],
  },
  {
    type: "PRODUCT",
    title:
      "Proin Adipiscing: Unveiling Subscription Tier with Unlimited Shipping and Exclusive Promotions",
    date: "07 Jul 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["SUBSCRIPTION"],
  },
  {
    type: "MERCHANTS",
    title:
      "Etiam Commodo: Asia Pacific Division Aids Vendors in Enhancing Digital Presence for Quick-Commerce",
    date: "04 Jul 2023",
    image:
      "https://plus.unsplash.com/premium_photo-1673590981810-894dadc93a6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    tags: ["E-COMMERCE", "VENDOR_SUPPORT"],
  },
];

const NewsroomPage = () => {
  // Tailwind Class mapping (using constants for consistency)
  const softNeutralBg = NEUTRAL_BG;
  const softSectionBg = SECTION_BG;

  return (
    <div className={`min-h-screen ${softNeutralBg}`}>
<section
  className={`relative py-24 md:py-32 shadow-md ${softSectionBg}`}
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1800&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl md:text-7xl  text-gray-100 mb-4 tracking-tighter">
            📰 Corporate Newsroom
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mb-8">
            Stay informed with our official press releases, in-depth reports,
            and company updates.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-200 text-lg font-semibold border-t pt-4 border-[#FFF9EE]">
            <Link
              href="#"
              className="hover:text-yellow-600 transition-colors relative after:absolute after:h-0.5 after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Press Releases
            </Link>
            <Link
              href="#"
              className="hover:text-yellow-600 transition-colors relative after:absolute after:h-0.5 after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Research & Insights
            </Link>
            <Link
              href="#"
              className="hover:text-yellow-600 transition-colors flex items-center"
            >
              Subscribe <Rss className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Headline Section (Prominent) */}
      <section className={`py-16 ${softNeutralBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Featured Story"
            subtitle="The most significant announcement from our organization this quarter."
          />
          <NewsCard {...mainHeadline} large={true} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-[#FFF9EE]" />
      </div>

      {/* All Stories Section */}
      <section className={`py-16 ${softSectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="All Stories & Archives"
            color="text-gray-900"
            subtitle="Browse all official content categorized by topic and date."
          />

          {/* Filter/Tag Buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              className={`px-6 py-2 text-sm font-bold rounded-full bg-gray-900 text-[#E8F4F1] shadow-lg hover:bg-gray-700 transition-colors flex items-center`}
            >
              ALL
            </button>
            <button
              className={`px-6 py-2 text-sm font-semibold rounded-full ${ACCENT_BG} text-yellow-800 border border-yellow-300 hover:bg-yellow-200 transition-colors flex items-center`}
            >
              BUSINESS
            </button>
            <button
              className={`px-6 py-2 text-sm font-semibold rounded-full ${ACCENT_BG} text-yellow-800 border border-yellow-300 hover:bg-yellow-200 transition-colors flex items-center`}
            >
              CAMPAIGNS
            </button>
            <button
              className={`px-6 py-2 text-sm font-semibold rounded-full bg-[#FFF9EE] text-gray-700 hover:bg-[#FFF9EE] transition-colors flex items-center space-x-1`}
            >
              <span>FILTER BY</span>{" "}
              <ChevronDown className="w-4 h-4 opacity-80" />
            </button>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-12 gap-10">
            {latestNews.slice(0, 3).map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
            {latestNews.slice(3, 6).map((news, index) => (
              <NewsCard key={`add-${index}`} {...news} />
            ))}
            {additionalNews.map((news, index) => (
              <NewsCard key={`add2-${index}`} {...news} />
            ))}
          </div>

          {/* Load More/View All Button */}
          <div className="text-center mt-16">
            <button
              className={`group px-10 py-4 text-[#E8F4F1] font-bold rounded-full bg-[${PRIMARY_yellow}] transition-all duration-300 shadow-xl shadow-[${PRIMARY_yellow}]/30 hover:shadow-2xl hover:scale-[1.03] flex items-center justify-center space-x-2 text-lg mx-auto`}
            >
              <span>Load More Stories</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Separator / Additional News Section (Different background for contrast) */}
      <section className={`py-16 ${softNeutralBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="More Archives" color="text-gray-900" />
          <div className="grid grid-cols-12 gap-10">
            {bottomNews.map((news, index) => (
              <NewsCard key={`bottom-${index}`} {...news} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Space/End of Page */}
      <div className={`h-16 ${softSectionBg}`}></div>
    </div>
  );
};

export default NewsroomPage;
