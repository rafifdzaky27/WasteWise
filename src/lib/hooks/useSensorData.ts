"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "../supabase/client";
import type { SensorReading } from "../types";

const MAX_READINGS = 100;

interface UseSensorDataReturn {
  readings: SensorReading[];
  latestReading: SensorReading | null;
  isConnected: boolean;
  error: string | null;
  isLoading: boolean;
}

/**
 * Custom hook that subscribes to Supabase Realtime for sensor data.
 * 1. Fetches initial readings via GET /api/sensors
 * 2. Subscribes to postgres_changes on sensor_readings table
 * 3. Prepends new readings on INSERT events (capped at MAX_READINGS)
 */
export function useSensorData(biobinId: string | null): UseSensorDataReturn {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    if (!biobinId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/sensors?biobin_id=${biobinId}&limit=100`);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to fetch sensor data");
      }
      const data: SensorReading[] = await res.json();
      setReadings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [biobinId]);

  // Subscribe to Realtime
  useEffect(() => {
    if (!biobinId) {
      setReadings([]);
      setIsLoading(false);
      return;
    }

    fetchInitialData();

    const supabase = createClient();
    const channel = supabase
      .channel(`biobin-${biobinId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
          filter: `biobin_id=eq.${biobinId}`,
        },
        (payload) => {
          const newReading = payload.new as SensorReading;
          setReadings((prev) => {
            const updated = [...prev, newReading];
            // Cap at MAX_READINGS to prevent memory growth
            if (updated.length > MAX_READINGS) {
              return updated.slice(updated.length - MAX_READINGS);
            }
            return updated;
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setError(null);
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false);
          setError("Realtime connection error");
        } else if (status === "TIMED_OUT") {
          setIsConnected(false);
          setError("Realtime connection timed out");
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [biobinId, fetchInitialData]);

  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;

  return { readings, latestReading, isConnected, error, isLoading };
}
