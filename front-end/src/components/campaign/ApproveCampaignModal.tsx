import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import type { CampaignBase } from "@/types/Campaign";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatters";
import Input from "@/components/ui/input";

interface ApproveCampaignModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  campaign: CampaignBase | null;
  onApprove: () => void;
  onReject: () => void;
}

export const ApproveCampaignModal: React.FC<ApproveCampaignModalProps> = ({
  open,
  onOpenChange,
  campaign,
  onApprove,
  onReject,
}) => {
  if (!campaign) return null;

  const campaignWithDates = campaign as CampaignBase & { startDate?: string; endDate?: string };

  return (
    <Dialog
      open={open}
      onOpenChange={(o: boolean) => {
        onOpenChange(o);
      }}
    >
      <DialogContent className="bg-white border-none max-w-3xl" showCloseButton={false}>
        <DialogTitle className="text-2xl font-semibold text-[var(--color-components)]">
          Revisar Campanha
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <Input
            id="campaign-title-review"
            label="Título"
            value={campaign.title}
            readOnly
            fullWidth
          />

          {campaign.authorName && (
            <Input
              id="campaign-author-review"
              label="Criado por"
              value={campaign.authorName}
              readOnly
              fullWidth
            />
          )}

          <div>
            <label className="text-sm font-medium text-[var(--color-components)] mb-1 block">
              Descrição
            </label>
            <textarea
              readOnly
              value={campaign.description}
              className="w-full h-32 rounded-md border border-[var(--color-components)]/30 p-3 text-sm text-black resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {campaign.description?.length || 0}/200
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="campaign-start-date-review"
              label="Data de Início"
              value={formatDate(campaignWithDates.startDate)}
              readOnly
              fullWidth
            />

            <Input
              id="campaign-end-date-review"
              label="Data de Término"
              value={formatDate(campaignWithDates.endDate)}
              readOnly
              fullWidth
            />
          </div>

          <Input
            id="campaign-value-review"
            label="Valor Pretendido"
            value={formatCurrency(campaign.targetValue || 0)}
            readOnly
            fullWidth
          />

          {campaign.image?.url && (
            <div>
              <label className="text-sm font-medium text-[var(--color-components)] block mb-1">
                Imagem
              </label>
              <div className="w-full h-40 rounded-md border border-[var(--color-components)]/30 overflow-hidden">
                <img
                  src={campaign.image.url}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="destructive" size="extraSmall" onClick={onReject}>
            Rejeitar
          </Button>
          <Button variant="primary" size="extraSmall" onClick={onApprove}>
            Aprovar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveCampaignModal;
