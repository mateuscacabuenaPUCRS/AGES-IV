import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SearchBar } from "@/components/ui/search-bar";
import Button from "@/components/ui/button";
import { getCampaigns, setRootCampaign, type CampaignAPI } from "@/services/campaigns";
import { useSearchParams } from "react-router-dom";

interface SelectRootCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentCampaignId?: string;
}

export function SelectRootCampaignModal({
  open,
  onOpenChange,
  onSuccess,
  currentCampaignId,
}: SelectRootCampaignModalProps) {
  const [campaigns, setCampaigns] = useState<CampaignAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (open) {
      fetchCampaigns();
    }
  }, [open, searchParams]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const searchTerm = searchParams.get("search") || undefined;
      const response = await getCampaigns({
        page: 1,
        pageSize: 100,
        title: searchTerm,
        status: "ACTIVE",
      });
      setCampaigns(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCampaignId) return;

    setSaving(true);
    try {
      await setRootCampaign(selectedCampaignId);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao definir campanha principal:", error);
      alert("Erro ao definir campanha principal. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-[var(--color-background)] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Campanha Principal</DialogTitle>
          <DialogDescription>
            Escolha qual campanha será exibida na seção "Como Ajudar?" da página inicial.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <SearchBar />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Carregando campanhas...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Nenhuma campanha ativa encontrada.</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => setSelectedCampaignId(campaign.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedCampaignId === campaign.id
                    ? "border-[var(--color-components)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  currentCampaignId === campaign.id ? "ring-2 ring-green-500 ring-offset-2" : ""
                }`}
                data-testid={`campaign-option-${campaign.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-components)]">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {campaign.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Meta: R$ {campaign.targetAmount.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs text-gray-500">
                        Arrecadado: R$ {campaign.currentAmount.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        {campaign.achievementPercentage.toFixed(0)}% atingido
                      </span>
                    </div>
                  </div>
                  {currentCampaignId === campaign.id && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Atual
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            disabled={saving}
            data-testid="cancel-button"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedCampaignId || saving}
            data-testid="save-button"
            className="bg-[var(--color-components)] hover:bg-[var(--color-components)] hover:opacity-90"
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
