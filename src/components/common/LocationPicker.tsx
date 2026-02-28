"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Crosshair, MapPin, Search } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  initialAddress?: string;
  initialLocation?: Location;
  onLocationChange?: (location: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    country?: string;
    state?: string;
    zip?: string;
  }) => void;
  className?: string;
  placeholder?: string;
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
};

export default function LocationPicker({
  initialAddress = "",
  initialLocation,
  onLocationChange,
  className = "",
  placeholder = "Search for a location...",
}: LocationPickerProps) {
  // State
  const [address, setAddress] = useState(initialAddress);
  const [center, setCenter] = useState(initialLocation || defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation || defaultCenter,
  );
  const [loading, setLoading] = useState(false);
  const isMapInteraction = useRef(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Sync with props if they change externally (optional, careful with loops)
  useEffect(() => {
    if (initialLocation) {
      setCenter(initialLocation);
      setMarkerPosition(initialLocation);
    }
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialLocation, initialAddress]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // -- Forward Geocode (Address -> Coords) --
  // Debounce this to avoid too many API calls while typing
  useEffect(() => {
    if (isMapInteraction.current) {
      isMapInteraction.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (!address || !window.google || !window.google.maps) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          const pos = { lat: loc.lat(), lng: loc.lng() };
          setCenter(pos);
          setMarkerPosition(pos);

          // Notify parent about the change (optional: might want to wait for user to select from dropdown/click search)
          // For now, let's trigger it so the map update is reflected in parent state
          notifyParent(pos.lat, pos.lng, results[0]);
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // -- Reverse Geocode (Coords -> Address) --
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google || !window.google.maps) return;

      setLoading(true);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setLoading(false);
        if (status === "OK" && results && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          notifyParent(lat, lng, results[0]);
        } else {
          toast.error("Could not fetch address details.");
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onLocationChange],
  );

  // Helper to extract address components and call parent callback
  const notifyParent = (
    lat: number,
    lng: number,
    result: google.maps.GeocoderResult,
  ) => {
    if (!onLocationChange) return;

    let city = "";
    let country = "";
    let state = "";
    let zip = "";

    result.address_components.forEach((component) => {
      const types = component.types;
      if (types.includes("locality")) city = component.long_name;
      if (types.includes("administrative_area_level_1"))
        state = component.long_name;
      if (types.includes("country")) country = component.long_name;
      if (types.includes("postal_code")) zip = component.long_name;
    });

    onLocationChange({
      lat,
      lng,
      address: result.formatted_address,
      city,
      country,
      state,
      zip,
    });
  };

  // -- Handlers --

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const pos = { lat, lng };

        setMarkerPosition(pos);
        // setCenter(pos); // Optional: pan to click
        isMapInteraction.current = true;
        reverseGeocode(lat, lng);
      }
    },
    [reverseGeocode],
  );

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      const toastId = toast.loading("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setMarkerPosition(pos);
          map?.panTo(pos);
          isMapInteraction.current = true;
          reverseGeocode(pos.lat, pos.lng);
          toast.success("Location found!", { id: toastId });
        },
        () => {
          toast.error("Error: The Geolocation service failed.", {
            id: toastId,
          });
        },
      );
    } else {
      toast.error("Error: Your browser doesn't support geolocation.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // -- Render --

  if (loadError) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center p-4 text-center h-[300px]">
        <div className="text-red-500">
          <p className="font-bold">Error loading maps</p>
          <p className="text-sm">Please check your API key configuration.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <MapPin className="h-8 w-8 text-gray-300 mb-2" />
          <span className="text-gray-400 text-sm">Loading Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          value={address}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleLocateMe}
          className="absolute right-1.5 top-1.5 h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg"
          title="Locate Me"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      {/* Map */}
      <div className="relative h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
          }}
        >
          <Marker position={markerPosition} />
        </GoogleMap>

        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-white px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold text-primary animate-pulse">
              Updating location...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
