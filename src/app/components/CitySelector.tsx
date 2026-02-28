"use client";

import { City } from "../types";

interface CitySelectorProps {
  cities: City[];
  selectedCity: City;
  onCityChange: (city: City) => void;
  disabled: boolean;
}

export default function CitySelector({
  cities,
  selectedCity,
  onCityChange,
  disabled,
}: CitySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {cities.map((city) => {
        const isSelected = city.name === selectedCity.name;
        return (
          <button
            key={city.name}
            onClick={() => onCityChange(city)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-transparent
              disabled:cursor-not-allowed disabled:opacity-60
              ${
                isSelected
                  ? "bg-white text-sky-600 shadow-md scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
}
