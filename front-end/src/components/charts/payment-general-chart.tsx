import { useState, useEffect } from "react";
import { ChartCard } from "@/components/charts/components/chart-card";
import { BaseBarChart } from "@/components/charts/components/bar-chart-component";
import type { ChartConfig } from "@/components/charts/components/chart";
import type { DateRange } from "react-day-picker";
import {
  getDonationsPaymentMethod,
  PaymentMethodLabel,
} from "@/services/metrics/donations-payment-method";

type OverallPaymentData = {
  metodo: string;
  quantidade: number;
  valor: number;
};

const configQuantidade = {
  quantidade: { label: "Quantidade" },
  PIX: { label: "PIX", color: "#2A9D90" },
  "Cartão de Crédito": { label: "Cartão de Crédito", color: "#E8C468" },
  Boleto: { label: "Boleto", color: "#F4A462" },
} satisfies ChartConfig;

const configValor = {
  valor: { label: "Valor" },
  PIX: { label: "PIX", color: "#2A9D90" },
  "Cartão de Crédito": { label: "Cartão de Crédito", color: "#E8C468" },
  Boleto: { label: "Boleto", color: "#F4A462" },
} satisfies ChartConfig;

export const PagamentosGeralChart = ({
  show = "all",
  period,
}: {
  show?: "quantidade" | "valor" | "all";
  period?: DateRange;
}) => {
  const [data, setData] = useState<OverallPaymentData[]>([]);
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
        const response = await getDonationsPaymentMethod(period.from, period.to);

        const mappedData: OverallPaymentData[] = response.data.map((item) => ({
          metodo: PaymentMethodLabel[item.paymentMethod],
          quantidade: item.totalQuantity,
          valor: item.totalAmount,
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Erro ao buscar dados de pagamento:", err);
        setError("Não foi possível carregar os dados. Tente novamente.");
        setData([]);
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

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Selecione um período para visualizar os dados</p>
      </div>
    );
  }

  if (show === "quantidade") {
    return (
      <ChartCard title="Quantidade de Doações por Método">
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
      <ChartCard title="Valor Arrecadado por Método">
        <BaseBarChart data={data} dataKey="valor" categoryKey="metodo" config={configValor} />
      </ChartCard>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      <ChartCard title="Quantidade de Doações por Método">
        <BaseBarChart
          data={data}
          dataKey="quantidade"
          categoryKey="metodo"
          config={configQuantidade}
        />
      </ChartCard>
      <ChartCard title="Valor Arrecadado por Método">
        <BaseBarChart data={data} dataKey="valor" categoryKey="metodo" config={configValor} />
      </ChartCard>
    </div>
  );
};
