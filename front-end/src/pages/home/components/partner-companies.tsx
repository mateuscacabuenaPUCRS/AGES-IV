import inconfidenciaLogo from "@/assets/PartnerCompanies/Inconfidencia.png";
import tkeLogo from "@/assets/PartnerCompanies/TKE.png";
import pontalLogo from "@/assets/PartnerCompanies/Pontal.png";
import jockeyLogo from "@/assets/PartnerCompanies/JockeyRS.png";
import cwaLogo from "@/assets/PartnerCompanies/CWA.png";
import metaLogo from "@/assets/PartnerCompanies/MetaAgenciaDigital.png";
import paimLogo from "@/assets/PartnerCompanies/Paim.png";
import cindapaLogo from "@/assets/PartnerCompanies/Cindapa.png";
import maisALogo from "@/assets/PartnerCompanies/maisA.png";
import ondawebLogo from "@/assets/PartnerCompanies/OndaWeb.png";
import { ROUTES } from "@/constant/routes";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";

const partners = [
  { src: inconfidenciaLogo, alt: "Logo Inconfidência" },
  { src: tkeLogo, alt: "Logo TKE" },
  { src: pontalLogo, alt: "Logo Pontal" },
  { src: jockeyLogo, alt: "Logo Jockey Club" },
  { src: cwaLogo, alt: "Logo CWA" },
  { src: metaLogo, alt: "Logo Meta Agência Digital" },
  { src: paimLogo, alt: "Logo Paim" },
  { src: cindapaLogo, alt: "Logo CINDAPA" },
  { src: maisALogo, alt: "Logo maisA" },
  { src: ondawebLogo, alt: "Logo OndaWeb" },
];

const PartnerCompanies = () => {
  return (
    <div
      className="bg-[var(--color-components-2)]  flex flex-col items-center 
    px-6 md:px-12 lg:px-24 
    pt-2 md:pt-4 lg:pt-6 
    pb-4 md:pb-6 lg:pb-8 
    gap-6 md:gap-12"
    >
      <h2
        className="
      text-[#005172] font-manrope font-bold 
      text-3xl leading-[48px] tracking-[0.5px] 
      self-center md:self-start
      text-center md:text-start"
      >
        EMPRESAS PARCEIRAS
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12 align-self stretch;">
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.src}
            alt={partner.alt}
            className="w-48 h-48 object-contain max-h-24"
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link to={ROUTES.partners}>
          <Button variant="senary" size="medium" className="whitespace-nowrap">
            Saiba mais
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PartnerCompanies;
