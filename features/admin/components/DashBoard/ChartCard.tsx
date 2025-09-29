import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartCardProps {
    title: string;
    type: "bar" | "line" | "donut";
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    options: ApexCharts.ApexOptions;
}

const ChartCard = ({ title, type, series, options }: ChartCardProps) => (
    <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body px-4 py-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-base-content">{title}</h2>
            </div>
            <Chart
                type={type}
                height={320}
                series={series}
                options={{
                    ...options,
                    chart: {
                        ...options.chart,
                        foreColor: "oklch(var(--bc))",
                        fontFamily: "inherit",
                    },
                    legend: {
                        labels: {
                            colors: ["oklch(var(--bc))"],
                        },
                    },

                }}
            />
        </div>
    </div>
);

export default ChartCard;
