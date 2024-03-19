import {
  Autocomplete,
  Box,
  Button,
  Container,
  Drawer,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { QuarterInput } from "./QuarterInput";
import { SearchHistory } from "./SearchHistory";
import { HousingPriceChart } from "./housingPriceChart";
import {
  ApiHouseTypes,
  FormInput,
  HistoryType,
  HouseTypes,
} from "./housingTypes";
import { useLocalStorage } from "./useLocalStorage";
import {
  apiClientFactory,
  buildQueryBody,
  generateRandomColors,
  getQuarterValuesInRange,
  isDateRangeGreater,
  prepareGraphData,
  updateURL,
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
  formValues?: FormInput | null;
}

export const HousePricing: React.FC<Props> = ({ formValues }) => {
  const [chartSeries, setChartSeries] = useState<
    Array<{ data: number[]; label: string }>
  >([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useLocalStorage<HistoryType>(
    LS_HISTORY_KEY,
    []
  );
  const { data, mutate } = useMutation(async (postData: string) => {
    const { data } = await apiClient.post(TABLE, postData);
    return data;
  });

  const { setValue, getValues, handleSubmit, register } = useForm<FormInput>({
    defaultValues: formValues ?? defaultValues,
  });

  const options = Object.entries(HouseTypes).map(([key, { label }]) => ({
    apiType: key as ApiHouseTypes,
    label,
  }));

  const submitData = async ({
    endQuarter,
    houseTypes,
    startQuarter,
  }: FormInput) => {
    if (isDateRangeGreater(startQuarter, endQuarter)) {
      alert("Invalid range");
      return;
    }

    const postData = buildQueryBody(
      houseTypes,
      getQuarterValuesInRange(startQuarter, endQuarter)
    );

    mutate(postData);
  };

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

  const onSubmit = async (postData: FormInput) => {
    try {
      await submitData(postData);
      afterSubmit();
    } catch (error) {}
  };

  const colors = useMemo(
    () => generateRandomColors(chartSeries.length),
    [chartSeries]
  );

  const toggleDrawer = (newOpen: boolean) => () => {
    setHistoryOpen(newOpen);
  };

  useEffect(() => {
    if (data) {
      const { datasets, labels } = prepareGraphData(data);
      setChartSeries(datasets);
      setChartLabels(labels);
    }
  }, [data]);

  useEffect(() => {
    if (formValues) submitData(formValues);
  }, [formValues]);

  return (
    <Container>
      <Box marginTop={2} width={'100%'}>
        <HousingPriceChart
          labels={chartLabels}
          datasets={chartSeries}
          colors={colors}
          xLabel="Quarters"
          yLabel="Cost per square meter"
        />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="start"
          width="100%"
          gap={2}
          marginTop={2}
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
            setValue={(quarter) => setValue("startQuarter", quarter)}
          />
          <QuarterInput
            label="To"
            minYear={2009}
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
        sx={{ maxHeight: "30vh", overflowY: "scroll" }}
        anchor={"bottom"}
        open={historyOpen}
        onClose={toggleDrawer(false)}
      >
        <SearchHistory history={history} />
      </Drawer>
    </Container>
  );
};
