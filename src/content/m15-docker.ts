import type { Module } from '../types';

export const m15: Module = {
  id: 'docker',
  number: 15,
  title: 'Docker — contentores do zero ao Compose',
  subtitle: 'Imagens, containers, volumes, redes, Dockerfile e docker compose — porque "funciona na minha máquina" deixou de ser desculpa',
  icon: '🐳',
  minutes: 100,
  goals: [
    'Perceber a diferença entre containers e máquinas virtuais',
    'Correr e inspecionar containers com confiança',
    'Escrever um `Dockerfile` idiomático, com camadas pensadas para cache',
    'Persistir dados com volumes e ligar serviços com redes',
    'Orquestrar múltiplos serviços com `docker compose`',
    'Reduzir imagens de 1 GB para 50 MB com multi-stage builds',
    'Publicar e consumir imagens em registries',
    'Evitar as armadilhas de segurança mais comuns',
  ],
  sections: [
    {
      id: 'porque-docker',
      title: 'Porquê Docker existe',
      blocks: [
        { type: 'p', text: 'Durante décadas, instalar uma aplicação em servidor significava: Python 3.9 nesta máquina, Python 3.11 na outra, uma biblioteca C com versão diferente em cada uma, e três horas a descobrir porquê a aplicação arranca em "localhost" e rebenta em produção. Docker resolve o problema do **ambiente** empacotando aplicação e dependências numa imagem portátil que corre igual em qualquer sítio.' },
        {
          type: 'compare',
          left: {
            title: 'Antes de containers',
            items: [
              '"Funciona na minha máquina" como resposta típica a bugs',
              'Documento de 30 páginas para configurar o ambiente de desenvolvimento',
              'Cada serviço na sua VM, cada VM a gastar 2 GB de RAM à toa',
              'Atualizar uma biblioteca partia três projetos independentes na mesma máquina',
              'Dias a instalar dependências em servidores novos',
            ],
          },
          right: {
            title: 'Com containers',
            items: [
              'Uma imagem = o mesmo comportamento, em qualquer sistema',
              '`docker compose up` e tens tudo a correr em segundos',
              'Dez containers no mesmo host, isolados, poucos MB de overhead',
              'Cada serviço com as suas versões, sem interferir com os outros',
              'Deploy = `docker pull && docker run` — seja em laptops, servidores ou cloud',
            ],
          },
        },
        { type: 'h', text: 'Container vs. máquina virtual' },
        {
          type: 'table',
          head: ['', 'VM', 'Container'],
          rows: [
            ['O que virtualiza', 'Hardware inteiro (CPU, RAM, disco, placa de rede)', 'Processo do sistema operativo'],
            ['Kernel', 'Cada VM tem o seu', 'Partilha o kernel do host'],
            ['Arranque', 'Minutos', 'Segundos (ou menos)'],
            ['Tamanho típico', 'GBs', 'Dezenas de MB a algumas centenas'],
            ['Densidade', 'Dezenas por host', 'Milhares por host'],
            ['Isolamento', 'Forte (hypervisor)', 'Bom, mas kernel partilhado'],
            ['Onde cabe', 'Diferentes SO em simultâneo', 'Aplicações Linux no mesmo kernel'],
          ],
          caption: 'Containers não substituem VMs — complementam. Em produção vêem-se containers DENTRO de VMs geridas por um orquestrador (Kubernetes, ECS).',
        },
        {
          type: 'callout', tone: 'key', title: 'A frase de uma linha',
          text: 'Container = **processo isolado** com o seu próprio sistema de ficheiros, rede e lista de processos, usando mecanismos do kernel Linux (namespaces + cgroups). Não há "magia" nem virtualização de hardware — só isolamento.',
        },
      ],
    },
    {
      id: 'conceitos',
      title: 'Conceitos: imagem, container, registry, Dockerfile',
      blocks: [
        {
          type: 'terms', items: [
            { term: 'Imagem', def: 'Molde imutável com o sistema de ficheiros, binários e configuração. Organizada em **camadas** sobrepostas. É o que descarregas com `docker pull`.' },
            { term: 'Container', def: 'Instância em execução de uma imagem. Pode ser arrancada, parada, apagada. Alterações feitas lá dentro desaparecem quando o container é removido (a menos que uses volumes).' },
            { term: 'Dockerfile', def: 'Receita textual para construir uma imagem. Sequência de instruções (`FROM`, `COPY`, `RUN`, `CMD`) que o Docker executa passo a passo, criando uma camada por instrução.' },
            { term: 'Registry', def: 'Servidor que guarda imagens. Docker Hub é o público; GitHub Container Registry (GHCR), GitLab, AWS ECR, Azure ACR são alternativas privadas.' },
            { term: 'Volume', def: 'Espaço de armazenamento persistente, independente do ciclo de vida do container. Para bases de dados, uploads, qualquer coisa que tenha de sobreviver a `docker rm`.' },
            { term: 'Rede', def: 'Ponte virtual entre containers. Containers na mesma rede falam por nome; o resto do mundo tem de passar por portas publicadas.' },
          ],
        },
        {
          type: 'code', lang: 'text', caption: 'o fluxo mental',
          code: `         ┌──────────────┐
         │  Dockerfile   │   receita, texto
         └──────┬───────┘
                │ docker build
                ▼
         ┌──────────────┐
         │   Imagem     │   artefacto imutável, em camadas
         └──────┬───────┘
                │ docker run
                ▼
         ┌──────────────┐
         │  Container    │   processo em execução
         └──────────────┘
                │ docker push
                ▼
         ┌──────────────┐
         │   Registry   │   partilha / deploy
         └──────────────┘`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Analogia que ajuda',
          text: 'Pensa no **Dockerfile** como o código-fonte; na **imagem** como o executável compilado; no **container** como o processo quando corres o executável. Mudar o Dockerfile → rebuild da imagem. Correr a imagem N vezes → N containers independentes.',
        },
      ],
    },
    {
      id: 'instalar',
      title: 'Instalar e primeiros comandos',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'Instalar', text: '**macOS/Windows:** [Docker Desktop](https://docs.docker.com/desktop/) — inclui o engine, CLI e uma UI. **Linux:** `docker.io` nos repositórios da distribuição, ou segue o [guia oficial](https://docs.docker.com/engine/install/). **Alternativas:** Podman (compatível, sem daemon), OrbStack (macOS, mais rápido e leve que Desktop).' },
            { title: 'Confirmar', text: '`docker --version` → `Docker version 27.x`. `docker run hello-world` → descarrega e corre uma imagem de teste. Se funcionou, está tudo.' },
            { title: 'Permissões Linux', text: 'Acrescenta-te ao grupo `docker` para não teres de usar `sudo`: `sudo usermod -aG docker $USER`. Logout e login outra vez.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'os 10 comandos que vais usar sempre',
          code: `# Correr um container em primeiro plano
docker run -it ubuntu bash              # -it = interactive + tty
docker run --rm alpine echo "olá"       # --rm = remove quando terminar

# Correr em background com porta publicada
docker run -d --name web -p 8080:80 nginx
# -d: detached (background)
# --name: nome legível (senão vem aleatório)
# -p host:container: expõe porta 80 do container na 8080 do host

# Ver o que está a correr
docker ps              # containers ativos
docker ps -a           # todos (incluindo parados)

# Logs e inspeção
docker logs web
docker logs -f web                      # -f = follow (tail)
docker inspect web                      # JSON com tudo
docker stats                            # uso de CPU/RAM em tempo real

# Entrar num container a correr
docker exec -it web bash
docker exec web ls /etc/nginx           # correr um comando pontual

# Parar, começar, reiniciar, remover
docker stop web
docker start web
docker restart web
docker rm web                           # tem de estar parado (ou -f para forçar)

# Imagens
docker pull python:3.12-slim
docker images                           # listar
docker rmi python:3.12                  # remover`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Limpar o que nunca mais precisas',
          text: 'Containers parados, imagens antigas e caches ocupam **dezenas de GB** depressa. `docker system df` mostra o quê. `docker system prune -a --volumes` apaga tudo o que não está a ser usado — usa com atenção.',
        },
      ],
    },
    {
      id: 'dockerfile',
      title: 'Escrever um Dockerfile',
      blocks: [
        { type: 'p', text: 'Cada instrução no Dockerfile cria uma **camada**. O Docker cacheia cada camada — se nada mudou acima, as camadas são reutilizadas. Pôr as coisas na ordem certa poupa minutos em cada rebuild.' },
        {
          type: 'code', lang: 'bash', caption: 'Dockerfile — aplicação Python básica',
          code: `# 1. Imagem base — escolhe a mais pequena que te sirva
FROM python:3.12-slim

# 2. Metadados (opcional mas boa prática)
LABEL maintainer="ana@example.com"

# 3. Diretório de trabalho — todos os COPY/RUN subsequentes acontecem aqui
WORKDIR /app

# 4. Instalar dependências ANTES de copiar o código
#    Assim, se só o código muda, esta camada é reutilizada da cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Agora sim, copia o código
COPY . .

# 6. Documentar a porta que o processo abre
EXPOSE 8000

# 7. Variáveis de ambiente (podem ser substituídas no run)
ENV PYTHONUNBUFFERED=1 \\
    LOG_LEVEL=info

# 8. Utilizador não-root (segurança)
RUN useradd --create-home app && chown -R app:app /app
USER app

# 9. Comando por omissão — o que corre quando fazes 'docker run'
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]`,
        },
        {
          type: 'table',
          head: ['Instrução', 'Para que serve'],
          rows: [
            ['`FROM`', 'Imagem base. Tem de ser a primeira (ou segunda, depois de `ARG`).'],
            ['`WORKDIR`', 'Define o diretório atual. Substitui `cd` + persiste entre instruções.'],
            ['`COPY src dst`', 'Copia do host para dentro da imagem. `ADD` tem extras (URL, tar), raramente necessários.'],
            ['`RUN`', 'Executa comando durante o build. Usa `&&` para juntar comandos e reduzir camadas.'],
            ['`ENV`', 'Variáveis de ambiente, acessíveis durante o build e em runtime.'],
            ['`ARG`', 'Variáveis de build (`docker build --build-arg KEY=val`). Não vão para a imagem final.'],
            ['`EXPOSE`', 'Documenta a porta. Não publica — isso é o `-p` do `run`.'],
            ['`USER`', 'Utilizador que corre o processo. Default: root (**má ideia em produção**).'],
            ['`CMD`', 'Comando por omissão. Pode ser substituído no `docker run`.'],
            ['`ENTRYPOINT`', 'Processo principal do container. `CMD` passa a ser os argumentos. Útil para "wrappers".'],
            ['`HEALTHCHECK`', 'Como o Docker verifica se o container está saudável.'],
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'construir e correr a imagem',
          code: `# Construir (lê o Dockerfile no diretório atual)
docker build -t minha-api:0.1 .
docker build -t minha-api:0.1 -f Dockerfile.prod .  # outro ficheiro

# Correr
docker run -d --name api -p 8000:8000 minha-api:0.1

# Ver as camadas da imagem (útil para descobrir o que ocupa espaço)
docker history minha-api:0.1`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Ordem = cache',
          text: 'As linhas que raramente mudam ficam **no topo**; o que muda a cada commit (código) fica **em baixo**. Se puseres `COPY . .` antes de `pip install`, cada alteração no código invalida o cache e o pip reinstala tudo outra vez. Pequena mudança, grande impacto.',
        },
      ],
    },
    {
      id: 'volumes',
      title: 'Volumes — persistir dados',
      blocks: [
        { type: 'p', text: 'Containers são **efémeros**. Tudo o que escreves dentro desaparece quando apagas o container. Para dados que têm de sobreviver — bases de dados, uploads, logs — usas volumes.' },
        {
          type: 'table',
          head: ['Tipo', 'Sintaxe', 'Quando usar'],
          rows: [
            ['**Named volume**', '`-v meusdados:/var/lib/postgresql/data`', 'Caso geral. O Docker gere, tu referes pelo nome.'],
            ['**Bind mount**', '`-v $(pwd)/src:/app/src`', 'Desenvolvimento — editar código no host e ver reflectido no container.'],
            ['**tmpfs**', '`--tmpfs /tmp`', 'Dados sensíveis em RAM que nunca tocam no disco.'],
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'PostgreSQL com dados persistentes',
          code: `# Cria o volume primeiro (opcional — é criado automaticamente)
docker volume create pgdata

# Corre o container ligado ao volume
docker run -d \\
    --name pg \\
    -e POSTGRES_PASSWORD=secret \\
    -v pgdata:/var/lib/postgresql/data \\
    -p 5432:5432 \\
    postgres:17

# Agora podes 'docker rm pg' e os dados ficam.
# Para apagar mesmo:
docker volume rm pgdata

# Listar e inspecionar
docker volume ls
docker volume inspect pgdata`,
        },
        {
          type: 'code', lang: 'bash', caption: 'bind mount para desenvolvimento',
          code: `# Monta a pasta ./src do host em /app/src do container
# — alterações em tempo real, sem rebuild
docker run -it --rm \\
    -v $(pwd)/src:/app/src \\
    -v $(pwd)/node_modules:/app/node_modules \\
    -p 3000:3000 \\
    node:22-slim npm run dev`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Permissões em Linux',
          text: 'Com bind mounts no Linux, os ficheiros criados pelo container ficam com o UID interno (muitas vezes root). Soluções: usar `USER` no Dockerfile com o mesmo UID do host, ou `docker run --user $(id -u):$(id -g)`. No macOS/Windows, o Docker Desktop trata disto por ti.',
        },
      ],
    },
    {
      id: 'redes',
      title: 'Redes entre containers',
      blocks: [
        { type: 'p', text: 'Por omissão, cada container ligado à rede `bridge` do Docker consegue falar com outros **pelo nome**. Isto substitui a necessidade de conhecer IPs.' },
        {
          type: 'code', lang: 'bash',
          code: `# Criar uma rede (ponte isolada para a tua app)
docker network create lojanet

# Postgres na rede, sem publicar porta no host
docker run -d --name db --network lojanet \\
    -e POSTGRES_PASSWORD=secret postgres:17

# API na mesma rede, acede a 'db' como se fosse um hostname
docker run -d --name api --network lojanet \\
    -e DATABASE_URL=postgres://postgres:secret@db:5432/postgres \\
    -p 8000:8000 minha-api:0.1

# A API fala com db:5432 por DNS interno. O host vê a API em localhost:8000.
# Ninguém de fora acede à base de dados — exatamente o que queres.`,
        },
        {
          type: 'table',
          head: ['Driver', 'O que faz', 'Quando usar'],
          rows: [
            ['`bridge`', 'Rede virtual isolada, DNS interno', 'Caso geral (default)'],
            ['`host`', 'Container partilha a stack de rede do host', 'Performance extrema; **nenhum isolamento**'],
            ['`none`', 'Sem rede', 'Processos batch sem rede, isolamento máximo'],
            ['`overlay`', 'Rede entre múltiplos hosts', 'Docker Swarm / clusters'],
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'Regra prática',
          text: 'Publica `-p` **apenas as portas que querem receber tráfego de fora** (API, web). Base de dados, cache, serviços internos: não publicam portas, falam-se por rede interna. Evita exposições acidentais e reduz a superfície de ataque.',
        },
      ],
    },
    {
      id: 'compose',
      title: 'Docker Compose — orquestrar múltiplos serviços',
      blocks: [
        { type: 'p', text: 'Uma aplicação real tem API + base de dados + cache + worker. Arrancar tudo à mão com `docker run` é tedioso. **Compose** descreve tudo num ficheiro `compose.yaml` e arranca com um comando.' },
        {
          type: 'code', lang: 'bash', caption: 'compose.yaml — stack típica de uma web app',
          code: `services:
  db:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: loja
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/loja
      REDIS_URL: redis://redis:6379
    ports:
      - "8000:8000"
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: ./pyproject.toml

volumes:
  pgdata:`,
        },
        {
          type: 'code', lang: 'bash', caption: 'comandos essenciais',
          code: `docker compose up                   # arranca tudo em primeiro plano
docker compose up -d                # em background
docker compose up --build           # força rebuild da imagem
docker compose watch                # live-reload a olhar para alterações

docker compose ps                   # ver estado
docker compose logs -f api          # logs do serviço 'api'
docker compose exec db psql -U postgres loja

docker compose stop                 # para, preserva
docker compose down                 # para + remove containers e rede
docker compose down -v              # + apaga volumes (DESTRUTIVO)

docker compose restart api          # reinicia um serviço
docker compose config               # valida o yaml e expande variáveis`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Compose em produção?',
          text: 'Para projetos pequenos (um servidor, uma equipa pequena) — sim, perfeitamente. Para escala (vários hosts, deploys zero-downtime, auto-scaling) migras para Kubernetes. Mas é raro ter de o fazer antes de passar milhares de utilizadores.',
        },
      ],
    },
    {
      id: 'multi-stage',
      title: 'Multi-stage builds — imagens pequenas',
      blocks: [
        { type: 'p', text: 'Compilar uma aplicação precisa de ferramentas (compilador, dependências de build). Mas essas ferramentas **não têm de ir para a imagem final**. Multi-stage builds separam as duas fases.' },
        {
          type: 'code', lang: 'bash', caption: 'antes: imagem Java "fat"',
          code: `FROM maven:3.9-eclipse-temurin-25
WORKDIR /app
COPY . .
RUN mvn package
CMD ["java", "-jar", "target/app.jar"]

# Tamanho final: ~800 MB
# Contém: Maven, compilador Java, cache do Maven, ferramentas de build,
# código-fonte — nada disso precisa para correr.`,
        },
        {
          type: 'code', lang: 'bash', caption: 'depois: multi-stage build',
          code: `# Stage 1 — builder (grande, mas descartado)
FROM maven:3.9-eclipse-temurin-25 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline              # cache de dependências
COPY src ./src
RUN mvn package -DskipTests

# Stage 2 — runtime (só o essencial)
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/app.jar .
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

# Tamanho final: ~180 MB
# Deploy mais rápido, superfície de ataque menor, menos vulnerabilidades.`,
        },
        {
          type: 'compare',
          left: {
            title: 'Base images para runtime',
            items: [
              '`alpine` — mínima (~5 MB), biblioteca musl',
              '`slim` — Debian minimalista (~80 MB), compatibilidade total',
              '`distroless` (Google) — só o binário e dependências; sem shell',
              '`scratch` — zero bytes; só para binários estáticos (Go, Rust)',
            ],
          },
          right: {
            title: 'Base images para build',
            items: [
              'As "full" (ex.: `node:22`, `python:3.12`) — têm as ferramentas todas',
              '`maven`, `gradle` — vêm com JDK e build tools',
              '`golang` — tem toolchain + git para dependências',
              'Para Rust: `rust:1.80` para builder, `debian:slim` ou `scratch` para runtime',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'A regra do GB',
          text: 'Se a tua imagem passa 1 GB, está quase sempre errada. Verifica com `docker history`: as camadas maiores são tipicamente caches de dependências ou `apt install` sem limpar. Revisa.',
        },
      ],
    },
    {
      id: 'registry',
      title: 'Registries — partilhar imagens',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'publicar no Docker Hub',
          code: `# Login
docker login
# Username: ana
# Password: ...

# Taggar com o teu utilizador/repositório
docker tag minha-api:0.1 ana/minha-api:0.1
docker tag minha-api:0.1 ana/minha-api:latest

# Push
docker push ana/minha-api:0.1
docker push ana/minha-api:latest

# Depois, em qualquer máquina:
docker pull ana/minha-api:0.1
docker run -d -p 8000:8000 ana/minha-api:0.1`,
        },
        {
          type: 'code', lang: 'bash', caption: 'publicar no GitHub Container Registry (gratuito, integrado com Actions)',
          code: `# Login (usa um Personal Access Token como password)
echo $GH_TOKEN | docker login ghcr.io -u ana --password-stdin

# Taggar com o endpoint do GHCR
docker tag minha-api:0.1 ghcr.io/ana/minha-api:0.1

# Push
docker push ghcr.io/ana/minha-api:0.1`,
        },
        {
          type: 'table',
          head: ['Registry', 'Público grátis?', 'Privado grátis?', 'Melhor para'],
          rows: [
            ['**Docker Hub**', 'Sim, ilimitado', '1 repositório privado', 'Imagens públicas de referência'],
            ['**GitHub Container Registry**', 'Sim', 'Sim, ilimitado em contas pessoais', 'Projetos ligados ao GitHub'],
            ['**GitLab Registry**', 'Sim (projetos públicos)', 'Sim (limites de storage)', 'Projetos ligados ao GitLab'],
            ['**AWS ECR, GCP Artifact Registry, Azure ACR**', 'N/A', 'Pago, integrado na cloud', 'Deploys em produção na respetiva cloud'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Convenções de tag',
          text: 'Nunca confies apenas em `latest` em produção — é instável e silencioso. Usa tags **imutáveis**: `0.3.1`, `2025-11-18`, `abc1234` (git sha). O `latest` serve para o canal de descoberta, não para deploys determinísticos.',
        },
      ],
    },
    {
      id: 'seguranca',
      title: 'Segurança — o essencial',
      blocks: [
        {
          type: 'list', items: [
            '**Nunca corras como root.** Cria um utilizador no Dockerfile e usa `USER`. Um exploit no container fica contido ao utilizador local.',
            '**Pin as versões das imagens base.** `FROM node:22-slim` vs `FROM node:22.6.0-slim` — a segunda é reprodutível; a primeira pode mudar amanhã.',
            '**Não metas segredos em imagens.** `.env`, chaves privadas, tokens. Imagens são copiadas e espalhadas. Passa segredos por variáveis de ambiente, Docker secrets ou um gestor (Vault, AWS Secrets Manager).',
            '**Analisa vulnerabilidades.** `docker scout cves minha-api:0.1` ou `trivy image minha-api:0.1` listam CVEs conhecidas das bibliotecas na imagem.',
            '**Limita recursos.** `--memory 512m --cpus 1.5` impede um container defeituoso de esgotar o host.',
            '**Read-only root filesystem.** `--read-only` + `--tmpfs /tmp` impede escritas acidentais no filesystem.',
            '**Não exponhas o socket do Docker.** `-v /var/run/docker.sock:/var/run/docker.sock` dá controlo total do host ao container — equivalente a root.',
          ],
        },
        {
          type: 'callout', tone: 'trap', title: 'Imagens de desconhecidos',
          text: 'Correr `docker run alguem/qualquercoisa` é equivalente a correr software descarregado sem verificar. Prefere **imagens oficiais** (as com o selo "Official Image") ou **Verified Publishers**. Para o resto, inspeciona antes: `docker scout cves`, `docker history`, lê o Dockerfile.',
        },
      ],
    },
    {
      id: 'debug',
      title: 'Debug e armadilhas comuns',
      blocks: [
        {
          type: 'terms', items: [
            { term: '"Exited (0)" logo após o run', def: 'O processo principal terminou. É normal para scripts; para serviços, significa que crashou. Vê `docker logs` e verifica se o `CMD` arranca um processo em foreground.' },
            { term: '"OCI runtime create failed: executable file not found"', def: 'O comando no `CMD`/`ENTRYPOINT` não existe na imagem. Verifica o path, se o binário foi mesmo instalado, e a arquitetura (imagem x86 num host ARM).' },
            { term: '"Cannot connect to Docker daemon"', def: 'O serviço Docker não está a correr, ou não tens permissões (grupo `docker`). Em Linux: `systemctl status docker`.' },
            { term: 'Container consome 100% CPU', def: 'Processo infinito ou bug. `docker stats` identifica; `docker exec -it container top` entra para investigar.' },
            { term: 'Imagem enorme', def: '`docker history minha-img` mostra as camadas. Tipicamente: caches de `apt`/`pip`/`npm` esquecidos. Soluções: `--no-cache-dir`, `rm -rf /var/lib/apt/lists/*` no fim do `RUN`, multi-stage.' },
            { term: 'Builds lentos', def: 'A ordem das instruções está errada — o que muda muito deve estar em baixo. Usa BuildKit (`DOCKER_BUILDKIT=1`) e `--mount=type=cache` para caches de dependências.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'investigar um container que não arranca',
          code: `# Vê os logs completos
docker logs minha-api

# Tenta correr interativamente
docker run -it --rm minha-api bash
# Se não há 'bash', experimenta 'sh'

# Correr com o entrypoint sobreposto
docker run -it --rm --entrypoint bash minha-api

# Inspecionar imagem camada a camada
docker history --no-trunc minha-api

# Diferenças entre o que a imagem tem e o que o container criou
docker diff <container>`,
        },
      ],
    },
    {
      id: 'proximos-passos',
      title: 'Onde ir a seguir',
      blocks: [
        {
          type: 'list', ordered: true, items: [
            '**[Documentação oficial do Docker](https://docs.docker.com/)** — rica, bem organizada, em várias línguas.',
            '**[Play with Docker](https://labs.play-with-docker.com/)** — ambiente de experimentação no browser, zero instalação.',
            '**[Docker Curriculum](https://docker-curriculum.com/)** — tutorial profundo e guiado.',
            '**Livro:** *Docker Deep Dive* (Nigel Poulton) — referência prática atualizada frequentemente.',
            '**[Kubernetes](https://kubernetes.io/)** — quando precisas de múltiplos hosts, auto-scaling, deploys zero-downtime. Começa por [Minikube](https://minikube.sigs.k8s.io/) ou [kind](https://kind.sigs.k8s.io/).',
            '**[Podman](https://podman.io/)** — alternativa compatível, sem daemon, roda rootless por omissão.',
            '**[Dive](https://github.com/wagoodman/dive)** — ferramenta para analisar camadas e encontrar desperdício.',
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'O que ganhas',
          text: 'Dominar Docker é a diferença entre "funciona na minha máquina" e "funciona em qualquer máquina". Pode-se lançar um ambiente completo numa linha, migrar servidores em segundos, e uniformizar pipelines de deploy. É das competências com melhor retorno por hora investida que existem hoje.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'dk1',
      prompt: 'A principal diferença entre container e máquina virtual é que…',
      options: [
        'O container usa menos RAM',
        'O container partilha o kernel do host; a VM traz o seu',
        'A VM é mais rápida a arrancar',
        'São sinónimos',
      ],
      answer: 1,
      explain: 'Containers partilham o kernel via namespaces e cgroups. VMs virtualizam hardware e carregam o seu próprio kernel — maior isolamento, maior custo.',
    },
    {
      id: 'dk2',
      prompt: 'Uma imagem Docker é…',
      options: [
        'Um container a correr',
        'Um snapshot de uma VM',
        'Um molde imutável e em camadas que gera containers',
        'Um ficheiro `.iso`',
      ],
      answer: 2,
      explain: 'Imagem é o artefacto estático. Correr uma imagem produz um container, que é a instância mutável.',
    },
    {
      id: 'dk3',
      prompt: 'No Dockerfile, pôr `COPY . .` **antes** de `RUN pip install` é…',
      options: ['Boa prática', 'Irrelevante', 'Má prática — invalida o cache sempre que o código muda', 'Obrigatório'],
      answer: 2,
      explain: 'Se o código muda, o layer de install reinstala tudo. Copiar primeiro `requirements.txt`, instalar, e só depois copiar o código mantém o cache.',
    },
    {
      id: 'dk4',
      prompt: 'Os dados numa base de dados que corre num container…',
      options: [
        'Ficam guardados automaticamente',
        'Desaparecem quando o container é removido, a menos que uses um volume',
        'Sincronizam com o Docker Hub',
        'Estão sempre encriptados',
      ],
      answer: 1,
      explain: 'Containers são efémeros. Para persistência precisas de volumes (named volumes ou bind mounts).',
    },
    {
      id: 'dk5',
      prompt: 'Para que serve `docker compose`?',
      options: [
        'Comprimir imagens Docker',
        'Definir e correr aplicações multi-container num ficheiro YAML',
        'Encriptar dados do container',
        'Substituir Dockerfile',
      ],
      answer: 1,
      explain: 'Compose declara todos os serviços (DB, cache, API, worker...) e as suas relações num `compose.yaml` e arranca-os com `docker compose up`.',
    },
    {
      id: 'dk6',
      prompt: 'Multi-stage builds servem para…',
      options: [
        'Correr em múltiplos hosts',
        'Separar as ferramentas de build da imagem final, produzindo imagens pequenas',
        'Executar vários processos no mesmo container',
        'Usar várias linguagens',
      ],
      answer: 1,
      explain: 'A primeira stage compila (grande, com toolchain); a última copia apenas o artefacto final para uma imagem minimalista.',
    },
    {
      id: 'dk7',
      prompt: '`-p 8080:80` significa…',
      options: [
        'Dentro do container, a porta 80 é vista como 8080',
        'Publica a porta 80 do container na porta 8080 do host',
        'Limita a porta 80 a 8080 conexões',
        'Troca o mapeamento interno de portas',
      ],
      answer: 1,
      explain: 'Formato `host:container`. Acedes em `localhost:8080`; o container recebe tráfego na sua porta 80.',
    },
    {
      id: 'dk8',
      prompt: 'Qual destas práticas é **má** em produção?',
      options: [
        'Correr o processo como utilizador não-root',
        'Fixar a versão da imagem (`node:22.6.0-slim`)',
        'Usar `latest` como tag para deploys',
        'Analisar vulnerabilidades com `docker scout` ou `trivy`',
      ],
      answer: 2,
      explain: '`latest` muda silenciosamente. Deploys reprodutíveis exigem tags imutáveis — versão exacta ou git sha.',
    },
    {
      id: 'dk9',
      prompt: 'Containers na mesma rede bridge do Docker comunicam entre si…',
      options: [
        'Por IP fixo',
        'Pelo nome do serviço (DNS interno)',
        'Apenas através do host',
        'Não comunicam',
      ],
      answer: 1,
      explain: 'O Docker fornece DNS interno: `api` resolve para o IP do container "api". Não precisas de IPs fixos.',
    },
    {
      id: 'dk10',
      prompt: 'Para tornar segredos (passwords, tokens) disponíveis ao container, o melhor é…',
      options: [
        'Pôr no Dockerfile com `ENV`',
        'Hardcode no código-fonte',
        'Passar por variável de ambiente no `run`/`compose`, ou usar secrets managers',
        'Deixar num ficheiro `.env` na imagem',
      ],
      answer: 2,
      explain: 'Imagens são copiadas e espalhadas. Segredos têm de ser injectados em runtime (env vars, Docker secrets, Vault, Secrets Manager).',
    },
  ],
  exercises: [
    {
      id: 'e15-1',
      difficulty: 1,
      kind: 'open',
      title: 'Primeiro container',
      statement: 'Corre um container `nginx` em background, publicando a porta 80 em 8080 do host. Verifica em `http://localhost:8080`. Depois, abre `/etc/nginx/nginx.conf` dentro do container sem o parar. Por fim, pára e remove-o.',
      hint: '`docker exec -it <container> cat <ficheiro>` deixa-te espreitar ficheiros sem entrar.',
      solution: '# Arrancar\ndocker run -d --name web -p 8080:80 nginx\n\n# Confirmar\ncurl http://localhost:8080\ndocker ps\n\n# Ver configuração sem parar\ndocker exec web cat /etc/nginx/nginx.conf\n\n# Entrar e explorar\ndocker exec -it web bash\n# exit quando terminares\n\n# Parar e remover\ndocker stop web\ndocker rm web\n\n# Ou tudo de uma vez:\ndocker rm -f web\n\nNota: `-d` corre em background, `--name` dá-lhe nome legível, `-p 8080:80` publica a porta. `exec -it` dá-te uma shell interativa.',
    },
    {
      id: 'e15-2',
      difficulty: 1,
      kind: 'open',
      title: 'Dockerfile simples',
      statement: 'Escreve um Dockerfile para uma aplicação Python/Flask mínima. Deve: usar `python:3.12-slim`, instalar dependências a partir de `requirements.txt`, copiar o código, expor a porta 5000 e arrancar com `python app.py`. Preocupa-te em pôr as camadas na ordem certa.',
      hint: 'A ordem importa: dependências primeiro, código depois. Senão qualquer alteração ao código invalida a cache do pip.',
      solution: '# Dockerfile\nFROM python:3.12-slim\n\nWORKDIR /app\n\n# Dependências primeiro (camada reutilizável)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Código depois\nCOPY . .\n\nEXPOSE 5000\n\nCMD ["python", "app.py"]\n\n# Construir e correr\ndocker build -t flask-app .\ndocker run -d -p 5000:5000 --name app flask-app\n\nPorquê esta ordem: alterar código → só reconstrói a última camada (COPY . .). Alterar requirements.txt → reconstrói do pip install para baixo. A primeira vez demora; as seguintes são segundos.',
    },
    {
      id: 'e15-3',
      difficulty: 2,
      kind: 'open',
      title: 'Compose com Postgres',
      statement: 'Escreve um `compose.yaml` com três serviços: PostgreSQL 17, Redis, e uma API construída a partir do Dockerfile local. A API deve só arrancar quando o Postgres estiver `healthy`, e ligar-se a `db:5432` e `redis:6379`.',
      hint: 'Usa `depends_on` com `condition: service_healthy` + `healthcheck` no Postgres. A API fala com `db` e `redis` por nome, nunca por IP.',
      solution: 'services:\n  db:\n    image: postgres:17\n    restart: unless-stopped\n    environment:\n      POSTGRES_PASSWORD: secret\n      POSTGRES_DB: loja\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]\n      interval: 5s\n      timeout: 3s\n      retries: 10\n\n  redis:\n    image: redis:7-alpine\n    restart: unless-stopped\n\n  api:\n    build: .\n    depends_on:\n      db:\n        condition: service_healthy\n      redis:\n        condition: service_started\n    environment:\n      DATABASE_URL: postgres://postgres:secret@db:5432/loja\n      REDIS_URL: redis://redis:6379\n    ports:\n      - "8000:8000"\n    restart: unless-stopped\n\nvolumes:\n  pgdata:\n\n# Correr\ndocker compose up -d\ndocker compose logs -f api\n\nNotas: (1) nem `db` nem `redis` publicam portas — só a API é acessível de fora; (2) o healthcheck garante que a API não arranca antes do Postgres estar mesmo pronto (`pg_isready`); (3) `restart: unless-stopped` recupera de falhas automaticamente; (4) o volume `pgdata` garante que os dados sobrevivem a `docker compose down` (mas não a `down -v`).',
    },
    {
      id: 'e15-4',
      difficulty: 2,
      kind: 'open',
      title: 'Imagem a crescer sem controlo',
      statement: 'Uma equipa tem uma imagem Python de 1.5 GB. Suspeitas de três problemas: (a) `apt install` sem limpar; (b) `pip install` sem flag de cache; (c) código e testes todos copiados. Propõe o Dockerfile corrigido e diz o que cada mudança poupa.',
      hint: '`apt-get clean` + `rm -rf /var/lib/apt/lists/*`. `pip --no-cache-dir`. `.dockerignore`.',
      solution: '# .dockerignore (muito importante — exclui testes, node_modules, .git, etc.)\n.git\ntests/\n__pycache__/\n*.pyc\n.env\n.pytest_cache/\n.venv/\ndocs/\n\n# Dockerfile otimizado\nFROM python:3.12-slim\n\n# Instala pacotes do sistema num RUN único, limpa no fim\nRUN apt-get update \\\n    && apt-get install -y --no-install-recommends gcc libpq-dev \\\n    && apt-get clean \\\n    && rm -rf /var/lib/apt/lists/*\n\nWORKDIR /app\n\n# Dependências — sem cache do pip\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Código (já filtrado pelo .dockerignore)\nCOPY . .\n\nUSER 10001\nEXPOSE 8000\nCMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0"]\n\n**O que cada mudança poupa:**\n\n1. `apt-get clean && rm -rf /var/lib/apt/lists/*` no mesmo RUN — a cache do apt são 100-300 MB. Fora do RUN, fica na camada. Dentro, é removida antes do commit.\n2. `pip install --no-cache-dir` — o pip guarda ~50-200 MB de wheels em `~/.cache/pip`. Com a flag, desliga.\n3. `--no-install-recommends` — remove dezenas de pacotes "sugeridos" que raramente precisas.\n4. `.dockerignore` — tipicamente poupa 100+ MB (testes, `.git`, caches, docs).\n5. **Multi-stage** (se precisas de compilador só para build): copia só o `site-packages` final. Pode baixar outros 200-400 MB.\n\nResultado esperado: 1.5 GB → 300-400 MB sem multi-stage; 150-200 MB com.',
    },
    {
      id: 'e15-5',
      difficulty: 3,
      kind: 'open',
      title: 'Multi-stage build para Java 25',
      statement: 'Escreve um Dockerfile multi-stage para uma aplicação Maven/Java 25. Stage 1 usa Maven para compilar; Stage 2 corre com JRE mínima. Acrescenta: utilizador não-root, HEALTHCHECK, suporte ao desligamento gracioso via SIGTERM.',
      hint: 'Builder: `maven:3.9-eclipse-temurin-25`. Runtime: `eclipse-temurin:25-jre-alpine`. HEALTHCHECK com `curl` ou `wget` ao endpoint de /health.',
      solution: '# Stage 1: builder\nFROM maven:3.9-eclipse-temurin-25 AS builder\nWORKDIR /build\n\n# Camada 1: dependências — mudam raramente\nCOPY pom.xml .\nRUN mvn -B dependency:go-offline\n\n# Camada 2: fontes e compilação\nCOPY src ./src\nRUN mvn -B package -DskipTests\n\n# Stage 2: runtime minimal\nFROM eclipse-temurin:25-jre-alpine\n\n# Ferramentas mínimas para HEALTHCHECK (curl é ~1 MB)\nRUN apk add --no-cache curl\n\n# Utilizador não-root\nRUN addgroup -S app && adduser -S app -G app\n\nWORKDIR /app\nCOPY --from=builder /build/target/*.jar app.jar\n\nUSER app\nEXPOSE 8080\n\nHEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \\\n    CMD curl -fsS http://localhost:8080/health || exit 1\n\n# dumb-init ou exec para propagar sinais corretamente;\n# a forma exec do CMD já faz isso: PID 1 é o java, recebe SIGTERM diretamente\nCMD ["java", \\\n     "-XX:+UseContainerSupport", \\\n     "-XX:MaxRAMPercentage=75", \\\n     "-jar", "app.jar"]\n\n**Decisões:**\n\n1. **Dependências separadas** no builder (`dependency:go-offline`) — rebuild sem internet quando só o código muda, muito mais rápido.\n2. **`eclipse-temurin:25-jre-alpine`** no runtime — ~180 MB vs >400 MB do JDK completo.\n3. **`USER app`** — exploit no serviço não é root no container.\n4. **`HEALTHCHECK`** — o Docker (ou compose, ou orquestrador) só considera o container saudável quando `/health` responde. `start-period` evita falsos negativos no arranque.\n5. **Flags da JVM** — `UseContainerSupport` + `MaxRAMPercentage` fazem a JVM respeitar os limites do cgroup; sem isto, assume que tem toda a RAM do host.\n6. **Forma exec do CMD** (`["java", ...]` vs `"java ..."`) — PID 1 é o Java, recebe SIGTERM diretamente e termina com shutdown hooks. Sem exec, PID 1 é a shell e os sinais perdem-se.\n\nResultado esperado: imagem final ~190 MB, arranque em segundos, recuperação graciosa.',
    },
    {
      id: 'e15-6',
      difficulty: 3,
      kind: 'open',
      title: 'Debug: container que não arranca',
      statement: 'Lançaste `docker run meu-worker:0.3` e sai imediatamente com `Exited (127)`. Os logs dizem `/bin/sh: ./entrypoint.sh: not found`. O `entrypoint.sh` existe na imagem (confirmaste com `docker run meu-worker:0.3 ls -l /app`). Lista pelo menos quatro causas plausíveis e como as diagnosticarias.',
      hint: 'Pensa em: permissões, line endings, arquitetura, dependências de runtime do script.',
      solution: '**Causas plausíveis e diagnóstico:**\n\n1. **Line endings Windows (CRLF)** — se o `entrypoint.sh` foi criado no Windows, o shebang `#!/bin/sh` tem `\\r` no fim. O kernel tenta carregar `/bin/sh\\r`, que não existe.\n   - Diagnóstico: `docker run --rm --entrypoint sh meu-worker:0.3 -c "file /app/entrypoint.sh"` → \"CRLF line terminators\".\n   - Fix: `dos2unix entrypoint.sh` antes de build, ou `.gitattributes` com `*.sh text eol=lf`.\n\n2. **Falta permissão de execução** — `ls -l` mostraria `-rw-r--r--` em vez de `-rwxr-xr-x`.\n   - Diagnóstico: `docker run --rm --entrypoint ls meu-worker:0.3 -la /app/entrypoint.sh`.\n   - Fix: `RUN chmod +x /app/entrypoint.sh` no Dockerfile, ou `COPY --chmod=0755`.\n\n3. **Shebang refere interpretador inexistente** — `#!/bin/bash` numa imagem `alpine` (que só tem `/bin/sh`, não bash).\n   - Diagnóstico: `docker run --rm --entrypoint head meu-worker:0.3 -n 1 /app/entrypoint.sh`.\n   - Fix: usar `#!/bin/sh` ou instalar bash no Dockerfile (`RUN apk add --no-cache bash`).\n\n4. **Arquitetura errada** — construíste a imagem em Mac M-series (arm64) e corres em servidor x86_64. O binário é incompatível.\n   - Diagnóstico: `docker inspect meu-worker:0.3 | grep Architecture`. Compara com `uname -m` no host.\n   - Fix: `docker buildx build --platform linux/amd64,linux/arm64 --push ...` (multi-arch).\n\n5. **Bibliotecas dinâmicas em falta** (menos provável dado o erro, mas vale mencionar) — binário compilado linkado a glibc numa imagem com musl (alpine).\n   - Diagnóstico: `docker run --rm --entrypoint ldd meu-worker:0.3 /app/bin/worker` → mostra "not found".\n   - Fix: usar imagem com glibc (debian:slim) ou compilar estaticamente.\n\n**Método geral de debug:**\n\n- `docker logs <container>` sempre primeiro.\n- `docker run --rm -it --entrypoint sh meu-worker:0.3` para explorar.\n- `docker inspect` para arquitetura/env/volumes.\n- `docker history --no-trunc` para perceber camadas suspeitas.\n- Dica de ouro: adiciona `RUN set -ex` no script para tracing, e logs em `stderr`.',
    },
  ],
};
