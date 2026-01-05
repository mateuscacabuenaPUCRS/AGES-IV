import type { FormStep } from "./login";

export function getHeaderConfig(step: FormStep) {
  switch (step) {
    case "login":
      return {
        headerText: "Login",
        headerSubtext: "Preencha os dados abaixo para acessar sua conta.",
        FooterHref: "/doacao",
      };
    case "personal":
      return {
        headerText: "Cadastro",
        headerSubtext: "Preencha seus dados pessoais para continuar.",
        FooterHref: "/login",
      };
    case "access":
      return {
        headerText: "Cadastro",
        headerSubtext: "Crie suas credenciais de acesso.",
        FooterHref: "/login",
      };
    case "success":
      return {
        headerText: "Sucesso!",
        headerSubtext: "Sua conta foi criada com sucesso.",
      };
  }
}
