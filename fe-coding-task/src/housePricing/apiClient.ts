import { Axios } from "axios";
import { ApiHouseTypes } from "./housingTypes";

export function apiClientFactory(baseURL: string, apiVersion: string) {
  return new Axios({
    baseURL: `${baseURL}/${apiVersion}/no/table/`,
    headers: { "Content-Type": "application/json" },
  });
}

export function getPostQuery(
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