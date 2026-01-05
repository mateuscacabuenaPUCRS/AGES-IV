import { useState, useEffect } from "react";
import { ChartCard } from "@/components/charts/components/chart-card";
import { BaseAreaChart } from "@/components/charts/components/area-chart-component";
import type { ChartConfig } from "@/components/charts/components/chart";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { getRaisedByPeriod } from "@/services/metrics/raised-by-period";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};

const chartConfig = {
  total: { label: "Total", color: "#A9840C" },
} satisfies ChartConfig;

export const TotalArrecadadoChart = ({ period }: { period?: DateRange }) => {
  const [data, setData] = useState<Array<{ data: string; total: number }>>([]);
  const [monthSeparators, setMonthSeparators] = useState<{ x: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!period?.from || !period?.to) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getRaisedByPeriod(period.from, period.to);

        const periodData =
          response.daily?.data || response.weekly?.data || response.monthly?.data || [];

        const mappedData = periodData.map((item) => {
          let label = item.label;

          if (response.daily && item.label.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [, month, day] = item.label.split("-");
            label = `${day}/${month}`;
          }

          return {
            data: label,
            total: item.amount,
          };
        });

        setData(mappedData);

        if (response.daily) {
          const separators: { x: string }[] = [];
          let currentMonth: string | null = null;

          mappedData.forEach((item) => {
            const parts = item.data.split("/");
            if (parts.length === 2) {
              const month = parts[1];
              if (currentMonth !== null && month !== currentMonth) {
                separators.push({ x: item.data });
              }
              currentMonth = month;
            }
          });
          setMonthSeparators(separators);
        } else {
          setMonthSeparators([]);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do período:", err);
        setError("Não foi possível carregar os dados. Tente novamente.");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const formattedPeriod =
    period?.from && period?.to
      ? `${formatDate(period.from)} - ${formatDate(period.to)}`
      : "Nenhum período selecionado";

  const periodSelector = (
    <div className="flex items-center gap-2 text-sm text-gray-600 border rounded-md px-3 py-1 cursor-pointer">
      <CalendarIcon className="h-4 w-4" />
      <span>{formattedPeriod}</span>
    </div>
  );

  return (
    <ChartCard title="Total Arrecadado no Período" controls={periodSelector}>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Selecione um período para visualizar os dados</p>
        </div>
      ) : (
        <BaseAreaChart
          data={data}
          dataKey="total"
          categoryKey="data"
          config={chartConfig}
          strokeColor="#A9840C"
          referenceLines={monthSeparators}
        />
      )}
    </ChartCard>
  );
};
