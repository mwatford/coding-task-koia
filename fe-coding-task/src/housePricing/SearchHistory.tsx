import { Box } from "@mui/material";
import { FormInput } from "./housingTypes";

export const SearchHistory: React.FC<{ history: FormInput[] }> = ({
  history,
}) => {
  return (
    <Box sx={{ marginX: 2 }}>
      {history.map((el) => (
        <p>{JSON.stringify(el)}</p>
      ))}
    </Box>
  );
};
