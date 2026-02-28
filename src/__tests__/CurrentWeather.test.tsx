import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CurrentWeather from "../app/components/CurrentWeather";
import { CITIES } from "../app/types";

// Open-Meteo APIのレスポンスモック生成ヘルパー
function makeMockResponse(temperature: number, windSpeed: number) {
  return {
    current: {
      temperature_2m: temperature,
      wind_speed_10m: windSpeed,
    },
    current_units: {
      temperature_2m: "°C",
      wind_speed_10m: "km/h",
    },
  };
}

describe("CurrentWeather", () => {
  beforeEach(() => {
    // fetch をモック化
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => makeMockResponse(20.5, 15.0),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("初期表示でローディングスピナーが出る", () => {
    render(<CurrentWeather />);
    // スピナーの animate-spin クラスを持つ要素
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("初期表示でローディングテキストが出る", () => {
    render(<CurrentWeather />);
    expect(screen.getByText("天気情報を取得中...")).toBeInTheDocument();
  });

  it("データ取得成功後に東京の気象データが表示される", async () => {
    render(<CurrentWeather />);
    // 気温が表示されるまで待つ
    await waitFor(() => {
      expect(screen.getByText("20.5")).toBeInTheDocument();
    });
    expect(screen.getByText("15.0")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("初期状態で東京が選択されている (ヘッダーに表示)", async () => {
    render(<CurrentWeather />);
    // ヘッダーの都市名は即時表示される
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("東京");
  });

  it("データ取得成功後にローディングが消える", async () => {
    render(<CurrentWeather />);
    await waitFor(() => {
      expect(screen.queryByText("天気情報を取得中...")).not.toBeInTheDocument();
    });
  });

  it("APIエラー時にエラーメッセージが表示される", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    render(<CurrentWeather />);
    await waitFor(() => {
      expect(screen.getByText("データの取得に失敗しました")).toBeInTheDocument();
    });
    expect(
      screen.getByText("API エラー: 500 Internal Server Error")
    ).toBeInTheDocument();
  });

  it("ネットワークエラー時にエラーメッセージが表示される", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network Error"))
    );

    render(<CurrentWeather />);
    await waitFor(() => {
      expect(screen.getByText("データの取得に失敗しました")).toBeInTheDocument();
    });
    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });

  it("5つの都市ボタンが表示される", async () => {
    render(<CurrentWeather />);
    for (const city of CITIES) {
      expect(screen.getByRole("button", { name: city.name })).toBeInTheDocument();
    }
  });

  it("大阪ボタンをクリックすると大阪の座標でAPIが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => makeMockResponse(25.0, 10.0),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<CurrentWeather />);

    // 初回フェッチ完了を待つ
    await waitFor(() => {
      expect(screen.queryByText("天気情報を取得中...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "大阪" }));

    await waitFor(() => {
      const calls = mockFetch.mock.calls.map((c) => c[0] as string);
      const osakaCall = calls.find(
        (url) =>
          url.includes(`latitude=${CITIES[1].latitude}`) &&
          url.includes(`longitude=${CITIES[1].longitude}`)
      );
      expect(osakaCall).toBeDefined();
    });
  });

  it("都市切り替え後にヘッダーが新しい都市名に変わる", async () => {
    const user = userEvent.setup();
    render(<CurrentWeather />);

    await waitFor(() => {
      expect(screen.queryByText("天気情報を取得中...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "札幌" }));

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("札幌");
  });

  it("都市切り替え中にローディングが表示される", async () => {
    const user = userEvent.setup();
    // 2回目のフェッチを遅延させる
    let callCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: async () => makeMockResponse(20.5, 15.0),
          });
        }
        // 2回目は解決しない Promise（ローディング中を維持）
        return new Promise(() => {});
      })
    );

    render(<CurrentWeather />);

    // 初回フェッチ完了
    await waitFor(() => {
      expect(screen.queryByText("天気情報を取得中...")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "福岡" }));

    // ローディングが再表示される
    expect(screen.getByText("天気情報を取得中...")).toBeInTheDocument();
  });

  it("初回フェッチで東京の座標が使用される", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => makeMockResponse(20.5, 15.0),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<CurrentWeather />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const firstCall = mockFetch.mock.calls[0][0] as string;
    expect(firstCall).toContain(`latitude=${CITIES[0].latitude}`);
    expect(firstCall).toContain(`longitude=${CITIES[0].longitude}`);
  });
});
