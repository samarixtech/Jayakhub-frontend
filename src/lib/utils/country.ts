import { getNames, getCode } from "country-list";

export const countryCurrencyMap: { [key: string]: string } = {
  US: "$",
  PK: "Rs",
  IN: "₹",
  AE: "د.إ",
  CA: "CA$",
  GB: "£",
  FR: "€",
  DE: "€",
  IT: "€",
  ES: "€",
  JP: "¥",
  CN: "¥",
  AU: "A$",
  BR: "R$",
  RU: "₽",
  SA: "﷼",
  EG: "E£",
  NG: "₦",
  ZA: "R",
  KR: "₩",
  MX: "$",
  SG: "S$",
  MY: "RM",
  TH: "฿",
  VN: "₫",
  ID: "Rp",
  NL: "€",
  BE: "€",
  CH: "CHF",
  SE: "kr",
  NO: "kr",
  DK: "kr",
  FI: "€",
  IE: "€",
  PT: "€",
  GR: "€",
  TR: "₺",
  PKR: "Rs",
  INR: "₹",
  AED: "د.إ",
  IQ: "ع.د", 
   AF: "؋",
};


export const getDefaultCountryData = (countryCode: string) => {

  const code = countryCode.toUpperCase();

  const countryName = getNames().find((name) => getCode(name) === code) || "Unknown Country";

  const currency = countryCurrencyMap[code] || "$";

  return { code, name: countryName, currency };
};
