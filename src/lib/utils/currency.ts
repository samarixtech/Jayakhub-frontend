// CREATED BY MUHAMMAD SHOAIB 3-18-2026
/**
 * Formats an amount using the native Intl.NumberFormat API.
 * This ensures the currency symbol, decimal separators, and thousands separators
 * are placed correctly according to the provided locale and currency code.
 *
 * @param amount - The numeric amount or string representation of the amount
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR', 'PKR')
 * @param locale - The BCP 47 language tag (e.g., 'en-US', 'en', 'fr')
 * @returns The formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  currencyCode: string,
  locale: string = "en-US",
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) return "0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    // Some currencies (e.g. PKR) default to 0 fraction digits in Intl's
    // CLDR data, which silently rounds off the actual decimal price.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}
