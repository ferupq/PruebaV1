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
  const periods: any = {};
  data.forEach((item) => {
    let key: string;
    switch (period) {
      case "week":
        const date = new Date(item.date);
        const startOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        key = `${startOfWeek.getFullYear()}-W${Math.ceil((date.getDate() + 1) / 7)}`;
        break;
      case "day":
        key = item.date.split("T")[0]; // Solo la fecha sin hora
        break;
      case "month":
      default:
        key = item.date.slice(0, 7); // Año y mes
    }

    if (!periods[key]) {
      periods[key] = { total: 0, count: 0 };
    }
    periods[key].total += item.value;
    periods[key].count += 1;
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
        const weekStart = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        const week = Math.ceil(date.getDate() / 7);
        return date.toISOString().includes(`-W${week}`);
      case "day":
        // Asegúrate de que la fecha esté en el formato YYYY-MM-DD sin la hora
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
