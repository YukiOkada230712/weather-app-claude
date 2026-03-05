"use client";

interface CityButtonProps {
  cityName: string;
  isSelected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function CityButton({
  cityName,
  isSelected = false,
  disabled = false,
  onClick,
}: CityButtonProps) {
  return (
    <button
      onClick={onClick}
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
      {cityName}
    </button>
  );
}
