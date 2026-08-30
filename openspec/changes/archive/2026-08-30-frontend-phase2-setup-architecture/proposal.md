## Why

Após concluir a análise e inventário funcional na Fase 1, precisamos criar e estruturar fisicamente a arquitetura base dos dois frontends no repositório (`frontend/client` para o portal do cliente e `frontend/admin` para o painel administrativo). Esta Fase 2 realiza o scaffolding completo das aplicações em Vue 3 + Vite, instala as dependências necessárias (incluindo Vuetify 3 no admin), configura o roteamento, estado (Pinia), serviço HTTP centralizado e variáveis de ambiente.

## What Changes

- **Scaffolding de `frontend/client`**: Criação da estrutura Vue 3 + Vite para o portal do cliente, importação dos assets e estilos do Design Spec Jobseek.
- **Scaffolding de `frontend/admin`**: Criação da estrutura Vue 3 + Vite para o painel administrativo com integração e configuração do **Vuetify 3** (plugins, ícones, tema).
- **Configuração de Roteamento (Vue Router)**: Estruturação dos arquivos `router/index.ts` com guards de navegação base (autenticação e permissões) para ambos os frontends.
- **Gerenciamento de Estado (Pinia)**: Instalação e criação das stores base (`auth`, `user`) nos dois frontends.
- **Camada de Serviços HTTP (Axios)**: Criação do cliente HTTP centralizado em `src/services/api.ts` com interceptors para envio do token JWT no header `Authorization`.
- **Configuração de Ambientes**: Criação dos arquivos `.env` e `.env.development` com `VITE_API_BASE_URL`.

## Capabilities

### New Capabilities
- `frontend-setup-architecture`: Estruturação base, scaffolding e configuração técnica das aplicações `frontend/client` e `frontend/admin`.

### Modified Capabilities

Nenhuma capacidade existente foi modificada.

## Impact

- **Código**: Criação dos subdiretórios `frontend/client/` e `frontend/admin/` com `package.json`, `vite.config.ts`, `src/`, etc.
- **Sistemas**: Estabelece os dois projetos executáveis prontos para receber a implementação das views nas Fases 3 e 4.
