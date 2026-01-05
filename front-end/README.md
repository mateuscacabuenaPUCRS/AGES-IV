# Pão dos Pobres Frontend

Frontend da aplicação Pão dos Pobres, desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **yarn** como gerenciador de pacotes
- **Git** para controle de versão

Para verificar se possui as versões corretas instaladas:

```bash
node --version  # deve retornar v18.x.x ou superior
yarn --version   # deve retornar uma versão recente
```

## Como rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd front-end
   ```

2. **Instale as dependências:**

   ```bash
   yarn
   ```

3. **Rode o projeto em modo desenvolvimento:**

   ```bash
   yarn dev
   ```

   O projeto estará disponível em `http://localhost:15570`

4. **Para build de produção:**

   ```bash
   yarn build
   ```

5. **Para visualizar o build de produção:**
   ```bash
   yarn preview
   ```

## Estrutura de Pastas e Arquivos

- **build/**: Arquivos gerados após o build do projeto (CSS, HTML, JS, imagens). Não edite manualmente.
- **public/**: Arquivos estáticos públicos, como imagens. São servidos diretamente pelo servidor.
- **src/**: Código-fonte principal do projeto.
  - **App.tsx**: Componente principal da aplicação.
  - **App.css / index.css**: Estilos globais e do app.
  - **main.tsx**: Ponto de entrada da aplicação React.
  - **assets/**: Imagens e ícones usados no projeto.
  - **components/**: Componentes reutilizáveis.
    - **layout/**: Componentes de layout, como Navbar e AppShell.
    - **ui/**: Componentes de interface, como botões.
  - **constant/**: Constantes globais, como rotas.
  - **hooks/**: Hooks personalizados do React.
  - **pages/**: Páginas da aplicação (ex: Home, NotFound).
  - **services/**: Serviços para chamadas de API.
  - **skeletons/**: Componentes de loading/skeleton.
  - **types/**: Tipos TypeScript usados no projeto.
  - **utils/**: Funções utilitárias.
- **index.html**: HTML principal usado pelo Vite.
- **package.json**: Gerenciamento de dependências e scripts do projeto.
- **README.md**: Documentação do projeto.
- **tailwind.config.js**: Configuração do Tailwind CSS.
- **tsconfig.json / tsconfig.app.json / tsconfig.node.json**: Configurações do TypeScript.
- **vite.config.ts**: Configuração do Vite.
- **eslint.config.js**: Configuração do ESLint.

## Scripts Disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento
- `yarn build` - Gera build de produção
- `yarn preview` - Visualiza o build de produção localmente
- `yarn lint` - Executa verificação de código com ESLint
- `yarn format` - Formata o código com Prettier

## Desenvolvimento

### Adicionando Novas Páginas

1. Crie um arquivo em `src/pages/` (ex: `nova-pagina.tsx`)
2. Adicione a rota em `src/constant/routes.ts`
3. Configure a rota no roteador da aplicação

### Criando Componentes

- **Componentes reutilizáveis**: `src/components/ui/`
- **Componentes de layout**: `src/components/layout/`
- **Hooks personalizados**: `src/hooks/`

### Estilos

- Utilize classes do **Tailwind CSS** para estilização
- Estilos globais em `src/index.css` e `src/App.css`

## Documentação e Recursos

Para aprender mais sobre as tecnologias utilizadas:

- [React](https://react.dev/) - Biblioteca para interfaces de usuário
- [TypeScript](https://www.typescriptlang.org/) - JavaScript com tipagem estática
- [Vite](https://vitejs.dev/) - Build tool rápida para desenvolvimento
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [React Router](https://reactrouter.com/) - Roteamento para React