## ADDED Requirements

### Requirement: Serviço de Notificações Push Firebase FCM em Kotlin
O sistema SHALL implementar a classe `MyFirebaseMessagingService` em Kotlin para interceptar mensagens recebidas do Firebase Cloud Messaging (FCM) e exibir notificações de sistema nativas utilizando `NotificationCompat.Builder` e `NotificationManager`.

#### Scenario: Recebimento de Notificação Push
- **WHEN** uma mensagem push do Firebase é entregue ao dispositivo Android
- **THEN** a `MyFirebaseMessagingService` processa o payload e exibe a notificação no painel do Android.

### Requirement: Suíte de Testes Unitários da Arquitetura
O sistema SHALL disponibilizar testes unitários em Kotlin (`NetworkResultTest`, `SessionManagerTest`) para validar isoladamente a manipulação de respostas HTTP, os estados de erro e a persistência de sessão.

#### Scenario: Validação de Estado de Rede em Sucesso
- **WHEN** o `NetworkResult.Success` é instanciado com dados de modelo
- **THEN** o objeto encapsulado é retornado e o estado é confirmado como sucesso.
