import { Prisma } from "@prisma/client";

export const newsMock: Prisma.NewsCreateInput[] = [
  {
    title: "Prefeitura anuncia novo programa de reciclagem nos bairros",
    description: "A Prefeitura lançou um programa de coleta seletiva que visa aumentar em 40% o reaproveitamento de resíduos recicláveis até o fim de 2026. A ação inclui pontos de coleta em escolas e praças públicas.",
    date: new Date("2025-10-25T09:00:00"),
    location: "São Paulo, SP",
    url: "https://noticiasambientais.com.br/reciclagem-bairros",
    createdAt: new Date("2025-10-25T09:30:00"),
    updatedAt: new Date("2025-10-25T09:30:00")
  },
  {
    title: "Universidade Federal inaugura laboratório de robótica avançada",
    description: "O novo centro de pesquisa vai atender estudantes de engenharia e tecnologia, com foco em automação e inteligência artificial aplicada à indústria.",
    date: new Date("2025-09-14T10:00:00"),
    location: "Belo Horizonte, MG",
    url: "https://tecnociencia.com.br/lab-robotica-ufmg",
    createdAt: new Date("2025-09-14T10:30:00"),
    updatedAt: new Date("2025-09-14T10:30:00")
  },
  {
    title: "Campanha arrecada 20 toneladas de alimentos em um fim de semana",
    description: "A ação solidária promovida por voluntários em parceria com supermercados locais beneficiará mais de 3 mil famílias em situação de vulnerabilidade.",
    date: new Date("2025-08-12T12:00:00"),
    location: "Curitiba, PR",
    url: "https://solidariedadebrasil.org/doacao-alimentos",
    createdAt: new Date("2025-08-12T12:30:00"),
    updatedAt: new Date("2025-08-12T12:30:00")
  },
  {
    title: "Festival de cinema nacional bate recorde de público",
    description: "Mais de 50 mil pessoas compareceram ao evento que exibiu produções independentes e homenageou diretores consagrados do cinema brasileiro.",
    date: new Date("2025-07-20T19:00:00"),
    location: "Recife, PE",
    url: "https://culturabrasil.com/festival-cinema-2025",
    createdAt: new Date("2025-07-20T19:15:00"),
    updatedAt: new Date("2025-07-20T19:15:00")
  },
  {
    title: "Empresa brasileira lança aplicativo para monitorar gastos domésticos",
    description: "A ferramenta permite categorizar despesas e criar metas mensais, com foco em ajudar famílias a economizarem mais de 20% por mês.",
    date: new Date("2025-06-02T08:00:00"),
    location: "São Paulo, SP",
    url: "https://tecnologiafinanceira.com/app-gastos",
    createdAt: new Date("2025-06-02T08:30:00"),
    updatedAt: new Date("2025-06-02T08:30:00")
  },
  {
    title: "Pesquisadores desenvolvem vacina promissora contra nova variante da gripe",
    description: "Os testes clínicos da vacina, realizados em parceria com o Instituto Butantan, mostram eficácia de 92% em voluntários.",
    date: new Date("2025-05-15T09:00:00"),
    location: "Rio de Janeiro, RJ",
    url: "https://saudebrasil.com/vacina-gripe-2025",
    createdAt: new Date("2025-05-15T09:30:00"),
    updatedAt: new Date("2025-05-15T09:30:00")
  },
  {
    title: "Biblioteca pública inaugura espaço de leitura infantil",
    description: "O novo ambiente conta com mais de 2 mil livros voltados ao público infantil, além de atividades recreativas e oficinas de contação de histórias.",
    date: new Date("2025-04-28T10:00:00"),
    location: "Porto Alegre, RS",
    url: "https://culturacrianca.com/espaco-leitura",
    createdAt: new Date("2025-04-28T10:15:00"),
    updatedAt: new Date("2025-04-28T10:15:00")
  },
  {
    title: "Parque eólico no Nordeste começa a operar com capacidade recorde",
    description: "O complexo gerará energia suficiente para abastecer cerca de 600 mil residências, reforçando a matriz energética renovável do país.",
    date: new Date("2025-03-10T11:00:00"),
    location: "Caetité, BA",
    url: "https://energiahoje.com/parque-eolico-2025",
    createdAt: new Date("2025-03-10T11:30:00"),
    updatedAt: new Date("2025-03-10T11:30:00")
  },
  {
    title: "Nova lei de incentivo à cultura é aprovada no Congresso",
    description: "A proposta amplia os recursos destinados a projetos culturais regionais e estimula a descentralização de investimentos.",
    date: new Date("2025-02-21T14:00:00"),
    location: "Brasília, DF",
    url: "https://politicacultural.com/lei-cultura-2025",
    createdAt: new Date("2025-02-21T14:15:00"),
    updatedAt: new Date("2025-02-21T14:15:00")
  },
  {
    title: "Pesquisadores brasileiros descobrem nova espécie de orquídea na Amazônia",
    description: "A planta, encontrada em uma área de difícil acesso, apresenta coloração rara e pode contribuir para estudos sobre biodiversidade.",
    date: new Date("2025-01-18T07:00:00"),
    location: "Manaus, AM",
    url: "https://amazoniaverde.com/orquidea-rara-2025",
    createdAt: new Date("2025-01-18T07:15:00"),
    updatedAt: new Date("2025-01-18T07:15:00")
  }
];
