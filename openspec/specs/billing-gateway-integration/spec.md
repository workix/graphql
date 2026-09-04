# billing-gateway-integration Specification

## Purpose
Especifica a integração com gateway de faturamento brasileiro (Asaas/Iugu), provendo suporte a pagamentos via Pix, Cartão e Boleto, emissão automática de NFS-e, e processamento idempotente de webhooks com trilha de auditoria.

## Requirements

### Requirement: Processamento de Assinaturas e Compras Avulsas via Gateway
O sistema SHALL integrar com provedor de pagamentos nacional para criação e gestão de clientes, cobrança recorrente de assinaturas (cartão/boleto anual) e compras pontuais via Pix de destaques e pacotes de créditos.

#### Scenario: Checkout de compra avulsa via Pix
- **WHEN** a empresa seleciona compra de destaque ou pacote de créditos e opta por Pix
- **THEN** o sistema gera o QR Code / copia-e-cola Pix via gateway e aguarda confirmação de liquidação para liberação imediata.

### Requirement: Idempotência de Webhooks e Persistência Prévia
O sistema SHALL persistir todo payload de webhook recebido na tabela `webhook_events` antes do processamento, garantindo tratamento idempotente através do identificador único do evento (`gateway_event_id`).

#### Scenario: Recebimento de webhook duplicado do gateway
- **WHEN** o webhook de confirmação de pagamento é reenviado pelo gateway
- **THEN** o sistema detecta que o `gateway_event_id` já foi processado com sucesso e responde confirmação HTTP 200 sem aplicar débitos ou créditos repetidos.

### Requirement: Emissão e Disponibilização de NFS-e Automática
O sistema SHALL registrar o identificador e link do documento fiscal (`nfse_number`, `nfse_url`) nas entidades `invoices` e `purchases` após emissão pelo gateway parceiro, disponibilizando acesso na tela de faturas do cliente.

#### Scenario: Consulta de nota fiscal pelo cliente
- **WHEN** o administrador da organização acessa o histórico de faturas no painel
- **THEN** o sistema exibe a lista de cobranças quitadas com link direto para download da respectiva NFS-e emitida.
