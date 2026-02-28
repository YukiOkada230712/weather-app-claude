"use client";

import { useEffect, useState } from "react";
import { City, CITIES } from "../types";
import CitySelector from "./CitySelector";

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

// --- コンポーネント ---

export default function CurrentWeather() {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchWeather = async () => {
      setStatus("loading");
      setErrorMessage("");

      const apiUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}` +
        `&current=temperature_2m,wind_speed_10m`;

      try {
        const res = await fetch(apiUrl);

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
  }, [selectedCity]);

  const isLoading = status === "idle" || status === "loading";

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
      {/* ヘッダー */}
      <div className="px-6 pt-6 pb-3">
        <p className="text-sm font-medium text-blue-100">現在の天気</p>
        <h2 className="mt-0.5 text-xl font-bold text-white">{selectedCity.name}</h2>
      </div>

      {/* 都市選択 */}
      <div className="px-6 pb-4">
        <CitySelector
          cities={CITIES}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          disabled={isLoading}
        />
      </div>

      {/* ローディング */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-white" />
            <p className="text-sm text-blue-100">天気情報を取得中...</p>
          </div>
        </div>
      )}

      {/* エラー */}
      {status === "error" && (
        <div className="mx-4 mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-700">データの取得に失敗しました</p>
              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* 成功 - 気象データ */}
      {status === "success" && weather && (
        <div className="grid grid-cols-2 gap-px bg-white/20 mx-4 mb-6 rounded-xl overflow-hidden">
          {/* 気温 */}
          <div className="bg-white/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">
              気温
            </p>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-4xl font-bold text-white">
                {weather.temperature.toFixed(1)}
              </span>
              <span className="mb-1 text-lg text-blue-100">
                {weather.temperatureUnit}
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
                {weather.windSpeed.toFixed(1)}
              </span>
              <span className="mb-1 text-sm text-blue-100">
                {weather.windSpeedUnit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
