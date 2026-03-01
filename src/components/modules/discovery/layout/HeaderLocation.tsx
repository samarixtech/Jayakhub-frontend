import LocationSwitcher from "../../../common/LocationSwitcher";

import { HeaderLocationProps } from "@/components/modules/discovery/discovery.types";

export const HeaderLocation = ({
  currentAddress,
  setCurrentAddress,
  isLoggedIn,
  onLocationChange,
  className = "",
}: HeaderLocationProps) => {
  return (
    <LocationSwitcher
      currentAddress={currentAddress}
      onAddressChange={setCurrentAddress}
      isLoggedIn={isLoggedIn}
      className={className}
      onLocationChange={onLocationChange}
    />
  );
};
