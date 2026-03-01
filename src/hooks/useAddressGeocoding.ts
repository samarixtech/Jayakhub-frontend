import { useState, useCallback, useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { toast } from "react-hot-toast";

export const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

export type AddressFormData = {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  note: string;
  status: boolean;
};

export function useAddressGeocoding(
  formData: AddressFormData,
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>,
) {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const isMapInteraction = useRef(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Forward Geocoding (Address -> Coordinates)
  useEffect(() => {
    if (isMapInteraction.current) {
      isMapInteraction.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (
        !window.google ||
        !window.google.maps ||
        (!formData.street && !formData.city)
      )
        return;

      const addressComponents = [
        formData.street,
        formData.city,
        formData.state,
        formData.zip,
        formData.country,
      ]
        .filter(Boolean)
        .join(", ");

      if (!addressComponents) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: addressComponents }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const pos = { lat: location.lat(), lng: location.lng() };
          setCenter(pos);
          setMarkerPosition(pos);
        }
      });
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [
    formData.street,
    formData.city,
    formData.state,
    formData.zip,
    formData.country,
  ]);

  // Reverse Geocoding
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google || !window.google.maps) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          let streetNumber = "";
          let route = "";
          let locality = "";
          let sublocality = "";
          let state = "";
          let country = "";
          let zip = "";

          results.forEach((result) => {
            result.address_components.forEach((component) => {
              const types = component.types;
              if (!streetNumber && types.includes("street_number"))
                streetNumber = component.long_name;
              if (!route && types.includes("route"))
                route = component.long_name;
              if (!locality && types.includes("locality"))
                locality = component.long_name;
              if (!sublocality && types.includes("sublocality"))
                sublocality = component.long_name;
              if (!state && types.includes("administrative_area_level_1"))
                state = component.long_name;
              if (!country && types.includes("country"))
                country = component.long_name;
              if (!zip && types.includes("postal_code"))
                zip = component.long_name;
            });
          });

          // Set City: Prioritize Locality (City) over Sublocality (Area/District)
          const city = locality || sublocality;

          // Construct street address
          let street = `${streetNumber} ${route}`.trim();
          if (!street && results[0]?.formatted_address) {
            street = results[0].formatted_address.split(",")[0];
          }

          setFormData((prev) => ({
            ...prev,
            street,
            city: city || prev.city,
            state,
            country,
            zip,
          }));
          toast.success("Address updated!");
        } else {
          console.error("Geocoder failed due to: " + status);
          toast.error("Could not fetch address details.");
        }
      });
    },
    [setFormData],
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPos = { lat, lng };
        setMarkerPosition(newPos);
        setCenter(newPos);

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

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return {
    isLoaded,
    loadError,
    center,
    setCenter,
    markerPosition,
    setMarkerPosition,
    map,
    onLoad,
    onUnmount,
    handleMapClick,
    handleLocateMe,
  };
}
