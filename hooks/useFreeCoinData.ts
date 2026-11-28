"use client";

import { useEffect, useState } from "react";

import { fetcher } from "@/lib/coingecko.actions";

interface UseFreeCoinDataProps {
  coinId: string;
  enabled?: boolean;
}
type SimplePriceResponse = Record<
  string,
  {
    usd: number;
    usd_24h_change?: number;
    usd_last_updated_at?: number;
  }
>;

export const useFreeCoinData = ({
  coinId,
  enabled = true,
}: UseFreeCoinDataProps): UseCoinGeckoWebSocketReturn => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [priceData, ohlcData] = await Promise.all([
          fetcher<SimplePriceResponse>(
            "/simple/price",
            {
              ids: coinId,
              vs_currencies: "usd",
              include_24hr_change: true,
              include_last_updated_at: true,
            },
            0,
          ),
          fetcher<number[][]>(
            `/coins/${coinId}/ohlc`,
            {
              vs_currency: "usd",
              days: 1,
            },
            0,
          ),
        ]);

        if (cancelled) return;

        const entry = priceData[coinId];

        if (entry) {
          setPrice({
            usd: entry.usd,
            price: entry.usd,
            change24h: entry.usd_24h_change ?? 0,
            timestamp: entry.usd_last_updated_at
              ? entry.usd_last_updated_at * 1000
              : Date.now(),
          });
        }

        const last = ohlcData[ohlcData.length - 1];

        if (last) {
          setOhlcv([
            Math.floor(last[0] / 1000),
            last[1],
            last[2],
            last[3],
            last[4],
          ] as OHLCData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    load();

    const interval = window.setInterval(load, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [coinId, enabled]);

  return {
    price,
    trades: [],
    ohlcv,
    isConnected: enabled && (price !== null || ohlcv !== null),
  };
};
