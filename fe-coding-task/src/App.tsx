import "./App.css";
import { HousePricing } from "./housePricing/HousePricing";
import { getQueryParams } from "./housePricing/utils";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  const formValues = getQueryParams();

  return (
    <QueryClientProvider client={queryClient}>
      <HousePricing formValues={formValues} />
    </QueryClientProvider>
  );
}

export default App;
