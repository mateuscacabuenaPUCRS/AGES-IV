import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { updateDonorAvatar } from "@/services/donors";
import { getUserAvatar } from "@/constant/defaultAvatar";

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorId: string;
  currentPhoto?: string;
  onSuccess?: () => void;
}

export default function ChangeAvatarModal({
  isOpen,
  onClose,
  donorId,
  currentPhoto,
  onSuccess,
}: ChangeAvatarModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB.");
      return;
    }

    setError("");
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    try {
      await updateDonorAvatar(donorId, selectedFile);
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (err) {
      console.error("Erro ao atualizar avatar:", err);
      setError("Erro ao atualizar foto de perfil. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    onClose();
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white" data-testid="change-avatar-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#005172]">
            Alterar Foto de Perfil
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Selecione uma nova foto para o seu perfil. Tamanho máximo: 5MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Preview da foto */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40">
              <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-[#005172]">
                <img
                  src={previewUrl || getUserAvatar(currentPhoto)}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              {previewUrl && (
                <button
                  onClick={handleRemoveSelected}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg z-10"
                  title="Remover imagem selecionada"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Input de arquivo escondido */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="avatar-file-input"
            />

            {/* Botão para selecionar arquivo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              type="button"
              data-testid="select-image-button"
              className="w-full max-w-md px-6 py-3 rounded-xl text-[#00a8cc] border-2 border-[#00a8cc] hover:bg-[#00a8cc] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-5 w-5" />
              Escolher Foto
            </button>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Dicas:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
              <li>Use uma foto com boa iluminação</li>
              <li>Formatos aceitos: JPG, PNG, GIF</li>
              <li>Tamanho máximo: 5MB</li>
            </ul>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={handleClose}
            disabled={isUploading}
            type="button"
            data-testid="cancel-avatar-button"
            className="flex-1 px-6 py-3 rounded-xl text-[#00a8cc] border-2 border-[#00a8cc] hover:bg-[#00a8cc] hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            type="button"
            data-testid="save-avatar-button"
            className="flex-1 px-6 py-3 rounded-xl bg-[#6b8a9a] text-white hover:bg-[#5a7586] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Salvando..." : "Salvar Foto"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
