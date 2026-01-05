import { useState, useEffect } from "react";
import { ChartCard } from "@/components/charts/components/chart-card";
import { BaseBarChart } from "@/components/charts/components/bar-chart-component";
import type { ChartConfig } from "@/components/charts/components/chart";
import type { DateRange } from "react-day-picker";
import { getCampaignMetrics } from "@/services/metrics/campaign-metrics";
import { PaymentMethodLabel } from "@/services/metrics/donations-payment-method";

type PaymentData = {
  metodo: string;
  valor: number;
  quantidade: number;
};

const configValor = {
  valor: { label: "Valor (R$)" },
  PIX: { label: "Pix", color: "#2A9D90" },
  "Cartão de Crédito": { label: "Cartão de Crédito", color: "#E8C468" },
  Boleto: { label: "Boleto", color: "#F4A462" },
} satisfies ChartConfig;

const configQuantidade = {
  quantidade: { label: "Quantidade" },
  PIX: { label: "Pix", color: "#2A9D90" },
  "Cartão de Crédito": { label: "Cartão de Crédito", color: "#E8C468" },
  Boleto: { label: "Boleto", color: "#F4A462" },
} satisfies ChartConfig;

export const PagamentosPorCampanhaChart = ({
  campaignId,
  show,
  period,
}: {
  campaignId: string;
  show: "quantidade" | "valor";
  period?: DateRange;
}) => {
  const [data, setData] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getCampaignMetrics(campaignId);

        const mappedData: PaymentData[] = response.paymentComparison.map((item) => ({
          metodo: PaymentMethodLabel[item.paymentMethod],
          valor: item.totalAmount,
          quantidade: item.totalCount,
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Erro ao buscar métricas da campanha:", err);
        setError("Não foi possível carregar os dados. Tente novamente.");
        setData([]);
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

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum dado disponível para esta campanha</p>
      </div>
    );
  }

  if (show === "quantidade") {
    return (
      <ChartCard title="Quantidade de Doações (Campanha)">
        <BaseBarChart
          data={data}
          dataKey="quantidade"
          categoryKey="metodo"
          config={configQuantidade}
        />
      </ChartCard>
    );
  }

  if (show === "valor") {
    return (
      <ChartCard title="Valor Arrecadado (Campanha)">
        <BaseBarChart data={data} dataKey="valor" categoryKey="metodo" config={configValor} />
      </ChartCard>
    );
  }

  return null;
};
