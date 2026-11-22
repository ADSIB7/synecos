/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

let mapScriptPromise: Promise<void> | undefined;

function loadMapScript(): Promise<void> {
  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (!API_KEY) {
    return Promise.reject(new Error("Google Maps API key is not configured"));
  }

  if (!mapScriptPromise) {
    mapScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        script.remove();
        if (window.google?.maps) {
          resolve();
          return;
        }

        mapScriptPromise = undefined;
        reject(new Error("Google Maps loaded without initializing the API"));
      };
      script.onerror = () => {
        script.remove();
        mapScriptPromise = undefined;
        reject(new Error("Failed to load Google Maps script"));
      };
      document.head.appendChild(script);
    });
  }

  return mapScriptPromise;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  const initializeMap = usePersistFn(async () => {
    try {
      await loadMapScript();

      const container = mapContainer.current;
      const maps = window.google?.maps;
      if (!container || !maps) {
        return;
      }

      const map = new maps.Map(container, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: "DEMO_MAP_ID",
      });

      onMapReady?.(map);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    void initializeMap();
  }, [initializeMap]);

  return (
    <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />
  );
}
