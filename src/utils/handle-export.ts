/**
 * Trigger a file download from a given API endpoint.
 *
 * @param endpoint
 * @param token
 * @param filename
 */
export const downloadFile = async (
  endpoint: string,
  token: string,
  filename: string,
) => {
  let baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_ANCHOR_URL ||
    "https://app.jayakhub.com/api/v1/";

  if (
    baseUrl.includes("app.jayakhub.com") &&
    !baseUrl.includes("/api/v1")
  ) {
    baseUrl = baseUrl.endsWith("/")
      ? `${baseUrl}api/v1/`
      : `${baseUrl}/api/v1/`;
  }

  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  let cleanEndpoint = endpoint;
  if (cleanEndpoint.endsWith("?") || cleanEndpoint.endsWith("&")) {
    cleanEndpoint = cleanEndpoint.slice(0, -1);
  }

  const separator = cleanEndpoint.includes("?") ? "&" : "?";
  const exportUrl = `${cleanBaseUrl}${cleanEndpoint}${separator}token=${token}`;

  try {
    const res = await fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      let errorMsg = `Download failed with status: ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson?.meta?.message) {
          errorMsg = errJson.meta.message;
        } else if (errJson?.message) {
          errorMsg = errJson.message;
        }
      } catch { }
      throw new Error(errorMsg);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error during file download:", error);
    throw error;
  }
};
