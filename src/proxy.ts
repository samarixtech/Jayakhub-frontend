// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// // import getClientIp from "./lib/getClientIp";
// import api from "./components/services/api";

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // 1. Exclude static assets and API routes
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.includes(".") ||
//     pathname === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   // 2. Get Country, Language from Cookies
//   const cookieCountry = request.cookies.get("USER_COUNTRY")?.value;
//   const cookieLanguage = request.cookies.get("NEXT_LOCALE")?.value;

//   let country: string = cookieCountry || "";
//   let language: string = cookieLanguage || "";

//   // 3. If cookies are missing, call detect API
//   if (!country || !language) {
//     try {
//       const detectRes = (await api.get(
//         "/detect",
//         //   , {
//         //   headers: { "x-ip": ip || "NULL" },
//         // }
//       )) as any;

//       const data = detectRes.data?.data;
//       if (data && data.isActive) {
//         country = (data.code || "iq").toLowerCase();
//         language = (data.language || "en").toLowerCase();
//       } else {
//         if (!country) country = "iq";
//         if (!language) language = "en";
//       }
//     } catch (error) {
//       console.error("Middleware: detect API error:", error);
//       if (!country) country = "iq";
//       if (!language) language = "en";
//     }
//   }

//   // 4. Analyze Path Segments
//   const pathSegments = pathname.split("/").filter(Boolean);

//   // Auth Protection
//   const token = request.cookies.get("token")?.value;
//   const role = request.cookies.get("role")?.value;

//   const isCustomerRoute = pathSegments.some(
//     (segment) => segment === "customer",
//   );
//   const isRestaurantRoute = pathSegments.some(
//     (segment) => segment === "restaurant",
//   );
//   const isProtected = isCustomerRoute || isRestaurantRoute;

//   if (isProtected) {
//     if (!token) {
//       const loginUrl = new URL(`/${country}/${language}/login`, request.url);
//       const response = NextResponse.redirect(loginUrl);
//       response.cookies.set("USER_COUNTRY", country, {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 365,
//       });
//       response.cookies.set("NEXT_LOCALE", language, {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 365,
//       });
//       return response;
//     }

//     // Role-based access control
//     if (isCustomerRoute && role !== "customer") {
//       let redirectPath = "login";
//       if (role === "restaurant_owner") redirectPath = "restaurant/dashboard";
//       if (role === "cashier") redirectPath = "restaurant/pos";

//       return NextResponse.redirect(
//         new URL(`/${country}/${language}/${redirectPath}`, request.url),
//       );
//     }

//     if (isRestaurantRoute) {
//       if (role !== "restaurant_owner" && role !== "cashier") {
//         const redirectPath =
//           role === "customer" ? "customer/dashboard" : "login";
//         return NextResponse.redirect(
//           new URL(`/${country}/${language}/${redirectPath}`, request.url),
//         );
//       }

//       // Restrict cashiers exclusively to the POS route
//       if (role === "cashier" && !pathSegments.includes("pos")) {
//         return NextResponse.redirect(
//           new URL(`/${country}/${language}/restaurant/pos`, request.url),
//         );
//       }
//     }
//   }

//   // Check if the URL already has the valid format /[country]/[language]/...
//   const hasCountry = pathSegments[0]?.length === 2;
//   const hasLanguage = pathSegments[1]?.length === 2;

//   if (hasCountry && hasLanguage) {
//     const countryInUrl = pathSegments[0];
//     const languageInUrl = pathSegments[1];

//     if (
//       countryInUrl !== countryInUrl.toLowerCase() ||
//       languageInUrl !== languageInUrl.toLowerCase()
//     ) {
//       const url = request.nextUrl.clone();
//       const segments = [...pathSegments];
//       segments[0] = countryInUrl.toLowerCase();
//       segments[1] = languageInUrl.toLowerCase();
//       url.pathname = `/${segments.join("/")}`;
//       return NextResponse.redirect(url);
//     }

//     // Ensure cookies are synced with URL
//     const response = NextResponse.next();
//     if (pathSegments[0] !== request.cookies.get("USER_COUNTRY")?.value) {
//       response.cookies.set("USER_COUNTRY", pathSegments[0], {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 365,
//       });
//     }
//     if (pathSegments[1] !== request.cookies.get("NEXT_LOCALE")?.value) {
//       response.cookies.set("NEXT_LOCALE", pathSegments[1], {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 365,
//       });
//     }
//     return response;
//   }

//   // 5. Handle Root Path "/"
//   if (pathname === "/") {
//     const url = request.nextUrl.clone();
//     url.pathname = `/${country}/${language}/restaurants`;
//     const response = NextResponse.redirect(url);
//     response.cookies.set("USER_COUNTRY", country, {
//       path: "/",
//       maxAge: 60 * 60 * 24 * 365,
//     });
//     response.cookies.set("NEXT_LOCALE", language, {
//       path: "/",
//       maxAge: 60 * 60 * 24 * 365,
//     });
//     return response;
//   }

//   // 6. Handle Paths missing Country/Language (e.g. /restaurants -> /pk/ur/restaurants)
//   const url = request.nextUrl.clone();
//   url.pathname = `/${country}/${language}${pathname}`;
//   const response = NextResponse.redirect(url);
//   response.cookies.set("USER_COUNTRY", country, {
//     path: "/",
//     maxAge: 60 * 60 * 24 * 365,
//   });
//   response.cookies.set("NEXT_LOCALE", language, {
//     path: "/",
//     maxAge: 60 * 60 * 24 * 365,
//   });
//   return response;
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./components/services/api";

// Define your supported languages here so the middleware can identify them
const supportedLocales = ["en", "fr", "es", "ar"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Get Country, Language from Cookies
  const cookieCountry = request.cookies.get("USER_COUNTRY")?.value;
  const cookieLanguage = request.cookies.get("NEXT_LOCALE")?.value;

  let country: string = cookieCountry || "";
  let language: string = cookieLanguage || "";

  // 3. If cookies are missing, call detect API
  if (!country || !language) {
    try {
      const detectRes = (await api.get("/detect")) as any;
      const data = detectRes.data?.data;
      if (data && data.isActive) {
        country = (data.code || "iq").toLowerCase();
        language = (data.language || "en").toLowerCase();
      } else {
        if (!country) country = "iq";
        if (!language) language = "en";
      }
    } catch (error) {
      console.error("Middleware: detect API error:", error);
      if (!country) country = "iq";
      if (!language) language = "en";
    }
  }

  // 4. Analyze Path Segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Auth Protection (Unchanged)
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isCustomerRoute = pathSegments.some((segment) => segment === "customer");
  const isRestaurantRoute = pathSegments.some((segment) => segment === "restaurant");
  const isProtected = isCustomerRoute || isRestaurantRoute;

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL(`/${country}/${language}/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("USER_COUNTRY", country, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      response.cookies.set("NEXT_LOCALE", language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }

    if (isCustomerRoute && role !== "customer") {
      let redirectPath = "login";
      if (role === "restaurant_owner") redirectPath = "restaurant/dashboard";
      if (role === "cashier") redirectPath = "restaurant/pos";

      return NextResponse.redirect(new URL(`/${country}/${language}/${redirectPath}`, request.url));
    }

    if (isRestaurantRoute) {
      if (role !== "restaurant_owner" && role !== "cashier") {
        const redirectPath = role === "customer" ? "customer/dashboard" : "login";
        return NextResponse.redirect(new URL(`/${country}/${language}/${redirectPath}`, request.url));
      }

      if (role === "cashier" && !pathSegments.includes("pos")) {
        return NextResponse.redirect(new URL(`/${country}/${language}/restaurant/pos`, request.url));
      }
    }
  }

  // Smarter detection for Country vs Language
  const firstSegment = pathSegments[0]?.toLowerCase();
  const secondSegment = pathSegments[1]?.toLowerCase();

  const isFirstSegmentLanguage = supportedLocales.includes(firstSegment as string);
  const isFirstSegmentCountry = firstSegment?.length === 2 && !isFirstSegmentLanguage;
  const isSecondSegmentLanguage = supportedLocales.includes(secondSegment as string);

  // Check if the URL already has the valid format /[country]/[language]/...
  if (isFirstSegmentCountry && isSecondSegmentLanguage) {
    if (firstSegment !== pathSegments[0] || secondSegment !== pathSegments[1]) {
      const url = request.nextUrl.clone();
      const segments = [...pathSegments];
      segments[0] = firstSegment as string;
      segments[1] = secondSegment as string;
      url.pathname = `/${segments.join("/")}`;
      return NextResponse.redirect(url);
    }

    // Ensure cookies are synced with URL
    const response = NextResponse.next();
    if (pathSegments[0] !== request.cookies.get("USER_COUNTRY")?.value) {
      response.cookies.set("USER_COUNTRY", pathSegments[0], { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
    if (pathSegments[1] !== request.cookies.get("NEXT_LOCALE")?.value) {
      response.cookies.set("NEXT_LOCALE", pathSegments[1], { path: "/", maxAge: 60 * 60 * 24 * 365 });
    }
    return response;
  }

  // 5. Handle Root Path "/"
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${country}/${language}/restaurants`;
    const response = NextResponse.redirect(url);
    response.cookies.set("USER_COUNTRY", country, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    response.cookies.set("NEXT_LOCALE", language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // 6. Handle Malformed Paths (Missing Country, Missing Language, or Both)
  let finalPath = pathname;

  if (isFirstSegmentLanguage) {
    // URL is something like "/en" -> Make it "/ae/en/restaurants"
    const pathWithoutLang = pathname.replace(`/${pathSegments[0]}`, "");
    finalPath = `/${country}/${firstSegment}${pathWithoutLang === "" ? "/restaurants" : pathWithoutLang}`;
  }
  else if (isFirstSegmentCountry) {
    // URL is something like "/ae" -> Make it "/ae/en/restaurants"
    const pathWithoutCountry = pathname.replace(`/${pathSegments[0]}`, "");
    finalPath = `/${firstSegment}/${language}${pathWithoutCountry === "" ? "/restaurants" : pathWithoutCountry}`;
  }
  else {
    // URL is something like "/restaurants" -> Make it "/ae/en/restaurants"
    finalPath = `/${country}/${language}${pathname}`;
  }

  const url = request.nextUrl.clone();
  url.pathname = finalPath;
  const response = NextResponse.redirect(url);
  response.cookies.set("USER_COUNTRY", country, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  response.cookies.set("NEXT_LOCALE", language, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};