import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

type DeleteCampaignModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  campaignTitle: string;
};

export default function DeleteCampaignModal({
  open,
  onOpenChange,
  onConfirm,
  campaignTitle,
}: DeleteCampaignModalProps) {
  return (
    <Modal
      variant="custom"
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Excluir Campanha"
      description=""
      footer={
        <div className="w-full space-y-4">
          <p className="text-[14px] text-[var(--color-text-2)]">
            Tem certeza que deseja excluir a campanha{" "}
            <strong className="text-[var(--color-text-3)]">"{campaignTitle}"</strong>?
          </p>
          <p className="text-[13px] text-red-600 font-medium">
            Esta ação não pode ser desfeita. Todas as informações da campanha serão permanentemente
            removidas.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="senary" size="extraSmall" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="extraSmall"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Excluir
            </Button>
          </div>
        </div>
      }
    />
  );
}
