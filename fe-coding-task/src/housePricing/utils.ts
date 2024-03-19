import { Axios } from "axios";
import { ApiHouseTypes, FormInput, HouseTypes } from "./housingTypes";

export function getQuarterValuesInRange(start: string, end: string): string[] {
  const isValidInput = (input: string) => {
    const [year, quarter] = input.split("K");
    return parseInt(year) && parseInt(quarter) < 5;
  };

  if (!isValidInput(start) || !isValidInput(end)) {
    throw new Error(
      "invalid range: Your range start and end should be in correct format YYYYKQ"
    );
  }

  const quarters = [];
  const [startYear, startQuarter] = start.split("K");
  let quarter = parseInt(startQuarter);
  let year = parseInt(startYear);

  while (quarters.at(-1) !== end) {
    quarters.push(`${year}K${quarter}`);
    if (quarter + 1 > 4) {
      year++;
      quarter = 1;
    } else {
      quarter++;
    }
  }

  return quarters;
}

export const generateRandomColors = (count: number) => {
  const result = [];

  for (let i = 0; i <= count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    result.push(`rgb(${r}, ${g}, ${b})`);
  }

  return result;
};

export function apiClientFactory(baseURL: string, apiVersion: string) {
  return new Axios({
    baseURL: `${baseURL}/${apiVersion}/no/table/`,
    headers: { "Content-Type": "application/json" },
  });
}

export function buildQueryBody(
  filterTypes: ApiHouseTypes[],
  selectedQuarters: string[]
) {
  return JSON.stringify({
    query: [
      {
        code: "Boligtype",
        selection: {
          filter: "item",
          values: filterTypes,
        },
      },
      {
        code: "ContentsCode",
        selection: {
          filter: "item",
          values: ["KvPris"],
        },
      },
      {
        code: "Tid",
        selection: {
          filter: "item",
          values: selectedQuarters,
        },
      },
    ],
    response: {
      format: "json-stat2",
    },
  });
}

export function validateCommon(year: number, quarter: number) {
  const YEAR_LIMIT = 2009;
  const errorMessage = "Your date is out of range, please select a valid date";
  if (!year || year < YEAR_LIMIT) {
    throw "Invalid year! choose a year starting from 2009";
  }
  const currentYear = new Date().getFullYear();
  if (year > currentYear) {
    throw "Your date is out of range, please select a valid date";
  }
  const currentQuarter = getCurrentQuarter();
  if (year === currentYear && quarter > currentQuarter) {
    throw errorMessage;
  }
  return true;
}

export const getCurrentQuarter = () =>
  Math.ceil((new Date().getMonth() + 1) / 4);

export const validateStartInput = (year: number, quarter: number) => {
  validateCommon(year, quarter);

  return true;
};

export function isDateRangeGreater(date1: string, date2: string) {
  const [year1, quarter1] = date1.split("K");
  const [year2, quarter2] = date2.split("K");

  if (year1 > year2) {
    return true;
  } else if (year1 < year2) {
    return false;
  } else {
    return quarter1 > quarter2;
  }
}

export const validateEndInput =
  (startQuarter: string) => (year: number, quarter: number) => {
    validateCommon(year, quarter);
    if (!isDateRangeGreater(`${year}K${quarter}`, startQuarter)) {
      throw "Ending value should be greater than starting value.";
    }
    return true;
  };

export function splitArrayIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

export const getQueryParams = (): FormInput => {
  const queryParams = new URLSearchParams(window.location.search);
  const houseTypes = queryParams.get("houseTypes");
  const startQuarter = queryParams.get("start");
  const endQuarter = queryParams.get("end");

  if (!houseTypes || !startQuarter || !endQuarter) {
    throw "Missing values in url";
  }

  const houseTypesArr = houseTypes.split(",");

  if (houseTypesArr.some((el) => !Object.keys(HouseTypes).includes(el))) {
    throw "Invalid house types in url";
  }

  return {
    houseTypes: houseTypesArr as ApiHouseTypes[],
    endQuarter,
    startQuarter,
  };
};

export const updateURL = (start: string, end: string, houseTypes: string[]) => {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set("start", start);
  currentURL.searchParams.set("end", end);
  currentURL.searchParams.set("houseTypes", houseTypes.join(","));
  window.history.replaceState({}, "", currentURL);
};

export const prepareGraphData = (data: string) => {
  const { dimension, value } = JSON.parse(data);

  const labels = Object.values(
    dimension["Tid"]["category"]["label"]
  ) as string[];

  const categories = dimension.Boligtype.category.index as Record<
    ApiHouseTypes,
    number
  >;

  const sortedCategoryNames = (
    Object.entries(categories) as [ApiHouseTypes, number][]
  )
    .sort(([_keyA, valA], [_keyB, valB]) => valA - valB)
    .map(([houseType]) => HouseTypes[houseType]?.label);

  if (value.length % sortedCategoryNames.length !== 0) {
    throw "error in data";
  }
  const chunks = splitArrayIntoChunks(
    value,
    value.length / sortedCategoryNames.length
  ) as number[][];

  const datasets = chunks.map((el, index) => ({
    data: el,
    label: sortedCategoryNames[index],
  }));

  return { datasets, labels };
};
