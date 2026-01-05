import Button from "@/components/ui/button";

interface SuccessRegistrationProps {
  onBackToLogin: () => void;
}

export default function SuccessRegistration({ onBackToLogin }: SuccessRegistrationProps) {
  return (
    <div className="mx-auto my-4 w-full text-center">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 my-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-sky-900 mb-2">
              Cadastro realizado com sucesso!
            </h2>
            <p className="text-sm text-sky-900/70">
              Sua conta foi criada e você já pode fazer login para acessar o sistema.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button type="button" variant="confirm" className="w-full" onClick={onBackToLogin}>
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
}
