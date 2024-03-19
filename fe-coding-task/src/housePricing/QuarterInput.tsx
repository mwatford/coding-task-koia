import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface Props {
  label: string;
  minYear: number;
  setValue: (input: string) => void;
  validate?: (year: number, quarter: number) => boolean;
  disabled?: boolean;
}

export function QuarterInput({
  label,
  minYear,
  validate,
  setValue,
  disabled = false,
}: Props) {
  const [year, setYear] = useState(minYear.toString());
  const [quarter, setQuarter] = useState("K1");
  const [error, setError] = useState("");

  const computedQuarterValue = year + quarter;

  const yearOptions = useMemo(() => {
    const result = [];
    const end = new Date().getFullYear();
    for (let i = minYear; i <= end; i++) {
      result.push(i.toString());
    }
    return result;
  }, []);

  useEffect(() => {
    try {
      if (!year || !quarter) return;
      if (!validate) return setValue(computedQuarterValue);

      setValue(computedQuarterValue);
      validate(parseInt(year), parseInt(quarter));
      setError("");
    } catch (error) {
      setError(error as string);
    }
  }, [year, quarter]);

  return (
    <Box display="flex" flexDirection="column">
      <InputLabel>{label}</InputLabel>
      <Box display="flex" flexDirection="row" gap="2" marginTop={1}>
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {yearOptions.map((yr) => (
              <MenuItem value={yr} key={yr}>
                {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Quarter</InputLabel>
          <Select
            label="Quarter"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            disabled={disabled}
            required
          >
            {["1", "2", "3", "4"].map((quarter) => (
              <MenuItem value={`K${quarter}`} key={quarter}>
                {quarter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {error.length > 0 && error}
    </Box>
  );
}
