import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import Button from "./button";

type ModalVariant =
  | "logout"
  | "whatsapp-redirect"
  | "main-site-redirect"
  | "newsletter-success"
  | "newsletter-error"
  | "delete-account";

type ActionType = "close" | "confirm" | "retry";

type ActionDef = {
  label: string;
  variant: "senary" | "primary" | "destructive";
  action: ActionType;
};

type PresetConfig = {
  title: string;
  description: string;
  actions: ActionDef[];
};

const modalConfig: Record<ModalVariant, PresetConfig> = {
  logout: {
    title: "Deseja sair da sua conta?",
    description:
      "Após realizar essa ação, você precisará fazer login novamente para acessar sua conta.",
    actions: [
      { label: "Voltar", variant: "senary", action: "close" },
      { label: "Continuar", variant: "primary", action: "confirm" },
    ],
  },
  "whatsapp-redirect": {
    title: "Redirecionamento para WhatsApp",
    description:
      "Você será redirecionado para uma conversa via WhatsApp com um de nossos atendentes. Deseja continuar?",
    actions: [
      { label: "Voltar", variant: "senary", action: "close" },
      { label: "Continuar", variant: "primary", action: "confirm" },
    ],
  },
  "main-site-redirect": {
    title: "Redirecionamento para Site Principal",
    description: "Você será redirecionado para o site principal. Deseja continuar?",
    actions: [
      { label: "Voltar", variant: "senary", action: "close" },
      { label: "Continuar", variant: "primary", action: "confirm" },
    ],
  },
  "newsletter-success": {
    title: "Newsletter assinada!",
    description: "Agora você receberá e-mails recorrentes com as nossas novidades!",
    actions: [{ label: "Fechar", variant: "senary", action: "close" }],
  },
  "newsletter-error": {
    title: "Ops! Deu erro na assinatura da newsletter...",
    description: "Tente novamente para não perder as novidades!",
    actions: [{ label: "Fechar", variant: "senary", action: "close" }],
  },
  "delete-account": {
    title: "Tem certeza que deseja excluir sua conta?",
    description:
      "Essa ação é irreversível e resultará na perda de todos os seus dados. Por favor, confirme se deseja continuar.",
    actions: [
      { label: "Cancelar", variant: "senary", action: "close" },
      { label: "Excluir", variant: "destructive", action: "confirm" },
    ],
  },
};

type BaseProps = {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onRetry?: () => void;
  variant?: ModalVariant | "custom";
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function Modal({
  isOpen,
  open,
  onClose,
  onConfirm,
  onRetry,
  variant,
  title,
  description,
  children,
  footer,
  className = "",
}: BaseProps) {
  const visible = typeof isOpen === "boolean" ? isOpen : !!open;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [visible]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) onClose();
    };
    if (visible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const cfg: PresetConfig | null = variant && variant !== "custom" ? modalConfig[variant] : null;

  const resolvedTitle = title ?? cfg?.title ?? "";
  const resolvedDescription = description ?? cfg?.description ?? "";

  const handleActionClick = (action: ActionType) => {
    switch (action) {
      case "close":
        onClose();
        break;
      case "confirm":
        onConfirm?.();
        break;
      case "retry":
        onRetry?.();
        break;
      default:
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={[
          "relative bg-white rounded-2xl border border-slate-300",
          "inline-flex flex-col items-start",
          "max-w-lg w-full mx-4 p-6 gap-4 shadow-lg",
          "transition-all duration-300 ease-out",
          isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
          className,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {(resolvedTitle || resolvedDescription) && (
          <div className="w-full">
            {resolvedTitle && (
              <h3
                id="modal-title"
                className="text-slate-900 font-inter text-lg font-semibold leading-7 mb-2"
              >
                {resolvedTitle}
              </h3>
            )}
            {resolvedDescription && (
              <p className="text-slate-500 font-inter text-sm font-normal leading-5">
                {resolvedDescription}
              </p>
            )}
          </div>
        )}

        {children}

        <div className="flex justify-end gap-3 w-full mt-2">
          {footer
            ? footer
            : cfg?.actions?.map((a, i) => (
                <Button
                  key={i}
                  variant={a.variant}
                  size="extraSmall"
                  onClick={() => handleActionClick(a.action)}
                  data-testid={`modal-${a.action}-button`}
                >
                  {a.label}
                </Button>
              ))}
        </div>
      </div>
    </div>
  );
}

export { Modal };
export default Modal;
