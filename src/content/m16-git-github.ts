import type { Module } from '../types';

export const m16: Module = {
  id: 'git-github',
  number: 16,
  title: 'Git e GitHub — controlo de versões e colaboração',
  subtitle: 'O modelo mental do Git, branches, merge/rebase, pull requests, code review e GitHub Actions — da primeira commit ao fluxo profissional',
  icon: '🌿',
  minutes: 110,
  goals: [
    'Compreender o modelo mental do Git (commits, árvore, hash, refs)',
    'Usar o fluxo básico: status, add, commit, log, diff, restore',
    'Trabalhar com branches, merge e rebase sem medo',
    'Resolver conflitos de forma metódica',
    'Colaborar em equipa via Pull Requests e code review',
    'Automatizar com GitHub Actions',
    'Recuperar de erros: reset, revert, reflog, stash, cherry-pick',
    'Escrever histórico que ajuda quem vier depois',
  ],
  sections: [
    {
      id: 'porque-git',
      title: 'Porque precisamos de controlo de versões',
      blocks: [
        { type: 'p', text: 'Antes do Git, equipas trabalhavam em `projeto_final_v2_definitivo_ESTE.zip`. Bugs regrediam porque dois programadores editavam o mesmo ficheiro. Experimentar algo significava copiar a pasta inteira "só por via das dúvidas". Perder uma semana de trabalho era normal.' },
        { type: 'p', text: 'Git é um **sistema de controlo de versões distribuído**: cada clone contém a história completa, podes trabalhar offline, criar linhas paralelas de desenvolvimento gratuitamente e combiná-las de forma controlada. É a ferramenta mais importante do dia-a-dia de qualquer programador — e a que aparece em todas as entrevistas.' },
        {
          type: 'compare',
          left: {
            title: 'O que Git te dá',
            items: [
              'Histórico completo com autor, data e motivo de cada alteração',
              'Experimentação sem risco (branches baratos)',
              'Reverter a qualquer ponto em segundos',
              'Trabalho offline — tudo o que precisas está no `.git`',
              'Colaboração em paralelo em equipas de milhares',
              'Prova (quase) irrefutável de quem alterou o quê',
            ],
          },
          right: {
            title: 'O que Git NÃO é',
            items: [
              'Um backup — se perdes o `.git`, perdes tudo (sincroniza para remoto)',
              'Um sistema para ficheiros binários grandes (usa Git LFS)',
              'Automático — tens de fazer `commit` e `push`',
              'À prova de merges catastróficos se escreves em todo o lado',
              'Um sistema de permissões — isso é o GitHub/GitLab',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'Git ≠ GitHub',
          text: '**Git** é o sistema de versionamento, corre no teu computador. **GitHub** (ou GitLab, Bitbucket, Gitea...) é um serviço web que hospeda repositórios Git e acrescenta pull requests, issues, CI/CD e colaboração. Podes usar Git sem nunca abrir o GitHub — mas em equipa, o servidor remoto é essencial.',
        },
      ],
    },
    {
      id: 'instalar',
      title: 'Instalar e configurar Git',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'Instalar', text: '**macOS:** `brew install git` ou `xcode-select --install`. **Ubuntu/Debian:** `sudo apt install git`. **Windows:** [git-scm.com](https://git-scm.com) — inclui o Git Bash. **Confirmar:** `git --version`.' },
            { title: 'Identificação global', text: 'O Git assina cada commit com nome e email. Configura **uma vez** por máquina.' },
            { title: 'Preferências úteis', text: 'Editor, estratégia de pull, cores, atalhos.' },
            { title: 'Verificar', text: '`git config --list` mostra tudo. `git config --global --edit` abre o `~/.gitconfig`.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'configuração mínima',
          code: `# Identidade — usa o teu nome e o email associado ao GitHub
git config --global user.name  "Ana Silva"
git config --global user.email "ana@example.com"

# Editor por omissão (vim, nano, code --wait, ...)
git config --global core.editor "code --wait"

# Nome do branch inicial (default moderno)
git config --global init.defaultBranch main

# Estratégia de pull — "só avança se possível, senão para"
git config --global pull.rebase false
git config --global pull.ff only

# Cor no output
git config --global color.ui auto

# Atalhos frequentes
git config --global alias.st "status -sb"
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.co "checkout"
git config --global alias.br "branch"`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Email privado do GitHub',
          text: 'Se não queres expor o teu email nos commits, usa o email anónimo que o GitHub te dá em *Settings → Emails → Keep my email addresses private*: algo como `123456+ana@users.noreply.github.com`. Os commits ficam atribuídos sem revelar o endereço real.',
        },
      ],
    },
    {
      id: 'modelo-mental',
      title: 'O modelo mental do Git',
      blocks: [
        { type: 'p', text: 'Se percebeste **cinco** conceitos, 90% do Git fica trivial. Se os ignoras, usas Git a tatear por décadas.' },
        {
          type: 'terms', items: [
            { term: 'Working directory', def: 'Os ficheiros que vês e editas. O estado atual do teu projeto.' },
            { term: 'Staging area (index)', def: 'Uma antecâmara onde selecionas **o que vai para o próximo commit**. `git add` adiciona alterações ao stage. Serve para fazer commits atómicos mesmo quando mudaste muita coisa.' },
            { term: 'Commit', def: 'Snapshot imutável de todo o projeto num dado momento, identificado por um hash SHA-1 (ex.: `3f2a1b`). Tem autor, data, mensagem e aponta para o(s) commit(s) pai.' },
            { term: 'Branch', def: 'Um ponteiro mutável para um commit. **Não é uma pasta nem uma cópia**. Avança automaticamente a cada novo commit. Criar um branch são uns bytes; não há desculpa para não o fazer.' },
            { term: 'HEAD', def: 'O ponteiro para "onde estás agora". Normalmente, HEAD aponta para um branch, que aponta para um commit.' },
          ],
        },
        {
          type: 'code', lang: 'text', caption: 'o fluxo mental',
          code: `  working dir     staging area        .git (local)         remoto (GitHub)
  ┌───────────┐   ┌────────────┐      ┌─────────────┐      ┌─────────────┐
  │  ficheiros │──▶│  ficheiros │──────▶│   commits   │──────▶│   commits   │
  │   editados │   │   para o   │      │  (snapshots)│      │   partilha  │
  │            │   │  próximo   │      │   + refs    │      │             │
  │            │   │   commit   │      │             │      │             │
  └───────────┘   └────────────┘      └─────────────┘      └─────────────┘
       │                │                     ▲                    ▲
       │   git add      │     git commit      │     git push       │
       │   ───────▶     │     ─────────▶      │     ─────────▶     │
       │                │                     │                    │
       │                │                     │     git fetch      │
       │                │                     │     ◀──────────    │
       │                │                     │                    │
                                                git pull = fetch + merge`,
        },
        {
          type: 'callout', tone: 'key', title: 'Os commits são um grafo acíclico dirigido (DAG)',
          text: 'Cada commit aponta para o(s) commit(s) pai. Um merge produz um commit com **dois** pais. Um branch é apenas uma "etiqueta" que se move. Entender isto resolve 90% da confusão: não há nada mágico, é um grafo imutável de snapshots.',
        },
      ],
    },
    {
      id: 'primeiro-repo',
      title: 'Primeiro repositório: add, commit, status, log',
      blocks: [
        {
          type: 'code', lang: 'bash',
          code: `# Criar
mkdir meu-projeto && cd meu-projeto
git init
# Initialized empty Git repository in .../meu-projeto/.git/

# Criar um ficheiro
echo "# O meu projeto" > README.md

# Ver estado
git status
# Untracked files:
#   README.md

# Adicionar ao stage
git add README.md
# ou: git add .           (tudo o que mudou)
# ou: git add -p          (interativo — hunk a hunk)

git status
# Changes to be committed:
#   new file: README.md

# Commit
git commit -m "chore: estrutura inicial"

# Histórico
git log
git log --oneline            # uma linha por commit
git log --oneline --graph    # com grafo das ramificações`,
        },
        { type: 'h', text: 'Ver o que mudou' },
        {
          type: 'code', lang: 'bash',
          code: `git diff                 # alterações não staged (working dir vs stage)
git diff --staged        # alterações staged (stage vs último commit)
git diff HEAD            # tudo o que mudou face ao último commit
git diff main feature-x  # diferenças entre dois branches
git diff abc123 def456   # entre dois commits concretos

# Desfazer
git restore ficheiro.py           # descarta alterações não staged (DESTRUTIVO)
git restore --staged ficheiro.py  # retira do stage, mantém no working dir

# Ver conteúdo de um ficheiro num commit passado
git show abc123:caminho/ficheiro.py`,
        },
        { type: 'h', text: '.gitignore — o que NÃO versionar' },
        {
          type: 'code', lang: 'bash', caption: '.gitignore típico para um projeto Python',
          code: `# Binários compilados / bytecode
__pycache__/
*.pyc

# Virtualenv
.venv/
venv/

# IDE
.idea/
.vscode/
*.swp

# Dependências e artefactos
node_modules/
dist/
build/
*.egg-info/

# Segredos
.env
.env.local
credentials.json

# Sistema operativo
.DS_Store
Thumbs.db

# Logs e caches
*.log
.pytest_cache/
.coverage`,
        },
        {
          type: 'callout', tone: 'trap', title: 'Já cometeste um segredo?',
          text: 'Acrescentar ao `.gitignore` **não** apaga do histórico. Se cometeste `.env` ou uma chave, considera o segredo comprometido: rotaciona-o imediatamente. Para o remover do histórico: [`git filter-repo`](https://github.com/newren/git-filter-repo) ou BFG Repo-Cleaner. Mas o cuidado principal é prevenir.',
        },
      ],
    },
    {
      id: 'branches',
      title: 'Branches — linhas paralelas de trabalho',
      blocks: [
        { type: 'p', text: 'Um branch permite-te experimentar sem risco. Toda a gente trabalha em branches: `main` fica estável; novas funcionalidades vivem em branches até estarem prontas; então vêm para `main` por merge ou rebase.' },
        {
          type: 'code', lang: 'bash',
          code: `# Criar e mudar para um branch
git switch -c feature/login     # moderno (recomendado)
# ou: git checkout -b feature/login   (antigo, equivalente)

git branch                      # lista locais
git branch -a                   # inclui remotos

# Fazer commits normalmente...
git commit -am "feat: formulário de login"

# Voltar a main
git switch main

# Trazer as alterações do branch para main (ver próxima secção)
git merge feature/login

# Apagar quando já integrado
git branch -d feature/login     # só apaga se já foi merged
git branch -D feature/login     # força (perde commits não integrados)`,
        },
        {
          type: 'table',
          head: ['Convenção de nomes', 'Para que serve'],
          rows: [
            ['`main` (ou `master`)', 'Linha estável — sempre deployável'],
            ['`feature/<nome>`', 'Nova funcionalidade'],
            ['`fix/<numero>-<desc>`', 'Correção de bug'],
            ['`chore/<desc>`', 'Manutenção sem impacto visível (deps, CI, docs internas)'],
            ['`hotfix/<desc>`', 'Correção urgente em produção'],
            ['`release/<versao>`', 'Branch de estabilização antes de lançar uma versão'],
          ],
          caption: 'Prefere nomes descritivos em kebab-case. Evita `feature-ana`, `tmp`, `teste2`.',
        },
        {
          type: 'callout', tone: 'tip', title: 'Branches são baratos — usa-os',
          text: 'Criar branch é instantâneo. Estás a experimentar uma refatoração? Branch. Vais mexer em três ficheiros para um bug? Branch. Trabalho descartado ≠ trabalho perdido — fica no `reflog`. Dedica o teu `main` ao código que funciona.',
        },
      ],
    },
    {
      id: 'merge-conflitos',
      title: 'Merge e conflitos',
      blocks: [
        { type: 'p', text: 'Um `merge` combina o histórico de dois branches. Se as alterações não se cruzam, o Git resolve tudo sozinho. Se cruzam, pede-te ajuda: é um **conflito**.' },
        { type: 'h', text: 'Fast-forward vs merge commit' },
        {
          type: 'code', lang: 'text', caption: 'antes do merge',
          code: `main                  A───B───C
                            \\
feature/login               D───E`,
        },
        {
          type: 'code', lang: 'bash', caption: 'duas formas',
          code: `# (1) Fast-forward: se main não mudou, o Git só move o ponteiro
git switch main
git merge feature/login --ff-only
# → main agora aponta para E, histórico linear

# (2) Merge commit: cria um commit extra que une os dois lados
git merge feature/login --no-ff
# → commits D, E ficam visíveis como branch na história

# Default: fast-forward quando possível, senão merge commit`,
        },
        { type: 'h', text: 'Resolver um conflito, passo a passo' },
        {
          type: 'steps', items: [
            { title: 'O Git para a meio e mostra os ficheiros em conflito', text: '`git status` lista as "Unmerged paths". Cada ficheiro em conflito tem marcadores no texto.' },
            { title: 'Abrir o ficheiro e procurar os marcadores', text: '`<<<<<<< HEAD` (o teu lado) e `>>>>>>> feature/login` (o outro) delimitam as versões rivais, separadas por `=======`.' },
            { title: 'Decidir o conteúdo final', text: 'Fica com o teu, com o do outro, ou com uma combinação. Remove os marcadores todos. Testa que o código ainda compila/corre.' },
            { title: 'Marcar como resolvido', text: '`git add <ficheiro>` por cada ficheiro resolvido.' },
            { title: 'Terminar o merge', text: '`git commit` (Git já tem a mensagem pronta, basta guardar) — ou `git merge --abort` se quiseres cancelar e voltar ao estado anterior.' },
          ],
        },
        {
          type: 'code', lang: 'text', caption: 'exemplo de ficheiro com conflito',
          code: `function calcularPreco(base) {
<<<<<<< HEAD
    return base * 1.23;   // IVA 23%
=======
    return base * 1.06;   // IVA 6% (taxa reduzida)
>>>>>>> feature/login
}`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Boas ferramentas poupam dor',
          text: 'VS Code, IntelliJ e outras IDEs mostram os conflitos lado a lado com botões "Accept Current", "Accept Incoming", "Accept Both". Para resolver pelos três lados (teu, outro e base comum), configura um *mergetool*: `git mergetool`.',
        },
      ],
    },
    {
      id: 'rebase',
      title: 'Rebase — reescrever o histórico',
      blocks: [
        { type: 'p', text: '`git rebase` pega nos teus commits e **reaplica-os** sobre outro ponto do histórico. Produz um histórico linear, sem merge commits, mais fácil de ler. Em troca, reescreve commits (novos hashes).' },
        {
          type: 'code', lang: 'text', caption: 'antes do rebase',
          code: `main          A───B───C
                   \\
feature            D───E`,
        },
        {
          type: 'code', lang: 'text', caption: 'depois de "git rebase main" em feature',
          code: `main          A───B───C
                            \\
feature                      D\\'───E\\'

(D\\' e E\\' são NOVOS commits com o mesmo conteúdo, baseados em C)`,
        },
        {
          type: 'code', lang: 'bash',
          code: `# A partir do branch feature:
git rebase main                 # rebaseia os teus commits sobre main

# Se houver conflitos, resolve-os, depois:
git add <ficheiros>
git rebase --continue
# ou para desistir:
git rebase --abort

# Rebase interativo — a ferramenta mais poderosa do Git
git rebase -i main

# Abre um editor com a lista dos teus commits. Para cada um, podes:
#   pick    — manter como está
#   reword  — mudar a mensagem
#   edit    — pausar para alterar
#   squash  — juntar com o anterior (soma mensagens)
#   fixup   — como squash mas descarta a mensagem
#   drop    — eliminar completamente
#   reorder — mudar a ordem das linhas`,
        },
        {
          type: 'compare',
          left: {
            title: 'Usa rebase quando…',
            items: [
              'Queres histórico linear, legível',
              'O branch ainda não foi partilhado com outros',
              'Queres limpar commits WIP antes de abrir PR',
              'Vais actualizar o teu branch com o main mais recente',
            ],
          },
          right: {
            title: 'Evita rebase quando…',
            items: [
              'Os commits já foram partilhados — altera a história',
              'Estás em `main` ou `master` — nunca rebases o tronco público',
              'Houve merge commits com significado histórico',
              'Não confias que te lembras de `--abort` se correr mal',
            ],
          },
        },
        {
          type: 'callout', tone: 'warn', title: 'A regra de ouro do rebase',
          text: '**Nunca rebases commits que outros já usaram.** Quando reescreves a história, os hashes mudam; quem clonou a versão antiga fica com histórico divergente. Rebase antes de empurrar / PRs → ok. Rebase depois → vais causar dor.',
        },
      ],
    },
    {
      id: 'remotos',
      title: 'Trabalhar com remotos',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'os comandos essenciais',
          code: `# Começar a partir de um remoto já existente
git clone https://github.com/ana/projeto.git
cd projeto

# Ver os remotos configurados
git remote -v

# Adicionar um remoto (ex.: fork)
git remote add upstream https://github.com/original/projeto.git

# Trazer alterações do remoto SEM aplicar
git fetch                       # atualiza origin/*
git fetch upstream              # atualiza upstream/*

# Trazer E aplicar no branch atual
git pull                        # = fetch + merge (default)
git pull --rebase               # = fetch + rebase (histórico linear)

# Enviar commits locais
git push                        # para o remoto do branch atual
git push -u origin feature/x    # primeira vez — cria upstream tracking
git push --force-with-lease     # após rebase; seguro, recusa se outro empurrou
git push --force                # DESTRUTIVO — nunca em main`,
        },
        {
          type: 'table',
          head: ['Comando', 'Faz'],
          rows: [
            ['`git fetch`', 'Descarrega commits do remoto, não mexe no teu working dir'],
            ['`git pull`', '`fetch` + `merge` (ou `rebase` se configurado)'],
            ['`git push`', 'Envia os teus commits para o remoto'],
            ['`git push --force-with-lease`', '`push` forçado que só avança se o remoto não mudou desde o teu último fetch'],
            ['`git remote prune origin`', 'Remove referências a branches que já não existem no remoto'],
          ],
        },
        { type: 'h', text: 'SSH keys — autenticar com o GitHub' },
        {
          type: 'code', lang: 'bash',
          code: `# Gerar uma chave (ed25519 é moderna e pequena)
ssh-keygen -t ed25519 -C "ana@example.com"
# Enter para aceitar o caminho (~/.ssh/id_ed25519)
# Passphrase — recomendado

# Copiar a chave pública
cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3Nza... ana@example.com

# Ir ao GitHub → Settings → SSH keys → New SSH key, colar.

# Confirmar
ssh -T git@github.com
# Hi Ana! You've successfully authenticated.

# Agora podes clonar/push por SSH
git clone git@github.com:ana/projeto.git`,
        },
      ],
    },
    {
      id: 'github',
      title: 'GitHub — colaboração em equipa',
      blocks: [
        { type: 'p', text: 'O GitHub acrescenta ao Git o que faz falta para equipas: pull requests, revisão de código, issues, discussões, wiki, e integração com CI/CD.' },
        { type: 'h', text: 'Criar um repositório' },
        {
          type: 'steps', items: [
            { title: 'No GitHub', text: 'Botão "New repository". Nome, visibilidade (público/privado), inicializar com README e `.gitignore`.' },
            { title: 'Local → GitHub (repo novo)', text: 'Copia o URL (HTTPS ou SSH) e, no teu terminal: `git remote add origin <url>` + `git push -u origin main`.' },
            { title: 'GitHub → Local (repo existente)', text: '`git clone <url>` e tudo o resto já está configurado.' },
          ],
        },
        { type: 'h', text: 'Pull Requests — o coração da colaboração' },
        { type: 'p', text: 'Um **Pull Request** (PR) é uma proposta de integrar o teu branch no `main`. Permite revisão, discussão, CI automático e merge controlado. É o fluxo diário em qualquer equipa profissional.' },
        {
          type: 'steps', items: [
            { title: '1. Cria branch local', text: '`git switch -c fix/validacao-email`' },
            { title: '2. Faz commits pequenos e descritivos', text: 'Um PR com 1 commit de 1000 linhas é intratável. Dez commits de 100 linhas, cada um a fazer uma coisa clara, é revisável.' },
            { title: '3. Empurra', text: '`git push -u origin fix/validacao-email`. O GitHub responde com um URL para abrir o PR.' },
            { title: '4. Abre o PR', text: 'Título curto (<70 chars), descrição com: **porquê** (não o quê — o diff mostra isso), como testar, screenshots se é UI, links para issues.' },
            { title: '5. Pede revisão', text: 'Adiciona reviewers. O CI corre automaticamente (testes, lint, tipos). Qualquer reviewer pode comentar, sugerir alterações ou aprovar.' },
            { title: '6. Itera', text: 'Novos commits aparecem no PR automaticamente. Usa [GitHub\'s "Suggested changes"](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests) para aceitar propostas com um clique.' },
            { title: '7. Merge', text: 'Quando aprovado e CI verde, um reviewer (ou tu) faz merge. Três estratégias: merge commit, squash, rebase.' },
          ],
        },
        {
          type: 'table',
          head: ['Estratégia de merge', 'O que faz', 'Melhor para'],
          rows: [
            ['**Merge commit**', 'Preserva todos os commits + cria 1 merge commit', 'Projetos onde a história de cada feature importa'],
            ['**Squash and merge**', 'Junta todos os commits do PR em 1 só na `main`', 'Default moderno — `main` fica limpa, 1 commit = 1 feature'],
            ['**Rebase and merge**', 'Reaplica os commits linearmente em `main`', 'Quem quer histórico linear mas preservar commits individuais'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Convencionar as mensagens',
          text: 'Usa [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`. Isto permite gerar changelogs automaticamente e torna o histórico pesquisável. Ex.: `feat(auth): aceitar login via OAuth`.',
        },
      ],
    },
    {
      id: 'code-review',
      title: 'Code Review — o que procurar',
      blocks: [
        { type: 'p', text: 'Code review não é caça aos erros do autor — é um mecanismo de aprendizagem e proteção partilhada. O código fica melhor; toda a equipa sobe de nível ao ler código dos outros.' },
        {
          type: 'compare',
          left: {
            title: 'Reviewer responsável',
            items: [
              'Explica o **porquê** da sugestão, não apenas o "não gosto"',
              'Distingue bloqueadores de preferências ("nit:", "suggestion:", "blocker:")',
              'Procura testes em falta, invariantes esquecidos, erros de segurança',
              'Aprova mesmo com nits pendentes se não bloqueiam',
              'Elogia o que está bem — torna a cultura sustentável',
            ],
          },
          right: {
            title: 'Autor que facilita',
            items: [
              'PRs pequenos (< 400 linhas idealmente)',
              'Descrição clara: porquê, como testar, riscos',
              'Auto-revê o próprio diff antes de pedir revisão',
              'Responde a cada comentário, mesmo que seja "concordo, corrigido em commit X"',
              'Separa *refactor* de *feature* em PRs diferentes',
            ],
          },
        },
        {
          type: 'list', items: [
            '**Correção** — a lógica está certa? Casos de fronteira tratados? Erros esperados?',
            '**Testes** — cobrem o novo comportamento? Falham antes da fix e passam depois?',
            '**Design** — faz sentido onde vive? Encaixa com o resto?',
            '**Leitura** — nomes claros? Funções curtas? Comentários que dizem o *porquê*?',
            '**Segurança** — input validado? SQL/XSS? Segredos fora do código?',
            '**Performance** — N+1 queries? Alocações desnecessárias? Loops em dados crescentes?',
            '**Backwards compatibility** — APIs públicas mudaram? Migrations compatíveis?',
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'A regra prática do tamanho',
          text: 'Um PR com <200 linhas tem muito maior probabilidade de encontrar bugs do que um de 800. Divide: refator primeiro, feature depois. Se tens de rever 2000 linhas, estás a carimbar aprovação, não a rever.',
        },
      ],
    },
    {
      id: 'actions',
      title: 'GitHub Actions — automatizar tudo',
      blocks: [
        { type: 'p', text: 'GitHub Actions corre workflows (YAML em `.github/workflows/`) em resposta a eventos: push, pull request, cron, release. É CI/CD gratuito para repositórios públicos e barato para privados.' },
        {
          type: 'code', lang: 'bash', caption: '.github/workflows/ci.yml — testes a cada push/PR',
          code: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: pip

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Lint
        run: ruff check .

      - name: Type check
        run: mypy src/

      - name: Tests
        run: pytest --cov=src --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: coverage.xml`,
        },
        {
          type: 'code', lang: 'bash', caption: 'build e push de imagem Docker em cada release',
          code: `name: Publish image

on:
  push:
    tags: ["v*"]

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.ref_name }}
            ghcr.io/\${{ github.repository }}:latest
          platforms: linux/amd64,linux/arm64`,
        },
        {
          type: 'table',
          head: ['Gatilho', 'Quando dispara'],
          rows: [
            ['`push`', 'Em cada push (com filtros `branches`, `paths`, `tags`)'],
            ['`pull_request`', 'Quando abres, atualizas ou re-abres um PR'],
            ['`schedule`', 'Em cron (ex.: `cron: "0 3 * * *"` — todos os dias às 3h UTC)'],
            ['`workflow_dispatch`', 'Manualmente, botão "Run workflow"'],
            ['`release`', 'Quando publicas uma Release no GitHub'],
            ['`issue_comment`', 'Comentários em issues/PRs (útil para "/deploy")'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Segredos e permissões',
          text: 'Nunca metas tokens no YAML. Usa `secrets.GITHUB_TOKEN` (automático, scope ao repo) ou define em *Settings → Secrets*. Para permissões granulares, declara `permissions:` no job — o default é "tudo", prefere "apenas o que precisas".',
        },
      ],
    },
    {
      id: 'workflows-equipa',
      title: 'Estratégias de branching',
      blocks: [
        {
          type: 'table',
          head: ['Estratégia', 'Como funciona', 'Bom para'],
          rows: [
            ['**Trunk-based**', 'Toda a gente mergeia para `main` frequentemente (várias vezes ao dia); features grandes escondidas atrás de feature flags', 'Equipas com forte CI/CD, deploys contínuos'],
            ['**GitHub Flow**', '`main` sempre deployável; features em branches curtos via PR', 'Maioria dos projetos — simples, pragmático'],
            ['**Git Flow**', '`develop` + `main` + `release/*` + `hotfix/*`', 'Produtos com releases planeadas e versionadas'],
            ['**Release branches**', 'Trabalho em `main`; cada versão tem o seu `release/vX.Y`', 'Software com múltiplas versões em suporte simultâneo'],
          ],
          caption: 'Começa por GitHub Flow. Os outros são especializações para contextos específicos.',
        },
        {
          type: 'callout', tone: 'tip', title: 'Pequeno e frequente > grande e raro',
          text: 'Branches de vida longa acumulam divergência e conflitos. Branches curtos (horas a dias) são seguros de mergear. **Se o teu branch tem mais de uma semana, provavelmente estás a construir demasiado antes de integrar.**',
        },
      ],
    },
    {
      id: 'recuperacao',
      title: 'Recuperação: reset, revert, reflog, stash, cherry-pick',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'reset — mover o HEAD',
          code: `# Soft — mantém o working dir e o stage
git reset --soft HEAD~1    # "desfaz" o último commit; alterações continuam staged

# Mixed (default) — mantém o working dir, limpa o stage
git reset HEAD~1           # "desfaz" o commit; alterações no working dir, não staged

# Hard — DESTRUTIVO: perde o working dir e o stage
git reset --hard HEAD~1    # volta exatamente ao commit anterior`,
        },
        {
          type: 'code', lang: 'bash', caption: 'revert — reverter sem reescrever a história',
          code: `# Cria um NOVO commit que desfaz o efeito de outro
git revert abc123

# Útil em main/branches partilhados — o histórico fica preservado
# em vez de reescrito. Sempre a escolha certa em main.`,
        },
        {
          type: 'code', lang: 'bash', caption: 'reflog — a última linha de defesa',
          code: `# Mostra TODAS as movimentações do HEAD, incluindo as "perdidas"
git reflog
# abc123 HEAD@{0}: commit: feat: X
# def456 HEAD@{1}: reset: moving to HEAD~2
# ...

# Encontraste o commit "perdido"? Volta a ele.
git reset --hard HEAD@{1}

# O reflog é local e sobrevive 90 dias por omissão.
# Quase nada no Git é mesmo "perdido".`,
        },
        {
          type: 'code', lang: 'bash', caption: 'stash — pôr trabalho em pausa',
          code: `# Guardar alterações temporariamente (volta o working dir ao limpo)
git stash push -m "wip: refactor inacabado"

# Ver o que está guardado
git stash list
# stash@{0}: On main: wip: refactor inacabado

# Voltar a aplicar (e remove da stash)
git stash pop

# Aplicar sem remover
git stash apply

# Descartar
git stash drop stash@{0}

# Usar: "a chefe pede-me para investigar um bug urgente mas tenho código
#         não terminado". Stash → switch → investigar → voltar → stash pop.`,
        },
        {
          type: 'code', lang: 'bash', caption: 'cherry-pick — trazer um commit específico',
          code: `# Aplicar o commit abc123 (de outro branch) no branch atual
git cherry-pick abc123

# Vários
git cherry-pick abc123 def456

# Resolver um conflito e continuar
git cherry-pick --continue

# Útil quando: fizeste um hotfix em "main" e queres aplicá-lo
# também numa branch de release antiga.`,
        },
        {
          type: 'callout', tone: 'key', title: 'Quando entrares em pânico',
          text: '**Respira. Verifica o `git reflog`. Quase nada no Git é definitivo em menos de 90 dias.** A exceção: `git reset --hard` elimina alterações no working dir que nunca foram commitadas, e `git push --force` em remoto parece apagar commits (mas eles continuam no reflog local de quem os tinha).',
        },
      ],
    },
    {
      id: 'boas-praticas',
      title: 'Boas práticas e armadilhas',
      blocks: [
        { type: 'h', text: 'Mensagens de commit que valem a pena' },
        {
          type: 'code', lang: 'text',
          code: `# ✗ Mau
atualizar
fix
wip
arranjado o bug

# ✓ Bom — Conventional Commits
feat(auth): aceitar login com Google OAuth
fix(checkout): corrigir arredondamento do IVA em compras com desconto

Antes, descontos > 50% podiam resultar em total negativo devido
à ordem de aplicação. Agora o desconto aplica-se sobre o subtotal
antes do IVA, e o IVA é calculado sobre o resultado.

Fixes #412

# Formato: tipo(scope): sumário curto no imperativo (<70 chars)
#   [linha em branco]
#   Corpo opcional a explicar o porquê, não o quê
#   [linha em branco]
#   Referências a issues`,
        },
        {
          type: 'compare',
          left: {
            title: 'Faz',
            items: [
              'Commits pequenos e atómicos — um pensamento por commit',
              'Mensagem no imperativo: "add", "fix", "refactor"',
              'Pull antes de push (rebase, para histórico limpo)',
              'Branches curtos, PRs frequentes',
              '`.gitignore` antes do primeiro commit',
              '`git log --follow <ficheiro>` para seguir renames',
            ],
          },
          right: {
            title: 'Evita',
            items: [
              'Commits do género "many changes" com 50 ficheiros',
              '`git push --force` em `main` (ou em branches de outros)',
              'Reescrever histórico já partilhado',
              'Cometer segredos (`.env`, chaves, credenciais)',
              'Cometer binários grandes (usa Git LFS)',
              '`git add .` cego — abre e lê o que entrou (`git diff --staged`)',
            ],
          },
        },
        { type: 'h', text: 'Onde aprender mais' },
        {
          type: 'list', ordered: true, items: [
            '**[Pro Git](https://git-scm.com/book)** — o livro oficial, gratuito, em várias línguas (incluindo português). A referência.',
            '**[Oh My Git!](https://ohmygit.org/)** — jogo visual que ensina os conceitos duros (merge, rebase, reset).',
            '**[Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR)** — visualizador interativo para dominar branches e merge.',
            '**[GitHub Docs](https://docs.github.com/en/get-started)** — PRs, Actions, Discussions, Projects.',
            '**[gh CLI](https://cli.github.com/)** — GitHub no terminal. `gh pr create`, `gh pr checkout 42`, `gh issue list`.',
            '**[git-tips](https://github.com/git-tips/tips)** — centenas de dicas práticas.',
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'A verdade sobre o Git',
          text: 'Em dois meses dominas 20 comandos que cobrem 95% dos dias. Os restantes (`bisect`, `worktree`, `sparse-checkout`...) aprendem-se quando aparecem. O importante hoje é: usar branches, abrir PRs, resolver conflitos sem medo, saber o reflog existe. O resto virá.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'gt1',
      prompt: 'Git é…',
      options: [
        'Um serviço online para guardar código',
        'Um sistema distribuído de controlo de versões que corre localmente',
        'Um editor de código',
        'Uma linguagem de programação',
      ],
      answer: 1,
      explain: 'Git é a ferramenta local; GitHub, GitLab, Bitbucket são serviços que hospedam repositórios Git.',
    },
    {
      id: 'gt2',
      prompt: 'A diferença entre `git fetch` e `git pull` é…',
      options: [
        'São sinónimos',
        '`fetch` só descarrega commits; `pull` descarrega e aplica no teu branch',
        '`pull` é mais seguro',
        '`fetch` não precisa de internet',
      ],
      answer: 1,
      explain: '`pull` = `fetch` + `merge` (ou `rebase`). Fetch deixa-te inspecionar antes de integrar.',
    },
    {
      id: 'gt3',
      prompt: 'Um branch no Git é…',
      options: [
        'Uma cópia completa dos ficheiros',
        'Uma pasta separada',
        'Um ponteiro mutável para um commit',
        'Um backup',
      ],
      answer: 2,
      explain: 'Branch é uma referência ligeira a um commit. Criá-lo e apagá-lo são operações instantâneas.',
    },
    {
      id: 'gt4',
      prompt: 'Quando acontece um conflito de merge, o Git…',
      options: [
        'Escolhe automaticamente a versão mais recente',
        'Para e deixa os marcadores `<<<<<<<`/`=======`/`>>>>>>>` nos ficheiros para resolveres',
        'Faz rollback automático',
        'Cria um novo branch',
      ],
      answer: 1,
      explain: 'Resolves manualmente, fazes `git add` e `git commit` (ou `git merge --abort` para desistir).',
    },
    {
      id: 'gt5',
      prompt: 'A regra de ouro do `rebase` é…',
      options: [
        'Usar sempre em vez de merge',
        'Nunca rebases commits que já foram partilhados com outros',
        'Só funciona em `main`',
        'Precisa de sudo',
      ],
      answer: 1,
      explain: 'Rebase reescreve commits (novos hashes). Quem já clonou os antigos fica com histórico divergente.',
    },
    {
      id: 'gt6',
      prompt: 'Um Pull Request é…',
      options: [
        'Um comando do Git para descarregar código',
        'Uma proposta de integrar um branch em outro, com revisão e discussão antes do merge',
        'Uma forma de clonar repositórios',
        'O mesmo que `git pull`',
      ],
      answer: 1,
      explain: 'PR é uma ferramenta do GitHub/GitLab/Bitbucket — não é um comando Git nativo.',
    },
    {
      id: 'gt7',
      prompt: 'Se fizeste `git reset --hard HEAD~1` por engano e perdeste um commit, como recuperas?',
      options: [
        'Já não dá — está perdido',
        '`git reflog` encontra o hash e `git reset --hard <hash>` restaura',
        'Reinstalar o Git',
        '`git pull` restaura',
      ],
      answer: 1,
      explain: 'Reflog guarda todas as movimentações do HEAD por 90 dias. É a rede de segurança do Git.',
    },
    {
      id: 'gt8',
      prompt: 'Para desfazer um commit já publicado em `main` sem reescrever histórico, usas…',
      options: [
        '`git reset --hard`',
        '`git revert`',
        '`git push --force`',
        '`git rebase -i`',
      ],
      answer: 1,
      explain: '`revert` cria um NOVO commit que desfaz o efeito de outro. Seguro em branches partilhados.',
    },
    {
      id: 'gt9',
      prompt: 'O `.gitignore` serve para…',
      options: [
        'Encriptar ficheiros',
        'Indicar ficheiros/pastas que o Git deve ignorar (não versionar)',
        'Listar os ficheiros em conflito',
        'Guardar configuração global',
      ],
      answer: 1,
      explain: 'Útil para `node_modules/`, `.env`, builds, caches, ficheiros do SO.',
    },
    {
      id: 'gt10',
      prompt: 'GitHub Actions corre…',
      options: [
        'Apenas quando fazes push para `main`',
        'Em resposta a eventos definidos em YAML (push, PR, cron, release, manual...)',
        'Só uma vez por dia',
        'Apenas em repositórios privados pagos',
      ],
      answer: 1,
      explain: 'Os workflows em `.github/workflows/*.yml` declaram `on:` com gatilhos flexíveis.',
    },
    {
      id: 'gt11',
      prompt: '`git stash` serve para…',
      options: [
        'Apagar todas as alterações',
        'Guardar temporariamente alterações não commitadas para voltares depois',
        'Comprimir commits',
        'Sincronizar com o remoto',
      ],
      answer: 1,
      explain: 'Permite "limpar" o working dir sem perder trabalho, útil para mudar de branch no meio de algo.',
    },
    {
      id: 'gt12',
      prompt: 'Um bom tamanho de Pull Request é geralmente…',
      options: [
        'Quanto maior, mais eficiente',
        'Pequeno (<400 linhas idealmente), com uma mudança focada',
        '2000-3000 linhas',
        'Depende do humor do reviewer',
      ],
      answer: 1,
      explain: 'PRs pequenos são revistos com atenção e apanham mais bugs. Grandes tendem a ser aprovados por fadiga.',
    },
  ],
  exercises: [
    {
      id: 'e16-1',
      difficulty: 1,
      kind: 'open',
      title: 'Primeiro repositório',
      statement: 'Cria uma pasta `meu-projeto`, inicializa como Git, cria um `README.md`, faz o primeiro commit. Depois acrescenta um `.gitignore` que ignore `.env` e `node_modules/`, e faz um segundo commit só com o `.gitignore` adicionado. Mostra o histórico.',
      hint: '`git init`, `git add`, `git commit -m "..."`, `git log --oneline`.',
      solution: 'mkdir meu-projeto && cd meu-projeto\ngit init\n\necho "# Meu projeto" > README.md\ngit add README.md\ngit commit -m "chore: estrutura inicial"\n\ncat > .gitignore <<EOF\n.env\nnode_modules/\nEOF\n\ngit add .gitignore\ngit commit -m "chore: adicionar .gitignore"\n\ngit log --oneline\n# abc1234 chore: adicionar .gitignore\n# def5678 chore: estrutura inicial\n\nNota: commits separados por responsabilidade — um para o README, outro para o .gitignore. Isto facilita rever e, se for preciso, reverter um sem o outro.',
    },
    {
      id: 'e16-2',
      difficulty: 1,
      kind: 'open',
      title: 'Branch e merge',
      statement: 'A partir de `main`, cria um branch `feature/saudacao`, acrescenta um ficheiro `ola.txt` com "Olá, mundo!", faz commit. Volta a `main` e mergeia o branch. Confirma que `ola.txt` aparece em `main`.',
      hint: '`git switch -c`, trabalha, `git switch main`, `git merge`.',
      solution: '# No branch main (depois de ter pelo menos 1 commit)\ngit switch -c feature/saudacao\n\necho "Olá, mundo!" > ola.txt\ngit add ola.txt\ngit commit -m "feat: adicionar saudacao"\n\n# Voltar a main\ngit switch main\nls              # ola.txt NÃO aparece aqui — está só no branch\n\n# Mergear\ngit merge feature/saudacao\n# Fast-forward (porque main não mudou)\nls              # ola.txt agora aparece\n\n# Apagar o branch já integrado\ngit branch -d feature/saudacao\n\nDica: se main tivesse tido commits novos, o merge criaria um merge commit (ou podias usar `git rebase main` em feature/saudacao antes de mergear, para manter linear).',
    },
    {
      id: 'e16-3',
      difficulty: 2,
      kind: 'open',
      title: 'Resolver um conflito',
      statement: 'Em `main` o ficheiro `calc.py` tem `def tax(n): return n * 1.23`. Cria `feature/iva-reduzido` e muda para `n * 1.06`; em `main` (sem o branch), muda a mesma linha para `n * 1.0` (isento). Mergeia `feature/iva-reduzido` em `main` — vais ter um conflito. Resolve-o deixando os dois cálculos num `if` sobre um parâmetro `tipo`.',
      hint: 'Depois do `git merge`, abre o ficheiro, encontra os marcadores `<<<<<<<`/`=======`/`>>>>>>>`, escreve o resultado final e `git add` + `git commit`.',
      solution: '# Estado inicial em main\ncat > calc.py <<EOF\ndef tax(n):\n    return n * 1.23\nEOF\ngit add calc.py && git commit -m "feat: imposto inicial"\n\n# Criar branch, mudar lá\ngit switch -c feature/iva-reduzido\nsed -i.bak \'s/1.23/1.06/\' calc.py && rm calc.py.bak\ngit commit -am "feat: aplicar IVA reduzido"\n\n# Voltar a main, mudar diferente\ngit switch main\nsed -i.bak \'s/1.23/1.0/\' calc.py && rm calc.py.bak\ngit commit -am "feat: isenção"\n\n# Tentar mergear\ngit merge feature/iva-reduzido\n# Auto-merging calc.py\n# CONFLICT (content): Merge conflict in calc.py\n\n# Agora calc.py tem:\n#   def tax(n):\n#   <<<<<<< HEAD\n#       return n * 1.0\n#   =======\n#       return n * 1.06\n#   >>>>>>> feature/iva-reduzido\n\n# Resolver: edita o ficheiro para\ncat > calc.py <<EOF\ndef tax(n, tipo="normal"):\n    if tipo == "isento":\n        return n\n    if tipo == "reduzido":\n        return n * 1.06\n    return n * 1.23   # normal\nEOF\n\ngit add calc.py\ngit commit    # Git abre o editor com a mensagem de merge pronta\n\ngit log --oneline --graph\n\nMétodo geral: (1) `git status` para ver conflitos; (2) abrir cada ficheiro, procurar `<<<<<<<`; (3) escrever o resultado final, remover marcadores; (4) `git add` cada resolvido; (5) `git commit` para fechar o merge. Se te perderes, `git merge --abort` volta ao estado antes do merge.',
    },
    {
      id: 'e16-4',
      difficulty: 2,
      kind: 'open',
      title: 'Rebase interativo — limpar o histórico',
      statement: 'Fizeste cinco commits num branch `feature/login`: `wip`, `fix typo`, `tentativa`, `wip 2`, `funciona!`. Antes de abrir PR, queres que fique UM commit com mensagem decente. Descreve passo a passo como fazes com `git rebase -i`.',
      hint: '`git rebase -i main`. No editor, deixa o primeiro `pick` e muda os outros para `squash` (ou `fixup` se quiseres descartar a mensagem). Depois reescreves a mensagem final.',
      solution: '# No branch feature/login:\ngit log --oneline main..HEAD\n# 5e5e5e5 funciona!\n# 4d4d4d4 wip 2\n# 3c3c3c3 tentativa\n# 2b2b2b2 fix typo\n# 1a1a1a1 wip\n\n# Rebase interativo sobre main\ngit rebase -i main\n\n# Abre o editor com:\n#   pick 1a1a1a1 wip\n#   pick 2b2b2b2 fix typo\n#   pick 3c3c3c3 tentativa\n#   pick 4d4d4d4 wip 2\n#   pick 5e5e5e5 funciona!\n\n# Mudar para:\n#   pick   1a1a1a1 wip\n#   fixup  2b2b2b2 fix typo       (junta no anterior, descarta mensagem)\n#   fixup  3c3c3c3 tentativa\n#   fixup  4d4d4d4 wip 2\n#   fixup  5e5e5e5 funciona!\n\n# Guardar e fechar. O Git combina tudo e abre novo editor\n# para a mensagem do commit final. Reescrever:\n\nfeat(auth): formulário de login com validação\n\nAdiciona o endpoint POST /login, validação client-side e server-side,\ne mensagens de erro claras para email ou password errados.\n\nFixes #42\n\n# Guardar. git log agora mostra:\ngit log --oneline main..HEAD\n# abc1234 feat(auth): formulário de login com validação\n\n# Empurrar (primeira vez ou após rebase, usa --force-with-lease)\ngit push --force-with-lease\n\nPorquê `--force-with-lease` em vez de `--force`: o lease aborta se outra pessoa empurrou algo para o branch depois do teu último fetch. Protege-te de apagar o trabalho dos outros por engano.\n\nNota: só faz isto em branches tuas, não partilhadas. Se o PR já tem comentários do reviewer, perguntas-lhe primeiro — alguns preferem ver incrementalmente, outros preferem squash antes do merge.',
    },
    {
      id: 'e16-5',
      difficulty: 2,
      kind: 'open',
      title: 'Workflow completo com GitHub',
      statement: 'Descreve o workflow completo para contribuir uma correção de bug a um projeto no GitHub onde não és colaborador direto: do fork ao merge do PR.',
      hint: 'Fork → clone → branch → commit → push → PR → review → iterar → merge. Lembra-te do `upstream`.',
      solution: '**1. Fazer fork no GitHub**\n   - Botão "Fork" na página do projeto. Cria uma cópia na tua conta.\n\n**2. Clonar o teu fork**\n```\ngit clone git@github.com:ana/projeto-original.git\ncd projeto-original\n```\n\n**3. Adicionar o repo original como "upstream"**\n```\ngit remote add upstream git@github.com:dono/projeto-original.git\ngit remote -v\n# origin    git@github.com:ana/projeto-original.git (fetch/push)\n# upstream  git@github.com:dono/projeto-original.git (fetch/push)\n```\n\n**4. Sincronizar com o original antes de começar**\n```\ngit fetch upstream\ngit switch main\ngit merge upstream/main    # ou: git rebase upstream/main\ngit push                   # atualiza o teu fork\n```\n\n**5. Criar branch de trabalho**\n```\ngit switch -c fix/123-null-pointer-no-login\n```\n\n**6. Fazer commits atómicos**\n```\n# ... código ...\ngit add -p               # revê hunk a hunk — hábito dourado\ngit commit -m "test: adicionar teste que reproduz #123"\n# ... correção ...\ngit commit -m "fix: tratar null em LoginService.autenticar"\n```\n\n**7. Empurrar para o teu fork**\n```\ngit push -u origin fix/123-null-pointer-no-login\n```\n\n**8. Abrir o PR**\n   - O GitHub mostra um banner após o push com "Compare & pull request".\n   - Base: `dono/projeto-original:main`. Compare: `ana:fix/123-...`.\n   - Título: `fix: tratar null em LoginService quando email está vazio`\n   - Descrição: porquê, como reproduzir, como testaste, screenshots se aplicável. Link para issue #123 com `Fixes #123`.\n\n**9. CI corre**\n   - GitHub Actions corre testes, lint, tipos. Se algo falha, corriges e fazes `git push` — o PR atualiza-se automaticamente.\n\n**10. Review**\n   - Reviewer comenta, pede alterações. Respondes a cada um (mesmo que seja só "concordo, feito em abc123").\n   - Se o main mudar e o branch ficar desatualizado: `git fetch upstream && git rebase upstream/main`, resolve conflitos, `git push --force-with-lease`.\n\n**11. Aprovado — merge**\n   - O dono do projeto faz merge (squash, merge commit ou rebase, conforme convenção do projeto).\n\n**12. Limpar**\n```\ngit switch main\ngit fetch upstream && git merge upstream/main && git push\ngit branch -d fix/123-null-pointer-no-login\ngit push origin --delete fix/123-null-pointer-no-login  # opcional\n```\n\nEste fluxo é o padrão de 99% do open source. Com o `gh` CLI, muitos destes passos tornam-se uma linha: `gh repo fork`, `gh pr create`, `gh pr checkout 42`.',
    },
    {
      id: 'e16-6',
      difficulty: 3,
      kind: 'open',
      title: 'GitHub Actions — pipeline CI',
      statement: 'Escreve um workflow `.github/workflows/ci.yml` que, em cada PR e push para `main`: (a) corre em Ubuntu com Node 20 e 22 em matriz; (b) faz cache do `node_modules`; (c) corre `npm run lint`, `npm run test` e `npm run build`; (d) só faz deploy automático (passo final) se o branch é `main`.',
      hint: '`strategy.matrix`, `actions/setup-node@v4` com `cache: npm`, `if: github.ref == \'refs/heads/main\'` no job de deploy.',
      solution: 'name: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        node-version: [20, 22]\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Setup Node \\${{ matrix.node-version }}\n        uses: actions/setup-node@v4\n        with:\n          node-version: \\${{ matrix.node-version }}\n          cache: npm\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Lint\n        run: npm run lint\n\n      - name: Test\n        run: npm run test -- --coverage\n\n      - name: Build\n        run: npm run build\n\n      - name: Upload coverage\n        if: matrix.node-version == 22\n        uses: actions/upload-artifact@v4\n        with:\n          name: coverage\n          path: coverage/\n\n  deploy:\n    needs: test\n    if: github.event_name == \'push\' && github.ref == \'refs/heads/main\'\n    runs-on: ubuntu-latest\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n\n      - run: npm ci && npm run build\n\n      - name: Deploy to production\n        env:\n          DEPLOY_TOKEN: \\${{ secrets.DEPLOY_TOKEN }}\n        run: npm run deploy\n\n**Decisões:**\n\n1. **`on: pull_request`** sem filtrar branches — qualquer PR dispara, inclusive para branches de feature.\n2. **`fail-fast: false`** — se Node 20 falha, Node 22 continua, para ver as duas falhas.\n3. **`actions/setup-node@v4` com `cache: npm`** — restaura o cache de `node_modules` entre runs. Builds de ~2 min passam a ~30 s.\n4. **`npm ci`** (não `npm install`) — rápido, determinístico, falha se o lockfile está dessincronizado.\n5. **`upload-artifact`** só uma vez (`matrix.node-version == 22`) — evita conflitos de nome.\n6. **Job `deploy` separado** com `needs: test` — só corre se os testes passam.\n7. **`if: github.event_name == \'push\' && github.ref == \'refs/heads/main\'`** — garante que não faz deploy por acidente a partir de PRs ou tags.\n8. **`environment: production`** — permite configurar aprovação manual, segredos por ambiente, e deixa rasto na UI do GitHub.\n9. **`secrets.DEPLOY_TOKEN`** — nunca hardcoded; configurado em *Settings → Secrets → Actions*.\n\n**Para evoluir:**\n- `concurrency: group: \\${{ github.ref }}` para cancelar runs antigas quando empurras novos commits.\n- `permissions:` por job para scope mínimo.\n- Usar `actions/dependency-review-action` em PRs para avisar sobre dependências com vulnerabilidades.',
    },
    {
      id: 'e16-7',
      difficulty: 3,
      kind: 'open',
      title: 'Recuperar de desastres',
      statement: 'Diagnostica e corrige cada um destes cenários: (a) Fizeste `git reset --hard HEAD~3` sem querer; (b) Empurraste um ficheiro `.env` com segredos para o GitHub; (c) Fizeste commit numa branch errada; (d) O teu colega empurrou um `--force` e o teu PR ficou "atrás". Explica a solução para cada um.',
      hint: '(a) reflog; (b) rotaciona segredos, depois `git filter-repo`; (c) `git reset`/`git cherry-pick`; (d) rebase do remoto atualizado.',
      solution: '**(a) `git reset --hard HEAD~3` por engano**\n\nOs três commits parecem perdidos mas estão no reflog local.\n```\ngit reflog\n# Encontra o commit onde estavas antes do reset.\n# Supondo que era HEAD@{1}:\n\ngit reset --hard HEAD@{1}\n\n# Ou se souberes o hash directamente:\ngit reset --hard abc1234\n```\nO reflog guarda 90 dias por omissão. Quase nada é "perdido" no Git.\n\n---\n\n**(b) Commit e push de `.env` com segredos**\n\n**Passo 1 — Rotaciona os segredos AGORA.** O ficheiro está público (ou visível a quem tem acesso ao repo); considera-o comprometido. Gera chaves novas, apaga as antigas em todos os serviços.\n\n**Passo 2 — Adiciona `.env` ao `.gitignore`** (para não voltar a acontecer).\n```\necho ".env" >> .gitignore\ngit rm --cached .env\ngit add .gitignore\ngit commit -m "chore: ignorar .env e remover do tracking"\ngit push\n```\n\n**Passo 3 — Remove do histórico** (o commit continua lá e é acessível).\n\nCom [`git filter-repo`](https://github.com/newren/git-filter-repo):\n```\ngit filter-repo --path .env --invert-paths\n```\nIsto reescreve todo o histórico. Depois:\n```\ngit push --force\n```\nAvisa a equipa — toda a gente vai ter de re-clonar ou fazer `git reset --hard origin/main` no seu branch local.\n\n**Alternativa:** [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/).\n\n**Nota:** rotacionar os segredos é não-negociável. Remover do histórico ajuda a limpar, mas o segredo esteve exposto.\n\n---\n\n**(c) Commits na branch errada**\n\nCenário: fizeste 2 commits em `main` quando deviam estar em `feature/x`.\n```\n# Estás em main com os commits a mais\ngit log --oneline\n# abc1234 feat: nova funcionalidade\n# def5678 fix: bug encontrado durante a feature\n# 9999999 (commit anterior, de main antes dos erros)\n\n# Criar o branch feature/x a partir daqui (preserva os commits)\ngit switch -c feature/x\n\n# Voltar main ao estado anterior\ngit switch main\ngit reset --hard 9999999\n\n# Confirmar\ngit log --oneline               # main: só até 9999999\ngit log --oneline feature/x     # feature/x: tem abc1234 e def5678\n```\n\nSe já tinhas empurrado para `main`, precisas de `git push --force-with-lease` — e, se outros já clonaram, avisar.\n\nAlternativa com `cherry-pick` (quando só querer MOVER um commit específico):\n```\ngit switch feature/x\ngit cherry-pick abc1234\ngit switch main\ngit reset --hard HEAD~1\n```\n\n---\n\n**(d) Colega fez `--force` no branch partilhado**\n\nO teu branch local tem commits que o remoto já não reconhece.\n```\ngit fetch\ngit status\n# Your branch and \'origin/feature/x\' have diverged,\n# and have N and M different commits each, respectively.\n```\n\nSe os teus commits ainda não estão nas versão nova do remoto (foram sobrescritos pelo force):\n```\n# Opção 1: reaplicar os teus commits sobre o novo estado remoto\ngit fetch\ngit rebase origin/feature/x\n# Resolve conflitos se houver.\ngit push --force-with-lease\n```\n\n```\n# Opção 2: se os teus commits estavam no reflog do colega e ele quiser recuperá-los\n# ele precisa de ir ao reflog LOCAL dele (não teu) e recuperá-los.\n# Por isso é que `--force-with-lease` é tão importante — recusa a sobrescrever se não estás alinhado.\n```\n\n**Prevenção:** no GitHub, protege o branch `main` (*Settings → Branches → Protection rules*): recusa force pushes, exige PR com review, exige CI verde. Em branches de feature, estabelece a cultura: comunicar antes de rebase/force em branches partilhados.',
    },
  ],
};
