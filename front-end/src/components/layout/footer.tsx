import { Link } from "react-router-dom";
import LogoIcon from "@/assets/Logo.svg?react";
import { WhatsAppIcon } from "@/icons/whatsappIcon";
import { EmailIcon } from "@/icons/emailIcon";
import { LinkedinIcon } from "@/icons/linkedinIcon";

export function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="bg-[var(--color-components-2)] w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="transition-transform hover:scale-105">
              <LogoIcon className="h-16 w-auto fill-current text-[var(--color-components)]" />
            </Link>
            <p className="text-sm text-center md:text-left max-w-xs">
              Fundação Pão dos Pobres de Santo Antônio
            </p>
          </div>

          <div className="text-center md:text-left flex flex-col gap-3">
            <h3 className="text-lg font-bold">Endereço</h3>
            <address className="not-italic leading-relaxed">
              R. da República, 801
              <br />
              Cidade Baixa
              <br />
              Porto Alegre, RS
              <br />
              CEP: 90050-321
            </address>
          </div>

          <div className="text-center md:text-left flex flex-col gap-3">
            <h3 className="text-lg font-bold">Contatos</h3>
            <div className="leading-relaxed">
              <p className="mt-1">
                Segunda à Sexta
                <br />
                8h às 12h | 13h às 17h
              </p>
            </div>
            <div className="flex justify-center md:justify-start gap-3 mt-2">
              <a
                href="mailto:relacaoinstitucional@paodospobres.com.br"
                className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-[#003366] hover:text-white transition-all shadow-sm hover:shadow-md"
                title="E-mail: relacaoinstitucional@paodospobres.com.br"
                aria-label="Enviar e-mail"
              >
                <EmailIcon className="w-5 h-5" />
              </a>

              <a
                href="https://wa.me/555134336900"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-[#25D366] hover:text-white transition-all shadow-sm hover:shadow-md"
                title="WhatsApp: (51) 3433-6900"
                aria-label="Abrir WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>

              <a
                href="https://www.linkedin.com/company/fundacao-pao-dos-pobres/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-[#0077B5] hover:text-white transition-all shadow-sm hover:shadow-md"
                title="LinkedIn: Fundação Pão dos Pobres"
                aria-label="Abrir LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-center">
            Copyright &copy; {year} - Pão dos Pobres. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
