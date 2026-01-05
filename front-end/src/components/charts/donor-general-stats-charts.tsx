import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { ChartCard } from "@/components/charts/components/chart-card";
import { BasePieChart } from "@/components/charts/components/pie-chart-component";
import { BaseBarChart } from "@/components/charts/components/bar-chart-component";
import type { ChartConfig } from "@/components/charts/components/chart";
import {
  getDonorsGenderAgeByPeriod,
  GenderLabel,
} from "@/services/metrics/donors-gender-age-by-period";

type PieData = { name: string; value: number };
type BarData = { faixa: string; total: number };

const pieConfig = {
  Masculino: { label: "Masculino", color: "#E8C468" },
  Feminino: { label: "Feminino", color: "#2A9D90" },
  Outro: { label: "Outro", color: "#F4A462" },
} satisfies ChartConfig;

const barConfig = {
  total: { label: "Total de Doadores: ", color: "#2A9D90" },
} satisfies ChartConfig;

const ageChartId = "age-distribution-chart";

export const DoadoresGeralStats = ({
  show = "all",
  period,
}: {
  show?: "genero" | "idade" | "all";
  period?: DateRange;
}) => {
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [barData, setBarData] = useState<BarData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!period?.from || !period?.to) {
        setPieData([]);
        setBarData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getDonorsGenderAgeByPeriod(period.from, period.to);

        const mappedPieData: PieData[] = response.genderDistribution.map((item) => ({
          name: GenderLabel[item.gender],
          value: item.count,
        }));

        const mappedBarData: BarData[] = response.ageDistribution.map((item) => ({
          faixa: item.ageRange,
          total: item.count,
        }));

        setPieData(mappedPieData);
        setBarData(mappedBarData);
      } catch (err) {
        console.error("Erro ao buscar dados de doadores:", err);
        setError("Não foi possível carregar os dados. Tente novamente.");
        setPieData([]);
        setBarData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (pieData.length === 0 && barData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Selecione um período para visualizar os dados</p>
      </div>
    );
  }

  if (show === "genero") {
    return (
      <ChartCard title="Doadores por Gênero" id="id">
        <BasePieChart data={pieData} dataKey="value" nameKey="name" config={pieConfig} />
      </ChartCard>
    );
  }

  if (show === "idade") {
    return (
      <>
        <style>{`
          #${ageChartId} .recharts-rectangle:hover {
            fill: #217d72; /* Um tom de verde mais escuro */
          }
        `}</style>
        <ChartCard title="Doadores por Faixa Etária" id={ageChartId}>
          <BaseBarChart data={barData} dataKey="total" categoryKey="faixa" config={barConfig} />
        </ChartCard>
      </>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <style>{`
        #${ageChartId} .recharts-rectangle:hover {
          fill: #217d72; /* Um tom de verde mais escuro */
        }
      `}</style>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold">Estatísticas Geral de Doadores</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <ChartCard title="Doadores por Gênero" id="id">
          <BasePieChart data={pieData} dataKey="value" nameKey="name" config={pieConfig} />
        </ChartCard>
        <ChartCard title="Doadores por Faixa Etária" id={ageChartId}>
          <BaseBarChart data={barData} dataKey="total" categoryKey="faixa" config={barConfig} />
        </ChartCard>
      </div>
    </div>
  );
};
