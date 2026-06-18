"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Clock, X, Utensils } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getAllRestaurantsAction } from "@/app/actions/public/restaurants";
import { debounce } from "lodash";
import Image from "next/image";

interface SimpleRestaurant {
  id: string;
  slug: string;
  name: string;
  profileImage?: string;
  bannerImage?: string;
  type?: string | string[];
  averageRating?: number;
}

export const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<SimpleRestaurant[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setRestaurants([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await getAllRestaurantsAction({ query: searchQuery });

      if (res.success && res.data) {
        const payload = res.data as unknown;

        // Match the provided API structure
        if (payload) {
          setRestaurants(Array.isArray(payload) ? payload : []);
        } else {
          setRestaurants([]);
        }

        if (res.suggestion) {
          setSuggestions(Array.isArray(res.suggestion) ? res.suggestion : []);
        } else {
          setSuggestions([]);
        }
      } else {
        setRestaurants([]);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setRestaurants([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync with URL query param on mount
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    if (urlQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(urlQuery);
      fetchResults(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize recent searches from session storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("recentSearches");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read recent searches", e);
    }
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.trim();
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    try {
      sessionStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch { }
  };

  // Debounced search
  const debouncedSearch = useMemo(() => debounce(fetchResults, 500), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    debouncedSearch(val);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    saveRecentSearch(searchTerm);
    setIsOpen(false);

    const params = new URLSearchParams(window.location.search);
    params.set("query", searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    sessionStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    sessionStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <div className="relative w-full max-w-[540px]" ref={dropdownRef}>
      <div className="w-full flex items-center bg-white rounded-full shadow-lg overflow-hidden pl-3 md:pl-4 pr-0 py-0 border-2 border-[#2A5443] focus-within:border-[#346853] transition-colors relative z-20">
        <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for restaurants, cuisines..."
          className="flex-1 h-10 md:h-12 px-2 md:px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setRestaurants([]);
              // Clear URL query param
              const params = new URLSearchParams(window.location.search);
              params.delete("query");
              const newSearch = params.toString();
              router.push(newSearch ? `${pathname}?${newSearch}` : pathname);
            }}
            className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => handleSearchSubmit(query)}
          className="h-8 md:h-9 flex items-center justify-center bg-[#346853] hover:bg-[#2a5443] text-white text-xs md:text-sm font-semibold px-4 md:px-5 mr-1 md:mr-1.5 rounded-full transition-colors shrink-0"
        >
          Search
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {/* Loading State - Skeleton Loader */}
            {isLoading && (
              <div className="p-2 space-y-2">
                <div className="px-3 py-2 space-y-2">
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="flex items-center gap-3 px-1 py-1">
                    <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-3 px-1 py-1">
                    <div className="w-4 h-4 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="px-3 py-2 space-y-3 border-t border-gray-50 pt-4">
                  <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-1 py-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Input - Recent Searches */}
            {!query.trim() && !isLoading && (
              <div className="p-2">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between px-3 py-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Recent Searches
                      </h4>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    {(recentSearches || []).map((term, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setQuery(term);
                          debouncedSearch(term);
                          setIsOpen(true);
                        }}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">
                            {term}
                          </span>
                        </div>
                        <button
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all font-bold"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    Search for your favorite restaurants or cuisines!
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            {query.trim() && !isLoading && (
              <div className="p-2">
                {/* Suggestions Section */}
                {suggestions.length > 0 && (
                  <div className="mb-2">
                    <h4 className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                      <Search className="w-3.5 h-3.5" /> Suggestions
                    </h4>
                    {(suggestions || []).map((sug, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setQuery(sug);
                          handleSearchSubmit(sug);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Search className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          {sug}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Restaurants Section */}
                {restaurants.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 mt-2 border-t border-gray-100 pt-3">
                      <Utensils className="w-3.5 h-3.5" /> Restaurants
                    </h4>
                    {(restaurants || []).slice(0, 4).map((restaurant) => {
                      const image =
                        restaurant.profileImage || restaurant.bannerImage;
                      const imageUrl =
                        image && !image.startsWith("http")
                          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "")}/${image.replace(/^\/+/, "").replace(/\\/g, "/")}`
                          : image || "/placeholder-restaurant.png";

                      return (
                        <div
                          key={restaurant.id}
                          onClick={() => {
                            saveRecentSearch(restaurant.name || query);
                            router.push(`/restaurants/${restaurant.slug}`);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={restaurant.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-gray-900 truncate">
                              {restaurant.name}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <span className="text-emerald-600 font-bold max-w-[120px] truncate">
                                  {Array.isArray(restaurant.type)
                                    ? (restaurant.type || []).join(", ")
                                    : restaurant.type}
                                </span>
                              </span>
                              {restaurant.averageRating !== undefined && restaurant.averageRating > 0 && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                  <span className="font-medium">
                                    ⭐{" "}
                                    {Number(restaurant.averageRating).toFixed(
                                      1,
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {restaurants.length === 0 && suggestions.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      No results found
                    </p>
                    <p className="text-xs">Try searching for something else.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
