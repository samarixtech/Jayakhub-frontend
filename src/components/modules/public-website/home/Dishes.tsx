import { useState, useEffect, useRef } from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCurrency } from '@/hooks/useCurrency';
import mixedGrillImg from '../../../../../public/mixed-grill.jpg';
import gourmetImg from '../../../../../public/gourmet.jpg';
import sausageFeastImg from '../../../../../public/sausage-feast.jpg';
import hyderabadBiryaniImg from '../../../../../public/Hyderabad-biryani.jpg';

const dishes = [
  {
    id: 1,
    name: 'Mixed Grill Platter',
    description: 'Lamb, chicken & beef kebabs with rice',
    price: 18.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviews: 320,
    image: mixedGrillImg,
    tag: 'Bestseller',
    tagColor: 'bg-primary',
  },
  {
    id: 2,
    name: 'Gourmet Steak',
    description: 'Premium ribeye with seasonal veggies',
    price: 28.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 180,
    image: gourmetImg,
    tag: "New Arrival",
    tagColor: 'bg-primary',
  },
  {
    id: 3,
    name: 'Sausage Feast',
    description: 'Assorted sausages with mashed potatoes',
    price: 16.99,
    originalPrice: 19.99,
    rating: 4.6,
    reviews: 95,
    image: sausageFeastImg,
    tag: '15% OFF',
    tagColor: 'bg-primary',
  },
  {
    id: 4,
    name: 'Hyderabadi Biryani',
    description: 'Aromatic rice with tender lamb',
    price: 15.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 250,
    image: hyderabadBiryaniImg,
    tag: 'Spicy',
    tagColor: 'bg-primary',
  },
];

export default function SpecialDishes() {
  const t = useTranslations('Home.featured_dishes');
  const { symbol: currencySymbol } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="menu" ref={sectionRef} className="py-24 bg-primary relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/10">
              <ShoppingBag className="w-4 h-4" />
              {t('badge')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t('title_prefix')} <span className="text-accent-yellow">{t('title_highlight')}</span> {t('title_suffix')}
            </h2>
            <p className="text-white/50 max-w-lg text-lg">
              {t('subtitle')}
            </p>
          </div>
          <Button className="mt-6 lg:mt-0 bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105">
            {t('view_menu_btn')}
          </Button>
        </div>

        {/* Dishes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish, index) => (
            <div
              key={dish.id}
              className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  width={250}
                  height={250}
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Tag */}
                {dish.tag && (
                  <div className={`absolute top-4 left-4 ${dish.tagColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    {t(`tags.${dish.tag}`)}
                  </div>
                )}

                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(dish.id)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${favorites.includes(dish.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-[#64748B]'
                      }`}
                  />
                </button>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-6 font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    {t('quick_view_btn')}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="font-bold text-foreground">{dish.rating}</span>
                  <span className="text-[#94A3B8] text-sm">({dish.reviews})</span>
                </div>

                {/* Name & Description */}
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {t(`items.dish${dish.id}.name`)}
                </h3>
                <p className="text-sm text-[#64748B] mb-4 line-clamp-1">
                  {t(`items.dish${dish.id}.desc`)}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">{currencySymbol}{dish.price}</span>
                  {dish.originalPrice && (
                    <span className="text-sm text-[#94A3B8] line-through">
                      {currencySymbol}{dish.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
