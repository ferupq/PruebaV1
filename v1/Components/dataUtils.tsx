interface Transaction {
  date: string;
  value: number;
  type: string;
  category: string;
}

export const groupByCategory = (data: Transaction[]) => {
  return data.reduce((acc: any, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push([new Date(item.date).getTime(), item.value]);
    return acc;
  }, {});
};

export const getColorByType = (type: string): string => {
  switch (type) {
    case "income":
      return "#28a745"; // Verde para ingresos
    case "expense":
      return "#dc3545"; // Rojo para gastos
    default:
      return "#6c757d"; // Gris por defecto
  }
};

export const getSymbolByCategory = (category: string): string => {
  switch (category) {
    case "food":
      return "circle"; // Símbolo para comida
    case "transport":
      return "square"; // Símbolo para transporte
    case "entertainment":
      return "diamond"; // Símbolo para entretenimiento
    default:
      return "triangle"; // Símbolo por defecto
  }
};

export const groupByPeriod = (data: Transaction[], period: string) => {
  const periods: Record<string, any[]> = {};

  // Helper function to get the ISO week number
  const getISOWeek = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (period) {
      case "week":
        const weekNumber = getISOWeek(date);
        key = `${date.getFullYear()}-W${weekNumber}`;
        break;
      case "day":
        key = date.toISOString().split("T")[0]; // Solo la fecha en formato YYYY-MM-DD
        break;
      case "month":
      default:
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`; // Año y mes en formato YYYY-MM
    }

    if (!periods[key]) {
      periods[key] = [];
    }
    periods[key].push(item);
  });

  return periods;
};

// export const calculateStatistics = (data: Transaction[]) => {
//   const values = data.map((item) => item.value);
//   const totalAmount = values.reduce((acc, val) => acc + val, 0);
//   const averageAmount = totalAmount / values.length;
//   const maxAmount = Math.max(...values);
//   const minAmount = Math.min(...values);

//   return {
//     totalAmount,
//     averageAmount,
//     maxAmount,
//     minAmount,
//   };
// };

// Filter data by selected period
export const filterDataByPeriod = (data: Transaction[], period: string) => {
  return data.filter((item) => {
    const date = new Date(item.date);
    switch (period) {
      case "week":
        const week = Math.ceil(date.getDate() / 7);
        return date.toISOString().includes(`-W${week}`);
      case "day":
        return (
          item.date.split("T")[0] === new Date().toISOString().split("T")[0]
        );
      case "month":
      default:
        return item.date.startsWith(new Date().toISOString().slice(0, 7));
    }
  });
};

export const calculateStatistics = (data: Transaction[]) => {
  if (data.length === 0) return {};

  // Extrae los valores de las transacciones
  const values = data.map((transaction) => transaction.value);

  // Calcular la media
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;

  // Calcular la mediana
  const sortedValues = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sortedValues.length / 2);
  const median =
    sortedValues.length % 2 !== 0
      ? sortedValues[mid]
      : (sortedValues[mid - 1] + sortedValues[mid]) / 2;

  // Calcular la moda
  // Calcular la moda
  const frequency: Record<string, number> = {};
  values.forEach((val) => (frequency[val] = (frequency[val] || 0) + 1));
  const maxFrequency = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency).find(
    (key) => frequency[key] === maxFrequency
  );

  // Calcular la desviación estándar
  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  // Calcular el rango
  const range = Math.max(...values) - Math.min(...values);

  return {
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    mode: mode ? Number(mode).toFixed(2) : "N/A",
    stdDev: stdDev.toFixed(2),
    variance: variance.toFixed(2),
    range: range.toFixed(2),
  };
};
