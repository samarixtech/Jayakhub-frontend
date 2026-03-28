import { GoogleMap, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Crosshair } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddressMapProps {
  isLoaded: boolean;
  loadError: Error | undefined;
  center: { lat: number; lng: number };
  markerPosition: { lat: number; lng: number };
  onLoad: (map: google.maps.Map) => void;
  onUnmount: () => void;
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onLocateMe: () => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export const AddressMap = ({
  isLoaded,
  loadError,
  center,
  markerPosition,
  onLoad,
  onUnmount,
  onMapClick,
  onLocateMe,
}: AddressMapProps) => {
  const t = useTranslations('CustomerDashboard.MyAddress');

  return (
    <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          {loadError ? t('error_loading_maps') : t('loading_map')}
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        onClick={onLocateMe}
        className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-emerald-800 shadow-md gap-2 rounded-full font-bold text-xs h-9 px-4 z-10"
      >
        <Crosshair size={14} className="text-emerald-600" />
        {t('locate_me')}
      </Button>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 shadow-sm border border-gray-100 pointer-events-none">
        {t('tap_on_map')}
      </div>
    </div>
  );
};
