import { useMemo, useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import Button from "@/components/ui/button";
import { Edit, Settings } from "lucide-react";
import { WhatsAppIcon } from "@/icons/whatsappIcon";
import { useUser } from "@/hooks/useUser";
import { useHowToHelp } from "./useHowToHelp";
import type { HowToHelpAPI } from "@/services/how-to-help";
import { getRootCampaign, type CampaignAPI } from "@/services/campaigns";
import { SelectRootCampaignModal } from "./SelectRootCampaignModal";

const WhatsAppButton = () => {
  const handleContactClick = () => {
    window.open("https://wa.me/5551989719615", "_blank");
  };
  return (
    <Button
      onClick={handleContactClick}
      className="bg-[var(--color-text-contact)] text-white w-full flex items-center justify-center gap-2 hover:bg-[var(--color-text-contact)] hover:opacity-95"
      data-testid="contact-button"
    >
      <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
      Entrar em Contato
    </Button>
  );
};

export default function HowToHelpSection() {
  const { user } = useUser();
  const { howToHelpList, updateHowToHelp } = useHowToHelp();

  const userIsAdmin = useMemo(() => user?.role === "ADMIN", [user]);

  const [editingId, setEditingId] = useState<string>("");
  const [editText, setEditText] = useState("");

  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const [rootCampaign, setRootCampaign] = useState<CampaignAPI | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const metaCampanha = rootCampaign?.targetAmount || 1000;
  const arrecadado = rootCampaign?.currentAmount || 0;
  const percentual = Math.min((arrecadado / metaCampanha) * 100, 100);

  useEffect(() => {
    fetchRootCampaign();
  }, []);

  const fetchRootCampaign = async () => {
    setLoadingCampaign(true);
    try {
      const campaign = await getRootCampaign();
      setRootCampaign(campaign);
    } catch (error) {
      console.error("Erro ao buscar campanha principal:", error);
    } finally {
      setLoadingCampaign(false);
    }
  };

  const handleCampaignUpdated = () => {
    fetchRootCampaign();
  };

  const handleEdit = (howToHelp: HowToHelpAPI) => {
    setOpenAccordionId(howToHelp.id);
    setEditingId(howToHelp.id);
    setEditText(howToHelp.description);
  };

  const handleSave = async () => {
    await updateHowToHelp(editingId, editText);
    setEditingId("");
    setEditText("");
  };

  const handleCancel = () => {
    setEditingId("");
    setEditText("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
    if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-left text-[#024b5a]">COMO AJUDAR?</h2>
          {userIsAdmin && (
            <Button
              onClick={() => setIsSelectModalOpen(true)}
              variant="secondary"
              className="flex items-center gap-2"
              data-testid="edit-root-campaign-button"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Alterar Campanha</span>
            </Button>
          )}
        </div>

        {loadingCampaign ? (
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : rootCampaign ? (
          <div className="space-y-2">
            <h3
              className="text-lg font-semibold text-[#024b5a] text-left"
              data-testid="root-campaign-title"
            >
              {rootCampaign.title}
            </h3>
            <Progress value={Math.round(percentual)} variant="blue" />
            <div className="flex justify-end">
              <span className="text-sm font-medium text-[#024b5a]">
                {percentual.toFixed(0)}% atingida
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
              value={openAccordionId ?? ""}
              onValueChange={setOpenAccordionId}
              data-testid="how-to-help-accordion"
            >
              {howToHelpList.map((howToHelp) => (
                <AccordionItem key={howToHelp.id} value={howToHelp.id}>
                  <AccordionTrigger
                    variant="secondary"
                    className="w-full [&>svg]:hidden"
                    data-testid={`accordion-trigger-${howToHelp.id}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-[#024b5a] font-medium text-lg">
                          <span className="accordion-icon"></span>
                        </span>
                        <span className="text-base text-[#024b5a]">{howToHelp.title}</span>
                      </div>
                      {userIsAdmin && (
                        <button
                          type="button"
                          aria-label={`Editar ${howToHelp.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(howToHelp);
                          }}
                          className="p-2 rounded-md hover:bg-gray-100 mr-4"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent variant="secondary">
                    <div className="py-2">
                      {editingId === howToHelp.id ? (
                        <div>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e)}
                            className="w-full p-2 border border-gray-300 rounded-md min-h-[120px]"
                            autoFocus
                          />
                          <small className="text-gray-500 mt-1 block">
                            Pressione <b>Enter</b> para salvar ou <b>Esc</b> para cancelar.
                          </small>
                        </div>
                      ) : (
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <p className="flex-1 text-sm text-justify leading-relaxed">
                            {howToHelp.description}
                          </p>
                          <div className="w-full lg:w-52 flex-shrink-0">
                            <WhatsAppButton />
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="lg:w-52 flex flex-col gap-2 mt-6 lg:mt-0">
            <Button
              onClick={() => (window.location.href = "/doacao")} //simula rota de /doacoes
              className="bg-[var(--color-text-special)] text-white w-full hover:bg-[var(--color-text-special)] hover:opacity-95"
              data-testid="donation-button"
            >
              Faça sua doação!
            </Button>
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-500">OU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <WhatsAppButton />
          </div>
        </div>
      </div>

      <SelectRootCampaignModal
        open={isSelectModalOpen}
        onOpenChange={setIsSelectModalOpen}
        onSuccess={handleCampaignUpdated}
        currentCampaignId={rootCampaign?.id}
      />

      <style>{`
        .accordion-icon { display: inline-block; }
        .accordion-icon::before { content: "+"; }
        [data-state="open"] .accordion-icon::before { content: "-"; }
      `}</style>
    </section>
  );
}
