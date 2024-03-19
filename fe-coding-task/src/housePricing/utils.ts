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

export const getQueryParams = (): FormInput | false => {
  const queryParams = new URLSearchParams(window.location.search);
  const houseTypes = queryParams.get("houseTypes");
  const startQuarter = queryParams.get("start");
  const endQuarter = queryParams.get("end");

  if (!houseTypes || !startQuarter || !endQuarter) {
    return false
  }

  const houseTypesArr = houseTypes.split(",");

  if (houseTypesArr.some((el) => !Object.keys(HouseTypes).includes(el))) {
    return false
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
