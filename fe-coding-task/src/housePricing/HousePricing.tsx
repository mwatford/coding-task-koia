import {
  Autocomplete,
  Box,
  Button,
  Container,
  Drawer,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { QuarterInput } from "./QuarterInput";
import { SearchHistory } from "./SearchHistory";
import { HousingPriceChart } from "./housingPriceChart";
import { ApiHouseTypes, FormInput, HouseTypes } from "./housingTypes";
import { useLocalStorage } from "./useLocalStorage";
import {
  apiClientFactory,
  buildQueryBody,
  generateRandomColors,
  getQuarterValuesInRange,
  isDateRangeGreater,
  prepareGraphData,
  updateURL,
  validateEndInput,
  validateStartInput,
} from "./utils";

const BASE_URL = "https://data.ssb.no/api";
const TABLE = "07241";
const apiClient = apiClientFactory(BASE_URL, "v0");

const defaultValues = {
  HouseTypes: [] as ApiHouseTypes[],
  startQuarter: "2009K1",
  endQuarter: "2010K1",
};

const LS_HISTORY_KEY = "search-history";

interface Props {
  formValues?: FormInput;
}

export const HousePricing: React.FC<Props> = ({ formValues }) => {
  const [chartSeries, setChartSeries] = useState<
    Array<{ data: number[]; label: string }>
  >([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useLocalStorage<
    Array<FormInput & { date: string }>
  >(LS_HISTORY_KEY, []);

  const options = Object.entries(HouseTypes).map(([key, { label }]) => ({
    apiType: key as ApiHouseTypes,
    label,
  }));
  const { setValue, getValues, handleSubmit, register } = useForm<FormInput>({
    defaultValues: formValues ?? defaultValues,
  });

  const afterSubmit = () => {
    const { endQuarter, houseTypes, startQuarter } = getValues();
    updateURL(startQuarter, endQuarter, houseTypes);

    const val = confirm("Do you want to save this search in a history?");

    if (val) {
      setHistory([
        ...history,
        {
          date: new Date().toISOString(),
          startQuarter,
          endQuarter,
          houseTypes,
        },
      ]);
    }
  };

  const submitData = async ({
    endQuarter,
    houseTypes,
    startQuarter,
  }: FormInput) => {
    try {
      if (isDateRangeGreater(startQuarter, endQuarter)) {
        alert("Invalid range");
        return;
      }
      const body = buildQueryBody(
        houseTypes,
        getQuarterValuesInRange(startQuarter, endQuarter)
      );

      const { data } = await apiClient.post(TABLE, body);
      const { datasets, labels } = prepareGraphData(data);

      setChartSeries(datasets);
      setChartLabels(labels);
    } catch (error) {
      alert("something went wrong, try again later");
    }
  };

  const onSubmit = async (data: FormInput) => {
    await submitData(data)
    afterSubmit()
  }

  const colors = useMemo(
    () => generateRandomColors(chartSeries.length),
    [chartSeries]
  );

  const toggleDrawer = (newOpen: boolean) => () => {
    setHistoryOpen(newOpen);
  };

  return (
    <Container>
      <HousingPriceChart
        labels={chartLabels}
        datasets={chartSeries}
        colors={colors}
        xLabel="Quarters"
        yLabel="Cost per square meter"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          width="100%"
          gap={2}
        >
          <Autocomplete
            {...register("houseTypes", {
              validate: (value) => value.length > 0 || "Select a house type",
            })}
            multiple
            limitTags={2}
            options={options}
            getOptionLabel={(option) => option.label}
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label="House Type" />
            )}
            onChange={(_e, newValue) =>
              setValue(
                "houseTypes",
                newValue.map((el) => el.apiType)
              )
            }
          />
          <QuarterInput
            label="From"
            minYear={2009}
            validate={validateStartInput}
            setValue={(quarter) => setValue("startQuarter", quarter)}
          />
          <QuarterInput
            label="To"
            minYear={2009}
            validate={validateEndInput(getValues("startQuarter"))}
            setValue={(quarter) => setValue("endQuarter", quarter)}
          />
        </Box>
        <Button type="submit" variant="outlined" sx={{ marginTop: 2 }}>
          Submit
        </Button>
      </form>
      <Button
        onClick={toggleDrawer(true)}
        variant="outlined"
        sx={{ marginTop: 2 }}
      >
        Open history
      </Button>
      <Drawer
        anchor={"bottom"}
        open={historyOpen}
        onClose={toggleDrawer(false)}
      >
        <SearchHistory history={history} />
      </Drawer>
    </Container>
  );
};
