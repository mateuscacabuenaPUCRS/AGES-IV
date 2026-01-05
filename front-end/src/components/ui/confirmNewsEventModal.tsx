//Modais da tela de notícias e eventos
import { useEffect } from "react";
import Button from "./button";

type ModalProps =
  | {
      isOpen: boolean;
      onClose: () => void;
      variant: "delete-news" | "delete-event";
      onConfirm?: () => void;
      itemTitle: string;
    }
  | {
      isOpen: boolean;
      onClose: () => void;
      variant: "maximum-news" | "maximum-events";
      onConfirm?: () => void;
      itemTitle?: never;
    };

const modalConfig = {
  "delete-news": {
    title: "Você deseja excluir esta notícia?",
    description: 'Você estará excluindo a notícia "{title}". Deseja continuar com esta ação?',
    actions: [
      { label: "Cancelar", variant: "tertiary" as const, action: "close" },
      { label: "Excluir", variant: "primary" as const, action: "confirm" },
    ],
  },
  "maximum-news": {
    title: "Você atingiu o número máximo de notícias!",
    description:
      "Você só pode ter no máximo 10 notícias cadastradas neste site. Para inserir uma nova é necessário remover uma existente.",
    actions: [
      { label: "Cancelar", variant: "tertiary" as const, action: "close" },
      { label: "Continuar", variant: "primary" as const, action: "confirm" },
    ],
  },
  "delete-event": {
    title: "Você deseja excluir este evento?",
    description: 'Você estará excluindo o evento "{title}". Deseja continuar com esta ação?',
    actions: [
      { label: "Cancelar", variant: "tertiary" as const, action: "close" },
      { label: "Excluir", variant: "primary" as const, action: "confirm" },
    ],
  },
  "maximum-events": {
    title: "Você atingiu o número máximo de eventos!",
    description:
      "Você só pode ter no máximo 10 eventos cadastrados neste site. Para inserir um novo é necessário remover um existente.",
    actions: [
      { label: "Cancelar", variant: "tertiary" as const, action: "close" },
      { label: "Continuar", variant: "primary" as const, action: "confirm" },
    ],
  },
};

const ConfirmNewsEventModal = ({ isOpen, onClose, variant, onConfirm, itemTitle }: ModalProps) => {
  const config = modalConfig[variant];

  const description = config.description.replace(/\{title\}/g, itemTitle || "");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleActionClick = (action: string) => {
    switch (action) {
      case "close":
        onClose();
        break;
      case "confirm":
        onConfirm?.();
        break;
      default:
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-lg border border-slate-300 inline-flex flex-col items-start
        max-w-md w-full mx-4 p-6 gap-4 shadow-lg text-left"
      >
        <div className="w-full">
          <h3 className="text-slate-900 font-inter text-lg font-semibold leading-7 mb-2">
            {config.title}
          </h3>

          <p className=" text-slate-500 font-inter text-sm font-normal leading-5">{description}</p>
        </div>

        <div className="flex justify-end gap-4 w-full mt-4">
          {config.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="extraSmall"
              onClick={() => handleActionClick(action.action)}
              className={`${
                action.variant === "primary" ? "text-white" : "text-[#005172]"
              } w-1/2 py-2 text-center rounded-lg justify-center`}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmNewsEventModal;
