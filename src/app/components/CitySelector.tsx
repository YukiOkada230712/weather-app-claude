"use client";

import { City } from "../types";
import CityButton from "./atoms/CityButton";

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
}: CitySelectorProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {cities.map((city) => (
        <CityButton
          key={city.name}
          cityName={city.name}
          isSelected={city === selectedCity}
          disabled={disabled}
          onClick={() => onCityChange(city)}
        />
      ))}
    </div>
  );
}
