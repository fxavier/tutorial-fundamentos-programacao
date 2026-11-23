import type { Module, GlossaryEntry } from '../types';
import { m01 } from './m01-computador';
import { m02 } from './m02-binario';
import { m03 } from './m03-memoria';
import { m04 } from './m04-redes';
import { m05 } from './m05-logica';
import { m06 } from './m06-controlo';
import { m07 } from './m07-algoritmos';
import { m08 } from './m08-estruturas';
import { m09 } from './m09-complexidade';
import { m10 } from './m10-paradigmas';
import { m11 } from './m11-ferramentas';
import { m12 } from './m12-proximos-passos';
import { m13 } from './m13-java25';
import { m14 } from './m14-bases-dados';
import { m15 } from './m15-docker';
import { m16 } from './m16-git-github';
import { m17 } from './m17-apis';
import { m18 } from './m18-spring-boot';
import { m19 } from './m19-kubernetes';
import { m20 } from './m20-terraform';

export const MODULES: Module[] = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20];

export const TRACKS = [
  { id: 'hardware', name: 'Como a máquina funciona', modules: ['computador', 'binario', 'memoria', 'redes'], color: 'from-sky-500 to-cyan-500' },
  { id: 'logica', name: 'Lógica e algoritmos', modules: ['logica', 'controlo', 'algoritmos'], color: 'from-violet-500 to-fuchsia-500' },
  { id: 'engenharia', name: 'Engenharia de software', modules: ['estruturas', 'complexidade', 'paradigmas', 'ferramentas', 'proximos-passos'], color: 'from-emerald-500 to-teal-500' },
  { id: 'linguagens', name: 'Linguagens modernas e bases de dados', modules: ['java25', 'bases-dados'], color: 'from-orange-500 to-red-500' },
  { id: 'devops', name: 'DevOps e colaboração', modules: ['docker', 'git-github'], color: 'from-indigo-500 to-blue-500' },
  { id: 'backend', name: 'APIs e backend em produção', modules: ['apis', 'spring-boot'], color: 'from-green-500 to-emerald-500' },
  { id: 'plataforma', name: 'Plataforma e infraestrutura', modules: ['kubernetes', 'terraform'], color: 'from-purple-500 to-pink-500' },
];

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function moduleNeighbours(id: string): { prev?: Module; next?: Module } {
  const i = MODULES.findIndex((m) => m.id === id);
  return { prev: i > 0 ? MODULES[i - 1] : undefined, next: i >= 0 && i < MODULES.length - 1 ? MODULES[i + 1] : undefined };
}

export const TOTAL_SECTIONS = MODULES.reduce((a, m) => a + m.sections.length, 0);
export const TOTAL_QUESTIONS = MODULES.reduce((a, m) => a + m.quiz.length, 0);
export const TOTAL_EXERCISES = MODULES.reduce((a, m) => a + m.exercises.length, 0);
export const TOTAL_MINUTES = MODULES.reduce((a, m) => a + m.minutes, 0);

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Algoritmo', def: 'Sequência finita de passos não ambíguos que resolve um problema.', module: 'algoritmos' },
  { term: 'Bit', def: 'Menor unidade de informação: 0 ou 1.', module: 'binario' },
  { term: 'Byte', def: 'Conjunto de 8 bits; representa 256 valores distintos.', module: 'memoria' },
  { term: 'Big-O', def: 'Notação que descreve como o custo de um algoritmo cresce com o tamanho da entrada.', module: 'complexidade' },
  { term: 'Cache', def: 'Memória rápida e pequena entre a CPU e a RAM, que guarda os dados usados recentemente.', module: 'memoria' },
  { term: 'Compilador', def: 'Programa que traduz código-fonte em código-máquina antes da execução.', module: 'computador' },
  { term: 'Complemento de dois', def: 'Convenção para representar números negativos em binário, dando peso negativo ao bit mais significativo.', module: 'binario' },
  { term: 'CPU', def: 'Unidade central de processamento: executa as instruções do programa.', module: 'computador' },
  { term: 'DNS', def: 'Serviço que traduz nomes de domínio em endereços IP.', module: 'redes' },
  { term: 'Encapsulamento (redes)', def: 'Processo em que cada camada acrescenta o seu cabeçalho aos dados da camada superior.', module: 'redes' },
  { term: 'Encapsulamento (POO)', def: 'Esconder o estado interno de um objeto, expondo apenas operações válidas.', module: 'paradigmas' },
  { term: 'Escopo', def: 'Zona do programa onde um nome é visível.', module: 'algoritmos' },
  { term: 'Fila (FIFO)', def: 'Estrutura em que o primeiro a entrar é o primeiro a sair.', module: 'estruturas' },
  { term: 'Hexadecimal', def: 'Base 16; cada dígito representa exatamente 4 bits.', module: 'binario' },
  { term: 'IEEE 754', def: 'Norma de representação de números com vírgula flutuante.', module: 'memoria' },
  { term: 'Índice', def: 'Posição de um elemento num vetor. Começa em 0 na maioria das linguagens.', module: 'estruturas' },
  { term: 'IP', def: 'Endereço lógico que identifica uma máquina numa rede.', module: 'redes' },
  { term: 'Mapa (hash)', def: 'Estrutura que associa chaves a valores com acesso médio em O(1).', module: 'estruturas' },
  { term: 'Overflow', def: 'Resultado que ultrapassa o valor máximo representável e "dá a volta".', module: 'binario' },
  { term: 'Pilha (LIFO)', def: 'Estrutura em que o último a entrar é o primeiro a sair; também a zona de memória das chamadas de função.', module: 'estruturas' },
  { term: 'Ponteiro', def: 'Variável que guarda o endereço de outra posição de memória.', module: 'memoria' },
  { term: 'Portugol', def: 'Pseudocódigo estruturado em português, usado para aprender lógica.', module: 'algoritmos' },
  { term: 'Pseudocódigo', def: 'Descrição estruturada de um algoritmo, independente de linguagem.', module: 'algoritmos' },
  { term: 'RAM', def: 'Memória principal, volátil e rápida, onde vivem os programas em execução.', module: 'computador' },
  { term: 'Recursão', def: 'Função que se chama a si própria com um problema menor até chegar ao caso base.', module: 'algoritmos' },
  { term: 'Sistema operativo', def: 'Software que gere recursos e faz de intermediário entre os programas e o hardware.', module: 'computador' },
  { term: 'TCP', def: 'Protocolo de transporte fiável, com ligação, ordem e retransmissão.', module: 'redes' },
  { term: 'Teste de mesa', def: 'Execução manual de um algoritmo, registando as variáveis passo a passo.', module: 'algoritmos' },
  { term: 'UDP', def: 'Protocolo de transporte rápido e sem garantias de entrega.', module: 'redes' },
  { term: 'Unicode / UTF-8', def: 'Catálogo universal de caracteres e a sua codificação dominante em bytes.', module: 'memoria' },
  { term: 'Variável', def: 'Nome dado a um espaço de memória que guarda um valor.', module: 'logica' },
  { term: 'Vetor (array)', def: 'Coleção de elementos do mesmo tipo em posições contíguas, acedidos por índice.', module: 'estruturas' },
  { term: 'ACID', def: 'Atomicidade, Consistência, Isolamento e Durabilidade — as quatro garantias de uma transação de base de dados.', module: 'bases-dados' },
  { term: 'Chave estrangeira', def: 'Coluna que referencia a chave primária de outra tabela, criando uma relação entre elas.', module: 'bases-dados' },
  { term: 'Chave primária', def: 'Coluna (ou conjunto) que identifica univocamente cada linha de uma tabela.', module: 'bases-dados' },
  { term: 'CTE', def: '*Common Table Expression* — subconsulta nomeada introduzida com `WITH`, usada para dividir consultas complexas em passos legíveis.', module: 'bases-dados' },
  { term: 'Índice (BD)', def: 'Estrutura auxiliar que acelera a localização de linhas por valores de uma ou mais colunas.', module: 'bases-dados' },
  { term: 'JOIN', def: 'Operação que combina linhas de duas tabelas segundo uma condição. INNER devolve só correspondências; LEFT inclui as linhas sem correspondência à direita.', module: 'bases-dados' },
  { term: 'JSONB', def: 'Tipo binário do PostgreSQL para dados JSON, indexável e muito mais rápido do que `json`.', module: 'bases-dados' },
  { term: 'Normalização', def: 'Processo de organizar o esquema para eliminar duplicação — cada facto num único sítio.', module: 'bases-dados' },
  { term: 'SQL', def: '*Structured Query Language* — linguagem declarativa usada em bases de dados relacionais.', module: 'bases-dados' },
  { term: 'Transação', def: 'Bloco de operações tratadas como uma unidade atómica: todas são confirmadas (COMMIT) ou todas desfeitas (ROLLBACK).', module: 'bases-dados' },
  { term: 'Window Function', def: 'Função que calcula agregações sobre um "janela" de linhas, mas devolve uma linha por cada linha de entrada.', module: 'bases-dados' },
  { term: 'Branch', def: 'Ponteiro mutável para um commit. Permite linhas paralelas de trabalho no mesmo repositório.', module: 'git-github' },
  { term: 'Commit', def: 'Snapshot imutável do projeto num dado momento, identificado por um hash SHA-1 e com uma mensagem associada.', module: 'git-github' },
  { term: 'Container', def: 'Instância em execução de uma imagem Docker: processo isolado com o seu sistema de ficheiros, rede e lista de processos.', module: 'docker' },
  { term: 'Dockerfile', def: 'Ficheiro de texto com instruções (`FROM`, `COPY`, `RUN`, `CMD`...) que descrevem como construir uma imagem.', module: 'docker' },
  { term: 'GitHub Actions', def: 'Serviço de CI/CD integrado no GitHub que corre workflows em resposta a eventos (push, PR, cron, release).', module: 'git-github' },
  { term: 'HEAD', def: 'Ponteiro para o commit atual — normalmente aponta para um branch, que por sua vez aponta para um commit.', module: 'git-github' },
  { term: 'Imagem (Docker)', def: 'Molde imutável em camadas que contém sistema de ficheiros, binários e configuração para arrancar containers.', module: 'docker' },
  { term: 'Merge', def: 'Operação que combina o histórico de dois branches. Pode ser fast-forward ou criar um merge commit com dois pais.', module: 'git-github' },
  { term: 'Multi-stage build', def: 'Dockerfile com múltiplas fases (`FROM ... AS stage`), permitindo compilar numa imagem pesada e correr noutra minimal.', module: 'docker' },
  { term: 'Pull Request', def: 'Proposta de integrar um branch noutro, com revisão de código, discussão e CI automático antes do merge.', module: 'git-github' },
  { term: 'Rebase', def: 'Operação que reaplica commits sobre outro ponto do histórico, produzindo uma história linear com hashes novos.', module: 'git-github' },
  { term: 'Registry', def: 'Servidor que armazena imagens Docker. Docker Hub, GHCR, AWS ECR, GitLab Registry são exemplos.', module: 'docker' },
  { term: 'Reflog', def: 'Registo local de todas as movimentações do HEAD. Guardado 90 dias por omissão — a última linha de defesa do Git.', module: 'git-github' },
  { term: 'Volume (Docker)', def: 'Espaço de armazenamento persistente, independente do ciclo de vida do container. Essencial para bases de dados.', module: 'docker' },
  { term: 'API', def: 'Contrato pelo qual um programa pede serviços a outro — normalmente por HTTP (REST, GraphQL) ou RPC (gRPC).', module: 'apis' },
  { term: 'REST', def: 'Estilo arquitetónico para APIs sobre HTTP: recursos identificados por URL, verbos (GET/POST/PUT/DELETE), stateless, interface uniforme.', module: 'apis' },
  { term: 'GraphQL', def: 'Linguagem de consulta sobre um schema tipado. O cliente pede exactamente os campos que precisa.', module: 'apis' },
  { term: 'gRPC', def: 'RPC binário sobre HTTP/2, com Protocol Buffers como formato. Baixa latência, streaming nativo, código gerado em qualquer linguagem.', module: 'apis' },
  { term: 'JWT', def: 'JSON Web Token — token auto-contido, assinado, usado para autenticação. Três partes: header, payload, assinatura, separadas por pontos.', module: 'apis' },
  { term: 'OpenAPI', def: 'Especificação (YAML/JSON) que descreve uma API REST. A partir dela gera-se documentação, clientes e mocks.', module: 'apis' },
  { term: 'Idempotência', def: 'Propriedade de uma operação poder ser repetida sem efeitos secundários extra. Essencial em pagamentos — implementada via `Idempotency-Key`.', module: 'apis' },
  { term: 'Problem Details (RFC 7807)', def: 'Formato padronizado para erros em APIs REST: `type`, `title`, `status`, `detail`, `instance`, com `Content-Type: application/problem+json`.', module: 'apis' },
  { term: 'Spring Boot', def: 'Framework Java que combina Spring + convenções + servidor embutido + dependências pré-empacotadas. O stack dominante para APIs em Java.', module: 'spring-boot' },
  { term: 'Dependency Injection', def: 'Padrão em que o framework fornece as dependências de uma classe em vez de esta as criar. Em Spring, prefere-se injecção por construtor.', module: 'spring-boot' },
  { term: 'Bean', def: 'Objecto gerido pelo container de Spring. Declarado com `@Component`, `@Service`, `@Repository`, `@Controller` ou `@Bean` numa classe `@Configuration`.', module: 'spring-boot' },
  { term: 'Spring Data JPA', def: 'Camada sobre JPA/Hibernate: declaras uma interface que estende `JpaRepository<T, ID>` e Spring gera a implementação.', module: 'spring-boot' },
  { term: 'Flyway', def: 'Ferramenta de migração de BD. Cada alteração vive num ficheiro `V1__init.sql` imutável; Flyway aplica-os por ordem e regista o que já correu.', module: 'spring-boot' },
  { term: 'Actuator', def: 'Módulo de Spring Boot que expõe endpoints de observabilidade: `/health`, `/metrics`, `/prometheus`, `/info`, `/loggers`.', module: 'spring-boot' },
  { term: 'Testcontainers', def: 'Biblioteca que arranca serviços reais (Postgres, Redis, Kafka) em Docker a partir dos testes. Testes de integração com a mesma tecnologia de produção.', module: 'spring-boot' },
  { term: 'Pod', def: 'Unidade mais pequena do Kubernetes: um ou mais containers partilhando rede e volumes. Raramente criados directamente — usa Deployment.', module: 'kubernetes' },
  { term: 'Deployment (K8s)', def: 'Objeto que gere Pods através de ReplicaSets. Faz rolling updates, rollbacks, mantém N réplicas. 90% do que usas no dia-a-dia.', module: 'kubernetes' },
  { term: 'Service (K8s)', def: 'Endpoint estável para um conjunto de Pods, com DNS interno e load balancing. Tipos: ClusterIP, NodePort, LoadBalancer.', module: 'kubernetes' },
  { term: 'Ingress', def: 'Roteamento HTTP(S) do exterior para Services, com hostnames e TLS. Precisa de um Ingress Controller (nginx, Traefik, ALB).', module: 'kubernetes' },
  { term: 'ConfigMap / Secret', def: 'Objetos para injetar configuração (ficheiros, env vars) nos Pods. ConfigMap para dados normais, Secret para sensíveis (mas Secrets são apenas base64 — encripta com SOPS ou External Secrets).', module: 'kubernetes' },
  { term: 'Helm', def: 'Package manager do Kubernetes. Charts empacotam aplicações parametrizadas com `values.yaml`.', module: 'kubernetes' },
  { term: 'GitOps', def: 'Padrão em que git é a fonte da verdade do estado desejado e uma ferramenta (ArgoCD, Flux) reconcilia o cluster com o repo. Deploys via PR.', module: 'kubernetes' },
  { term: 'kubectl', def: 'CLI oficial do Kubernetes. Fala com o API Server. Tudo o resto (dashboards, k9s, Lens) é açúcar por cima.', module: 'kubernetes' },
  { term: 'Terraform / OpenTofu', def: 'Ferramenta de IaC declarativa em HCL. Descreve recursos; `plan` mostra o impacto; `apply` executa. OpenTofu é o fork open-source compatível.', module: 'terraform' },
  { term: 'HCL', def: '*HashiCorp Configuration Language* — linguagem declarativa do Terraform. Blocos `resource`, `variable`, `output`, `module`, com expressões e tipos.', module: 'terraform' },
  { term: 'State (Terraform)', def: 'Ficheiro JSON (`terraform.tfstate`) que mapeia recursos do código a recursos reais na cloud. Contém segredos — guarda sempre em backend remoto encriptado com locking.', module: 'terraform' },
  { term: 'Backend remoto', def: 'Onde o Terraform guarda o state (S3+DynamoDB, GCS, Azure Blob, Terraform Cloud). Essencial para trabalho em equipa — oferece locking.', module: 'terraform' },
  { term: 'Módulo (Terraform)', def: 'Grupo reutilizável de recursos com inputs (variáveis) e outputs. Qualquer diretório com `.tf` é um módulo; o root module é onde corres.', module: 'terraform' },
  { term: 'Drift', def: 'Divergência entre o state do Terraform e a realidade na cloud (alguém alterou algo à margem). Detetado com `terraform plan -refresh-only`.', module: 'terraform' },
  { term: 'IaC', def: '*Infrastructure as Code* — descrever infraestrutura em ficheiros versionados no git, aplicados via ferramentas (Terraform, Pulumi, CloudFormation).', module: 'terraform' },
];
