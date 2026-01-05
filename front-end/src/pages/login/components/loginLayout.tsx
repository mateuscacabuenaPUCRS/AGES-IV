import React from "react";
import logoLogin from "@/assets/logo-pp-login.png";
import bgLogin from "@/assets/fundo-pp.png";
import Link from "@/components/ui/link";

function loginLayout({
  headerText,
  headerSubtext,
  FooterHref,
  children,
}: {
  children: React.ReactNode;
  headerText: string;
  headerSubtext: string;
  FooterHref?: string;
}) {
  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 57, 80, 0.6) 66.98%, rgba(0, 81, 114, 0.6) 100%), url(${bgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex items-center justify-center min-h-full px-4 py-4">
        <main
          className="
            w-full max-w-[400px]
            bg-[#D2D2D2E0] backdrop-blur
            shadow-2xl
            py-4 px-3 sm:py-6 sm:px-5
            rounded-xl
          "
          aria-label="Card de Login"
        >
          <div className="flex flex-col items-center gap-2 my-2">
            <img src={logoLogin} alt="Pão dos Pobres" className="h-8 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-900">{headerText}</h1>
            <p className="text-xs sm:text-sm text-sky-900/80 text-center font-bold">
              {headerSubtext}
            </p>
          </div>
          {children}
          {FooterHref && (
            <Link href={FooterHref}>
              {FooterHref === "/doacao" ? "Fazer doação anônima" : "Já tem uma conta? Acesse."}
            </Link>
          )}
        </main>
      </div>
    </div>
  );
}

export default loginLayout;
