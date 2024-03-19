import { Box } from "@mui/material";
import { HistoryType } from "./housingTypes";

export const SearchHistory: React.FC<{ history: HistoryType }> = ({
  history,
}) => {
  return (
    <Box sx={{ margin: 2, maxHeight: "30vh" }}>
      {history.map((el) => (
        <p key={el.date} style={{ wordWrap: "break-word" }}>
          {JSON.stringify(el)}
        </p>
      ))}
    </Box>
  );
};
