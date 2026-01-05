import { z } from "zod";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useNewsletter } from "./useNewsletter";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  isChecked: z.boolean({ message: "Aceite os termos e condições" }),
});

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<"newsletter-success" | "newsletter-error">(
    "newsletter-success"
  );

  const { subscribe } = useNewsletter();

  function handleSubmit() {
    const result = newsletterSchema.safeParse({ email, isChecked });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    subscribe(email, {
      onSuccess: () => {
        setModalVariant("newsletter-success");
        setIsModalOpen(true);
        setEmail("");
        setIsChecked(false);
        setErrorMessage("");
      },
      onError: (message) => {
        setErrorMessage(message);
        setModalVariant("newsletter-error");
        setIsModalOpen(true);
      },
    });
  }

  return (
    <div className="p-6 flex flex-col gap-6 w-full bg-[#CCE0E6]">
      <h3 className="uppercase text-[32px] leading-[110%] font-bold">Fique por dentro do futuro</h3>
      <p className="text-center max-w-[800px] mx-auto font-bold md:leading-[150%]">
        A newsletter do Pão dos Pobres é um canal de conexão entre você e nossas ações. Nela,
        compartilhamos histórias de transformação, resultados de impacto, campanhas em andamento e
        formas de participar. Assine e acompanhe de perto como a sua ajuda faz diferença na vida de
        crianças, adolescentes e jovens em situação de vulnerabilidade.
      </p>
      <div className="flex flex-col items-center w-full max-w-md gap-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:gap-2 w-full gap-4 items-center">
          <Input
            placeholder="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full"
            data-testid="newsletter-email"
          />
          <Button
            size="small"
            disabled={!email || !isChecked}
            onClick={handleSubmit}
            variant="quinary"
            className="whitespace-nowrap"
            data-testid="newsletter-submit"
          >
            Inscrever-se
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="newsletter"
            onCheckedChange={() => setIsChecked((prev) => !prev)}
            checked={isChecked}
            data-testid="newsletter-checkbox"
          />
          <label
            htmlFor="newsletter"
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Aceito os termos e condições
          </label>
        </div>

        {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} variant={modalVariant} />
    </div>
  );
};
