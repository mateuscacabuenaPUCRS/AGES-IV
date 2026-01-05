import { faker } from "@faker-js/faker";
import { Prisma, CampaignStatus } from "@prisma/client";

const campaignTitles = [
  "Ajuda para Famílias Carentes",
  "Campanha do Agasalho",
  "Doação de Alimentos",
  "Reforma da Cozinha Comunitária",
  "Material Escolar para Crianças",
  "Campanha de Natal",
  "Auxílio para Idosos",
  "Projeto Horta Comunitária",
  "Distribuição de Medicamentos",
  "Construção de Brinquedoteca",
  "Programa de Alfabetização",
  "Campanha contra a Fome",
  "Assistência Médica Gratuita",
  "Reforma do Telhado",
  "Compra de Equipamentos",
  "Projeto de Capacitação",
  "Auxílio Funeral",
  "Campanha do Leite",
  "Doação de Roupas",
  "Projeto Panela Cheia",
  "Assistência Jurídica",
  "Campanha de Páscoa",
  "Projeto Mãos que Ajudam",
  "Doação de Fraldas",
  "Reforma do Refeitório",
  "Campanha Volta às Aulas",
  "Projeto Sorriso de Criança",
  "Auxílio para Gestantes",
  "Distribuição de Cestas Básicas",
  "Campanha Inverno Solidário"
];

const campaignDescriptions = [
  "Uma iniciativa para auxiliar famílias em situação de vulnerabilidade social com doações de alimentos, roupas e produtos de higiene básica.",
  "Campanha de arrecadação de agasalhos para distribuição durante o período de inverno para pessoas em situação de rua e famílias carentes.",
  "Projeto focado na arrecadação e distribuição de alimentos não perecíveis para famílias que passam por dificuldades financeiras.",
  "Reforma completa da cozinha comunitária que atende diariamente centenas de pessoas em situação de vulnerabilidade.",
  "Arrecadação de material escolar para crianças de famílias de baixa renda garantirem seu direito à educação.",
  "Campanha especial de Natal para proporcionar uma ceia digna e presentes para crianças carentes da comunidade.",
  "Projeto de assistência a idosos em situação de abandono, oferecendo cuidados básicos de saúde e alimentação.",
  "Criação de uma horta comunitária para produção de alimentos orgânicos e geração de renda para a comunidade.",
  "Distribuição gratuita de medicamentos básicos para pessoas que não têm condições de adquiri-los.",
  "Construção de um espaço lúdico e educativo para o desenvolvimento integral das crianças da comunidade.",
  "Programa de alfabetização para jovens e adultos que não tiveram oportunidade de estudar na idade apropriada.",
  "Iniciativa para combater a fome através da distribuição regular de refeições e cestas básicas.",
  "Prestação de serviços médicos gratuitos através de mutirões de saúde na comunidade.",
  "Reparo urgente do telhado que protege o refeitório comunitário que atende centenas de pessoas diariamente.",
  "Aquisição de equipamentos essenciais para melhorar o atendimento à comunidade carente.",
  "Projeto de capacitação profissional para jovens e adultos em busca de oportunidades no mercado de trabalho.",
  "Auxílio financeiro para famílias carentes que perderam entes queridos e não têm condições de arcar com despesas funerárias.",
  "Campanha permanente de arrecadação e distribuição de leite para crianças e famílias em situação de insegurança alimentar.",
  "Coleta e distribuição de roupas em bom estado para pessoas em situação de vulnerabilidade social.",
  "Projeto que garante refeições diárias para pessoas em situação de rua e famílias carentes.",
  "Prestação de assistência jurídica gratuita para pessoas de baixa renda que precisam resolver questões legais.",
  "Campanha especial de Páscoa para distribuição de chocolates e cestas básicas para famílias carentes.",
  "Projeto que mobiliza voluntários para diversas ações de assistência social na comunidade.",
  "Arrecadação e distribuição de fraldas para famílias com bebês em situação de vulnerabilidade social.",
  "Reforma do refeitório comunitário para melhorar as condições de higiene e capacidade de atendimento.",
  "Campanha de início do ano letivo para garantir que todas as crianças tenham acesso aos materiais escolares necessários.",
  "Projeto focado no bem-estar e desenvolvimento de crianças através de atividades lúdicas e educativas.",
  "Assistência especializada para gestantes em situação de vulnerabilidade, incluindo acompanhamento pré-natal.",
  "Distribuição mensal de cestas básicas para famílias em situação de insegurança alimentar.",
  "Campanha de inverno para distribuição de cobertores, sopas e agasalhos para pessoas em situação de rua."
];

export const campaignsMock: (
  adminIds: string[],
  donorUserIds: string[]
) => Prisma.CampaignCreateInput[] = (
  adminIds: string[],
  donorUserIds: string[]
) => {
  const allCreatorIds = [...adminIds, ...donorUserIds];

  const mocks = [
    ...Array.from({ length: 25 }).map((_, index) => {
      const roundTargets = [
        5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000,
        40000, 45000, 50000
      ];
      const targetAmount = faker.helpers.arrayElement(roundTargets);
      const currentAmount = faker.number.float({
        min: 0,
        max: targetAmount * 0.8,
        fractionDigits: 2
      });
      const startDate = faker.date.between({
        from: "2025-01-01",
        to: "2025-09-01"
      });
      const endDate = faker.date.between({
        from: "2025-11-01",
        to: "2026-12-31"
      });

      return {
        title: campaignTitles[index],
        description: campaignDescriptions[index],
        targetAmount,
        currentAmount,
        startDate,
        endDate,
        imageUrl: faker.image.url({ width: 800, height: 600 }),
        status: CampaignStatus.ACTIVE,
        user: {
          connect: { id: faker.helpers.arrayElement(allCreatorIds) }
        }
      };
    }),

    ...Array.from({ length: 5 }).map((_, index) => {
      const roundTargetsFinished = [
        3000, 5000, 8000, 10000, 12000, 15000, 18000, 20000, 25000
      ];
      const targetAmount = faker.helpers.arrayElement(roundTargetsFinished);
      const currentAmount = faker.number.float({
        min: targetAmount * 0.95,
        max: targetAmount * 1.2,
        fractionDigits: 2
      });
      const startDate = faker.date.between({
        from: "2024-03-01",
        to: "2024-12-01"
      });
      const endDate = faker.date.between({
        from: "2025-01-01",
        to: "2025-09-30"
      });

      return {
        title: campaignTitles[index + 25],
        description: campaignDescriptions[index + 25],
        targetAmount,
        currentAmount,
        startDate,
        endDate,
        imageUrl: faker.image.url({ width: 800, height: 600 }),
        status: CampaignStatus.FINISHED,
        user: {
          connect: { id: faker.helpers.arrayElement(allCreatorIds) }
        }
      };
    })
  ];

  const specificCampaign: Prisma.CampaignCreateInput = {
    title: "Campanha Pão dos Pobres",
    description:
      "A Campanha Pão dos Pobres busca arrecadar fundos e alimentos para fornecer refeições diárias a pessoas em situação de rua e famílias em extrema vulnerabilidade. Nosso objetivo é garantir dignidade e nutrição a quem mais precisa.",
    targetAmount: 25000,
    currentAmount: faker.number.float({ min: 100000, max: 200000, fractionDigits: 2 }),
    startDate: new Date("2025-10-01"),
    endDate: new Date("2026-03-30"),
    imageUrl: faker.image.url({ width: 800, height: 600 }),
    status: CampaignStatus.ACTIVE,
    isRoot: true,
    user: {
      connect: { id: faker.helpers.arrayElement(allCreatorIds) }
    }
  };

  return [...mocks, specificCampaign];
};