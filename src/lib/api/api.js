export const API_CONFIG = {
    baseUrl: (process.env.WC_BASE_URL || process.env.NEXT_PUBLIC_WC_BASE_URL || "https://store.houseofdecor.ae").replace(/\/$/, ""),
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET
}


