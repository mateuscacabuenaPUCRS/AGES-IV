import { useState, useEffect } from "react";
import { ChartCard } from "@/components/charts/components/chart-card";
import { BasePieChart } from "@/components/charts/components/pie-chart-component";
import { BaseBarChart } from "@/components/charts/components/bar-chart-component";
import type { ChartConfig } from "@/components/charts/components/chart";
import type { DateRange } from "react-day-picker";
import {
  getDonorsCampaignSocialData,
  CampaignGenderLabel,
} from "@/services/metrics/donors-campaign-social-data";

type PieData = { name: string; value: number };
type BarData = { faixa: string; total: number };

const pieConfig = {
  Masculino: { label: "Masculino", color: "#E8C468" },
  Feminino: { label: "Feminino", color: "#2A9D90" },
  Outro: { label: "Outro", color: "#F4A462" },
} satisfies ChartConfig;

const barConfig = {
  total: { label: "Total de Doadores: ", color: "#264653" },
} satisfies ChartConfig;

export const DoadoresPorCampanhaStats = ({
  campaignId,
  show,
  period,
}: {
  campaignId: string;
  show: "genero" | "idade";
  period?: DateRange;
}) => {
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [barData, setBarData] = useState<BarData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) {
        setPieData([]);
        setBarData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getDonorsCampaignSocialData(campaignId);

        const mappedPieData: PieData[] = response.genderDistribution.map((item) => ({
          name: CampaignGenderLabel[item.gender],
          value: item.count,
        }));

        const mappedBarData: BarData[] = response.ageDistribution.map((item) => ({
          faixa: item.ageRange,
          total: item.count,
        }));

        setPieData(mappedPieData);
        setBarData(mappedBarData);
      } catch (err) {
        console.error("Erro ao buscar dados sociais da campanha:", err);
        setError("Não foi possível carregar os dados. Tente novamente.");
        setPieData([]);
        setBarData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [campaignId, period]);

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
        <p className="text-gray-500">Nenhum dado disponível para esta campanha</p>
      </div>
    );
  }

  if (show === "genero") {
    return (
      <ChartCard title="Doadores por Gênero (Campanha)">
        <BasePieChart data={pieData} dataKey="value" nameKey="name" config={pieConfig} />
      </ChartCard>
    );
  }

  if (show === "idade") {
    return (
      <ChartCard title="Doadores por Faixa Etária (Campanha)">
        <BaseBarChart data={barData} dataKey="total" categoryKey="faixa" config={barConfig} />
      </ChartCard>
    );
  }

  return null;
};
