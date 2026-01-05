import { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import CurrencyInput from "../components/ui/currencyInput";
import Button from "../components/ui/button";
import StepHeader from "../components/ui/stepHeader";
import { Combobox } from "../components/ui/combobox";
import { Select } from "../components/ui/select";
import PaymentMethodSelector from "../components/ui/paymentMethodSelector";
import PixPaymentDisplay from "../components/ui/pixPaymentDisplay";
import CreditCardForm from "../components/ui/creditCardForm";
import BoletoPaymentDisplay from "../components/ui/boletoPaymentDisplay";
import { getCampaigns, getRootCampaign, type CampaignAPI } from "../services/campaigns";
import { createDonation, type Periodicity } from "../services/donations";
import { useUser } from "../hooks/useUser";
import { toast } from "sonner";

const Doacao = () => {
  const { user: currentUser } = useUser();
  const [currentStep, setCurrentStep] = useState("item-1");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [donationValue, setDonationValue] = useState("0");
  const [periodicity, setPeriodicity] = useState<Periodicity | "UNIQUE">("UNIQUE");
  const [step3Value, setStep3Value] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "Pendente" | "Confirmado" | "Negado" | "Cancelado"
  >("Pendente");
  const [paymentId] = useState<string | null>(null);
  const [timer, setTimer] = useState(600);
  const [isCampaignConfirmed, setIsCampaignConfirmed] = useState(false);
  const [isValueConfirmed, setIsValueConfirmed] = useState(false);
  const [isStep3Confirmed, setIsStep3Confirmed] = useState(false);
  const [isStep4Confirmed, setIsStep4Confirmed] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSubStep, setPaymentSubStep] = useState<"form" | "pending">("form");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isCreatingDonation, setIsCreatingDonation] = useState(false);
  const [valueError, setValueError] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignAPI[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("");
  const [rootCampaign, setRootCampaign] = useState<CampaignAPI | null>(null);

  // Fetch root campaign
  useEffect(() => {
    const fetchRootCampaign = async () => {
      try {
        const campaign = await getRootCampaign();
        setRootCampaign(campaign);
      } catch (error) {
        console.error("Erro ao buscar campanha principal:", error);
      }
    };

    fetchRootCampaign();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoadingCampaigns(true);
        const response = await getCampaigns({
          page: 1,
          pageSize: 100,
          title: campaignSearchTerm || undefined,
          status: "ACTIVE",
        });
        setCampaigns(response.data);
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
        setCampaigns([]);
      } finally {
        setIsLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, [campaignSearchTerm]);

  // Set periodicity to UNIQUE for anonymous users
  useEffect(() => {
    if (!currentUser) {
      setPeriodicity("UNIQUE");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentStep === "item-4" && step3Value === "Pix" && !paymentId && !isCreatingPayment) {
      console.log("Iniciando pagamento Pix automaticamente...");
    }
  }, [currentStep, step3Value, paymentId, isCreatingPayment]);

  useEffect(() => {
    setPaymentSubStep("form");
    setPaymentStatus("Pendente");
    setTimer(600);
  }, [step3Value]);

  useEffect(() => {
    const isTimerActive =
      paymentStatus === "Pendente" &&
      (step3Value === "Pix" ||
        step3Value === "Boleto" ||
        (step3Value === "Crédito" && paymentSubStep === "pending"));

    if (isTimerActive) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setPaymentStatus("Cancelado");
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step3Value, paymentSubStep, paymentStatus]);

  const simulatePaymentConfirmation = useCallback(() => {
    console.log("Simulando processamento do pagamento...");
    if (step3Value === "Crédito") setPaymentSubStep("pending");

    setTimeout(() => {
      console.log("Simulação concluída: Pagamento Confirmado");
      setPaymentStatus("Confirmado");
      setIsStep4Confirmed(true);
      setCurrentStep("");
    }, 3000);
  }, [step3Value]);

  const handleCreateDonation = useCallback(async () => {
    // Validate that anonymous users can only make one-time donations
    if (!currentUser && periodicity !== "UNIQUE") {
      toast.error("Você precisa estar logado para fazer doações recorrentes");
      return;
    }

    try {
      setIsCreatingDonation(true);

      const paymentMethodMap: Record<string, "PIX" | "BANK_SLIP" | "CREDIT_CARD"> = {
        Pix: "PIX",
        Boleto: "BANK_SLIP",
        Crédito: "CREDIT_CARD",
      };

      const donationData = {
        amount: parseInt(donationValue, 10) / 100, // Convert from cents to reais
        periodicity: periodicity === "UNIQUE" ? null : (periodicity as Periodicity),
        campaignId: selectedCampaign,
        donorId: currentUser?.id,
        paymentMethod: paymentMethodMap[step3Value],
      };

      const result = await createDonation(donationData);
      console.log("Doação criada com sucesso:", result);
      toast.success("Doação criada com sucesso!");

      simulatePaymentConfirmation();
    } catch (error) {
      console.error("Erro ao criar doação:", error);
      toast.error("Erro ao criar doação. Tente novamente.");
      setPaymentStatus("Negado");
    } finally {
      setIsCreatingDonation(false);
    }
  }, [
    currentUser,
    donationValue,
    periodicity,
    selectedCampaign,
    step3Value,
    simulatePaymentConfirmation,
  ]);

  useEffect(() => {
    if (
      currentStep === "item-4" &&
      step3Value === "Pix" &&
      !isCreatingPayment &&
      !isStep4Confirmed &&
      !isCreatingDonation
    ) {
      setIsCreatingPayment(true);
      handleCreateDonation();
    }
  }, [
    currentStep,
    step3Value,
    isCreatingPayment,
    isStep4Confirmed,
    isCreatingDonation,
    handleCreateDonation,
  ]);

  const handleConfirmCampaign = () => {
    if (selectedCampaign) {
      setIsCampaignConfirmed(true);
      setCurrentStep("item-2");
    }
  };

  const handleDirectDonation = () => {
    // Direct donations to Fundação O Pão dos Pobres (root campaign)
    if (rootCampaign?.id) {
      setSelectedCampaign(rootCampaign.id);
      setIsCampaignConfirmed(true);
      setCurrentStep("item-2");
    } else {
      toast.error("Campanha principal não encontrada. Tente novamente.");
    }
  };

  const handleConfirmValue = () => {
    const valueInCents = parseInt(donationValue, 10);
    if (valueInCents < 500) {
      setValueError("O valor mínimo para doação é de R$ 5,00.");
      return;
    }
    if (currentUser && !periodicity) {
      setValueError("Por favor, selecione a frequência da doação.");
      return;
    }
    setValueError("");
    setIsValueConfirmed(true);
    setCurrentStep("item-3");
  };

  const handleDonationValueChange = (value: string) => {
    if (valueError) {
      setValueError("");
    }
    setDonationValue(value);
  };

  const handleConfirmStep3 = () => {
    if (step3Value) {
      setIsStep3Confirmed(true);
      setCurrentStep("item-4");
    }
  };

  const handleConfirmStep4 = () => {
    setPaymentStatus("Confirmado");
    setIsStep4Confirmed(true);
    setCurrentStep("");
  };

  const handleConfirmCardDetails = async () => {
    await handleCreateDonation();
  };

  const shouldShowPaymentTag =
    isStep3Confirmed &&
    (step3Value === "Pix" ||
      step3Value === "Boleto" ||
      (step3Value === "Crédito" && paymentSubStep === "pending"));

  const campaignOptions = campaigns.map((campaign) => ({
    value: campaign.id,
    label: campaign.title,
  }));
  const mockPixCode =
    "00020126360014br.gov.bcb.pix0114+55119999999995204000053039865802BR5913NOME COMPLETO6009SAO PAULO62070503***6304E2E1";
  const mockQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example";
  const mockBoletoCode = "34191.79001 01043.510047 91020.101014 1 98470000123456";
  const mockBarcodeUrl =
    "https://barcode.tec-it.com/barcode.ashx?data=" +
    mockBoletoCode.replace(/\D/g, "") +
    "&code=Code128";

  const showTimer =
    (step3Value === "Pix" ||
      step3Value === "Boleto" ||
      (step3Value === "Crédito" && paymentSubStep === "pending")) &&
    paymentStatus === "Pendente";

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center">
      <img
        src="/src/assets/quadra-pp.jpg"
        alt="Imagem de fundo de uma quadra de esportes"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-blue-800/30 to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10 container py-10 flex flex-col items-center px-6">
        <div className="container py-10 w-full max-w-lg mx-auto flex flex-col gap-6 items-center">
          <Accordion
            type="single"
            className="w-full"
            value={currentStep}
            onValueChange={setCurrentStep}
          >
            {/* Step 1 */}
            <AccordionItem
              value="item-1"
              className={`mb-4 rounded-md relative ${currentStep === "item-1" ? "overflow-visible" : "overflow-hidden"}`}
            >
              <AccordionTrigger variant="secondary" size="large">
                <StepHeader
                  stepNumber="1"
                  title="Seleção de Campanha"
                  isActive={isCampaignConfirmed}
                  value={
                    isCampaignConfirmed
                      ? selectedCampaign === rootCampaign?.id
                        ? rootCampaign?.title || "Fundação O Pão dos Pobres"
                        : campaignOptions.find((c) => c.value === selectedCampaign)?.label
                      : undefined
                  }
                  valueType="text"
                />
              </AccordionTrigger>
              <AccordionContent variant="secondary">
                <div className="flex flex-col gap-4">
                  <Combobox
                    options={campaignOptions}
                    value={selectedCampaign}
                    onChange={setSelectedCampaign}
                    onSearchChange={setCampaignSearchTerm}
                    placeholder="Pesquise ou escolha uma campanha para doar"
                    label="Campanha"
                    fullWidth
                    isLoading={isLoadingCampaigns}
                    emptyMessage={
                      campaignSearchTerm
                        ? "Nenhuma campanha encontrada"
                        : "Nenhuma campanha ativa disponível"
                    }
                  />
                  <Button
                    variant="confirm"
                    size="small"
                    onClick={handleConfirmCampaign}
                    className="self-end"
                    disabled={!selectedCampaign}
                    data-testid="confirm-campaign-button"
                  >
                    Confirmar Campanha
                  </Button>
                  <div className="text-center my-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Caso queira apenas fazer uma doação à "{rootCampaign?.title || "Fundação O Pão dos Pobres"}" sem vínculo:
                    </p>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleDirectDonation}
                      className="w-auto px-4"
                      data-testid="direct-donation-button"
                      disabled={!rootCampaign}
                    >
                      Doar para {rootCampaign?.title?.replace("Fundação ", "") || "Pão dos Pobres"}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 2 */}
            <AccordionItem
              value="item-2"
              className={`mb-4 rounded-md ${currentStep === "item-2" ? "overflow-visible" : "overflow-hidden"}`}
              disabled={!isCampaignConfirmed}
            >
              <AccordionTrigger variant="secondary" size="large" disabled={!isCampaignConfirmed}>
                <StepHeader
                  stepNumber="2"
                  title="Valor e Frequência"
                  isActive={isValueConfirmed}
                  value={
                    isValueConfirmed
                      ? `${(parseInt(donationValue, 10) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} - ${
                          periodicity === "UNIQUE"
                            ? "Doação única"
                            : periodicity === "MONTHLY"
                              ? "Mensal"
                              : periodicity === "QUARTERLY"
                                ? "Trimestral"
                                : periodicity === "SEMI_ANNUAL"
                                  ? "Semestral"
                                  : periodicity === "YEARLY"
                                    ? "Anual"
                                    : ""
                        }`
                      : undefined
                  }
                  valueType="text"
                />
              </AccordionTrigger>
              <AccordionContent variant="secondary">
                <div className="flex flex-col gap-4">
                  <CurrencyInput
                    value={donationValue}
                    onValueChange={handleDonationValueChange}
                    error={valueError}
                  />
                  {currentUser ? (
                    <Select
                      options={[
                        { value: "UNIQUE", label: "Doação única" },
                        { value: "MONTHLY", label: "Mensal" },
                        { value: "QUARTERLY", label: "Trimestral" },
                        { value: "SEMI_ANNUAL", label: "Semestral" },
                        { value: "YEARLY", label: "Anual" },
                      ]}
                      value={periodicity}
                      onChange={(value) => setPeriodicity(value as Periodicity | "UNIQUE")}
                      placeholder="Selecione a frequência"
                      label="Frequência"
                      fullWidth
                    />
                  ) : (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="font-semibold text-blue-900 mb-2">Doação única</p>
                      <p className="text-sm text-blue-700">
                        Para realizar doações com recorrência (mensal, trimestral, semestral ou
                        anual), é necessário fazer login com uma conta de doador.
                      </p>
                    </div>
                  )}
                  <Button
                    variant="confirm"
                    size="small"
                    onClick={handleConfirmValue}
                    className="self-end"
                    desactive={parseInt(donationValue, 10) <= 0 || (currentUser && !periodicity)}
                    data-testid="confirm-value-button"
                  >
                    Confirmar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3 */}
            <AccordionItem
              value="item-3"
              className="mb-4 rounded-md overflow-hidden"
              disabled={!isValueConfirmed}
            >
              <AccordionTrigger variant="secondary" size="large" disabled={!isValueConfirmed}>
                <StepHeader
                  stepNumber="3"
                  title="Método de Pagamento"
                  isActive={isStep3Confirmed}
                  value={isStep3Confirmed ? step3Value : undefined}
                  valueType="text"
                />
              </AccordionTrigger>
              <AccordionContent variant="secondary">
                <div className="flex flex-col gap-4">
                  <PaymentMethodSelector
                    selectedValue={step3Value}
                    onSelect={setStep3Value}
                    data-testid="payment-method-selector"
                  />
                  <Button
                    variant="confirm"
                    size="small"
                    onClick={handleConfirmStep3}
                    className="self-end"
                    disabled={!step3Value}
                    data-testid="confirm-payment-method-button"
                  >
                    Confirmar
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 4 */}
            <AccordionItem
              value="item-4"
              className="mb-4 rounded-md overflow-hidden"
              disabled={!isStep3Confirmed}
            >
              <AccordionTrigger variant="secondary" size="large" disabled={!isStep3Confirmed}>
                <StepHeader
                  stepNumber="4"
                  title="Pagamento"
                  isActive={isStep4Confirmed}
                  value={shouldShowPaymentTag ? paymentStatus : undefined}
                  valueType="status"
                />
              </AccordionTrigger>
              <AccordionContent variant="secondary">
                <div className="flex flex-col gap-4">
                  {step3Value === "Pix" && (
                    <PixPaymentDisplay pixCode={mockPixCode} qrCodeImageUrl={mockQrCodeUrl} />
                  )}
                  {step3Value === "Boleto" && (
                    <BoletoPaymentDisplay
                      boletoCode={mockBoletoCode}
                      barcodeImageUrl={mockBarcodeUrl}
                    />
                  )}
                  {step3Value === "Crédito" && (
                    <CreditCardForm
                      disabled={paymentSubStep === "pending"}
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      cardName={cardName}
                      setCardName={setCardName}
                      expiryDate={expiryDate}
                      setExpiryDate={setExpiryDate}
                      cvv={cvv}
                      setCvv={setCvv}
                      onSubmit={handleConfirmCardDetails}
                    />
                  )}

                  {showTimer && (
                    <div className="text-center p-2 rounded-lg bg-yellow-50 border border-yellow-300">
                      <p className="font-semibold text-yellow-700">Aguardando pagamento...</p>
                      <p className="text-lg font-mono text-yellow-800">
                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  )}
                  {step3Value === "Boleto" && (
                    <Button
                      variant="confirm"
                      size="small"
                      onClick={handleConfirmStep4}
                      className="self-end"
                      disabled={paymentStatus !== "Pendente"}
                    >
                      Confirmar Pagamento
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            variant="primary"
            size="large"
            onClick={() => (window.location.href = "/")}
            disabled={paymentStatus !== "Confirmado"}
            data-testid="back-home-button"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Doacao;
