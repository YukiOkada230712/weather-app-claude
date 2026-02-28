import { describe, it, expect } from "vitest";
import { CITIES, type City } from "../app/types";

describe("CITIES", () => {
  it("5都市が定義されている", () => {
    expect(CITIES).toHaveLength(5);
  });

  it("各都市がname/latitude/longitudeを持つ", () => {
    for (const city of CITIES) {
      expect(city).toHaveProperty("name");
      expect(city).toHaveProperty("latitude");
      expect(city).toHaveProperty("longitude");
      expect(typeof city.name).toBe("string");
      expect(typeof city.latitude).toBe("number");
      expect(typeof city.longitude).toBe("number");
    }
  });

  it("都市名が正しい", () => {
    const names = CITIES.map((c) => c.name);
    expect(names).toEqual(["東京", "大阪", "札幌", "福岡", "那覇"]);
  });

  it("東京の座標が正しい", () => {
    const tokyo = CITIES.find((c) => c.name === "東京");
    expect(tokyo).toBeDefined();
    expect(tokyo!.latitude).toBe(35.6762);
    expect(tokyo!.longitude).toBe(139.6503);
  });

  it("大阪の座標が正しい", () => {
    const osaka = CITIES.find((c) => c.name === "大阪");
    expect(osaka!.latitude).toBe(34.6937);
    expect(osaka!.longitude).toBe(135.5023);
  });

  it("札幌の座標が正しい", () => {
    const sapporo = CITIES.find((c) => c.name === "札幌");
    expect(sapporo!.latitude).toBe(43.0618);
    expect(sapporo!.longitude).toBe(141.3545);
  });

  it("福岡の座標が正しい", () => {
    const fukuoka = CITIES.find((c) => c.name === "福岡");
    expect(fukuoka!.latitude).toBe(33.5902);
    expect(fukuoka!.longitude).toBe(130.4017);
  });

  it("那覇の座標が正しい", () => {
    const naha = CITIES.find((c) => c.name === "那覇");
    expect(naha!.latitude).toBe(26.2124);
    expect(naha!.longitude).toBe(127.6809);
  });

  it("緯度が有効な範囲内にある (-90〜90)", () => {
    for (const city of CITIES) {
      expect(city.latitude).toBeGreaterThanOrEqual(-90);
      expect(city.latitude).toBeLessThanOrEqual(90);
    }
  });

  it("経度が有効な範囲内にある (-180〜180)", () => {
    for (const city of CITIES) {
      expect(city.longitude).toBeGreaterThanOrEqual(-180);
      expect(city.longitude).toBeLessThanOrEqual(180);
    }
  });

  it("City型に適合する", () => {
    // TypeScriptの型チェックは build 時に行われるが、
    // ランタイムでもキーセットが正しいことを確認
    const expectedKeys: (keyof City)[] = ["name", "latitude", "longitude"];
    for (const city of CITIES) {
      for (const key of expectedKeys) {
        expect(city).toHaveProperty(key);
      }
    }
  });
});
