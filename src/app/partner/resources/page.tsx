"use client"; 

import React from 'react';
import Image from 'next/image'
import Link from 'next/link';  
import Header from '@/components/partner/TopHeader';


const articlesData = [
  {
    id: 1,
    title: "Easy Steps to List Your Restaurant on JAHAK HUB",
    category: "PARTNER",
    date: "August 14, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image path
    link: "/articles/easy-steps-to-list",
  },
  {
    id: 2,
    title: "Most Profitable Food Items to Sell in Pakistan",
    category: "PARTNER",
    date: "July 21, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/most-profitable-food",
  },
  {
    id: 3,
    title: "Frequently Asked Questions About Partnering With JAYAK HUB  Pakistan",
    category: "PARTNER",
    date: "August 18, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/faq-IFDP-pakistan",
  },
  {
    id: 4,
    title: "How to Improve Your Restaurant's Online Rating in Pakistan: 10 Expert Tips",
    category: "PARTNER",
    date: "July 15, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/improve-online-rating",
  },
  {
    id: 5,
    title: "10 Tips for a Profitable Restaurant: A JAYAK HUB  Case Study",
    category: "PARTNER",
    date: "March 5, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/profitable-restaurant-tips",
  },
  {
    id: 6,
    title: "10 Strategies to Attract Customers to Your Pakistan Restaurant",
    category: "PARTNER",
    date: "February 28, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/attract-customers-pakistan",
  },
  {
    id: 7,
    title: "A Guide on How to Create a Restaurant Menu Design that Sells",
    category: "PARTNER",
    date: "October 16, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/restaurant-menu-design",
  },
  {
    id: 8,
    title: "5 Steps for Handling Customer Complaints in Pakistan",
    category: "PARTNER",
    date: "October 14, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/handling-customer-complaints",
  },
  // Add more dummy data as needed to fill out the grid
  {
    id: 9,
    title: "Food Business Trends in 2024: What to Expect",
    category: "INSIGHTS",
    date: "September 1, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/food-trends-2024",
  },
  {
    id: 10,
    title: "Maximizing Profit with JAYAK HUB  Promotions",
    category: "PARTNER",
    date: "August 20, 2024",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/articles/maximizing-profit-promotions",
  },
];


const ArticleCard: React.FC<{ article: typeof articlesData[0] }> = ({ article }) => {
  return (
    <Link href={article.link} className="block group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48 md:h-40 overflow-hidden">
        <Image
         width={200}
         height={200}
          src={article.imageUrl} 
          alt={article.title} 
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-gray-900 bg-opacity-70 text-[#E8F4F1] text-xs font-semibold px-3 py-1 rounded-full">
          {article.category}
        </div>
      </div>
      <div className="p-4 bg-[#E8F4F1]">
        <h3 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-[#B6932F] transition-colors duration-300">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500">{article.date}</p>
      </div>
    </Link>
  );
};


export default function HomePage() {
  return (
    
    <div className="bg-[#E8F4F1] min-h-screen">
        <Header/>
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Delicious Biryani" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C] via-transparent to-transparent opacity-70"></div> {/* Gradient overlay */}
        
        <div className="relative z-10 flex flex-col justify-end items-start h-full max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-normal text-[#E8F4F1] mb-4">
            Delicious Stories
          </h1>
          <button className="px-6 py-3 bg-[#0B5D4E] text-[#E8F4F1] font-semibold rounded-lg shadow-md hover:bg-[#0B5D4E] transition duration-300">
            <Link href={"/partner"}>
            Sign up to be a restaurant partner
            </Link>
          </button>
        </div>
      </section>

      {/* --- Selected Articles Section --- */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">
          Selected articles
        </h2>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articlesData.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
      
      {/* (Optional: Add other sections like Footer here if you have them) */}
    </div>
  );
}