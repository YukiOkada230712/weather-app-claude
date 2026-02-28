import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySelector from "../app/components/CitySelector";
import { CITIES } from "../app/types";

const defaultProps = {
  cities: CITIES,
  selectedCity: CITIES[0], // 東京
  onCityChange: vi.fn(),
  disabled: false,
};

describe("CitySelector", () => {
  it("すべての都市ボタンがレンダリングされる", () => {
    render(<CitySelector {...defaultProps} />);
    for (const city of CITIES) {
      expect(screen.getByRole("button", { name: city.name })).toBeInTheDocument();
    }
  });

  it("選択中の都市ボタンは aria-pressed='true'", () => {
    render(<CitySelector {...defaultProps} selectedCity={CITIES[0]} />);
    expect(screen.getByRole("button", { name: "東京" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("非選択の都市ボタンは aria-pressed='false'", () => {
    render(<CitySelector {...defaultProps} selectedCity={CITIES[0]} />);
    const nonSelected = ["大阪", "札幌", "福岡", "那覇"];
    for (const name of nonSelected) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    }
  });

  it("都市ボタンをクリックすると onCityChange が呼ばれる", async () => {
    const user = userEvent.setup();
    const onCityChange = vi.fn();
    render(<CitySelector {...defaultProps} onCityChange={onCityChange} />);

    await user.click(screen.getByRole("button", { name: "大阪" }));
    expect(onCityChange).toHaveBeenCalledTimes(1);
    expect(onCityChange).toHaveBeenCalledWith(CITIES[1]); // 大阪
  });

  it("disabled=true のとき全ボタンが無効化される", () => {
    render(<CitySelector {...defaultProps} disabled={true} />);
    for (const city of CITIES) {
      expect(screen.getByRole("button", { name: city.name })).toBeDisabled();
    }
  });

  it("disabled=true のときクリックしても onCityChange が呼ばれない", async () => {
    const user = userEvent.setup();
    const onCityChange = vi.fn();
    render(
      <CitySelector {...defaultProps} disabled={true} onCityChange={onCityChange} />
    );

    await user.click(screen.getByRole("button", { name: "大阪" }));
    expect(onCityChange).not.toHaveBeenCalled();
  });

  it("disabled=false のとき全ボタンが有効", () => {
    render(<CitySelector {...defaultProps} disabled={false} />);
    for (const city of CITIES) {
      expect(screen.getByRole("button", { name: city.name })).not.toBeDisabled();
    }
  });

  it("大阪を selectedCity にするとそのボタンが aria-pressed='true'", () => {
    render(<CitySelector {...defaultProps} selectedCity={CITIES[1]} />);
    expect(screen.getByRole("button", { name: "大阪" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "東京" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("那覇をクリックすると那覇の City オブジェクトで onCityChange が呼ばれる", async () => {
    const user = userEvent.setup();
    const onCityChange = vi.fn();
    render(<CitySelector {...defaultProps} onCityChange={onCityChange} />);

    await user.click(screen.getByRole("button", { name: "那覇" }));
    expect(onCityChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "那覇", latitude: 26.2124, longitude: 127.6809 })
    );
  });
});
