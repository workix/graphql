## 1. Configuração do Pool de Conexões

- [ ] 1.1 Atualizar `src/config/config.json` adicionando blocos de `pool` para `development`, `test` e `production`
- [ ] 1.2 Atualizar instanciação do Sequelize em `src/models/index.ts` para repassar parâmetros de pool

## 2. Testes e Validação

- [ ] 2.1 Criar teste unitário/integração para validar a presença das configurações de pool na instância do Sequelize
- [ ] 2.2 Executar suíte de testes com `npm test` para garantir integridade funcional
