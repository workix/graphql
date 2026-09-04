# Guia de Auto-Hospedagem (SELF-HOSTING.md)

Este documento fornece instruções completas e transparentes para a execução do **núcleo open source da Workix** (sob licença AGPLv3) em sua própria infraestrutura.

---

## 1. O que está incluído no Núcleo Aberto (AGPLv3)

Ao executar o repositório aberto da Workix, você dispõe de todas as capacidades essenciais de uma plataforma de recrutamento e rede profissional:
- Cadastro e gestão estruturada de perfis de candidatos e currículos;
- Criação e administração de Company Pages e vagas de emprego;
- Busca avançada com fórmula de ranqueamento orgânico auditável (`RANKING.md`);
- Funil de candidaturas (Kanban de processos seletivos);
- Mensageria direta entre empresas e candidatos;
- Sistema de controle de privacidade em 3 chaves (`visibility_settings`) e função `reveal()`;
- Rotulagem compulsória de itens patrocinados (`is_sponsored = true`);
- Rotinas de LGPD (exportação, anonimização e exclusão de dados).

---

## 2. O que NÃO está incluído no Núcleo Aberto (Módulos Comerciais)

Os seguintes recursos fazem parte da edição comercial proprietária (**Workix Enterprise** / White-Label) e requerem licenciamento comercial:
- Motor de alocação de leilão e precificação de destaques pagos;
- Gestão multi-tenant isolada para associações setoriais, sindicatos e centros universitários;
- Conectores avançados de ERP/ATS corporativos;
- Painel administrativo automatizado de antifraude e faturamento recorrente internacional.

---

## 3. Pré-Requisitos de Infraestrutura

- **Node.js**: v18.x ou v20.x LTS
- **Banco de Dados**: PostgreSQL 14+, MySQL 8+ ou SQLite (para testes locais)
- **Cache**: Redis 6+ (opcional para desenvolvimento, recomendado para produção)
- **Mensageria**: RabbitMQ 3.9+ (para fila assíncrona de notificações)
- **Provedor de Autenticação**: Firebase Authentication ou emulador local

---

## 4. Passo a Passo de Instalação e Execução

### 1. Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/frmichetti/graphql.git
cd graphql
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e preencha as variáveis de banco de dados e segredos locais:
```bash
cp .env.default .env
```

### 3. Executar Migrações e Seeds
```bash
npm run migrate
npm run seed
```

### 4. Iniciar o Servidor em Modo de Desenvolvimento
```bash
npm run dev
```

A API GraphQL estará disponível em `http://localhost:4000/graphql` com playground GraphiQL ativo.

---

## 5. Licença e Suporte

- O núcleo é licenciado sob **AGPLv3**. Modificações disponibilizadas em rede devem ter o código-fonte correspondente liberado sob os mesmos termos.
- Para suporte corporativo, edições white-label ou licenciamento do motor comercial, entre em contato: `contato@workix.com.br` ou `frmichetti@gmail.com`.
