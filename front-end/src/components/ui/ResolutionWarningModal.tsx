import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Monitor, AlertTriangle } from "lucide-react";
import { useScreenSize } from "@/hooks/useScreenSize";

interface ResolutionWarningModalProps {
  /**
   * Minimum width required to use the page
   * @default 1024
   */
  minWidth?: number;
}

export function ResolutionWarningModal({ minWidth = 1024 }: ResolutionWarningModalProps) {
  const { screenWidth } = useScreenSize();
  const [isOpen, setIsOpen] = useState(false);
  const [hasClosedWarning, setHasClosedWarning] = useState(false);

  useEffect(() => {
    // Show modal if screen is too small and user hasn't closed it yet
    if (screenWidth < minWidth && !hasClosedWarning) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [screenWidth, minWidth, hasClosedWarning]);

  const handleClose = () => {
    setIsOpen(false);
    setHasClosedWarning(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-w-md bg-white"
        data-testid="resolution-warning-modal"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Resolução Não Suportada</DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Monitor className="h-5 w-5" />
              <span className="text-sm">Largura mínima necessária: {minWidth}px</span>
            </div>

            <p className="text-gray-700">
              Esta tela administrativa foi projetada para uso em computadores e requer uma resolução
              mínima de <strong>{minWidth}px de largura</strong>.
            </p>

            <p className="text-gray-700">
              Para melhor experiência, por favor acesse esta página através de um computador ou
              aumente o tamanho da janela do navegador.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Sua resolução atual:</strong> {screenWidth}px
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-6">
          <Button
            onClick={handleClose}
            className="bg-[var(--color-components)] hover:bg-[var(--color-components)] hover:opacity-90 w-full"
            data-testid="close-resolution-warning"
          >
            Entendi, continuar mesmo assim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
