export const apiLocalUrl =
  process.env.LOCAL_API_URL || "http://127.0.0.1:8000/api/v1";

export const apiServerUrl =
  process.env.SERVER_API_URL || "https://api.amerbazar.mkhandev.info/api/v1";

export const apiUrl =
  process.env.ENVIRONMEBT_MODE === "production" ? apiServerUrl : apiLocalUrl;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "AmerBazar";
