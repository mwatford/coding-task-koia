import { ApiHouseTypes, HouseTypes } from "./housingTypes";
import { splitArrayIntoChunks } from "./utils";

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
