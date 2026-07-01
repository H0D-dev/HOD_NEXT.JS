import { API_CONFIG } from "@/src/lib/api/api";

export async function verifyAuthToken(token: string) {
  try {
    const wpUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
    const validateUrl = `${wpUrl}/wp-json/api/v1/token-validate`;

    const wpRes = await fetch(validateUrl, {
      method: "GET", // The plugin specifically expects a GET request for validation
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!wpRes.ok) {
      console.error("Token validation failed with status:", wpRes.status);
      return null;
    }

    // 2. Since the token is valid, we can safely decode the payload base64 to extract user details
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');

    const payload = JSON.parse(jsonPayload);

    return payload;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}
