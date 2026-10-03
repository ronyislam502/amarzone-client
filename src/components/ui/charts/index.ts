export * from "./LineChart";
export { default as LineChart } from "./LineChart";

export * from "./BarChart";
export { default as BarChart } from "./BarChart";

export * from "./PieChart";
export { default as PieChart, DonutChart } from "./PieChart";

export * from "./RadialGaugeChart";
export { default as RadialGaugeChart, GaugeChart } from "./RadialGaugeChart";

// Re-export core Recharts primitives for direct usage across the client
export {
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  CartesianAxis,
  Area,
  AreaChart,
  RadialBar,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
} from "recharts";
