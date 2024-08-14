import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import HighchartsMore from "highcharts/highcharts-more";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsDarkMode from "highcharts/themes/dark-unica";
import HighchartsXRange from "highcharts/modules/xrange";
import dotenv from "dotenv";

// Initialize Highcharts modules

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
  HighchartsMore(Highcharts);
  HighchartsHeatmap(Highcharts);
  HighchartsAccessibility(Highcharts);
  HighchartsExporting(Highcharts);
  HighchartsExportData(Highcharts);
  HighchartsDarkMode(Highcharts);
  HighchartsXRange(Highcharts);
}

interface DataPoint {
  id: string;
  account: Account;
  created_at: string;
  category?: string;
  type: string;
  amount: number;
  status: string;
  balance: number;
  currency: string;
  reference: string;
  value_date: string;
  description: string;
  collected_at: string;
  observations: any;
  accounting_date: string;
  internal_identification: string;
}

interface Account {
  id: string;
  link: string;
  institution: Institution;
  created_at: string;
  collected_at: string;
  currency: string;
  category: string;
  type: string;
  number: string;
  agency: string;
  bank_product_id: string;
  internal_identification: string;
  public_identification_name: string;
  public_identification_value: string;
  credit_data?: CreditData;
  loan_data?: LoanData;
  name: string;
  balance: Balance;
  last_accessed_at: string;
  balance_type: string;
}

interface Institution {
  name: string;
  type: string;
}

interface CreditData {
  collected_at: string;
  credit_limit: number;
  cutting_date: string;
  next_payment_date: string;
  minimum_payment: number;
  monthly_payment: number;
  no_interest_payment: number;
  last_payment_date: string;
  last_period_balance: number;
  interest_rate: number;
}

interface LoanData {
  collected_at: string;
  credit_limit: number;
  cutting_day: string;
  cutting_date: string;
  next_payment_date: string;
  limit_date: string;
  limit_day: string;
  monthly_payment: any;
  no_interest_payment: any;
  last_payment_date: string;
  last_period_balance: any;
  interest_rate: any;
  principal: any;
  loan_type: any;
  payment_due_day: any;
  outstanding_balance: any;
  outstanding_principal: any;
  number_of_installments_total: any;
  number_of_installments_outstanding: any;
  contract_start_date: any;
  contract_number: any;
  interest_rates: any;
  fees: any;
}

interface Balance {
  current: number;
  available: number;
}

const DataVisualization: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("scatter");
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([
    "Online Platforms & Leisure",
    "Bills & Utilities",
    "Personal Shopping",
    "Home & Life",
    "Credits & Loans",
  ]);
  const [types, setTypes] = useState<string[]>(["INFLOW", "OUTFLOW"]);
  const [statuses, setStatuses] = useState<string[]>(["PENDING", "PROCESSED"]);

  dotenv.config();

  const mySecretKey = process.env.BELVO_KEY;

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
            date_to: "2024-05-05",
          },
          {
            headers: {
              Authorization: `Basic ${btoa(`${mySecretKey}:`)}`,
              "Content-Type": "application/json",
            },
          }
        );

        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters to the fetched data
    const applyFilters = () => {
      const result = data.filter((item) => {
        return (
          (!category || item.category === category) &&
          (!transactionType || item.type === transactionType) &&
          (!status || item.status === status)
        );
      });

      setFilteredData(result);
    };

    applyFilters();
  }, [transactionType, category, status, data]);

  // Prepare data for scatter plot
  const scatterData = filteredData.map((item) => ({
    x: new Date(item.created_at).getTime(),
    y: item.amount,
    z: item.amount, // Size of marker
    color: item.type === "INFLOW" ? "#7cb5ec" : "#f15c80", // Updated colors
    name: item.category || "Unknown",
  }));

  // Prepare data for histogram
  const histogramData = filteredData.reduce(
    (acc, item) => {
      const period = new Date(item.created_at).toISOString().split("T")[0]; // Daily bins
      if (!acc[period]) acc[period] = 0;
      acc[period] += 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  // Exclude today's date from histogram data
  const today = new Date().toISOString().split("T")[0];
  delete histogramData[today];

  const histogramSeries = Object.keys(histogramData).map((key) => ({
    name: key,
    data: [histogramData[key]],
  }));

  // Create chart options
  const scatterOptions: Highcharts.Options = {
    chart: {
      type: "bubble",
      backgroundColor: "#ffffff", // Ensure background is white
    },
    title: {
      text: "Scatter Plot",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        data: scatterData,
        type: "bubble",
        name: "Transactions",
        marker: {
          fillOpacity: 0.7,
          lineWidth: 0,
          radius: 5,
        },
      },
    ],
  };

  const histogramOptions: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "#ffffff", // Ensure background is white
    },
    title: {
      text: "Comparative Histogram",
    },
    xAxis: {
      categories: Object.keys(histogramData),
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Frequency",
      },
    },
    series: histogramSeries.map((series) => ({
      ...series,
      type: "column",
    })),
  };

  const timeSeriesOptions: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "#ffffff", // Ensure background is white
    },
    title: {
      text: "Time Series Analysis",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Amount",
      },
    },
    series: [
      {
        data: scatterData.map((point) => [point.x, point.y]),
        type: "line",
        name: "Amount over Time",
      },
    ],
  };

  return (
    <section id="about">
      <div className="p-10">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Transaction Filters</h1>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-white">Choose</label>
              <select
                value={transactionType || ""}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full bg-white text-black rounded p-2"
              >
                <option value="">All</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-black">Category:</label>
              <select
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-black rounded p-2"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-white">Status:</label>
              <select
                value={status || ""}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white text-black rounded p-2"
              >
                <option value="">All</option>
                {statuses.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-4">
            <button
              onClick={() => setActiveTab("scatter")}
              className={`p-2 rounded ${
                activeTab === "scatter"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200  text-black"
              }`}
            >
              Scatter Plot
            </button>
            <button
              onClick={() => setActiveTab("histogram")}
              className={`p-2 rounded ${
                activeTab === "histogram"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Histogram
            </button>
            <button
              onClick={() => setActiveTab("timeSeries")}
              className={`p-2 rounded ${
                activeTab === "timeSeries"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Time Series
            </button>
          </div>
        </div>
        <div>
          {loading && <p>Fetching data, please wait a sec.... </p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <>
              {activeTab === "scatter" && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={scatterOptions}
                />
              )}
              {activeTab === "histogram" && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={histogramOptions}
                />
              )}
              {activeTab === "timeSeries" && (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={timeSeriesOptions}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataVisualization;
