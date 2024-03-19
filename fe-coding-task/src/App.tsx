import "./App.css";
import { HousePricing } from "./housePricing/HousePricing";
import { getQueryParams } from "./housePricing/utils";

function App() {
  try {
    const formValues = getQueryParams();
    return <HousePricing formValues={formValues} />;
  } catch (error) {
    return <HousePricing />;
  }
}

export default App;
