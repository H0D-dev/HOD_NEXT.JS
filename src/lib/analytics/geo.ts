/**
 * HOD Analytics Geolocation & Referrer Classification Utilities
 * Provides ISO-2 country resolution, flag emoji mapping, and inbound traffic channel categorization.
 */

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

/**
 * Standard ISO 3166-1 alpha-2 mapping for common international and regional eCommerce markets.
 */
const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  AE: { name: "United Arab Emirates", flag: "🇦🇪" },
  SA: { name: "Saudi Arabia", flag: "🇸🇦" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  IN: { name: "India", flag: "🇮🇳" },
  KW: { name: "Kuwait", flag: "🇰🇼" },
  QA: { name: "Qatar", flag: "🇶🇦" },
  OM: { name: "Oman", flag: "🇴🇲" },
  BH: { name: "Bahrain", flag: "🇧🇭" },
  CA: { name: "Canada", flag: "🇨🇦" },
  AU: { name: "Australia", flag: "🇦🇺" },
  DE: { name: "Germany", flag: "🇩🇪" },
  FR: { name: "France", flag: "🇫🇷" },
  IT: { name: "Italy", flag: "🇮🇹" },
  ES: { name: "Spain", flag: "🇪🇸" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  CH: { name: "Switzerland", flag: "🇨🇭" },
  SG: { name: "Singapore", flag: "🇸🇬" },
  JP: { name: "Japan", flag: "🇯🇵" },
  CN: { name: "China", flag: "🇨🇳" },
  RU: { name: "Russia", flag: "🇷🇺" },
  EG: { name: "Egypt", flag: "🇪🇬" },
  JO: { name: "Jordan", flag: "🇯🇴" },
  LB: { name: "Lebanon", flag: "🇱🇧" },
  PK: { name: "Pakistan", flag: "🇵🇰" },
  NP: { name: "Nepal", flag: "🇳🇵" },
  TR: { name: "Turkey", flag: "🇹🇷" },
  ZA: { name: "South Africa", flag: "🇿🇦" },
  BR: { name: "Brazil", flag: "🇧🇷" },
  MX: { name: "Mexico", flag: "🇲🇽" },
  NZ: { name: "New Zealand", flag: "🇳🇿" },
  SE: { name: "Sweden", flag: "🇸🇪" },
  NO: { name: "Norway", flag: "🇳🇴" },
  DK: { name: "Denmark", flag: "🇩🇰" },
  IE: { name: "Ireland", flag: "🇮🇪" },
  BE: { name: "Belgium", flag: "🇧🇪" },
  AT: { name: "Austria", flag: "🇦🇹" },
  HK: { name: "Hong Kong", flag: "🇭🇰" },
  MY: { name: "Malaysia", flag: "🇲🇾" },
  TH: { name: "Thailand", flag: "🇹🇭" },
  ID: { name: "Indonesia", flag: "🇮🇩" },
  KR: { name: "South Korea", flag: "🇰🇷" },
};

/**
 * Converts a 2-letter ISO country code to its flag emoji.
 */
export function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const code = countryCode.toUpperCase();
  if (COUNTRY_MAP[code]) {
    return COUNTRY_MAP[code].flag;
  }
  // Generic Unicode Flag Generator from ISO code
  try {
    const codePoints = code
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

/**
 * Returns human-readable country details with flag and normalized name.
 */
export function resolveCountry(countryCode?: string | null): CountryInfo {
  if (!countryCode) {
    return { code: "UNKNOWN", name: "Direct / Unknown", flag: "🌐" };
  }
  const code = countryCode.toUpperCase().trim();
  if (COUNTRY_MAP[code]) {
    return { code, name: COUNTRY_MAP[code].name, flag: COUNTRY_MAP[code].flag };
  }
  // Standard region name fallback
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    const name = displayNames.of(code) || code;
    return { code, name, flag: getCountryFlag(code) };
  } catch {
    return { code, name: code, flag: getCountryFlag(code) };
  }
}

// ── Referrer & Channel Categorization ─────────────────────────────────────────

export type TrafficChannel =
  | "Direct"
  | "Organic Search"
  | "Paid Search"
  | "Paid Social"
  | "Organic Social"
  | "Email"
  | "Referral";

interface ReferrerRule {
  channel: TrafficChannel;
  name: string;
  domains: string[];
}

const REFERRER_RULES: ReferrerRule[] = [
  {
    channel: "Organic Search",
    name: "Google",
    domains: ["google.", "google.com", "google.ae", "google.co.uk", "google.co.in", "google.com.sa"],
  },
  {
    channel: "Organic Search",
    name: "Bing",
    domains: ["bing.com"],
  },
  {
    channel: "Organic Search",
    name: "Yahoo",
    domains: ["yahoo.com", "search.yahoo.com"],
  },
  {
    channel: "Organic Search",
    name: "DuckDuckGo",
    domains: ["duckduckgo.com"],
  },
  {
    channel: "Organic Search",
    name: "Ecosia",
    domains: ["ecosia.org"],
  },
  {
    channel: "Organic Social",
    name: "Instagram",
    domains: ["instagram.com", "l.instagram.com"],
  },
  {
    channel: "Organic Social",
    name: "Facebook",
    domains: ["facebook.com", "l.facebook.com", "lm.facebook.com", "m.facebook.com", "fb.com"],
  },
  {
    channel: "Organic Social",
    name: "Pinterest",
    domains: ["pinterest.com", "pinterest.ae", "pinterest.co.uk", "pin.it"],
  },
  {
    channel: "Organic Social",
    name: "TikTok",
    domains: ["tiktok.com", "vm.tiktok.com"],
  },
  {
    channel: "Organic Social",
    name: "Twitter / X",
    domains: ["t.co", "twitter.com", "x.com"],
  },
  {
    channel: "Organic Social",
    name: "LinkedIn",
    domains: ["linkedin.com", "lnkd.in"],
  },
  {
    channel: "Organic Social",
    name: "YouTube",
    domains: ["youtube.com", "youtu.be", "m.youtube.com"],
  },
  {
    channel: "Organic Social",
    name: "Reddit",
    domains: ["reddit.com", "redd.it"],
  },
];

/**
 * Extracts a clean domain from a raw referrer string.
 */
export function extractReferrerDomain(referrer?: string | null): string {
  if (!referrer || referrer.trim() === "" || referrer === "(direct)" || referrer === "Direct") {
    return "Direct";
  }

  try {
    const url = new URL(referrer.startsWith("http") ? referrer : `https://${referrer}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return referrer.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || "Direct";
  }
}

/**
 * Classifies inbound traffic by checking UTM parameters and Referrer domain.
 */
export function classifyTrafficSource(params: {
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}): { channel: TrafficChannel; sourceName: string; domain: string } {
  const utmSource = (params.utm_source || "").toLowerCase().trim();
  const utmMedium = (params.utm_medium || "").toLowerCase().trim();
  const rawReferrer = params.referrer || "";
  const domain = extractReferrerDomain(rawReferrer).toLowerCase();

  // 1. Paid Channels via UTM medium
  if (
    utmMedium.includes("cpc") ||
    utmMedium.includes("ppc") ||
    utmMedium.includes("paidsearch") ||
    utmMedium.includes("adwords")
  ) {
    return {
      channel: "Paid Search",
      sourceName: params.utm_source ? `${params.utm_source} (Paid)` : "Paid Search",
      domain: domain || "google.com",
    };
  }

  if (
    utmMedium.includes("paidsocial") ||
    utmMedium.includes("meta_ads") ||
    utmMedium.includes("social_ads") ||
    utmMedium.includes("instagram_ads")
  ) {
    return {
      channel: "Paid Social",
      sourceName: params.utm_source ? `${params.utm_source} (Ads)` : "Paid Social",
      domain: domain || "instagram.com",
    };
  }

  // 2. Email UTMs
  if (utmMedium.includes("email") || utmMedium.includes("newsletter")) {
    return {
      channel: "Email",
      sourceName: params.utm_source ? `${params.utm_source} (Email)` : "Newsletter / Email",
      domain: "email",
    };
  }

  // 3. UTM Source Matching
  if (utmSource) {
    for (const rule of REFERRER_RULES) {
      if (rule.domains.some((d) => utmSource.includes(d.replace(".com", "")) || utmSource === rule.name.toLowerCase())) {
        return {
          channel: rule.channel,
          sourceName: rule.name,
          domain: rule.domains[0],
        };
      }
    }

    if (utmMedium.includes("social")) {
      return {
        channel: "Organic Social",
        sourceName: params.utm_source || "Social",
        domain: domain !== "direct" ? domain : "social",
      };
    }

    return {
      channel: "Referral",
      sourceName: params.utm_source || domain,
      domain: domain !== "direct" ? domain : utmSource,
    };
  }

  // 4. Referrer Header Matching
  if (domain && domain !== "direct") {
    for (const rule of REFERRER_RULES) {
      if (rule.domains.some((d) => domain.includes(d))) {
        return {
          channel: rule.channel,
          sourceName: rule.name,
          domain,
        };
      }
    }

    return {
      channel: "Referral",
      sourceName: domain,
      domain,
    };
  }

  // 5. Default: Direct Traffic
  return {
    channel: "Direct",
    sourceName: "Direct / None",
    domain: "Direct",
  };
}
