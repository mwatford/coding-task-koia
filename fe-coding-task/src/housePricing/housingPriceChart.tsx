import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  labels: string[];
  xLabel: string;
  yLabel: string;
  datasets: { data: number[]; label: string }[];
  colors: string[];
}

export const HousingPriceChart: React.FC<Props> = ({
  labels,
  datasets,
  xLabel,
  yLabel,
  colors,
}) => {
  const data = {
    labels,
    datasets: datasets.map((el, index) => ({
      ...el,
      tension: 0.3,
      borderColor: colors.at(index),
      pointBackgroundColor: colors.at(index),
    })),
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yLabel,
        },
      },
      x: {
        title: {
          display: true,
          text: xLabel,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
