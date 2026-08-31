# Prompt de Ações — Diagnóstico e Gestão de Memória/CPU em Projetos Java

> **v2** — mesma estrutura de diagnóstico do prompt original, com uma fase nova (25-B) que detalha, para cada categoria de causa, a **medida de gerenciamento concreta a aplicar**, o **padrão de código de referência**, a **configuração recomendada**, os **trade-offs** e a **forma de validar**. Isso fecha o ciclo: diagnóstico → causa → correção padronizada → validação.

## Objetivo

Analisar um projeto Java de forma completa para identificar causas de:

* Vazamento de memória e crescimento contínuo de RAM;
* Garbage Collection excessivo / pausas longas;
* Alto consumo de CPU;
* Threads em execução contínua, mal dimensionadas ou vazando;
* Loops, polling e schedulers em excesso ou sobrepostos;
* Filas crescendo indefinidamente (backlog);
* Conexões HTTP/DB, streams e arquivos não liberados;
* Caches, collections e objetos estáticos sem limite;
* Retries agressivos e chamadas externas repetitivas;
* Processamento em background desnecessário.

E, uma vez identificadas as causas, **propor e aplicar a medida de gerenciamento correta**, com evidência, risco e forma de validação — nunca uma alteração especulativa.

---

# REGRA PRINCIPAL

**Não altere o código antes de ter evidência.**

Sequência obrigatória:

```text
1. Levantar evidência (estática + runtime, quando possível)
2. Formular hipótese de causa
3. Confirmar causa com profiling/dump/logs
4. Selecionar a medida de gerenciamento adequada (Fase 25-B)
5. Aplicar a menor mudança possível
6. Validar com métrica objetiva (antes/depois)
```

Não faça alterações do tipo "vamos aumentar Xmx", "vamos aumentar o pool", "vamos colocar sleep" sem evidência e sem métrica de validação associada.

---

# FASE 1 — IDENTIFICAÇÃO DO PROJETO

Identifique: tipo de aplicação, framework, versão do Java, versão do Spring Boot/Quarkus/Jakarta EE, servidor de aplicação (Tomcat/WildFly), build (Maven/Gradle), banco de dados, integrações externas, HTTP clients, mensageria, schedulers, threads, cache, arquivos, WebSocket/SSE, processamento assíncrono.

Arquivos-alvo: `pom.xml`, `build.gradle(.kts)`, `application*.properties/yml`, `Dockerfile`, scripts de inicialização, configurações de Tomcat e de pools.

---

# FASE 2 — MAPA DE COMPONENTES

```text
HTTP Requests → Controllers → Services → Repositories → Database
Schedulers → Background Jobs → Executors → Thread Pools
HTTP Client → External APIs → Retry → Queues
File Processing → Streams → Buffers → Temporary Files
```

---

# FASE 3 — COLLECTIONS

Localize `List`, `Set`, `Map`, `HashMap`, `ConcurrentHashMap`, `ArrayList`, `LinkedList`, `HashSet`.

Verifique: collection estática/singleton, cache manual, map por ID, lista acumulando resultados, collection nunca limpa, collection ligada a sessão/requisição/job.

Atenção redobrada a `static` / `static final` / `singleton`.

---

# FASE 4 — CACHE

Localize Caffeine, Ehcache, Redis, Guava Cache, `Map` manual, cache do Hibernate, cache de sessão.

Para cada um, determine: limite de tamanho, TTL, eviction, política de expiração, tamanho máximo esperado.

Todo `Map<Key, Object>` usado como cache é **suspeito por padrão** até prova de mecanismo de limpeza.

---

# FASE 5 — OBJETOS ESTÁTICOS

Procure `static List/Map/Set/Collection/Object/Cache/Thread/ExecutorService`.

Mapeie cadeias de referência que podem impedir GC: `static → service → repository → entity`, `static → session/request/context/usuário/arquivo`.

---

# FASE 6 — THREADS

Localize `new Thread()`, `ExecutorService`, `Executors`, `ThreadPoolExecutor`, `ScheduledExecutorService`, `CompletableFuture`, `parallelStream()`, `ForkJoinPool`, `@Async`, `@Scheduled`.

Para cada ocorrência: quem cria, quem inicia, quem encerra, quantidade máxima, existe shutdown, pode criar threads continuamente.

`new Thread(...)` dentro de `for`/`while`/request/scheduler/listener/callback = **alto risco**.

---

# FASE 7 — SCHEDULERS

Localize `@Scheduled`, `Timer`, `TimerTask`, `ScheduledExecutorService`, Quartz, cron jobs.

Registre: classe, método, frequência (fixedRate/fixedDelay/cron), tempo médio de execução, possibilidade de execução concorrente.

Caso perigoso clássico: intervalo de 1 minuto com processamento de 5 minutos → execuções sobrepostas.

---

# FASE 8 — LOOPS

Procure `while`, `for`, `do while`, recursão — priorizando `while(true)` sem `sleep`/`wait`/blocking queue/condition/I-O, o que gera CPU 100%.

---

# FASE 9 — RETRIES

Localize `RetryTemplate`, Resilience4j, Spring Retry, `while`/`catch` com nova tentativa.

Verifique: número máximo de tentativas, intervalo, backoff, limite temporal, condição de parada. Retry imediato sem backoff = CPU alto + sobrecarga da API externa.

---

# FASE 10 — HTTP CLIENTS

Analise `RestTemplate`, `WebClient`, `HttpClient`, OkHttp, Apache HttpClient, Feign, `URLConnection`.

Verifique: connection pool, max connections, connection/read timeout, eviction, se o response body é sempre consumido/fechado.

---

# FASE 11 — BANCO DE DADOS

Analise `DataSource`, HikariCP, JDBC, JPA/Hibernate/EclipseLink.

Verifique `maximumPoolSize`, `minimumIdle`, `connectionTimeout`, `idleTimeout`, `maxLifetime`.

Código JDBC manual deve usar `try-with-resources` para `Connection`/`PreparedStatement`/`ResultSet`.

Investigue: queries retornando milhões de registros, `findAll()` sem paginação, `SELECT` sem limite, `JOIN FETCH` excessivo, CLOB/BLOB carregado integralmente.

---

# FASE 12 — JPA/HIBERNATE/ECLIPSELINK

Investigue Persistence Context/EntityManager/Session/UnitOfWork.

Procure `persist()` em laço sem `flush`/`clear`/batch, e `findAll()` em tabelas grandes.

---

# FASE 13 — ARQUIVOS

Procure `InputStream`, `OutputStream`, `FileInputStream/Output`, `BufferedReader/Writer`, `Files.lines()`, `ZipInputStream/Output`.

Verifique fechamento de recursos. Priorize `Files.readAllBytes()`/`readString()` carregando arquivos inteiros em memória.

---

# FASE 14 — JSON

Investigue Jackson/Gson/JSON-B, `readTree`/`readValue`/`writeValueAsString` em objetos grandes; considere streaming para documentos muito grandes.

---

# FASE 15 — GARBAGE COLLECTION

Identifique JDK e GC (G1GC/ParallelGC/ZGC/SerialGC) e parâmetros `-Xms/-Xmx/-Xss`, Metaspace, DirectMemory, GC logging.

Investigue: Young GC excessivo, Full GC frequente, pausas longas, heap sempre perto do Xmx, Old Gen crescendo continuamente. **Não altere parâmetros antes de entender o comportamento.**

---

# FASE 16 — TOMCAT

Analise `maxThreads`, `minSpareThreads`, `maxConnections`, `acceptCount`, `connectionTimeout`, executor. `maxThreads = 500` não significa que 500 threads sejam necessárias — avalie contra a capacidade real do banco/downstream.

---

# FASE 17 — SPRING

Investigue `@Component/@Service/@Repository/@Controller/@Configuration/@Bean/@Async/@Scheduled/@EventListener`.

Beans singleton mantendo estado de requisição em atributo de instância = ponto de atenção prioritário.

---

# FASE 18 — PROCESSAMENTO ASSÍNCRONO

Localize `CompletableFuture`, `@Async`, `Executor(Service)`, `Queue`/`BlockingQueue`, Kafka/RabbitMQ/SQS.

Determine tamanho da fila, nº de consumidores/produtores, pool de threads, possibilidade de backlog.

---

# FASE 19 — PROCESSAMENTO SEM USUÁRIO

Verifique o que roda sem usuários conectados: schedulers, polling, listeners, retry, jobs, filas, sincronização, integrações, monitoramento, downloads. Para cada um: gatilho, frequência, concorrência, duração, volume processado, chamadas externas.

---

# FASE 20 — DIAGNÓSTICO EM RUNTIME

```bash
jcmd <PID> VM.flags
jcmd <PID> VM.command_line
jcmd <PID> GC.heap_info
jcmd <PID> Thread.print
jcmd <PID> VM.native_memory summary   # se NMT habilitado
```

Colete snapshots em T0, T+5min, T+15min, T+30min, T+60min e compare.

---

# FASE 21 — THREAD DUMP

Capture ao menos 3 dumps (T0, T+10s, T+30s). Procure threads permanentemente `RUNNABLE`; investigue loops, polling, locks, deadlocks, blocked threads, starvation.

---

# FASE 22 — HEAP DUMP

```bash
jcmd <PID> GC.heap_dump arquivo.hprof
```

Analise com Eclipse MAT/VisualVM/JProfiler/YourKit: Dominator Tree, Retained Heap, Largest Objects, GC Roots. Objetivo: qual objeto impede a liberação de memória.

---

# FASE 23 — CPU PROFILING

Java Flight Recorder / Mission Control / async-profiler / VisualVM. Identifique Hot Methods/Threads, GC CPU, lock contention, I/O wait. Não conclua causa apenas por frequência no código-fonte — relacione ao profiling real.

---

# FASE 24 — CLASSIFICAÇÃO

* **CRÍTICO**: CPU 100%, OutOfMemoryError, crash, indisponibilidade.
* **ALTO**: degradação progressiva, aumento de memória/CPU.
* **MÉDIO**: problema potencial dependente de carga.
* **BAIXO**: melhoria preventiva/qualidade.

---

# FASE 25-A — RELATÓRIO DE DIAGNÓSTICO

## 1. Resumo executivo
Evidência de leak? Evidência de CPU excessiva? Principal suspeita? Nível de confiança?

## 2. Problemas encontrados
Para cada um: Problema / Arquivo / Classe / Método / Linha / Severidade / Evidência / Impacto.

## 3. Possíveis vazamentos
| Problema | Local | Evidência | Severidade |
|---|---|---|---|

## 4. Possíveis causas de CPU
| Problema | Local | Evidência | Severidade |
|---|---|---|---|

## 5–10. Threads / Schedulers / Banco / HTTP / Memória / CPU
Resumo objetivo de cada dimensão (mesmo formato do prompt original).

---

# FASE 25-B — MEDIDAS DE GERENCIAMENTO DE MEMÓRIA E PROCESSAMENTO (NOVA)

Esta fase traduz cada causa da Fase 25-A em uma **medida padronizada de correção**. Para cada categoria abaixo, ao propor a correção, preencha sempre os 5 campos: **Medida | Padrão de implementação | Configuração recomendada | Trade-off | Como validar**.

### 25-B.1 Collections e Caches sem limite

* **Medida:** substituir `Map`/`List` manual por cache com limite e expiração; nunca reter referência a objeto de requisição/sessão em coleção estática.
* **Padrão de implementação:**
  ```java
  Cache<String, Object> cache = Caffeine.newBuilder()
      .maximumSize(10_000)
      .expireAfterWrite(Duration.ofMinutes(30))
      .recordStats()
      .build();
  ```
* **Configuração recomendada:** tamanho máximo dimensionado pelo volume real observado (heap dump), TTL alinhado ao ciclo de vida do dado, `recordStats()` habilitado para métricas de hit/miss.
* **Trade-off:** menor hit-rate se o limite for subdimensionado; overhead marginal de contabilização de estatísticas.
* **Como validar:** comparar Retained Heap do cache antes/depois via heap dump; acompanhar `cache.stats().hitRate()` exposto via Micrometer.

### 25-B.2 Objetos estáticos retendo estado

* **Medida:** remover estado mutável de `static`/singleton; se necessário cache global, usar estrutura com eviction (25-B.1) em vez de coleção crua.
* **Padrão:** mover atributos de instância de `@Service` que armazenam dado por requisição para parâmetro de método ou escopo `@RequestScope`.
* **Configuração recomendada:** revisão de code review específica para `static` não-final adicionada em PR.
* **Trade-off:** pode exigir refatoração de assinatura de métodos e testes.
* **Como validar:** GC Roots do heap dump não devem mais apontar da classe estática para entidades de negócio.

### 25-B.3 Threads criadas manualmente / pools mal dimensionados

* **Medida:** eliminar `new Thread()` ad-hoc; centralizar em `ExecutorService` nomeado, com pool limitado e fila limitada, e shutdown gerenciado pelo ciclo de vida do bean (`@PreDestroy`).
* **Padrão:**
  ```java
  @Bean(destroyMethod = "shutdown")
  ExecutorService taskExecutor() {
      return new ThreadPoolExecutor(
          coreSize, maxSize,
          60, TimeUnit.SECONDS,
          new ArrayBlockingQueue<>(1000),
          new ThreadFactoryBuilder().setNameFormat("app-task-%d").build(),
          new ThreadPoolExecutor.CallerRunsPolicy()); // aplica backpressure
  }
  ```
* **Configuração recomendada:** dimensionar `coreSize`/`maxSize` pela regra `threads ≈ CPUs × (1 + tempo_espera/tempo_CPU)` para cargas I/O-bound; sempre usar fila limitada (nunca `Integer.MAX_VALUE`) com uma `RejectedExecutionHandler` explícita.
* **Trade-off:** fila limitada pode rejeitar/atrasar tarefas sob pico — decisão deliberada de backpressure em vez de OOM silencioso.
* **Como validar:** thread dump mostra pool nomeado estável em tamanho; métrica `executor.pool.size`/`executor.queue.remaining` (Micrometer) sem crescimento contínuo.

### 25-B.4 Schedulers sobrepostos

* **Medida:** garantir execução não concorrente e ajustar frequência ao tempo real de processamento.
* **Padrão:**
  ```java
  @Scheduled(fixedDelay = 60000) // fixedDelay, não fixedRate, evita sobreposição
  @SchedulerLock(name = "jobX", lockAtMostFor = "10m") // ShedLock em cluster
  public void run() { ... }
  ```
* **Configuração recomendada:** medir p95 de duração do job e definir intervalo ≥ p95 × margem de segurança (ex.: 1.5x); usar `fixedDelay` em vez de `fixedRate` quando a duração é variável; usar lock distribuído (ShedLock/Quartz cluster) em ambientes com múltiplas instâncias.
* **Trade-off:** intervalo maior atrasa a atualização do dado; lock distribuído adiciona dependência (tabela/Redis de lock).
* **Como validar:** logs/métricas mostram apenas uma execução ativa por vez; nº de execuções concorrentes = 0.

### 25-B.5 Loops sem condição de parada / polling ativo

* **Medida:** substituir `while(true)` sem I/O por `BlockingQueue.take()`, `wait/notify`, ou scheduler com intervalo definido.
* **Padrão:** `queue.poll(timeout, TimeUnit.SECONDS)` em vez de `while(true) { check(); }` sem espera.
* **Configuração recomendada:** timeout de poll compatível com a latência aceitável do negócio (ex.: 1–5s).
* **Trade-off:** pequena latência adicional na detecção de eventos, aceitável frente à economia de CPU.
* **Como validar:** CPU profiling (JFR) mostra queda de tempo em hot method antes contínuo; uso de CPU em repouso próximo de 0%.

### 25-B.6 Retries agressivos

* **Medida:** aplicar backoff exponencial com jitter e limite de tentativas.
* **Padrão (Resilience4j):**
  ```yaml
  resilience4j.retry:
    instances:
      externalApi:
        max-attempts: 4
        wait-duration: 500ms
        exponential-backoff-multiplier: 2
        enable-randomized-wait: true
  ```
* **Configuração recomendada:** combinar com Circuit Breaker para cortar chamadas quando a taxa de erro ultrapassar um limiar (ex.: 50% em 10 chamadas).
* **Trade-off:** aumenta a latência percebida em falhas reais; correto para não amplificar incidentes.
* **Como validar:** métrica `resilience4j.retry.calls`/`circuitbreaker.state`; nº de chamadas externas por segundo cai durante indisponibilidade do downstream.

### 25-B.7 HTTP Client — pool e conexões

* **Medida:** configurar pool de conexões explícito, timeouts, e garantir consumo/fechamento do corpo da resposta.
* **Padrão (WebClient):**
  ```java
  ConnectionProvider provider = ConnectionProvider.builder("api-pool")
      .maxConnections(50)
      .pendingAcquireTimeout(Duration.ofSeconds(5))
      .maxIdleTime(Duration.ofSeconds(30))
      .build();
  ```
* **Configuração recomendada:** `maxConnections` dimensionado pelo throughput real; `connectTimeout`/`readTimeout` sempre definidos (nunca infinito); sempre drenar/fechar o body mesmo em erro.
* **Trade-off:** pool pequeno pode gerar espera sob pico; grande demais consome memória/handles do SO.
* **Como validar:** métricas de pool (`active`, `idle`, `pending`) estáveis; nº de sockets `ESTABLISHED`/`CLOSE_WAIT` não cresce ao longo do tempo (`netstat`/`ss`).

### 25-B.8 Banco de dados / HikariCP / JPA

* **Medida:** usar `try-with-resources` em JDBC manual; paginar `findAll`; controlar flush/clear em lote; ajustar pool ao paralelismo real.
* **Padrão:**
  ```java
  int batchSize = 50;
  for (int i = 0; i < items.size(); i++) {
      em.persist(items.get(i));
      if (i % batchSize == 0) { em.flush(); em.clear(); }
  }
  ```
  ```yaml
  spring.datasource.hikari:
    maximum-pool-size: 20        # ≈ (nº núcleos × 2) + discos, ajustar por medição
    minimum-idle: 5
    connection-timeout: 3000
    idle-timeout: 600000
    max-lifetime: 1700000
  ```
* **Configuração recomendada:** paginação via `Pageable`/`Slice` em toda consulta que possa retornar volume não limitado.
* **Trade-off:** paginação exige mudança de contrato de API/serviço; batch com flush/clear reduz uso de memória mas aumenta round-trips.
* **Como validar:** `HikariPoolMXBean` (active/idle/waiting) estável sob carga; persistence context não cresce (medido em heap dump); tempo de query não degrada com volume.

### 25-B.9 Arquivos e streams

* **Medida:** usar `try-with-resources` sempre; para arquivos grandes, processar em streaming (`Files.lines()`, `BufferedReader`) em vez de `readAllBytes`/`readString`.
* **Padrão:**
  ```java
  try (var reader = Files.newBufferedReader(path)) {
      reader.lines().forEach(this::processLine);
  }
  ```
* **Configuração recomendada:** limite de tamanho de arquivo aceito antes de decidir por streaming vs. carga total; remoção garantida de arquivos temporários (`Files.deleteIfExists` em `finally` ou `File.deleteOnExit()` com ressalvas).
* **Trade-off:** streaming impede acesso aleatório ao conteúdo; requer reestruturar lógica de processamento linha a linha.
* **Como validar:** heap usado durante processamento do arquivo não escala com o tamanho do arquivo; nº de file descriptors abertos (`lsof -p <PID>`) permanece estável.

### 25-B.10 GC e parâmetros de JVM

* **Medida:** só ajustar parâmetros após medir padrão real de alocação/promoção via GC log/JFR.
* **Padrão de investigação antes de mudar:**
  ```bash
  -Xlog:gc*:file=gc.log:time,uptime:filecount=5,filesize=50M
  ```
* **Configuração recomendada:** escolher GC pelo objetivo (G1GC para equilíbrio geral; ZGC para heaps grandes e pausas mínimas); dimensionar `-Xmx` pelo Retained Heap observado + margem, não por tentativa e erro.
* **Trade-off:** ZGC/Shenandoah reduzem pausa mas podem consumir mais CPU; heap maior atrasa Full GC mas aumenta tempo de pausa quando ocorre.
* **Como validar:** comparar GC log antes/depois: frequência de Full GC, tempo de pausa p99, throughput da aplicação.

### 25-B.11 Tomcat / servidor de aplicação

* **Medida:** dimensionar `maxThreads` pela capacidade real do pool de banco/downstream, não por valor arbitrário alto.
* **Configuração recomendada:** `maxThreads` ≤ capacidade do pool de conexões downstream × fator de concorrência tolerado; `acceptCount` como buffer curto, não fila infinita.
* **Trade-off:** `maxThreads` baixo demais rejeita requisições sob pico; alto demais transfere a fila para o banco (contenção).
* **Como validar:** throughput e latência p95 estáveis sob teste de carga; sem esgotamento do pool de banco correlacionado a pico de threads Tomcat.

### 25-B.12 Processamento assíncrono / filas

* **Medida:** garantir fila limitada com política de rejeição/backpressure e nº de consumidores proporcional ao throughput do downstream.
* **Configuração recomendada:** monitorar profundidade da fila (`queue.size`) com alerta de backlog crescente; usar DLQ (dead-letter queue) para falhas repetidas em vez de reprocessar indefinidamente.
* **Trade-off:** backpressure pode significar descartar/atrasar mensagens — deve ser decisão de negócio explícita.
* **Como validar:** profundidade de fila estável (não monotonicamente crescente) em gráfico de série temporal.

---

# FASE 26 — NÃO MODIFICAR SEM EVIDÊNCIA

Antes de alterar código, responda: qual problema estamos corrigindo, como sabemos que existe, qual evidência temos, qual o impacto da alteração, como mediremos a melhora.

---

# FASE 27 — PLANO DE MONITORAMENTO

Métricas: Heap Used/Max, Old/Young Gen, GC Count/Time, CPU, Threads (total/daemon), HTTP Request Duration, Database Pool Usage, Queue Size, Scheduler Executions, Errors, Retries — expostas via Micrometer + Spring Boot Actuator + Prometheus/Grafana, com JFR contínuo quando possível.

Para cada medida aplicada na Fase 25-B, adicione um painel/alerta específico à métrica citada em "Como validar", de forma que a correção tenha rastreabilidade permanente (não apenas validação pontual).

---

# RESULTADO ESPERADO

1. O consumo está relacionado ao Heap? Há Memory Leak? Crescimento contínuo de objetos?
2. Há Collections/caches sem limite? Referências estáticas retendo objetos?
3. Há threads criadas continuamente? Schedulers sobrepostos? Loop consumindo CPU? Retry agressivo?
4. Há problema de pool (banco/HTTP)? GC excessivo?
5. Há processamento em background desnecessário? Ponto específico de alto consumo de CPU?
6. **Para cada causa confirmada, qual medida da Fase 25-B foi aplicada, qual configuração foi usada, e qual métrica prova a melhora?**

## Regra final

```text
CAUSA → EVIDÊNCIA → IMPACTO → MEDIDA DE GERENCIAMENTO (Fase 25-B) → CONFIGURAÇÃO → VALIDAÇÃO
```

O objetivo é sair da análise com um diagnóstico técnico reproduzível **e** um conjunto de medidas de gerenciamento de memória/processamento já especificadas em código e configuração, prontas para implementação e com métrica de validação associada.
