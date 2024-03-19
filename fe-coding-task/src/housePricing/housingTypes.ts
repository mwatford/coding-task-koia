export const HouseTypes = {
  "00": {
    label: "Total"
  },
  "02": {
    label: "Small"
  },
  "03": {
    label: "Block Apartments"
  },
} as const;

export type Quarter = "K1" | "K2" | "K3" | "K4";

export type ApiHouseTypes = keyof typeof HouseTypes

export interface FormInput {
  houseTypes: ApiHouseTypes[];
  startQuarter: string;
  endQuarter: string;
}
