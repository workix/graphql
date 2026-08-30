## 1. Setup do Frontend do Cliente (`frontend/client`)

- [x] 1.1 Criar a estrutura física do projeto Vue 3 + Vite em `frontend/client` (package.json, tsconfig.json, vite.config.ts, index.html).
- [x] 1.2 Copiar e organizar os assets, fontes e CSS do template Jobseek (`frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template/template`) em `frontend/client/src/assets/`.
- [x] 1.3 Configurar o Vue Router e Pinia store base (`auth`) no frontend Cliente.
- [x] 1.4 Criar a camada de serviço HTTP Axios em `frontend/client/src/services/api.ts` com suporte a token JWT.

## 2. Setup do Frontend Administrativo (`frontend/admin`)

- [x] 2.1 Criar a estrutura física do projeto Vue 3 + Vite em `frontend/admin` (package.json, tsconfig.json, vite.config.ts, index.html).
- [x] 2.2 Instalar e configurar o **Vuetify 3** com suporte a Material Design Icons e tema customizado em `frontend/admin/src/plugins/vuetify.ts`.
- [x] 2.3 Configurar o Vue Router com proteção de rotas para perfil `ROLE_ADMIN` e Pinia store base (`adminAuth`).
- [x] 2.4 Criar a camada de serviço HTTP Axios em `frontend/admin/src/services/api.ts`.

## 3. Configurações Globais e Validação

- [x] 3.1 Criar arquivos `.env` e `.env.development` com `VITE_API_BASE_URL` para ambos os frontends.
- [x] 3.2 Atualizar `FRONTEND_IMPLEMENTATION.md` registrando o progresso do setup da arquitetura.
