import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";
import { FaBars } from "react-icons/fa";

import {
  groupByCategory,
  groupByPeriod,
  calculateStatistics,
  getColorByType,
  getSymbolByCategory,
  filterDataByPeriod,
} from "./dataUtils";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

interface Transaction {
  date: string;
  value: number;
  type: string;
  category: string;
}

type ChartType = "grouped" | "scatter" | "histogram" | "line";

const AboutSection: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType>("scatter");
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});
  const [stats, setStats] = useState<any>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          "https://sandbox.belvo.com/api/transactions/",
          {
            link: "f17e77e9-985c-4f0d-8359-3487bd44169e",
            date_from: "2024-02-05",
            date_to: "2024-06-05",
          },
          {
            headers: {
              Authorization: `Basic ${btoa(
                "752e5970-4677-492f-a0df-bfb99236071e:1IzmPNWimznBcYu042gI#yHTS*42--zP7mt5wSqSpM5DwWe1ms6im6FR8q2oa3gR"
              )}`,
              "Content-Type": "application/json",
            },
          }
        );

        const fetchedData = response.data;
        console.log("Response:", fetchedData);

        const processedData = fetchedData.map((item: any) => ({
          date: item.created_at,
          value: item.amount,
          type: item.type,
          category: item.category,
        }));

        setData(processedData);
      } catch (error) {
        setError("Error fetching data from API");
        console.error("Error making request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const filteredData = filterDataByPeriod(data, selectedPeriod);

    // Ordena los datos por fecha
    const sortedData = filteredData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const statistics = calculateStatistics(filteredData);
    setStats(statistics);

    // Datos para gráfico de dispersión
    const scatterData = sortedData.map((transaction) => ({
      x: new Date(transaction.date).getTime(),
      y: transaction.value,
      marker: {
        radius: transaction.value / 1000,
        fillColor: getColorByType(transaction.type),
        symbol: getSymbolByCategory(transaction.category),
      },
      name: transaction.type,
    }));

    // Datos para gráfico de histograma
    const periodGroupedData = groupByPeriod(filteredData, selectedPeriod);
    const histogramData = Object.entries(periodGroupedData).map(
      ([period, values]) => ({
        name: period,
        y: Array.isArray(values) ? values.length : 0,
      })
    );

    // Datos para gráfico agrupado
    const groupedData = groupByCategory(filteredData);
    const groupedOptions: Highcharts.Options = {
      chart: { type: "line" },
      title: { text: "Transactions Over Time by Category" },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
        labels: {
          format: "{value:%Y-%m-%d}",
          style: { fontSize: "0.9rem" },
        },
      },
      yAxis: { title: { text: "Value" } },
      series: Object.keys(groupedData).map((category) => ({
        type: "line",
        name: category,
        data: groupedData[category].map((item: any) => [
          new Date(item[0]).getTime(),
          item[1],
        ]),
      })),
    };

    // Opciones del gráfico de dispersión
    const scatterOptions: Highcharts.Options = {
      chart: { type: "scatter" },
      title: { text: "Transaction Scatter Plot with Connecting Line" },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
        labels: {
          format: "{value:%Y-%m-%d}",
          style: { fontSize: "0.9rem" },
        },
      },
      yAxis: {
        title: { text: "Value" },
        startOnTick: false,
        endOnTick: false,
        showLastLabel: true,
      },
      series: [
        {
          type: "scatter",
          data: scatterData,
          name: "Transactions",
        },
        {
          type: "line",
          data: scatterData,
          name: "Trend Line",
          color: "blue",
          dashStyle: "Solid",
          enableMouseTracking: false,
        },
      ],
    };

    // Opciones del gráfico de histograma
    const histogramOptions: Highcharts.Options = {
      chart: { type: "column" },
      title: { text: "Transactions Histogram by Period" },
      xAxis: {
        categories: Object.keys(periodGroupedData),
        title: { text: "Period" },
        labels: {
          style: { fontSize: "0.9rem" },
        },
      },
      yAxis: { title: { text: "Number of Transactions" } },
      series: [
        {
          type: "column",
          name: "Transactions",
          data: histogramData,
        },
      ],
    };

    // Opciones del gráfico de líneas
    const lineOptions: Highcharts.Options = {
      chart: { type: "line" },
      title: { text: "Transaction Trends Over Time" },
      xAxis: {
        type: "datetime",
        title: { text: "Date" },
        labels: {
          format: "{value:%Y-%m-%d}",
          style: { fontSize: "0.9rem" },
        },
      },
      yAxis: { title: { text: "Value" } },
      series: [
        {
          type: "line",
          name: "Transaction Trends",
          data: sortedData
            .map((transaction) => [
              new Date(transaction.date).getTime(),
              transaction.value,
            ])
            .sort((a, b) => a[0] - b[0]),
        },
      ],
    };

    setStats(calculateStatistics(filteredData));

    switch (selectedChart) {
      case "scatter":
        setChartOptions(scatterOptions);
        break;
      case "histogram":
        setChartOptions(histogramOptions);
        break;
      case "grouped":
        setChartOptions(groupedOptions);
        break;
      case "line":
        setChartOptions(lineOptions);
        break;
      default:
        setChartOptions(scatterOptions);
    }
  }, [data, selectedChart, selectedPeriod]);

  if (loading) return <p className="mt-4 text-blue-500">Loading...</p>;
  if (error) return <p className="mt-4 text-red-500">{error}</p>;

  return (
    <section
      id="about"
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center mb-4">
          <h2 className="text-2xl font-bold text-center w-full">Data Charts</h2>
        </div>
        <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button
              onClick={() => setSelectedChart("scatter")}
              className={`py-2 px-4 rounded-lg ${
                selectedChart === "scatter"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Scatter
            </button>
            <button
              onClick={() => setSelectedChart("histogram")}
              className={`py-2 px-4 rounded-lg ${
                selectedChart === "histogram"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Histogram
            </button>
            <button
              onClick={() => setSelectedChart("grouped")}
              className={`py-2 px-4 rounded-lg ${
                selectedChart === "grouped"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Grouped
            </button>
            <button
              onClick={() => setSelectedChart("line")}
              className={`py-2 px-4 rounded-lg ${
                selectedChart === "line"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Line
            </button>
          </div>
          <select
            className="p-2 border rounded-lg"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <div className="mt-6 p-6 bg-gray-50 shadow-lg rounded-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Statistics
          </h3>
          <table className="min-w-full divide-y divide-gray-300 bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">
                  Statistic
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-gray-700">Mean</td>
                <td className="py-2 px-4 text-gray-900">
                  {stats.mean || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Median</td>
                <td className="py-2 px-4 text-gray-900">
                  {stats.median || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Mode</td>
                <td className="py-2 px-4 text-gray-900">
                  {stats.mode || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Standard Deviation</td>
                <td className="py-2 px-4 text-gray-900">
                  {stats.stdDev || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Variance</td>
                <td className="py-2 px-4 text-gray-900">
                  {stats.variance || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-gray-700">Range</td>
                <td className="py-2 px-4 text-gray-900">
                  {stats.range || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        ;
      </div>
    </section>
  );
};

export default AboutSection;
