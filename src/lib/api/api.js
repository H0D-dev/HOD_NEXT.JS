export const API_CONFIG = {
    baseUrl: process.env.WC_BASE_URL ? process.env.WC_BASE_URL.replace(/\/$/, "") : "",
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET
}


