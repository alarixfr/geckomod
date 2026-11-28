"use server";

import qs from "query-string";

const PRO_BASE_URL = "https://pro-api.coingecko.com/api/v3";
const DEMO_BASE_URL = "https://api.coingecko.com/api/v3";

const API_KEY = process.env.COINGECKO_API_KEY;

if (!API_KEY) throw new Error("Could not get api key");

const API_TOKEN: string = API_KEY;

type ApiProfile = "pro" | "demo";

let cachedProfile: Promise<ApiProfile> | null = null;

export async function getApiProfile(): Promise<ApiProfile> {
  const override = process.env.COINGECKO_PLAN;

  if (override === "pro" || override === "demo") {
    return override;
  }

  if (!cachedProfile) {
    cachedProfile = (async () => {
      try {
        const response = await fetch(`${PRO_BASE_URL}/key`, {
          headers: { "x-cg-pro-api-key": API_TOKEN },
          cache: "no-store",
        });

        return response.ok ? "pro" : "demo";
      } catch {
        return "demo";
      }
    })();
  }
  return cachedProfile;
}

const DEMO_BLOCKED_PARAMS = new Set([
  "dex_pair_format",
  "interval",
  "precision",
]);

function demoParams(params?: QueryParams): QueryParams | undefined {
  if (!params) return undefined;

  const result: QueryParams = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || DEMO_BLOCKED_PARAMS.has(key)) continue;

    result[key] = value;
  }

  if (
    result.days === "max" ||
    (typeof result.days === "number" && result.days > 365)
  ) {
    result.days = 365;
  }

  return result;
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const profile = await getApiProfile();
  const baseUrl = profile === "pro" ? PRO_BASE_URL : DEMO_BASE_URL;
  const authHeader =
    profile === "pro" ? "x-cg-pro-api-key" : "x-cg-demo-api-key";
  const query = profile === "pro" ? params : demoParams(params);

  const url = qs.stringifyUrl(
    {
      url: `${baseUrl}/${endpoint}`,
      query,
    },
    { skipNull: true, skipEmptyString: true },
  );

  const response = await fetch(url, {
    headers: {
      [authHeader]: API_TOKEN,
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      `API Error: ${response.status}: ${errorBody.error || response.statusText} `,
    );
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id },
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function(query: string): Promise<SearchCoin[]> {
  const trimmed = query.trim();

  if (!trimmed) return [];

  const data = await fetcher<{ coins?: SearchCOin[] }>(
    "/search/query",
    { query: trimmed },
    0,
  );

  return data.coins ?? [];
}