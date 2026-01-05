import { Prisma } from "@prisma/client";

export const eventsMock: Prisma.EventsCreateInput[] = [
  {
    title: "Feira de Tecnologia e Inovação",
    description: "Evento voltado para apresentação de novas soluções tecnológicas e startups promissoras.",
    dateStart: new Date("2025-02-10T09:00:00"),
    dateEnd: new Date("2025-02-12T18:00:00"),
    location: "Centro de Convenções de São Paulo, SP",
    url: "https://feiratecinovacao.com.br"
  },
  {
    title: "Congresso Nacional de Sustentabilidade",
    description: "Discussões sobre práticas sustentáveis e políticas ambientais no Brasil.",
    dateStart: new Date("2025-03-05T08:30:00"),
    dateEnd: new Date("2025-03-07T17:00:00"),
    location: "Auditório do Ministério do Meio Ambiente, Brasília, DF",
    url: "https://congressosustentavel.org"
  },
  {
    title: "Festival de Música Independente",
    description: "Apresentações de bandas e artistas independentes de todo o país.",
    dateStart: new Date("2025-04-15T18:00:00"),
    dateEnd: new Date("2025-04-17T23:59:00"),
    location: "Parque da Juventude, São Paulo, SP",
    url: "https://festivalindependente.com"
  },
  {
    title: "Semana do Empreendedor",
    description: "Workshops e palestras sobre empreendedorismo, inovação e gestão de negócios.",
    dateStart: new Date("2025-05-02T09:00:00"),
    dateEnd: new Date("2025-05-06T17:30:00"),
    location: "Sebrae Minas, Belo Horizonte, MG",
    url: "https://semanadoempreendedor.com.br"
  },
  {
    title: "Hackathon Universitário 2025",
    description: "Competição de programação entre estudantes universitários com foco em soluções sociais.",
    dateStart: new Date("2025-06-20T10:00:00"),
    dateEnd: new Date("2025-06-22T18:00:00"),
    location: "Campus da UFRJ, Rio de Janeiro, RJ",
    url: "https://hackuniv2025.com"
  },
  {
    title: "Exposição de Arte Contemporânea",
    description: "Mostra com artistas emergentes e renomados da cena contemporânea brasileira.",
    dateStart: new Date("2025-07-10T10:00:00"),
    dateEnd: new Date("2025-07-30T20:00:00"),
    location: "Museu de Arte Moderna, Rio de Janeiro, RJ",
    url: "https://mamrj.org/exposicoes"
  },
  {
    title: "Encontro Nacional de Educação",
    description: "Debates sobre políticas públicas, tecnologia e inovação no ensino básico e superior.",
    dateStart: new Date("2025-08-12T09:00:00"),
    dateEnd: new Date("2025-08-15T18:00:00"),
    location: "Centro de Eventos do Ceará, Fortaleza, CE",
    url: "https://educa2025.org"
  },
  {
    title: "Fórum Brasileiro de Inteligência Artificial",
    description: "Especialistas discutem os impactos e oportunidades da IA na sociedade.",
    dateStart: new Date("2025-09-18T08:30:00"),
    dateEnd: new Date("2025-09-19T17:30:00"),
    location: "Centro de Inovação ACATE, Florianópolis, SC",
    url: "https://forumia2025.com.br"
  },
  {
    title: "Mostra de Cinema Nacional",
    description: "Exibição de filmes brasileiros independentes e clássicos restaurados.",
    dateStart: new Date("2025-10-05T14:00:00"),
    dateEnd: new Date("2025-10-12T22:00:00"),
    location: "Cine Belas Artes, São Paulo, SP",
    url: "https://mostracinema2025.com.br"
  },
  {
    title: "Conferência de Segurança da Informação",
    description: "Palestras e painéis sobre cibersegurança e privacidade de dados.",
    dateStart: new Date("2025-11-03T09:00:00"),
    dateEnd: new Date("2025-11-05T18:00:00"),
    location: "Centro de Convenções Frei Caneca, São Paulo, SP",
    url: "https://secinfobrasil.com"
  },
  {
    title: "Feira Nacional do Livro",
    description: "Lançamento de livros, sessões de autógrafos e palestras com autores renomados.",
    dateStart: new Date("2025-11-20T10:00:00"),
    dateEnd: new Date("2025-11-25T21:00:00"),
    location: "Centro Cultural Dragão do Mar, Fortaleza, CE",
    url: "https://feiradolivro2025.com.br"
  },
  {
    title: "Encontro de Desenvolvedores Web",
    description: "Técnicas modernas de desenvolvimento com foco em performance e segurança.",
    dateStart: new Date("2025-12-01T08:00:00"),
    dateEnd: new Date("2025-12-02T17:30:00"),
    location: "PUC-RS, Porto Alegre, RS",
    url: "https://devbrasil2025.com"
  },
  {
    title: "Festival de Gastronomia Brasileira",
    description: "Culinária típica de todas as regiões do país em um só lugar.",
    dateStart: new Date("2025-12-10T12:00:00"),
    dateEnd: new Date("2025-12-15T23:00:00"),
    location: "Praça da Liberdade, Belo Horizonte, MG",
    url: "https://festgastrobrasil.com"
  },
  {
    title: "Feira de Empregos e Estágios",
    description: "Oportunidades para jovens e profissionais em transição de carreira.",
    dateStart: new Date("2026-01-15T09:00:00"),
    dateEnd: new Date("2026-01-17T18:00:00"),
    location: "Expo Center Norte, São Paulo, SP",
    url: "https://feiradeempregos.com.br"
  },
  {
    title: "Encontro Nacional de Startups",
    description: "Investidores e empreendedores se reúnem para networking e pitches de inovação.",
    dateStart: new Date("2026-02-03T08:00:00"),
    dateEnd: new Date("2026-02-04T18:00:00"),
    location: "Cubo Itaú, São Paulo, SP",
    url: "https://startupbrasil2026.com"
  },
  {
    title: "Seminário de Direito Digital",
    description: "Discussão sobre regulamentação da internet, LGPD e crimes cibernéticos.",
    dateStart: new Date("2026-03-10T09:30:00"),
    dateEnd: new Date("2026-03-11T17:30:00"),
    location: "OAB São Paulo, SP",
    url: "https://direitodigital2026.org"
  },
  {
    title: "Maratona de Programação Solidária",
    description: "Evento beneficente de programação para ajudar ONGs locais.",
    dateStart: new Date("2026-04-05T09:00:00"),
    dateEnd: new Date("2026-04-06T18:00:00"),
    location: "Senac Campinas, SP",
    url: "https://maratonasolidaria.com.br"
  },
  {
    title: "Fórum Nacional de Saúde Mental",
    description: "Debates sobre políticas públicas e novas abordagens terapêuticas.",
    dateStart: new Date("2026-05-10T08:00:00"),
    dateEnd: new Date("2026-05-12T17:00:00"),
    location: "Centro de Convenções Ulysses Guimarães, Brasília, DF",
    url: "https://saudemental2026.com.br"
  },
  {
    title: "Simpósio de Robótica e Automação",
    description: "Apresentação de pesquisas e protótipos inovadores da indústria 4.0.",
    dateStart: new Date("2026-06-02T08:30:00"),
    dateEnd: new Date("2026-06-04T18:00:00"),
    location: "UFSC, Florianópolis, SC",
    url: "https://robotica2026.com"
  },
  {
    title: "Encontro Nacional de Cultura Popular",
    description: "Música, dança, teatro e arte popular de todas as regiões do Brasil.",
    dateStart: new Date("2026-07-15T10:00:00"),
    dateEnd: new Date("2026-07-20T22:00:00"),
    location: "Pelourinho, Salvador, BA",
    url: "https://culturanacional2026.com.br"
  }
];
