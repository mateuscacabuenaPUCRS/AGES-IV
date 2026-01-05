import inconfidenciaLogo from "@/assets/PartnerCompanies/Inconfidencia.png";
import tkeLogo from "@/assets/PartnerCompanies/TKE.png";
import pontalLogo from "@/assets/PartnerCompanies/Pontal.png";
import jockeyLogo from "@/assets/PartnerCompanies/JockeyRS.png";
import cwaLogo from "@/assets/PartnerCompanies/CWA.png";
import metaLogo from "@/assets/PartnerCompanies/MetaAgenciaDigital.png";
import cindapaLogo from "@/assets/PartnerCompanies/Cindapa.png";
import ondawebLogo from "@/assets/PartnerCompanies/OndaWeb.png";
import grupoZaffariLogo from "@/assets/PartnerCompanies/GrupoZaffari.png";
import sidersulLogo from "@/assets/PartnerCompanies/Sidersul.png";
import planaltoLogo from "@/assets/PartnerCompanies/Planalto.png";
import dryStoreLogo from "@/assets/PartnerCompanies/Drystore.png";
import banrisulLogo from "@/assets/PartnerCompanies/Banrisul.png";
import paimLogo from "@/assets/PartnerCompanies/Paim.png";
import maisALogo from "@/assets/PartnerCompanies/maisA.png";
import sindilojasLogo from "@/assets/PartnerCompanies/Sindilojas.png";
import oabLogo from "@/assets/PartnerCompanies/OAB.png";
import institutoClaroLogo from "@/assets/PartnerCompanies/InstitutoClaro.png";
import Button from "@/components/ui/button";

const companies = [
  { src: inconfidenciaLogo, alt: "Logo Inconfidência" },
  { src: tkeLogo, alt: "Logo TKE" },
  { src: pontalLogo, alt: "Logo Pontal" },
  { src: jockeyLogo, alt: "Logo Jockey Club" },
  { src: cwaLogo, alt: "Logo CWA" },
  { src: metaLogo, alt: "Logo Meta Agência Digital" },
  { src: cindapaLogo, alt: "Logo CINDAPA" },
  { src: ondawebLogo, alt: "Logo OndaWeb" },
  { src: grupoZaffariLogo, alt: "Logo Grupo Zaffari" },
  { src: sidersulLogo, alt: "Logo Sidersul" },
  { src: planaltoLogo, alt: "Logo Planalto" },
  { src: dryStoreLogo, alt: "Logo Dry Store" },
  { src: banrisulLogo, alt: "Logo Banrisul" },
];

const institutions = [
  { src: paimLogo, alt: "Logo Paim" },
  { src: maisALogo, alt: "Logo maisA" },
  { src: sindilojasLogo, alt: "Logo Sindilojas" },
  { src: oabLogo, alt: "Logo OAB" },
  { src: institutoClaroLogo, alt: "Logo Instituto Claro" },
];

const email = "relacaoinstitucional@paodospobres.com.br";

const partners = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main
        className="
        bg-white
        flex flex-col items-center 
        px-6 md:px-12 lg:px-24 
        pt-8 md:pt-16 lg:pt-20 
        pb-4
        gap-4 md:gap-8
        flex-1"
      >
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[#f68537] font-manrope font-bold text-sm md:text-base uppercase tracking-wider mb-4">
            NOSSOS APOIADORES
          </p>
          <h1 className="text-[#00D1D3] font-manrope font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
            VEJA QUEM JÁ CRIA NOVOS FUTUROS
          </h1>
        </div>

        <h2
          className="
        text-[#005172] font-manrope font-bold 
        text-3xl leading-[48px] tracking-[0.5px] 
        self-center md:self-start
        text-center md:text-start mb-4"
        >
          EMPRESAS PARCEIRAS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full mb-12 md:mb-16">
          {companies.map((company, index) => (
            <img
              key={index}
              src={company.src}
              alt={company.alt}
              className="w-55 h-55 object-contain"
            />
          ))}
        </div>

        <h2
          className="
        text-[#005172] font-manrope font-bold 
        text-3xl leading-[48px] tracking-[0.5px] 
        self-center md:self-start
        text-center md:text-start mb-4"
        >
          INSTITUIÇÕES PARCEIRAS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {institutions.map((institution, index) => (
            <img
              key={index}
              src={institution.src}
              alt={institution.alt}
              className="w-55 h-55 object-contain"
            />
          ))}
        </div>
      </main>

      <section
        className="bg-[#005172] w-full flex flex-col justify-center items-center
        px-6 md:px-12 lg:px-24 
        py-8 md:py-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white font-manrope font-extrabold text-sm uppercase tracking-wider mb-4">
            FAÇA SUA PARTE
          </p>

          <h2 className="text-2xl md:text-3xl text-white font-manrope font-bold mb-8 leading-tight">
            SAIBA COMO SUA EMPRESA PODE AJUDAR
          </h2>

          <div className="space-y-2 mb-6 text-sm md:text-base">
            <p className="text-white font-manrope font-regular leading-relaxed">
              Rua da República, 801 - Cidade Baixa - Porto Alegre/RS - CEP 91380-250
            </p>
            <p className="text-white font-manrope font-regular leading-relaxed">
              Telefones: (51) 3433-6900 | (51) 3433-6902
            </p>
            <p className="text-white font-manrope font-regular leading-relaxed">
              relacaoinstitucional@paodospobres.com.br
            </p>
          </div>

          <Button
            variant="secondary"
            size="large"
            className="!text-xl !font-bold"
            onClick={() => {
              window.location.href = `mailto:${email}`;
            }}
          >
            Entrar em contato
          </Button>
        </div>
      </section>
    </div>
  );
};

export default partners;
