import { render, screen } from "@testing-library/react";

import { SearchHistory } from "../SearchHistory";
import { HistoryType } from "../housingTypes";

describe("SearchHistory", () => {
  const history = [
    {
      date: "test date 1",
      startQuarter: "2020K1",
      endQuarter: "2024K1",
      houseTypes: ["02"],
    },
    {
      date: "test date 2",
      startQuarter: "2020K1",
      endQuarter: "2024K1",
      houseTypes: ["00"],
    },
  ] as HistoryType;

  it("should render correct amount of history entries", () => {
    render(<SearchHistory history={history} />);

    expect(screen.getAllByTestId("history-entry").length).toBe(2);
  });
});
