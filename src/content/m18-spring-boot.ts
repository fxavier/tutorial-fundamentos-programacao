import type { Module } from '../types';

export const m18: Module = {
  id: 'spring-boot',
  number: 18,
  title: 'Spring Boot — do zero à API em produção',
  subtitle: 'IoC, REST controllers, Spring Data JPA, validação, segurança, testes com Testcontainers, Actuator e deploy — o framework Java número um',
  icon: '🍃',
  minutes: 130,
  goals: [
    'Perceber o modelo de IoC/DI e o que Spring Boot faz por ti',
    'Criar uma API REST tipada, com validação e tratamento de erros',
    'Persistir dados com Spring Data JPA sobre PostgreSQL',
    'Gerir configuração com profiles e Flyway para migrations',
    'Proteger endpoints com Spring Security + JWT',
    'Escrever testes rápidos (unitários) e lentos (Testcontainers)',
    'Expor métricas, healthchecks e tracing com Actuator + OpenTelemetry',
    'Empacotar como JAR executável e imagem OCI pronta para deploy',
  ],
  sections: [
    {
      id: 'porque-spring',
      title: 'Porquê Spring Boot',
      blocks: [
        { type: 'p', text: 'Spring começou em 2003 como alternativa ao pesadelo do JavaEE. Vinte anos depois, **Spring Boot** é o framework que a maior parte das empresas usa para APIs em Java — bancos, retalho, telecom, governo, startups. Em 2026, Spring Boot 4 traz suporte nativo a Java 25, virtual threads integrados em todo o stack, e configuração zero para a maioria dos casos.' },
        {
          type: 'compare',
          left: {
            title: 'O que Spring Boot resolve',
            items: [
              'Configuração sem XML — convenções sobre configuração',
              'Dependência num comando: `spring-boot-starter-web` traz tudo o que uma API precisa',
              'Servidor embutido (Tomcat/Netty) — JAR que corre sozinho',
              'Testes de integração em segundos com `@SpringBootTest`',
              'Observabilidade (health, métricas, traces) com uma linha',
              'Integração nativa com todas as BDs, filas, caches',
            ],
          },
          right: {
            title: 'Trade-offs que compensa saber',
            items: [
              'Mais pesado que frameworks "slim" (Javalin, Spark)',
              'Arranque mais lento que Quarkus/Micronaut (compila-se GraalVM Native para ter sub-segundo)',
              'Convenções implícitas — a magia pode esconder bugs se não a conheces',
              'Muitas formas de fazer a mesma coisa — curva de aprendizagem',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'A proposta em uma linha',
          text: '**Spring Boot** = Spring + convenções + servidor embutido + dependências pré-empacotadas. Escreves código de negócio; o framework trata do resto.',
        },
      ],
    },
    {
      id: 'criar-projeto',
      title: 'Criar o primeiro projeto',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'Spring Initializr', text: 'Vai a [start.spring.io](https://start.spring.io). Escolhe: **Project** Maven · **Language** Java · **Spring Boot** 3.5.x (ou 4.x) · **Java** 25. Preenche Group (`pt.exemplo`) e Artifact (`loja`).' },
            { title: 'Dependências mínimas', text: 'Para uma API moderna: **Spring Web**, **Spring Data JPA**, **PostgreSQL Driver**, **Flyway Migration**, **Spring Boot Actuator**, **Spring Boot DevTools**, **Validation**, **Lombok** (opcional), **Spring Security**.' },
            { title: 'Descarrega e abre no IDE', text: 'IntelliJ IDEA Community ou VS Code (com Extension Pack for Java). Importa como projeto Maven. Primeira sincronização demora alguns segundos.' },
            { title: 'Arranca', text: '`./mvnw spring-boot:run` ou clica em "Run" sobre `LojaApplication`. Em segundos vês `Started LojaApplication in 2.3 seconds`.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'estrutura típica',
          code: `loja/
├── pom.xml                              # dependências e plugins Maven
├── mvnw, mvnw.cmd                       # Maven Wrapper (não precisa de Maven instalado)
├── src/
│   ├── main/
│   │   ├── java/pt/exemplo/loja/
│   │   │   ├── LojaApplication.java     # main() — ponto de entrada
│   │   │   ├── produto/
│   │   │   │   ├── Produto.java         # entidade JPA
│   │   │   │   ├── ProdutoRepository.java
│   │   │   │   ├── ProdutoService.java
│   │   │   │   └── ProdutoController.java
│   │   │   └── config/
│   │   └── resources/
│   │       ├── application.yml          # configuração
│   │       └── db/migration/            # Flyway
│   │           └── V1__init.sql
│   └── test/
│       └── java/pt/exemplo/loja/
│           └── ProdutoControllerTest.java`,
        },
        {
          type: 'code', lang: 'java', caption: 'LojaApplication.java — o mínimo para arrancar',
          code: `package pt.exemplo.loja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LojaApplication {
    public static void main(String[] args) {
        SpringApplication.run(LojaApplication.class, args);
    }
}`,
        },
        {
          type: 'callout', tone: 'tip', title: 'O que `@SpringBootApplication` faz',
          text: 'Três anotações em uma: `@Configuration` (classe define beans), `@EnableAutoConfiguration` (ativa o mecanismo que configura automaticamente o que está no classpath) e `@ComponentScan` (procura os teus `@Component`, `@Service`, `@Repository`, `@Controller` no pacote e sub-pacotes).',
        },
      ],
    },
    {
      id: 'ioc-di',
      title: 'IoC e Dependency Injection — o coração de Spring',
      blocks: [
        { type: 'p', text: '**Inversão de controlo**: em vez de o teu código criar as suas dependências, o framework fornece-as. Resultado: classes desacopladas, trocáveis em testes e configuração centralizada.' },
        {
          type: 'code', lang: 'java', caption: 'sem Spring (acoplamento forte)',
          code: `public class ProdutoService {
    // Instancia diretamente — não dá para trocar em testes
    private final ProdutoRepository repo = new JdbcProdutoRepository();
    private final EmailSender email = new SmtpEmailSender("smtp.example.com");

    public Produto criar(CriarProdutoDTO dto) {
        var p = repo.save(new Produto(dto));
        email.send(...);
        return p;
    }
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'com Spring (dependências injectadas)',
          code: `@Service
public class ProdutoService {
    private final ProdutoRepository repo;
    private final EmailSender email;

    // Construtor único — Spring injecta automaticamente
    public ProdutoService(ProdutoRepository repo, EmailSender email) {
        this.repo = repo;
        this.email = email;
    }

    public Produto criar(CriarProdutoDTO dto) {
        var p = repo.save(Produto.from(dto));
        email.send(...);
        return p;
    }
}`,
        },
        {
          type: 'terms', items: [
            { term: '`@Component`', def: 'Marca uma classe como gerida por Spring. O container instancia-a uma vez (singleton por omissão) e injecta-a onde for precisa.' },
            { term: '`@Service`', def: 'Semanticamente equivalente a `@Component` — convenção para lógica de negócio.' },
            { term: '`@Repository`', def: 'Também `@Component`, mas com tradução automática de exceções de acesso a dados em `DataAccessException`.' },
            { term: '`@Controller` / `@RestController`', def: 'Componentes que recebem pedidos HTTP. `@RestController` = `@Controller` + `@ResponseBody` (resposta é serializada diretamente em JSON).' },
            { term: '`@Configuration` + `@Bean`', def: 'Classe que define beans programaticamente. Útil para configurar bibliotecas externas que não conheces como Spring.' },
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Constructor injection sempre',
          text: 'Prefere **injecção por construtor** (como no exemplo) em vez de `@Autowired` em campos. Benefícios: campos podem ser `final`, a classe é testável sem reflection, dependências obrigatórias são óbvias, e Spring deteta ciclos no arranque.',
        },
      ],
    },
    {
      id: 'rest-controller',
      title: 'REST Controllers — expor endpoints',
      blocks: [
        {
          type: 'code', lang: 'java', caption: 'ProdutoController.java',
          code: `package pt.exemplo.loja.produto;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProdutoDTO> listar(
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(required = false) String cursor
    ) {
        return service.listar(limit, cursor);
    }

    @GetMapping("/{id}")
    public ProdutoDTO obter(@PathVariable Long id) {
        return service.obter(id);  // lança ProdutoNaoEncontrado -> 404
    }

    @PostMapping
    public ResponseEntity<ProdutoDTO> criar(
        @Valid @RequestBody CriarProdutoDTO dto,
        @RequestHeader(value = "Idempotency-Key", required = false) String idemKey
    ) {
        var criado = service.criar(dto, idemKey);
        return ResponseEntity
            .created(URI.create("/v1/produtos/" + criado.id()))
            .body(criado);
    }

    @PatchMapping("/{id}")
    public ProdutoDTO atualizar(@PathVariable Long id,
                                 @Valid @RequestBody AtualizarProdutoDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable Long id) {
        service.apagar(id);
    }
}`,
        },
        {
          type: 'table',
          head: ['Anotação', 'Para que serve'],
          rows: [
            ['`@RequestMapping("/base")`', 'Prefixo de todos os métodos do controller'],
            ['`@GetMapping`, `@PostMapping`, ...', 'Atalho para o verbo HTTP'],
            ['`@PathVariable`', 'Captura `{id}` do URL'],
            ['`@RequestParam`', 'Captura query params (`?limit=20`)'],
            ['`@RequestBody`', 'Desserializa o corpo JSON num DTO'],
            ['`@RequestHeader`', 'Lê cabeçalho específico'],
            ['`@Valid`', 'Dispara a validação (ver próxima secção)'],
            ['`@ResponseStatus`', 'Força status HTTP sem precisar de `ResponseEntity`'],
          ],
        },
      ],
    },
    {
      id: 'dto-validacao',
      title: 'DTOs e validação',
      blocks: [
        { type: 'p', text: 'DTOs (Data Transfer Objects) são os contratos de entrada/saída. Com Java 25, Records são a escolha perfeita: imutáveis, concisos, com equals/hashCode gratuitos.' },
        {
          type: 'code', lang: 'java', caption: 'DTOs como records',
          code: `package pt.exemplo.loja.produto;

import jakarta.validation.constraints.*;

public record CriarProdutoDTO(
    @NotBlank @Size(max = 200)
    String nome,

    @NotNull @Positive
    Long precoCents,

    @NotNull @PositiveOrZero
    Integer stock,

    @NotNull
    Long categoriaId
) {}

public record AtualizarProdutoDTO(
    @Size(max = 200)
    String nome,

    @Positive
    Long precoCents
) {}

// DTO de resposta — podes esconder campos internos (ex.: cost_cents)
public record ProdutoDTO(
    Long id,
    String nome,
    long precoCents,
    int stock,
    CategoriaDTO categoria
) {
    public static ProdutoDTO from(Produto p) {
        return new ProdutoDTO(p.getId(), p.getNome(), p.getPrecoCents(),
                              p.getStock(), CategoriaDTO.from(p.getCategoria()));
    }
}`,
        },
        {
          type: 'table',
          head: ['Anotação de validação', 'Significado'],
          rows: [
            ['`@NotNull`', 'Não pode ser null'],
            ['`@NotBlank`', 'String não null, nem vazia, nem só espaços'],
            ['`@NotEmpty`', 'String/Collection não null nem vazia'],
            ['`@Size(min, max)`', 'Tamanho de String ou Collection entre limites'],
            ['`@Min(n)`, `@Max(n)`', 'Valor numérico mínimo/máximo'],
            ['`@Positive`, `@PositiveOrZero`', 'Numérico > 0 / ≥ 0'],
            ['`@Email`', 'Formato de email'],
            ['`@Pattern(regexp)`', 'Regex customizado'],
            ['`@Past`, `@Future`', 'Datas no passado / futuro'],
            ['`@Valid` (em campos aninhados)', 'Valida recursivamente'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Entidade ≠ DTO',
          text: 'Nunca exponhas directamente a tua entidade JPA no endpoint. Hoje tem 5 campos; amanhã tem 30, incluindo `hashed_password`. Separa com DTO desde o dia 1. É boilerplate que compensa.',
        },
      ],
    },
    {
      id: 'excecoes',
      title: 'Tratamento de erros — @ControllerAdvice + ProblemDetail',
      blocks: [
        { type: 'p', text: 'Spring 6+ tem suporte nativo para Problem Details (RFC 7807). Lançar uma exceção dedicada e tratá-la num `@ControllerAdvice` substitui blocos `try/catch` em todos os controllers.' },
        {
          type: 'code', lang: 'java', caption: 'exceções de domínio',
          code: `public class ProdutoNaoEncontrado extends RuntimeException {
    public ProdutoNaoEncontrado(Long id) {
        super("Produto " + id + " não existe");
    }
}

public class StockInsuficiente extends RuntimeException {
    public StockInsuficiente(Long id) {
        super("Stock insuficiente para o produto " + id);
    }
}`,
        },
        {
          type: 'code', lang: 'java', caption: '@RestControllerAdvice global',
          code: `import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.ErrorResponseException;

@RestControllerAdvice
public class GlobalErrorHandler {

    @ExceptionHandler(ProdutoNaoEncontrado.class)
    public ProblemDetail naoEncontrado(ProdutoNaoEncontrado ex) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setType(URI.create("https://api.loja.pt/erros/nao-encontrado"));
        pd.setTitle("Recurso não existe");
        pd.setProperty("code", "produto_nao_encontrado");
        return pd;
    }

    @ExceptionHandler(StockInsuficiente.class)
    public ResponseEntity<ProblemDetail> stockInsuficiente(StockInsuficiente ex) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setProperty("code", "stock_insuficiente");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(pd);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail validacao(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> Map.of("field", e.getField(),
                              "code", e.getCode(),
                              "message", e.getDefaultMessage()))
            .toList();

        var pd = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);
        pd.setTitle("Dados inválidos");
        pd.setProperty("errors", errors);
        return pd;
    }
}`,
        },
        {
          type: 'callout', tone: 'key', title: 'Fluxo mental',
          text: 'Service lança excepção → Advice captura → devolve ProblemDetail com status apropriado. O controller fica limpo, sem `if (produto == null) return 404`.',
        },
      ],
    },
    {
      id: 'jpa',
      title: 'Spring Data JPA — persistência sem SQL à mão',
      blocks: [
        { type: 'p', text: 'JPA (*Jakarta Persistence API*) é um padrão para mapear objetos Java a tabelas SQL (ORM). Spring Data JPA junta repositórios automáticos: declaras uma interface, Spring gera a implementação.' },
        {
          type: 'code', lang: 'java', caption: 'entidade',
          code: `package pt.exemplo.loja.produto;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "preco_cents", nullable = false)
    private long precoCents;

    @Column(nullable = false)
    private int stock;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm;

    @PrePersist
    void aoCriar() { this.criadoEm = Instant.now(); }

    // getters, setters, equals/hashCode baseados em id
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'repositório — zero implementação',
          code: `package pt.exemplo.loja.produto;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Spring gera a query a partir do nome do método
    Page<Produto> findByCategoriaId(Long categoriaId, Pageable pageable);

    boolean existsByNomeIgnoreCase(String nome);

    // Query explícita quando precisas
    @Query("""
        SELECT p FROM Produto p
        WHERE p.stock > 0
          AND p.categoria.id = :catId
        ORDER BY p.precoCents ASC
        """)
    List<Produto> emStockPorCategoria(@Param("catId") Long catId);

    // SQL nativo quando JPQL não chega
    @Query(value = """
        SELECT * FROM produtos
        WHERE search_vector @@ plainto_tsquery('portuguese', :termo)
        """, nativeQuery = true)
    List<Produto> pesquisar(@Param("termo") String termo);

    // Modificação direta — exige @Modifying e transação
    @Modifying
    @Query("UPDATE Produto p SET p.stock = p.stock - :q WHERE p.id = :id AND p.stock >= :q")
    int reduzirStock(@Param("id") Long id, @Param("q") int q);
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'service com transação',
          code: `@Service
public class ProdutoService {
    private final ProdutoRepository repo;

    public ProdutoService(ProdutoRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public ProdutoDTO obter(Long id) {
        var p = repo.findById(id)
            .orElseThrow(() -> new ProdutoNaoEncontrado(id));
        return ProdutoDTO.from(p);
    }

    @Transactional
    public ProdutoDTO criar(CriarProdutoDTO dto, String idemKey) {
        // validar idempotência (se chave vier), criar, devolver
        var p = new Produto();
        p.setNome(dto.nome());
        p.setPrecoCents(dto.precoCents());
        p.setStock(dto.stock());
        // ...
        return ProdutoDTO.from(repo.save(p));
    }
}`,
        },
        {
          type: 'callout', tone: 'trap', title: 'O problema N+1 em JPA',
          text: 'Carregaste 100 produtos e lês `produto.getCategoria().getNome()` → 1 select + 100 selects para as categorias. Soluções: `@EntityGraph`, `JOIN FETCH` em JPQL, ou Spring Data Projections. **Liga a propriedade `spring.jpa.properties.hibernate.use_sql_comments=true`** em dev para ver o SQL que o Hibernate está a correr.',
        },
      ],
    },
    {
      id: 'postgres-flyway',
      title: 'PostgreSQL + Flyway — base de dados versionada',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'src/main/resources/application.yml',
          code: `spring:
  application:
    name: loja

  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:5432/loja}
    username: \${DB_USER:postgres}
    password: \${DB_PASSWORD:secret}

  jpa:
    hibernate:
      ddl-auto: validate            # NUNCA create/update em produção — usa Flyway
    properties:
      hibernate:
        format_sql: true
    open-in-view: false             # desliga — anti-padrão clássico

  flyway:
    enabled: true
    locations: classpath:db/migration

server:
  port: 8080
  shutdown: graceful

management:
  endpoints:
    web.exposure.include: health,info,metrics,prometheus
  endpoint:
    health.show-details: when_authorized`,
        },
        {
          type: 'code', lang: 'sql', caption: 'src/main/resources/db/migration/V1__init.sql',
          code: `CREATE TABLE categorias (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE produtos (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome         TEXT   NOT NULL,
    preco_cents  BIGINT NOT NULL CHECK (preco_cents > 0),
    stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria_id BIGINT NOT NULL REFERENCES categorias(id),
    criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);

CREATE TABLE idempotency_keys (
    key              TEXT PRIMARY KEY,
    request_hash     TEXT NOT NULL,
    response_status  INTEGER NOT NULL,
    response_body    JSONB NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_idem_expires ON idempotency_keys(expires_at);`,
        },
        {
          type: 'callout', tone: 'key', title: 'A regra do Flyway',
          text: 'Cada alteração ao esquema é um ficheiro **imutável** (`V2__add_categoria.sql`, `V3__add_search.sql`). Uma migração que já correu em produção **nunca é editada** — se te enganaste, cria `V4__corrige_V3.sql`. O esquema passa a estar no git, versionado, com histórico e reversível.',
        },
      ],
    },
    {
      id: 'config-perfis',
      title: 'Configuração e profiles',
      blocks: [
        { type: 'p', text: 'Spring Boot lê configuração de múltiplas fontes, por ordem de precedência: variáveis de ambiente, args da linha de comando, `application-{profile}.yml`, `application.yml`. Profiles permitem ambientes diferentes (dev, test, prod) com o mesmo código.' },
        {
          type: 'code', lang: 'bash', caption: 'application-dev.yml',
          code: `spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/loja
  jpa:
    show-sql: true           # imprime SQL em dev (nunca em prod)

logging:
  level:
    pt.exemplo.loja: DEBUG
    org.hibernate.SQL: DEBUG`,
        },
        {
          type: 'code', lang: 'bash', caption: 'application-prod.yml',
          code: `spring:
  datasource:
    url: \${DATABASE_URL}         # obrigatório vir do ambiente
  jpa:
    show-sql: false

logging:
  level:
    root: INFO
  pattern:
    console: "{\"time\":\"%d{yyyy-MM-dd'T'HH:mm:ss.SSSZ}\",\"level\":\"%level\",\"logger\":\"%logger\",\"thread\":\"%thread\",\"trace_id\":\"%X{traceId}\",\"msg\":\"%msg\"}%n"

management:
  tracing:
    sampling.probability: 0.1`,
        },
        {
          type: 'code', lang: 'bash', caption: 'arrancar com profile',
          code: `# via arg
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# via env var (produção)
SPRING_PROFILES_ACTIVE=prod java -jar loja.jar

# via Docker
docker run -e SPRING_PROFILES_ACTIVE=prod loja:latest`,
        },
        {
          type: 'code', lang: 'java', caption: 'injetar valores tipados',
          code: `@ConfigurationProperties(prefix = "loja")
public record LojaConfig(
    String nome,
    int maxItensPorEncomenda,
    Duration idempotencyTtl
) {}

// Usar
@Service
public class EncomendaService {
    private final LojaConfig config;
    public EncomendaService(LojaConfig config) { this.config = config; }
}

// application.yml
// loja:
//   nome: "Loja da Ana"
//   max-itens-por-encomenda: 50
//   idempotency-ttl: 24h`,
        },
      ],
    },
    {
      id: 'seguranca',
      title: 'Spring Security + JWT',
      blocks: [
        { type: 'p', text: '**Spring Security** é a framework de segurança. Por omissão, um projeto novo tem todos os endpoints protegidos (Basic Auth com password gerada no arranque). Para APIs modernas, substituis isto por JWT ou OAuth2.' },
        {
          type: 'code', lang: 'java', caption: 'configuração com JWT',
          code: `import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                           // API stateless, sem CSRF
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a
                .requestMatchers("/v1/public/**", "/actuator/health").permitAll()
                .requestMatchers("/v1/admin/**").hasAuthority("SCOPE_admin")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(o -> o.jwt(jwt -> {}));            // valida JWTs

        return http.build();
    }
}`,
        },
        {
          type: 'code', lang: 'bash', caption: 'application.yml — validador JWT',
          code: `spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          # Opção 1: JWKS endpoint (OAuth provider)
          jwk-set-uri: https://auth.loja.pt/.well-known/jwks.json
          # Opção 2: segredo partilhado (HMAC) — simples, menos escalável
          # secret-key: \${JWT_SECRET}
          issuer-uri: https://auth.loja.pt
          audiences: loja-api`,
        },
        {
          type: 'code', lang: 'java', caption: 'ler o utilizador autenticado',
          code: `@GetMapping("/me")
public MeResponse me(@AuthenticationPrincipal Jwt jwt) {
    String userId = jwt.getSubject();
    List<String> scopes = jwt.getClaimAsStringList("scope");
    return new MeResponse(userId, scopes);
}

// Autorização por método
@PreAuthorize("hasAuthority('SCOPE_admin')")
@DeleteMapping("/{id}")
public void apagar(@PathVariable Long id) { ... }

@PreAuthorize("#id == authentication.name or hasAuthority('SCOPE_admin')")
@GetMapping("/users/{id}")
public UserDTO verUser(@PathVariable String id) { ... }`,
        },
        {
          type: 'callout', tone: 'trap', title: 'Erros clássicos de Spring Security',
          text: '**(1)** Deixar `.csrf().disable()` em aplicações **com sessões de browser** — expõe a CSRF. Desliga **só** para APIs stateless. **(2)** Confiar em `"ROLE_USER"` em vez de validar scopes do token. **(3)** Logar o conteúdo do `Authorization` header. **(4)** Esquecer de validar `audience` do JWT: aceitas tokens emitidos para outra aplicação.',
        },
      ],
    },
    {
      id: 'testes',
      title: 'Testes: unitários, @WebMvcTest, Testcontainers',
      blocks: [
        {
          type: 'table',
          head: ['Nível', 'Anotação', 'O que inicializa', 'Velocidade'],
          rows: [
            ['**Unit puro**', 'Nenhum', 'Só a classe + mocks (Mockito)', 'Milissegundos'],
            ['**@WebMvcTest**', 'Controlador + Spring MVC', 'Sem BD, sem services reais (usa mocks)', '~1 s'],
            ['**@DataJpaTest**', 'JPA + H2 em memória', 'Só a camada de persistência', '~2 s'],
            ['**@SpringBootTest**', 'Contexto completo', 'Tudo', '~5-30 s'],
            ['**@SpringBootTest + Testcontainers**', 'Contexto + Postgres real em Docker', 'Como produção', '~30 s a 1 min'],
          ],
        },
        {
          type: 'code', lang: 'java', caption: 'teste unitário com Mockito',
          code: `@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock ProdutoRepository repo;
    @InjectMocks ProdutoService service;

    @Test
    void obter_lanca_naoEncontrado_quando_id_nao_existe() {
        given(repo.findById(42L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> service.obter(42L))
            .isInstanceOf(ProdutoNaoEncontrado.class)
            .hasMessageContaining("42");
    }
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'teste de controller com @WebMvcTest',
          code: `@WebMvcTest(ProdutoController.class)
class ProdutoControllerTest {

    @Autowired MockMvc mvc;
    @MockBean ProdutoService service;

    @Test
    void criar_devolve_201_e_location() throws Exception {
        given(service.criar(any(), any()))
            .willReturn(new ProdutoDTO(42L, "iPad", 150_000, 10, null));

        mvc.perform(post("/v1/produtos")
                .with(jwt().jwt(j -> j.claim("scope", "write:produtos")))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "nome": "iPad", "precoCents": 150000, "stock": 10, "categoriaId": 1 }
                    """))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", "/v1/produtos/42"))
            .andExpect(jsonPath("$.nome").value("iPad"));
    }

    @Test
    void criar_rejeita_quando_preco_negativo() throws Exception {
        mvc.perform(post("/v1/produtos")
                .with(jwt().jwt(j -> j.claim("scope", "write:produtos")))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "nome": "iPad", "precoCents": -1, "stock": 10, "categoriaId": 1 }
                    """))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.errors[0].field").value("precoCents"));
    }
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'teste de integração com Testcontainers',
          code: `@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class ProdutoIntegrationTest {

    @Container
    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:17-alpine")
        .withDatabaseName("loja")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url",      pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
    }

    @Autowired MockMvc mvc;
    @Autowired ProdutoRepository repo;

    @Test
    void criar_e_obter_round_trip() throws Exception {
        // Flyway já correu, BD limpa

        var response = mvc.perform(post("/v1/produtos")
                .with(jwt().jwt(j -> j.claim("scope", "write:produtos")))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    { "nome": "MacBook", "precoCents": 180000, "stock": 2, "categoriaId": 1 }
                    """))
            .andExpect(status().isCreated())
            .andReturn();

        var id = JsonPath.read(response.getResponse().getContentAsString(), "$.id");

        mvc.perform(get("/v1/produtos/" + id)
                .with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nome").value("MacBook"));

        assertThat(repo.findById(Long.valueOf(id.toString()))).isPresent();
    }
}`,
        },
        {
          type: 'callout', tone: 'key', title: 'A pirâmide prática',
          text: 'Para cada feature: muitos **unitários** (lógica pura), alguns **@WebMvcTest** (validação de request/response), poucos **Testcontainers** (fluxos críticos). A tentação é fazer tudo em @SpringBootTest — resiste: fica lento, difícil de debugar e frágil.',
        },
      ],
    },
    {
      id: 'observabilidade',
      title: 'Actuator, métricas e tracing',
      blocks: [
        { type: 'p', text: 'Spring Boot Actuator expõe endpoints de observabilidade com uma dependência. Combinado com Micrometer + OpenTelemetry, torna-se a base de qualquer stack de monitorização em produção.' },
        {
          type: 'table',
          head: ['Endpoint', 'O que faz'],
          rows: [
            ['`/actuator/health`', 'Estado geral e por componente (BD, Redis...)'],
            ['`/actuator/info`', 'Metadados (versão, build time, git sha)'],
            ['`/actuator/metrics`', 'JVM, HTTP, datasources, custom'],
            ['`/actuator/prometheus`', 'Métricas em formato Prometheus (via Micrometer)'],
            ['`/actuator/env`', 'Propriedades de configuração (proteger!)'],
            ['`/actuator/loggers`', 'Alterar níveis de log em runtime'],
            ['`/actuator/threaddump`', 'Debug de locks e deadlocks'],
          ],
        },
        {
          type: 'code', lang: 'java', caption: 'métricas custom',
          code: `@Service
public class EncomendaService {
    private final Counter criacoes;
    private final Timer latenciaProcessamento;

    public EncomendaService(MeterRegistry registry) {
        this.criacoes = Counter.builder("encomendas.criadas")
            .description("Total de encomendas criadas")
            .tag("version", "v1")
            .register(registry);

        this.latenciaProcessamento = Timer.builder("encomendas.processamento")
            .register(registry);
    }

    public EncomendaDTO criar(CriarEncomendaDTO dto) {
        return latenciaProcessamento.record(() -> {
            // ... criar encomenda ...
            criacoes.increment();
            return result;
        });
    }
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'health check custom',
          code: `@Component
public class StripeHealthIndicator implements HealthIndicator {
    private final StripeClient stripe;
    public StripeHealthIndicator(StripeClient stripe) { this.stripe = stripe; }

    @Override
    public Health health() {
        try {
            stripe.ping();
            return Health.up().withDetail("provider", "stripe").build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Tracing distribuído',
          text: 'Com `spring-boot-starter-actuator` + `micrometer-tracing-bridge-otel` tens tracing automático em todos os pedidos HTTP, JDBC e Kafka. Cada log tem `trace_id` e `span_id` — correlacionas com o Grafana Tempo, Jaeger ou Honeycomb.',
        },
      ],
    },
    {
      id: 'deploy',
      title: 'Empacotar e deployar',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'JAR executável',
          code: `./mvnw clean package
# gera target/loja-0.1.0.jar com servidor embutido

java -jar target/loja-0.1.0.jar
# Started LojaApplication in 2.3 seconds

# Com perfil e config
SPRING_PROFILES_ACTIVE=prod \\
DATABASE_URL=jdbc:postgresql://pg.exemplo.com:5432/loja \\
DB_USER=loja \\
DB_PASSWORD=secret \\
java -jar target/loja-0.1.0.jar`,
        },
        {
          type: 'code', lang: 'bash', caption: 'imagem Docker com Spring Boot buildpacks (sem Dockerfile)',
          code: `./mvnw spring-boot:build-image \\
    -Dspring-boot.build-image.imageName=ghcr.io/ana/loja:0.1.0

docker run -p 8080:8080 \\
    -e DATABASE_URL=... \\
    ghcr.io/ana/loja:0.1.0

# Ou Dockerfile explícito (ver módulo Docker):
# FROM eclipse-temurin:25-jre-alpine
# COPY target/*.jar app.jar
# USER 10001
# EXPOSE 8080
# CMD ["java", "-jar", "app.jar"]`,
        },
        {
          type: 'code', lang: 'bash', caption: 'nativo com GraalVM — arranque sub-segundo',
          code: `./mvnw -Pnative native:compile
# Gera target/loja (binário standalone, sem JVM)

./target/loja
# Started LojaApplication in 0.08 seconds   ← 2.3s → 80ms

# Trade-off: compilação demora minutos; reflection precisa de hints.
# Vale para serverless / cold starts críticos.`,
        },
        {
          type: 'callout', tone: 'key', title: 'Checklist pré-produção',
          text: '**(1)** `ddl-auto: validate`, nunca `update`. **(2)** Flyway a correr no arranque. **(3)** `open-in-view: false`. **(4)** Logs em JSON com `trace_id`. **(5)** `/actuator/prometheus` só na porta interna. **(6)** `server.shutdown: graceful`. **(7)** Readiness probe separada de liveness. **(8)** Timeouts em todos os clientes HTTP e BD. **(9)** Virtual threads (`spring.threads.virtual.enabled: true`) para I/O. **(10)** Secrets em secret manager, não em env vars vistas em `/actuator/env`.',
        },
        { type: 'h', text: 'Para onde ir a seguir' },
        {
          type: 'list', ordered: true, items: [
            '**[Documentação oficial de Spring Boot](https://docs.spring.io/spring-boot/)** — guia e reference. Densa, mas é a fonte da verdade.',
            '**[Spring Guides](https://spring.io/guides)** — tutoriais curtos de 15-30 min por tópico.',
            '**[Baeldung](https://www.baeldung.com/)** — artigos práticos sobre quase tudo em Spring.',
            '**Livro:** *Spring in Action* (Craig Walls) — referência atualizada frequentemente.',
            '**Livro:** *Spring Boot Up & Running* (Mark Heckler) — tour prático.',
            '**[Testcontainers](https://testcontainers.com/)** — testar com infraestrutura real em Docker.',
            '**[Spring Security Reference](https://docs.spring.io/spring-security/reference/)** — denso mas essencial.',
            '**[Spring Modulith](https://spring.io/projects/spring-modulith)** — para separar módulos num monolito antes de pensar em microserviços.',
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'sb1',
      prompt: 'A anotação `@SpringBootApplication` combina…',
      options: [
        '`@Service` + `@Repository` + `@Controller`',
        '`@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`',
        '`@RestController` + `@RequestMapping` + `@Valid`',
        '`@Entity` + `@Table` + `@Id`',
      ],
      answer: 1,
      explain: 'É o ponto de entrada: declara a classe como configuração, ativa autoconfiguração e faz scan dos componentes no pacote e sub-pacotes.',
    },
    {
      id: 'sb2',
      prompt: 'Qual é a forma recomendada de injectar dependências?',
      options: [
        '`@Autowired` em campos privados',
        '`@Autowired` em setters',
        'Pelo construtor (campos `final`)',
        'Instanciar directamente com `new`',
      ],
      answer: 2,
      explain: 'Construtor permite campos `final`, torna dependências óbvias, facilita testes sem reflection, e Spring deteta ciclos no arranque.',
    },
    {
      id: 'sb3',
      prompt: '`ddl-auto: update` em produção é…',
      options: [
        'A melhor prática',
        'Aceitável se tens testes',
        'Perigoso — usa Flyway/Liquibase para migrações versionadas',
        'Automaticamente seguro',
      ],
      answer: 2,
      explain: 'O Hibernate pode fazer alterações destrutivas (DROP COLUMN) sem aviso. Em produção: `validate` + Flyway/Liquibase com ficheiros `V__*.sql`.',
    },
    {
      id: 'sb4',
      prompt: 'O que faz `@Valid @RequestBody` num parâmetro de controller?',
      options: [
        'Serializa a resposta',
        'Desserializa o corpo JSON e valida contra as anotações do DTO (`@NotBlank`, `@Positive`, etc.)',
        'Encripta o corpo',
        'Converte para XML',
      ],
      answer: 1,
      explain: '`@RequestBody` desserializa; `@Valid` dispara Bean Validation. Falhas lançam `MethodArgumentNotValidException`, que o `@RestControllerAdvice` converte em resposta 422.',
    },
    {
      id: 'sb5',
      prompt: '`@RestControllerAdvice` serve para…',
      options: [
        'Validar entradas',
        'Capturar exceções globalmente e devolver respostas HTTP consistentes',
        'Definir rotas',
        'Configurar segurança',
      ],
      answer: 1,
      explain: 'Centraliza o tratamento de erros — lançar excepção no service → responder 404/422/500 com `ProblemDetail` consistente.',
    },
    {
      id: 'sb6',
      prompt: 'Qual é a melhor estratégia de teste para validação de request/response sem BD?',
      options: [
        '`@SpringBootTest`',
        '`@DataJpaTest`',
        '`@WebMvcTest` com `MockMvc` + `@MockBean` do service',
        'Teste unitário puro',
      ],
      answer: 2,
      explain: '`@WebMvcTest` carrega só a camada web — rápido (~1 s). Services são mocked. Para teste de persistência: `@DataJpaTest`. Para integração completa: `@SpringBootTest` + Testcontainers.',
    },
    {
      id: 'sb7',
      prompt: 'O problema N+1 em JPA tipicamente resolve-se com…',
      options: [
        'Mais memória',
        '`JOIN FETCH` em JPQL ou `@EntityGraph`',
        'Desligar transações',
        'Usar `Set` em vez de `List`',
      ],
      answer: 1,
      explain: 'O N+1 acontece quando acedes a uma relação lazy em cada item de uma lista. `JOIN FETCH`/`@EntityGraph` força o Hibernate a carregar tudo numa query com join.',
    },
    {
      id: 'sb8',
      prompt: 'Para uma API REST stateless com JWT, deves…',
      options: [
        'Manter CSRF ativo',
        'Desligar CSRF e configurar `SessionCreationPolicy.STATELESS`',
        'Guardar o JWT numa sessão HTTP',
        'Usar Basic Auth em paralelo',
      ],
      answer: 1,
      explain: 'CSRF só faz sentido com sessões/cookies. APIs stateless autenticadas por JWT não têm estado de sessão a proteger — desliga.',
    },
    {
      id: 'sb9',
      prompt: '`/actuator/health` é para…',
      options: [
        'Debugar código',
        'Reportar o estado da aplicação a load balancers e sistemas de monitorização',
        'Autenticar utilizadores',
        'Alterar configuração',
      ],
      answer: 1,
      explain: 'Kubernetes, ALB, Nginx chamam este endpoint para saber se devem enviar tráfego. Separa `liveness` (processo está vivo) de `readiness` (está pronto a servir).',
    },
    {
      id: 'sb10',
      prompt: 'Spring Boot 4 + Java 25 permite tirar partido de Virtual Threads…',
      options: [
        'Reescrevendo tudo em CompletableFuture',
        'Com `spring.threads.virtual.enabled: true`: o Tomcat e serviços bloqueantes passam a usar virtual threads',
        'Apenas com Netty',
        'Não há suporte ainda',
      ],
      answer: 1,
      explain: 'Uma flag. O Tomcat cria virtual threads por pedido; APIs bloqueantes (JDBC, HTTP client) deixam de ser gargalo. Sem alterar código.',
    },
    {
      id: 'sb11',
      prompt: 'Um DTO como `record ProdutoDTO(Long id, String nome, long precoCents)` resolve o quê?',
      options: [
        'Nada relevante — devias usar classes',
        'Imutabilidade, equals/hashCode automáticos, e evita expor a entidade JPA ao exterior',
        'Compila mais rápido',
        'Faz validação automaticamente',
      ],
      answer: 1,
      explain: 'Records (Java 16+) são perfeitos para DTOs: menos boilerplate, imutáveis, fáceis de serializar. Separar entidade de DTO protege a API de mudanças internas.',
    },
    {
      id: 'sb12',
      prompt: 'A tentação "vou meter tudo em @SpringBootTest" é má porque…',
      options: [
        'Não compila',
        'Arranca o contexto todo (BD, security, servlets); fica lento, pesado e difícil de debugar',
        'Spring Boot não suporta',
        'Força uso de Mockito',
      ],
      answer: 1,
      explain: 'Usa a camada mínima necessária: `@WebMvcTest` para controllers, `@DataJpaTest` para repositórios, unitário puro para lógica. Reserva `@SpringBootTest` para integrações completas.',
    },
  ],
  exercises: [
    {
      id: 'e18-1',
      difficulty: 1,
      kind: 'open',
      title: 'Primeiro endpoint',
      statement: 'Cria um projeto Spring Boot com `spring-boot-starter-web`. Escreve um `HelloController` com `GET /hello?nome=X` que devolva `{ "mensagem": "Olá, X!" }`. Testa com `curl`.',
      hint: '`@RestController`, `@GetMapping("/hello")`, `@RequestParam`. Devolve um record.',
      solution: 'package pt.exemplo.loja;\n\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\npublic class HelloController {\n\n    public record HelloResponse(String mensagem) {}\n\n    @GetMapping("/hello")\n    public HelloResponse hello(@RequestParam(defaultValue = "mundo") String nome) {\n        return new HelloResponse("Olá, " + nome + "!");\n    }\n}\n\n# Correr\n./mvnw spring-boot:run\n\n# Testar\ncurl "http://localhost:8080/hello?nome=Ana"\n# {"mensagem":"Olá, Ana!"}\n\ncurl "http://localhost:8080/hello"\n# {"mensagem":"Olá, mundo!"}\n\nNotas: (1) O record é serializado automaticamente para JSON pelo Jackson (incluído no starter); (2) `defaultValue` evita 400 quando o param falta; (3) `@RestController` combina `@Controller` + `@ResponseBody`.',
    },
    {
      id: 'e18-2',
      difficulty: 1,
      kind: 'open',
      title: 'DTO com validação',
      statement: 'Escreve um record `CriarClienteDTO` com: `nome` (obrigatório, 1-200 chars), `email` (obrigatório, formato válido), `idade` (opcional, 0-150), `telefone` (opcional, regex `^\\+?[0-9]{9,15}$`). Usa Bean Validation. Mostra o endpoint que o aceita.',
      hint: '`@NotBlank`, `@Email`, `@Min`/`@Max`, `@Pattern`. No controller: `@Valid @RequestBody`.',
      solution: 'import jakarta.validation.constraints.*;\n\npublic record CriarClienteDTO(\n    @NotBlank @Size(min = 1, max = 200)\n    String nome,\n\n    @NotBlank @Email\n    String email,\n\n    @Min(0) @Max(150)\n    Integer idade,\n\n    @Pattern(regexp = "^\\\\+?[0-9]{9,15}$", message = "telefone inválido")\n    String telefone\n) {}\n\n// Controller\n@RestController\n@RequestMapping("/v1/clientes")\npublic class ClienteController {\n\n    private final ClienteService service;\n    public ClienteController(ClienteService service) { this.service = service; }\n\n    @PostMapping\n    public ResponseEntity<ClienteDTO> criar(@Valid @RequestBody CriarClienteDTO dto) {\n        var criado = service.criar(dto);\n        return ResponseEntity.created(URI.create("/v1/clientes/" + criado.id())).body(criado);\n    }\n}\n\n// Testar entrada inválida com curl:\ncurl -X POST http://localhost:8080/v1/clientes \\\\\n    -H "Content-Type: application/json" \\\\\n    -d \'{"nome": "", "email": "naoevalido", "idade": -5}\'\n\n// Resposta esperada (com @RestControllerAdvice a tratar MethodArgumentNotValidException):\n// HTTP/1.1 422 Unprocessable Entity\n// { "errors": [{"field": "nome", ...}, {"field": "email", ...}, {"field": "idade", ...}] }\n\nNotas: (1) `@NotBlank` cobre null, vazio e só-espaços; `@NotNull` só cobre null. (2) `idade` e `telefone` são opcionais (sem `@NotNull`), mas se vierem são validados. (3) `@Pattern` tem a sua `message` custom — o cliente vê "telefone inválido" em vez da mensagem padrão da regex.',
    },
    {
      id: 'e18-3',
      difficulty: 2,
      kind: 'open',
      title: 'Repository com Spring Data JPA',
      statement: 'Dada a entidade `Produto(id, nome, precoCents, stock, categoria)`, declara um `ProdutoRepository` com métodos para: (a) encontrar por nome exato ignorando case; (b) listar produtos com stock > 0 por categoria, ordenados por preço crescente, paginados; (c) decrementar o stock atomicamente e verificar se foi feito.',
      hint: 'Método derivado por nome vs `@Query` explícita. `Pageable` como parâmetro. `@Modifying` + transação para UPDATE.',
      solution: 'import org.springframework.data.jpa.repository.*;\nimport org.springframework.data.repository.query.Param;\nimport org.springframework.data.domain.*;\n\npublic interface ProdutoRepository extends JpaRepository<Produto, Long> {\n\n    // (a) Derived query - Spring gera SQL a partir do nome do método\n    Optional<Produto> findByNomeIgnoreCase(String nome);\n\n    // (b) JPQL explícita para clareza\n    @Query("""\n        SELECT p FROM Produto p\n        WHERE p.stock > 0\n          AND p.categoria.id = :categoriaId\n        ORDER BY p.precoCents ASC\n        """)\n    Page<Produto> emStockPorCategoria(@Param("categoriaId") Long categoriaId, Pageable pageable);\n\n    // (c) UPDATE atómico — devolve número de linhas afetadas\n    @Modifying\n    @Query("""\n        UPDATE Produto p\n        SET p.stock = p.stock - :quantidade\n        WHERE p.id = :id\n          AND p.stock >= :quantidade\n        """)\n    int reduzirStock(@Param("id") Long id, @Param("quantidade") int quantidade);\n}\n\n// Service\n@Service\npublic class ProdutoService {\n    private final ProdutoRepository repo;\n    public ProdutoService(ProdutoRepository repo) { this.repo = repo; }\n\n    @Transactional\n    public void venderUnidade(Long id, int qtd) {\n        int linhasAfetadas = repo.reduzirStock(id, qtd);\n        if (linhasAfetadas == 0) {\n            throw new StockInsuficiente(id);\n        }\n    }\n\n    @Transactional(readOnly = true)\n    public Page<ProdutoDTO> listarComStock(Long categoriaId, int pagina, int tamanho) {\n        return repo.emStockPorCategoria(\n            categoriaId,\n            PageRequest.of(pagina, tamanho, Sort.by("precoCents"))\n        ).map(ProdutoDTO::from);\n    }\n}\n\n**Decisões:**\n\n1. **Derived vs @Query**: nomes curtos (`findByEmail`, `existsByNome`) ficam derivados; queries complexas ou com joins ficam explícitas — mais legíveis e menos frágeis a renames.\n2. **`Optional<Produto>`** em vez de `null`: o chamador é obrigado a lidar com o caso "não encontrado".\n3. **`Pageable` built-in**: devolve `Page<T>` com totalElements, totalPages, number. Para paginação cursor-based, usas `Slice` + `where id > :cursor`.\n4. **`@Modifying` + `int` retorno**: `reduzirStock` devolve o número de linhas afetadas. Se for 0, significa que não havia stock suficiente — e o UPDATE em si é atómico (um único SQL), o que resolve a race condition sem lock explícito.\n5. **`@Transactional` em métodos de serviço**, não no repositório. O service orquestra; o repo expõe operações.\n6. **`readOnly = true`** sugere ao Hibernate otimizações (não faz dirty checking). Pequeno mas gratuito.',
    },
    {
      id: 'e18-4',
      difficulty: 2,
      kind: 'open',
      title: 'Tratamento de erros global',
      statement: 'Escreve um `@RestControllerAdvice` que converte: (a) `EntityNotFoundException` → 404; (b) `IllegalArgumentException` → 400; (c) `MethodArgumentNotValidException` → 422 com lista de campos; (d) qualquer outra `Exception` → 500 com mensagem genérica e `request_id`. Usa `ProblemDetail` do Spring 6+.',
      hint: '`@ExceptionHandler` por tipo. Guarda `request_id` em `MDC` no filter e lê aqui.',
      solution: 'import jakarta.persistence.EntityNotFoundException;\nimport org.slf4j.MDC;\nimport org.springframework.http.*;\nimport org.springframework.web.bind.*;\nimport org.springframework.web.bind.annotation.*;\nimport java.net.URI;\nimport java.util.*;\nimport java.util.stream.Collectors;\n\n@RestControllerAdvice\npublic class GlobalErrorHandler {\n\n    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GlobalErrorHandler.class);\n\n    @ExceptionHandler(EntityNotFoundException.class)\n    public ProblemDetail notFound(EntityNotFoundException ex) {\n        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n        pd.setType(URI.create("https://api.loja.pt/erros/not-found"));\n        pd.setTitle("Recurso não encontrado");\n        pd.setProperty("code", "not_found");\n        pd.setProperty("request_id", MDC.get("request_id"));\n        return pd;\n    }\n\n    @ExceptionHandler(IllegalArgumentException.class)\n    public ProblemDetail badRequest(IllegalArgumentException ex) {\n        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());\n        pd.setTitle("Pedido inválido");\n        pd.setProperty("code", "bad_request");\n        pd.setProperty("request_id", MDC.get("request_id"));\n        return pd;\n    }\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public ProblemDetail validation(MethodArgumentNotValidException ex) {\n        var errors = ex.getBindingResult().getFieldErrors().stream()\n            .map(e -> Map.of(\n                "field",   e.getField(),\n                "code",    Optional.ofNullable(e.getCode()).orElse("invalid"),\n                "message", Optional.ofNullable(e.getDefaultMessage()).orElse("inválido")\n            ))\n            .collect(Collectors.toList());\n\n        var pd = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);\n        pd.setTitle("Dados inválidos");\n        pd.setDetail("Um ou mais campos falharam a validação");\n        pd.setProperty("code", "validation_failed");\n        pd.setProperty("errors", errors);\n        pd.setProperty("request_id", MDC.get("request_id"));\n        return pd;\n    }\n\n    @ExceptionHandler(Exception.class)\n    public ProblemDetail generic(Exception ex) {\n        // Log completo com stack trace — NÃO expor ao cliente\n        log.error("Erro não tratado", ex);\n\n        var pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);\n        pd.setTitle("Erro interno");\n        pd.setDetail("Ocorreu um erro. Contacta o suporte com o request_id.");\n        pd.setProperty("code", "internal_error");\n        pd.setProperty("request_id", MDC.get("request_id"));\n        return pd;\n    }\n}\n\n// Filter que popula o MDC com request_id (chamar antes de tudo)\n@Component\npublic class RequestIdFilter implements Filter {\n    @Override\n    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)\n            throws IOException, ServletException {\n        var http = (HttpServletRequest) req;\n        var id = Optional.ofNullable(http.getHeader("X-Request-ID"))\n            .orElse(UUID.randomUUID().toString());\n        MDC.put("request_id", id);\n        ((HttpServletResponse) res).setHeader("X-Request-ID", id);\n        try {\n            chain.doFilter(req, res);\n        } finally {\n            MDC.clear();\n        }\n    }\n}\n\n**Decisões:**\n\n1. **Ordem dos handlers importa** — do mais específico para o mais genérico. O catch-all `Exception` fica por último.\n2. **Log completo apenas no 500** — detalhes técnicos vão para os logs, nunca para a resposta.\n3. **`request_id` em MDC** — propaga-se automaticamente em todos os logs e vai no `X-Request-ID` da resposta. Suporte pergunta pelo ID, equipa procura nos logs.\n4. **`code` estável** — slugs que o cliente pode comparar programaticamente. Nunca uses a mensagem para lógica.\n5. **422 vs 400**: 400 para JSON malformado; 422 para JSON válido com regras de negócio falhadas.',
    },
    {
      id: 'e18-5',
      difficulty: 3,
      kind: 'open',
      title: 'API CRUD completa com Postgres',
      statement: 'Esboça o código de um CRUD completo para `Categoria(id, nome)`: entidade, migration Flyway, repository, service, DTOs (criar/atualizar/response), controller, tratamento de erros, testes `@WebMvcTest` + Testcontainers. Explica as escolhas de design chave.',
      hint: 'Record DTOs; entidade só no service/repo; `@Transactional` no service; Flyway V1 inicial; testes separados por camada.',
      solution: '**V1__categorias.sql** (Flyway)\n```sql\nCREATE TABLE categorias (\n    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    nome       TEXT   NOT NULL UNIQUE,\n    criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n```\n\n**Categoria.java** (entidade)\n```java\n@Entity @Table(name = "categorias")\npublic class Categoria {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @Column(nullable = false, unique = true, length = 200)\n    private String nome;\n\n    @Column(name = "criado_em", nullable = false, updatable = false)\n    private Instant criadoEm;\n\n    @PrePersist void onCreate() { this.criadoEm = Instant.now(); }\n    // getters/setters\n}\n```\n\n**DTOs** (records)\n```java\npublic record CriarCategoriaDTO(@NotBlank @Size(max = 200) String nome) {}\npublic record AtualizarCategoriaDTO(@NotBlank @Size(max = 200) String nome) {}\npublic record CategoriaDTO(Long id, String nome, Instant criadoEm) {\n    static CategoriaDTO from(Categoria c) {\n        return new CategoriaDTO(c.getId(), c.getNome(), c.getCriadoEm());\n    }\n}\n```\n\n**Repository**\n```java\npublic interface CategoriaRepository extends JpaRepository<Categoria, Long> {\n    boolean existsByNomeIgnoreCase(String nome);\n}\n```\n\n**Service** (lógica + transações)\n```java\n@Service\npublic class CategoriaService {\n    private final CategoriaRepository repo;\n    public CategoriaService(CategoriaRepository repo) { this.repo = repo; }\n\n    @Transactional(readOnly = true)\n    public Page<CategoriaDTO> listar(Pageable p) {\n        return repo.findAll(p).map(CategoriaDTO::from);\n    }\n\n    @Transactional(readOnly = true)\n    public CategoriaDTO obter(Long id) {\n        return repo.findById(id).map(CategoriaDTO::from)\n            .orElseThrow(() -> new EntityNotFoundException("Categoria " + id));\n    }\n\n    @Transactional\n    public CategoriaDTO criar(CriarCategoriaDTO dto) {\n        if (repo.existsByNomeIgnoreCase(dto.nome())) {\n            throw new ConflictException("Categoria com esse nome já existe");\n        }\n        var c = new Categoria();\n        c.setNome(dto.nome());\n        return CategoriaDTO.from(repo.save(c));\n    }\n\n    @Transactional\n    public CategoriaDTO atualizar(Long id, AtualizarCategoriaDTO dto) {\n        var c = repo.findById(id)\n            .orElseThrow(() -> new EntityNotFoundException("Categoria " + id));\n        c.setNome(dto.nome());\n        return CategoriaDTO.from(c);   // flush no commit\n    }\n\n    @Transactional\n    public void apagar(Long id) {\n        if (!repo.existsById(id)) throw new EntityNotFoundException("Categoria " + id);\n        repo.deleteById(id);\n    }\n}\n```\n\n**Controller**\n```java\n@RestController @RequestMapping("/v1/categorias")\npublic class CategoriaController {\n    private final CategoriaService service;\n    public CategoriaController(CategoriaService s) { this.service = s; }\n\n    @GetMapping\n    public Page<CategoriaDTO> listar(@RequestParam(defaultValue = "0") int page,\n                                       @RequestParam(defaultValue = "20") int size) {\n        return service.listar(PageRequest.of(page, size, Sort.by("nome")));\n    }\n\n    @GetMapping("/{id}")\n    public CategoriaDTO obter(@PathVariable Long id) { return service.obter(id); }\n\n    @PostMapping\n    public ResponseEntity<CategoriaDTO> criar(@Valid @RequestBody CriarCategoriaDTO dto) {\n        var c = service.criar(dto);\n        return ResponseEntity.created(URI.create("/v1/categorias/" + c.id())).body(c);\n    }\n\n    @PutMapping("/{id}")\n    public CategoriaDTO atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarCategoriaDTO dto) {\n        return service.atualizar(id, dto);\n    }\n\n    @DeleteMapping("/{id}")\n    @ResponseStatus(HttpStatus.NO_CONTENT)\n    public void apagar(@PathVariable Long id) { service.apagar(id); }\n}\n```\n\n**Testes**\n```java\n// Rápido: valida apenas request/response\n@WebMvcTest(CategoriaController.class)\nclass CategoriaControllerTest {\n    @Autowired MockMvc mvc;\n    @MockBean CategoriaService service;\n\n    @Test\n    void criar_rejeita_nome_vazio() throws Exception {\n        mvc.perform(post("/v1/categorias").contentType(APPLICATION_JSON)\n                .content("{\\"nome\\":\\"\\"}"))\n            .andExpect(status().isUnprocessableEntity());\n    }\n}\n\n// Integração: Postgres real, sem mocks\n@SpringBootTest @AutoConfigureMockMvc @Testcontainers\nclass CategoriaIntegrationTest {\n    @Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:17-alpine");\n\n    @DynamicPropertySource\n    static void props(DynamicPropertyRegistry r) {\n        r.add("spring.datasource.url",      pg::getJdbcUrl);\n        r.add("spring.datasource.username", pg::getUsername);\n        r.add("spring.datasource.password", pg::getPassword);\n    }\n\n    @Autowired MockMvc mvc;\n\n    @Test\n    void criar_listar_apagar_roundTrip() throws Exception {\n        var res = mvc.perform(post("/v1/categorias").contentType(APPLICATION_JSON)\n                .content("{\\"nome\\":\\"Electrónica\\"}"))\n            .andExpect(status().isCreated())\n            .andReturn();\n\n        var id = JsonPath.read(res.getResponse().getContentAsString(), "$.id");\n\n        mvc.perform(get("/v1/categorias/" + id))\n            .andExpect(status().isOk())\n            .andExpect(jsonPath("$.nome").value("Electrónica"));\n\n        mvc.perform(delete("/v1/categorias/" + id))\n            .andExpect(status().isNoContent());\n    }\n}\n```\n\n**Escolhas de design:**\n\n1. **Entidade vs DTO separados** — a entidade pode ter mais campos, lazy relations, etc. O DTO é o contrato com o exterior.\n2. **Records para DTOs** — menos boilerplate, imutáveis.\n3. **`@Transactional` no service**, não no controller nem no repo. O service é a unidade transacional.\n4. **`readOnly = true`** em queries de leitura — hint para o Hibernate.\n5. **`existsByNomeIgnoreCase` antes de criar** — validação no service, confirmada pela UNIQUE constraint na BD.\n6. **UPDATE sem chamar `save()`** no `atualizar` — o Hibernate detecta alterações na entidade gerida (*dirty checking*) e faz flush no commit da transação. Chamar `save()` seria redundante.\n7. **Pirâmide de testes** — `@WebMvcTest` rápidos cobrem validação e serialização; Testcontainers cobrem o fluxo completo contra Postgres real. Evita-se `@SpringBootTest` sem Testcontainers (não é reproduzível).\n8. **`ResponseEntity.created().body()`** no POST — status + Location + body. Convenção REST.\n9. **404 quando não existe** — lançado no service via `EntityNotFoundException`, convertido pelo `@RestControllerAdvice`.',
    },
    {
      id: 'e18-6',
      difficulty: 3,
      kind: 'open',
      title: 'Spring Security com JWT e scopes',
      statement: 'Configura Spring Security para uma API com estes requisitos: (a) `/v1/public/**` e `/actuator/health` abertos; (b) todos os outros endpoints exigem JWT válido emitido por `https://auth.loja.pt`; (c) `DELETE /v1/produtos/{id}` exige `scope: "admin"`; (d) `GET /v1/me` devolve o `sub` do token; (e) `/actuator/**` (exceto health) exige scope `ops`. Desenha a configuração e explica.',
      hint: '`SecurityFilterChain` com `oauth2ResourceServer().jwt()`. `authorizeHttpRequests` com matchers por path e método. `@PreAuthorize` nos controllers específicos.',
      solution: '**SecurityConfig.java**\n```java\nimport org.springframework.context.annotation.*;\nimport org.springframework.http.HttpMethod;\nimport org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;\nimport org.springframework.security.config.annotation.web.builders.HttpSecurity;\nimport org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;\nimport org.springframework.security.config.http.SessionCreationPolicy;\nimport org.springframework.security.oauth2.jwt.*;\nimport org.springframework.security.oauth2.server.resource.authentication.*;\nimport org.springframework.security.web.SecurityFilterChain;\nimport org.springframework.core.convert.converter.Converter;\nimport java.util.*;\nimport java.util.stream.Stream;\n\n@Configuration\n@EnableWebSecurity\n@EnableMethodSecurity   // habilita @PreAuthorize\npublic class SecurityConfig {\n\n    @Bean\n    SecurityFilterChain api(HttpSecurity http) throws Exception {\n        http\n            .csrf(c -> c.disable())\n            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(a -> a\n                .requestMatchers("/v1/public/**", "/actuator/health").permitAll()\n                .requestMatchers("/actuator/**").hasAuthority("SCOPE_ops")\n                .requestMatchers(HttpMethod.DELETE, "/v1/produtos/**").hasAuthority("SCOPE_admin")\n                .anyRequest().authenticated()\n            )\n            .oauth2ResourceServer(o -> o.jwt(jwt -> jwt\n                .jwtAuthenticationConverter(jwtAuthenticationConverter())\n            ));\n        return http.build();\n    }\n\n    @Bean\n    JwtDecoder jwtDecoder() {\n        // Decoder que descarrega JWKS do issuer e valida assinatura, exp, iss, aud\n        var decoder = NimbusJwtDecoder\n            .withIssuerLocation("https://auth.loja.pt")\n            .build();\n\n        // Validações extra: audience é obrigatório\n        var validator = new DelegatingOAuth2TokenValidator<>(\n            JwtValidators.createDefaultWithIssuer("https://auth.loja.pt"),\n            jwt -> jwt.getAudience().contains("loja-api")\n                ? OAuth2TokenValidatorResult.success()\n                : OAuth2TokenValidatorResult.failure(\n                      new OAuth2Error("invalid_audience", "aud != loja-api", null))\n        );\n        decoder.setJwtValidator(validator);\n        return decoder;\n    }\n\n    private Converter<Jwt, JwtAuthenticationToken> jwtAuthenticationConverter() {\n        var scopes = new JwtGrantedAuthoritiesConverter();\n        scopes.setAuthoritiesClaimName("scope");       // claim name no token\n        scopes.setAuthorityPrefix("SCOPE_");            // prefixo nas authorities\n\n        return source -> new JwtAuthenticationToken(source, scopes.convert(source));\n    }\n}\n```\n\n**Controller com endpoint /me e @PreAuthorize**\n```java\nimport org.springframework.security.core.annotation.AuthenticationPrincipal;\nimport org.springframework.security.oauth2.jwt.Jwt;\nimport org.springframework.security.access.prepost.PreAuthorize;\n\n@RestController\n@RequestMapping("/v1")\npublic class UserController {\n\n    public record MeResponse(String sub, List<String> scopes, String email) {}\n\n    @GetMapping("/me")\n    public MeResponse me(@AuthenticationPrincipal Jwt jwt) {\n        return new MeResponse(\n            jwt.getSubject(),\n            jwt.getClaimAsStringList("scope"),\n            jwt.getClaimAsString("email")\n        );\n    }\n}\n\n@RestController\n@RequestMapping("/v1/produtos")\npublic class ProdutoController {\n\n    @DeleteMapping("/{id}")\n    @ResponseStatus(HttpStatus.NO_CONTENT)\n    @PreAuthorize("hasAuthority(\'SCOPE_admin\')")   // redundante com matcher, mas mais visível\n    public void apagar(@PathVariable Long id) { ... }\n}\n```\n\n**application.yml**\n```yaml\nspring:\n  security:\n    oauth2:\n      resourceserver:\n        jwt:\n          issuer-uri: https://auth.loja.pt\n          audiences: loja-api         # opcional — também validado no decoder\n```\n\n**Testar**\n```java\n@WebMvcTest(ProdutoController.class)\nclass ProdutoSecurityTest {\n    @Autowired MockMvc mvc;\n\n    @Test\n    void delete_sem_admin_scope_retorna_403() throws Exception {\n        mvc.perform(delete("/v1/produtos/42")\n                .with(jwt().jwt(j -> j.claim("scope", "read"))))\n            .andExpect(status().isForbidden());\n    }\n\n    @Test\n    void delete_com_admin_scope_retorna_204() throws Exception {\n        mvc.perform(delete("/v1/produtos/42")\n                .with(jwt().jwt(j -> j.claim("scope", "admin"))))\n            .andExpect(status().isNoContent());\n    }\n\n    @Test\n    void delete_sem_token_retorna_401() throws Exception {\n        mvc.perform(delete("/v1/produtos/42"))\n            .andExpect(status().isUnauthorized());\n    }\n}\n```\n\n**Explicação das escolhas:**\n\n1. **CSRF off + STATELESS** — API consumida por clientes não-browser com Bearer tokens. Sem cookies, não há CSRF para atacar.\n2. **`permitAll` para `/v1/public/**` e `/actuator/health`** — endpoints não autenticados; qualquer um pode chamar. Health é exigido por load balancers e orquestradores.\n3. **`/actuator/**` → `SCOPE_ops`** — depois do matcher mais específico de `/actuator/health`. A ordem importa: matchers são avaliados por ordem.\n4. **`HttpMethod.DELETE, "/v1/produtos/**"` → `SCOPE_admin`** — autorização específica por método + path.\n5. **`@PreAuthorize` *além* do matcher** — segunda linha de defesa. Se alguém mexer na config, o `@PreAuthorize` continua a proteger.\n6. **`JwtGrantedAuthoritiesConverter` com `scope`** — mapeia o claim `scope: "admin read write"` do token para authorities Spring `SCOPE_admin`, `SCOPE_read`, `SCOPE_write`.\n7. **Validação de audience** — sem isto, aceitas tokens emitidos para outras aplicações do mesmo auth server. Erro de segurança comum.\n8. **`JwtDecoder` com `issuer-uri`** — descarrega as chaves públicas (JWKS) do issuer; a biblioteca faz rotação automática quando o auth server rotaciona chaves.\n9. **Testes com `jwt().jwt(...)`** — testa cenários de scope sem precisar de um auth server real. O `@WebMvcTest` tem suporte dedicado para isto.\n10. **401 vs 403** — sem token → 401 (não autenticado). Com token válido mas sem scope → 403 (não autorizado). Spring Security devolve isto automaticamente quando configurado assim.',
    },
  ],
};
