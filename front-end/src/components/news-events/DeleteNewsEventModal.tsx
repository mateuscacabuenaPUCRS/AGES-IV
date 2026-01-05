import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

type DeleteNewsEventModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemTitle: string;
  itemType: "news" | "event";
};

export default function DeleteNewsEventModal({
  open,
  onOpenChange,
  onConfirm,
  itemTitle,
  itemType,
}: DeleteNewsEventModalProps) {
  const typeLabel = itemType === "news" ? "notícia" : "evento";
  const typeLabelCapitalized = itemType === "news" ? "Notícia" : "Evento";

  return (
    <Modal
      variant="custom"
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={`Excluir ${typeLabelCapitalized}`}
      description=""
      footer={
        <div className="w-full space-y-5 px-2">
          <p className="text-[15px] text-gray-700 leading-relaxed">
            Tem certeza que deseja excluir {itemType === "news" ? "a" : "o"} {typeLabel}{" "}
            <strong className="text-[#034d6b] font-semibold">"{itemTitle}"</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-[13px] text-red-700 font-medium flex items-start gap-2">
              <span>
                Esta ação não pode ser desfeita. Todas as informações{" "}
                {itemType === "news" ? "da" : "do"} {typeLabel} serão permanentemente removidas.
              </span>
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-3">
            <Button
              variant="senary"
              size="medium"
              onClick={() => onOpenChange(false)}
              className="px-8"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="medium"
              onClick={() => {
                onConfirm();
              }}
              className="px-8 bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </div>
        </div>
      }
    />
  );
}
