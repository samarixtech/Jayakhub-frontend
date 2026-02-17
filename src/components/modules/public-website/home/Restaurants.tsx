import { useState, useEffect, useRef } from "react";
import { Star, Clock, Flame, ChevronRight, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const categories = [
  { name: "All", icon: "🔥" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Sushi", icon: "🍣" },
  { name: "Kebab", icon: "🥙" },
  { name: "Dessert", icon: "🍰" },
];

const restaurants = [
  {
    id: 1,
    name: "Al-Mansour Grill",
    cuisines: ["Iraqi", "Kebab"],
    rating: 4.9,
    reviews: 1120,
    time: "25-35 min",
    delivery: "Free",
    image: "/al-mansour.jpg",
    badge: "Top Rated",
    badgeColor: "bg-primary",
  },
  {
    id: 2,
    name: "Baghdad Bites",
    cuisines: ["Fast Food", "Burger"],
    rating: 4.7,
    reviews: 850,
    time: "20-30 min",
    delivery: "$1.50",
    image: "/baghdad-bites.jpg",
    badge: "Popular",
    badgeColor: "bg-primary",
  },
  {
    id: 3,
    name: "Pizza Palace",
    cuisines: ["Italian", "Pizza"],
    rating: 4.6,
    reviews: 780,
    time: "30-40 min",
    delivery: "Free",
    image: "/pizza-palace.jpg",
    badge: "20% OFF",
    badgeColor: "bg-primary",
  },
  {
    id: 4,
    name: "Spice Route",
    cuisines: ["Indian", "Curry"],
    rating: 4.8,
    reviews: 650,
    time: "35-45 min",
    delivery: "$2.00",
    image: "/spice-route.png",
    badge: "Popular",
    badgeColor: "bg-primary",
  },
  {
    id: 5,
    name: "Sushi Master",
    cuisines: ["Japanese", "Sushi"],
    rating: 4.9,
    reviews: 480,
    time: "25-35 min",
    delivery: "Free",
    image: "/sushi-master.jpg",
    badge: "New",
    badgeColor: "bg-primary",
  },
  {
    id: 6,
    name: "Green Garden",
    cuisines: ["Healthy", "Salad"],
    rating: 4.5,
    reviews: 420,
    time: "15-25 min",
    delivery: "$1.00",
    image: "/green-garden.png",
    badge: "tasty",
    badgeColor: "bg-primary",
  },
];

export default function Restaurants() {
  const t = useTranslations("Home.featured_restaurants");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <section
      id="restaurants"
      ref={sectionRef}
      className="py-12 md:py-24 bg-white relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:sm font-semibold mb-4">
              <Flame className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {t('badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              {t('title_prefix')} <span className="text-primary">{t('title_highlight')}</span>
            </h2>
            <p className="text-[#64748B] max-w-lg text-base md:text-lg">
              {t('subtitle')}
            </p>
          </div>
          <button className="mt-6 md:mt-0 inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm md:text-base">
            {t('view_all_btn')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter - Added horizontal scroll for mobile */}
        <div
          className={`flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap gap-3 mb-10 no-scrollbar transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 px-5 py-2.5 md:py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === category.name
                  ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm md:text-base">{t(`categories.${category.name}`)}</span>
            </button>
          ))}
        </div>

        {/* Restaurant Grid - Optimized columns for all breakpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className={`group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-[#E2E8F0] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-52 lg:h-56 overflow-hidden">
                <Image
                width={200}
                height={200}
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay - visible always on mobile for accessibility, hover on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 md:from-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />

                {/* Badge */}
                {restaurant.badge && (
                  <div
                    className={`absolute top-3 left-3 md:top-4 md:left-4 ${restaurant.badgeColor} text-white px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold z-10`}
                  >
                    {t(`badges.${restaurant.badge}`)}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(restaurant.id);
                  }}
                  className="absolute top-3 right-3 md:top-4 md:right-4 w-9 h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
                >
                  <Heart
                    className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${favorites.includes(restaurant.id)
                        ? "text-red-500 fill-red-500"
                        : "text-[#64748B]"
                      }`}
                  />
                </button>

                {/* Delivery Info - Adjusted visibility for mobile */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-center justify-between md:opacity-0 md:group-hover:opacity-100 transition-all transform md:translate-y-4 md:group-hover:translate-y-0 z-10">
                  <div className="flex items-center gap-1.5 md:gap-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs md:text-sm font-semibold text-foreground">
                      {restaurant.time}
                    </span>
                  </div>
                  <div className="bg-primary text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-md">
                    {restaurant.delivery === "Free"
                      ? t('delivery.Free')
                      : restaurant.delivery}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 lg:p-6">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {restaurant.cuisines.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="text-[10px] md:text-xs font-semibold text-[#64748B] bg-[#F1F5F9] px-2 md:px-2.5 py-0.5 md:py-1 rounded-full uppercase tracking-wider"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>

                <h3 className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {restaurant.name}
                </h3>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400" />
                    <span className="font-bold text-sm md:text-base text-foreground">
                      {restaurant.rating}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-[#94A3B8]">
                    ({restaurant.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
