"use client";

import { useState, useEffect } from "react";

interface AutoLocationData {
  city: string;
  area: string;
  latitude: string;
  longitude: string;
  postalCode: string;
  loading: boolean;
  error: string;
}

export function useAutoLocation() {
  const [data, setData] = useState<AutoLocationData>({
    city: "",
    area: "",
    latitude: "",
    longitude: "",
    postalCode: "",
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          if (typeof google !== "undefined" && google.maps) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  const addressComponents = results[0].address_components;
                  let city = "";
                  let area = "";
                  let postalCode = "";

                  for (const component of addressComponents) {
                    if (component.types.includes("locality")) {
                      city = component.long_name;
                    }
                    if (
                      component.types.includes("sublocality") ||
                      component.types.includes("neighborhood")
                    ) {
                      area = component.long_name;
                    }
                    if (component.types.includes("postal_code")) {
                      postalCode = component.long_name;
                    }
                  }

                  setData({
                    city: city || area,
                    area: area || city,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    postalCode,
                    loading: false,
                    error: "",
                  });
                } else {
                  // Fallback: just use coordinates without city info
                  setData({
                    city: "",
                    area: "",
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    postalCode: "",
                    loading: false,
                    error: "",
                  });
                }
              },
            );
          } else {
            // Google Maps not loaded, just return coordinates
            setData({
              city: "",
              area: "",
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              postalCode: "",
              loading: false,
              error: "",
            });
          }
        } catch (err) {
          setData({
            city: "",
            area: "",
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            postalCode: "",
            loading: false,
            error: "",
          });
        }
      },
      (error) => {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to get location",
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  return data;
}
