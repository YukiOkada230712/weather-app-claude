"use client";

import { useEffect, useState } from "react";

// --- 型定義 ---

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
}

interface WeatherData {
  temperature: number;
  windSpeed: number;
  temperatureUnit: string;
  windSpeedUnit: string;
}

type FetchStatus = "idle" | "loading" | "success" | "error";

// --- 定数 ---

const TOKYO_LAT = 35.6762;
const TOKYO_LON = 139.6503;

const API_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}` +
  `&current=temperature_2m,wind_speed_10m`;

// --- コンポーネント ---

export default function CurrentWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchWeather = async () => {
      setStatus("loading");
      setErrorMessage("");

      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`API エラー: ${res.status} ${res.statusText}`);
        }

        const data: OpenMeteoResponse = await res.json();

        setWeather({
          temperature: data.current.temperature_2m,
          windSpeed: data.current.wind_speed_10m,
          temperatureUnit: data.current_units.temperature_2m,
          windSpeedUnit: data.current_units.wind_speed_10m,
        });
        setStatus("success");
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "不明なエラーが発生しました"
        );
        setStatus("error");
      }
    };

    fetchWeather();
  }, []);

  // ローディング
  if (status === "idle" || status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
          <p className="text-sm text-gray-500">天気情報を取得中...</p>
        </div>
      </div>
    );
  }

  // エラー
  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-red-700">データの取得に失敗しました</p>
            <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // 成功
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
      {/* ヘッダー */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-sm font-medium text-blue-100">現在の天気</p>
        <h2 className="mt-0.5 text-xl font-bold text-white">東京</h2>
      </div>

      {/* 気象データ */}
      <div className="grid grid-cols-2 gap-px bg-white/20 mx-4 mb-6 mt-4 rounded-xl overflow-hidden">
        {/* 気温 */}
        <div className="bg-white/10 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">
            気温
          </p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold text-white">
              {weather!.temperature.toFixed(1)}
            </span>
            <span className="mb-1 text-lg text-blue-100">
              {weather!.temperatureUnit}
            </span>
          </div>
        </div>

        {/* 風速 */}
        <div className="bg-white/10 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">
            風速
          </p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold text-white">
              {weather!.windSpeed.toFixed(1)}
            </span>
            <span className="mb-1 text-sm text-blue-100">
              {weather!.windSpeedUnit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
