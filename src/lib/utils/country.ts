import { getNames, getCode } from "country-list";

export interface CurrencyInfo {
  symbol: string;
  code: string;
}

export const countryCurrencyMap: { [key: string]: CurrencyInfo } = {
  US: { symbol: "$", code: "USD" },
  PK: { symbol: "Rs", code: "PKR" },
  IN: { symbol: "₹", code: "INR" },
  AE: { symbol: "د.إ", code: "AED" },
  CA: { symbol: "CA$", code: "CAD" },
  GB: { symbol: "£", code: "GBP" },
  FR: { symbol: "€", code: "EUR" },
  DE: { symbol: "€", code: "EUR" },
  IT: { symbol: "€", code: "EUR" },
  ES: { symbol: "€", code: "EUR" },
  JP: { symbol: "¥", code: "JPY" },
  CN: { symbol: "¥", code: "CNY" },
  AU: { symbol: "A$", code: "AUD" },
  BR: { symbol: "R$", code: "BRL" },
  RU: { symbol: "₽", code: "RUB" },
  SA: { symbol: "﷼", code: "SAR" },
  EG: { symbol: "E£", code: "EGP" },
  NG: { symbol: "₦", code: "NGN" },
  ZA: { symbol: "R", code: "ZAR" },
  KR: { symbol: "₩", code: "KRW" },
  MX: { symbol: "$", code: "MXN" },
  SG: { symbol: "S$", code: "SGD" },
  MY: { symbol: "RM", code: "MYR" },
  TH: { symbol: "฿", code: "THB" },
  VN: { symbol: "₫", code: "VND" },
  ID: { symbol: "Rp", code: "IDR" },
  NL: { symbol: "€", code: "EUR" },
  BE: { symbol: "€", code: "EUR" },
  CH: { symbol: "CHF", code: "CHF" },
  SE: { symbol: "kr", code: "SEK" },
  NO: { symbol: "kr", code: "NOK" },
  DK: { symbol: "kr", code: "DKK" },
  FI: { symbol: "€", code: "EUR" },
  IE: { symbol: "€", code: "EUR" },
  PT: { symbol: "€", code: "EUR" },
  GR: { symbol: "€", code: "EUR" },
  TR: { symbol: "₺", code: "TRY" },
  IQ: { symbol: "ID", code: "IQD" },
  AF: { symbol: "؋", code: "AFN" },
};

export const getDefaultCountryData = (countryCode: string) => {
  const code = countryCode.toUpperCase();
  const countryName = getNames().find((name) => getCode(name) === code) || "Unknown Country";
  const currencyInfo = countryCurrencyMap[code] || { symbol: "$", code: "USD" };

  return { 
    code, 
    name: countryName, 
    currencySymbol: currencyInfo.symbol, 
    currencyCode: currencyInfo.code.toLowerCase() 
  };
};
