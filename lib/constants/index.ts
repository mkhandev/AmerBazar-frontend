export const apiLocalUrl =
  process.env.LOCAL_API_URL || "http://127.0.0.1:8000/api/v1";

export const apiServerUrl =
  process.env.SERVER_API_URL || "https://api.amerbazar.mkhandev.info/api/v1";

export const apiUrl =
  process.env.ENVIRONMENT_MODE === "production" ? apiServerUrl : apiLocalUrl;

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "AmerBazar";

export const PRICES = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $100",
    value: "51-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
];

export const RATINGS = [4, 3, 2, 1];

export const SORT_ORDERS = ["newest", "lowest", "highest", "rating"];
