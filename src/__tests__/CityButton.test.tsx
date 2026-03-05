import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CityButton from "../app/components/atoms/CityButton";

describe("CityButton", () => {
  it("都市名が表示される", () => {
    render(<CityButton cityName="東京" />);
    expect(screen.getByRole("button", { name: "東京" })).toBeInTheDocument();
  });

  it("デフォルトで aria-pressed='false'", () => {
    render(<CityButton cityName="東京" />);
    expect(screen.getByRole("button", { name: "東京" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("isSelected=true のとき aria-pressed='true'", () => {
    render(<CityButton cityName="大阪" isSelected={true} />);
    expect(screen.getByRole("button", { name: "大阪" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("クリックすると onClick が呼ばれる", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CityButton cityName="札幌" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "札幌" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled=true のとき無効化される", () => {
    render(<CityButton cityName="福岡" disabled={true} />);
    expect(screen.getByRole("button", { name: "福岡" })).toBeDisabled();
  });

  it("disabled=true のときクリックしても onClick が呼ばれない", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CityButton cityName="那覇" disabled={true} onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "那覇" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
