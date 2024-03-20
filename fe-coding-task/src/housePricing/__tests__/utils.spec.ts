import { getQuarterValuesInRange, isQuarterValueGreater } from "../utils";

describe("getQuarterValuesInRange", () => {
  it("should return an array of quarter values for a given range", () => {
    expect(getQuarterValuesInRange("1992K2", "1993K3")).toEqual([
      "1992K2",
      "1992K3",
      "1992K4",
      "1993K1",
      "1993K2",
      "1993K3",
    ]);
  });

  it("should throw an error for invalid quarter value", () => {
    expect(() => getQuarterValuesInRange("1992K5", "1994K3")).toThrow(
      /invalid range/gi
    );
  });
});

describe("isQuarterValueGreater", () => {
  it("should return true if the first argument is greater", () => {
    expect(isQuarterValueGreater("2020K3", "2020K1")).toBe(true);
  });

  it("should return false if the second argument is greater", () => {
    expect(isQuarterValueGreater("2020K3", "2021K1")).toBe(false);
  });

  it("should return false if the arguments are the same", () => {
    expect(isQuarterValueGreater("2020K3", "2020K3")).toBe(false);
  });
});
