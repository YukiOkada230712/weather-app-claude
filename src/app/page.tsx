import CurrentWeather from "./components/CurrentWeather";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-sm">
        <CurrentWeather />
      </div>
    </main>
  );
}
