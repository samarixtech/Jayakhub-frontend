export interface RestaurantDetails {
  id: string;
  slug: string;
  name: string;
  type: string[];
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  profileImage: string;
  bannerImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIMnuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  basePrice: number;
  discount?: string | null;
  dietaryType: string;
  image: string;
  variations: any[];
  category: string | null;
  categoryData?: string;
  isAvailable: boolean;
}

export interface RestaurantMenuProps {
  categories: string[];
  activeTab: string;
  searchTerm: string;
  filteredItems: APIMnuItem[] | null;
  menuByCategories: Record<string, APIMnuItem[]>;
  currency: string;
  onCategoryClick: (category: string) => void;
  onAddItem: (item: APIMnuItem) => void;
  onItemClick: (item: APIMnuItem) => void;
}

export interface RestaurantHeroProps {
  restaurant: RestaurantDetails;
  bannerUrl: string;
  profileUrl: string;
  reviewsData: any;
  onOpenReviews: () => void;
}

export interface FoodCardProps {
  item: APIMnuItem;
  onAddItem: (item: APIMnuItem) => void;
  onClick: () => void;
  currency: string;
}

export interface CuisineType {
  id: string;
  name: string;
}

export interface DiscoverySidebarProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
  activeFilters: string[];
  onFilterToggle: (id: string) => void;
  selectedPrice: string | null;
  onPriceToggle: (price: string) => void;
  showAllCuisines: boolean;
  onToggleCuisines: () => void;
  onResetFilters: () => void;
  cuisineTypes: CuisineType[];
  className?: string;
}

export interface RestaurantProps {
  id: string;
  slug: string;
  name: string;
  image: string;
  rating: number;
  totalRatings?: number;
  priceLevel: string;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: number;
  discount?: string;
  isFavorite?: boolean;
  isWishlist?: boolean;
  averageDiscount?: number;
}

export interface CardProps {
  data: RestaurantProps;
  variant?: "default" | "compact";
  className?: string;
  fluid?: boolean;
  isLoggedIn?: boolean;
  onWishlistToggle?: (restaurantId: string, newState: boolean) => void;
}

export interface PreviousOrdersSectionProps {
  isLoggedIn: boolean;
  isPreviousOrdersLoading: boolean;
  previousOrders: RestaurantProps[];
  viewMode: "grid" | "list";
}

export interface PopularRestaurantsSectionProps {
  isPending: boolean;
  restaurants: RestaurantProps[];
  isLoggedIn?: boolean;
  onAction?: () => void;
}

export interface CuisinesSectionProps {
  isCuisinesLoading: boolean;
  cuisineTypes: any[];
  activeFilters: string[];
  onCuisineClick: (id: string) => void;
}

export interface AllRestaurantsSectionProps {
  isPending: boolean;
  restaurants: RestaurantProps[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isLoggedIn?: boolean;
  onAction?: () => void;
}

export interface ShopProps {
  id: string;
  name: string;
  image: string;
  deliveryTime: string;
}

export interface TopBarProps {
  isScrolled: boolean;
}

export interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export interface RestaurantsBottomNavProps {
  onFilterClick: () => void;
  onCartClick: () => void;
  isLoggedIn: boolean;
  user: any;
  showFilter?: boolean;
}

export interface HeaderLocationProps {
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  isLoggedIn: boolean;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export interface HeaderActionsProps {
  isLoggedIn: boolean;
  user: any;
  totalItems: number;
  onLogout: () => void;
  onCartClick: () => void;
}
