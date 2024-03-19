import { getQuarterValuesInRange } from "../utils";

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
