import { BarChart } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

const SummaryCard = ({ label, value, icon = <BarChart className="w-6 h-6 text-primary" /> }: SummaryCardProps) => (
  <div className="card bg-base-100 shadow-md border border-base-300">
    <div className="card-body flex flex-col items-center text-center px-4 py-6 gap-2">
      <div className="bg-base-200 rounded-full p-2">{icon}</div>
      <p className="text-sm text-base-content/70">{label}</p>
      <p className="text-3xl font-bold text-base-content">{value.toLocaleString()}</p>
    </div>
  </div>
);

export default SummaryCard;
