import type { Module } from '../types';

export const m11: Module = {
  id: 'ferramentas',
  number: 11,
  title: 'Terminal, ficheiros e Git',
  subtitle: 'As ferramentas que vais usar todos os dias, seja qual for a linguagem',
  icon: '🛠️',
  minutes: 45,
  goals: [
    'Navegar no sistema de ficheiros pela linha de comandos',
    'Compreender caminhos absolutos e relativos',
    'Usar Git para guardar o histórico do teu trabalho',
    'Trabalhar com ramos e resolver conflitos simples',
    'Escolher e configurar um ambiente de desenvolvimento',
  ],
  sections: [
    {
      id: 'ficheiros',
      title: 'O sistema de ficheiros',
      blocks: [
        { type: 'p', text: 'Um **caminho** identifica um ficheiro na árvore de diretórios. Há dois tipos, e confundi-los é a causa nº 1 de "funciona na minha máquina".' },
        {
          type: 'compare',
          left: { title: 'Caminho absoluto', items: ['Começa na raiz do sistema', 'Linux/macOS: `/home/ana/projeto/dados.csv`', 'Windows: `C:\\Users\\Ana\\projeto\\dados.csv`', 'Não depende de onde estás', 'Frágil: quebra noutra máquina'] },
          right: { title: 'Caminho relativo', items: ['Parte do diretório atual', '`dados.csv`, `./dados.csv`', '`../config/app.json` — sobe um nível', 'Depende de onde executas o programa', 'Portátil: usa este em código'] },
        },
        {
          type: 'terms', items: [
            { term: '.', def: 'O diretório atual.' },
            { term: '..', def: 'O diretório acima (pai).' },
            { term: '~', def: 'A pasta pessoal do utilizador (em Unix).' },
            { term: 'Extensão', def: 'O sufixo (`.txt`, `.py`) é uma convenção para as aplicações; não determina o conteúdo real do ficheiro.' },
            { term: 'Ficheiro oculto', def: 'Em Unix, começa por ponto: `.gitignore`, `.env`. Não aparece nas listagens normais.' },
          ],
        },
        { type: 'callout', tone: 'warn', title: 'Separadores e maiúsculas', text: 'O Windows usa `\\` e o Unix `/` — em código, usa sempre a biblioteca da linguagem (`os.path.join`, `Path`) em vez de concatenar strings. E atenção: Linux distingue maiúsculas de minúsculas nos nomes de ficheiros; Windows e macOS, por omissão, não. `Dados.csv` e `dados.csv` são ficheiros diferentes em produção e o mesmo no teu portátil.' },
      ],
    },
    {
      id: 'terminal',
      title: 'A linha de comandos',
      blocks: [
        { type: 'p', text: 'O terminal assusta ao início e passa a ser mais rápido do que qualquer interface gráfica em poucas semanas. Em servidores, muitas vezes é a única opção.' },
        {
          type: 'table',
          head: ['Comando (Unix)', 'Windows (PowerShell)', 'O que faz'],
          rows: [
            ['`pwd`', '`pwd`', 'Mostra o diretório atual'],
            ['`ls -la`', '`ls`', 'Lista ficheiros, incluindo ocultos e detalhes'],
            ['`cd pasta`', '`cd pasta`', 'Entra numa pasta (`cd ..` sobe)'],
            ['`mkdir nome`', '`mkdir nome`', 'Cria uma pasta'],
            ['`cp a b`', '`copy a b`', 'Copia'],
            ['`mv a b`', '`move a b`', 'Move ou renomeia'],
            ['`rm ficheiro`', '`del ficheiro`', 'Apaga — sem reciclagem, tem cuidado'],
            ['`cat ficheiro`', '`type ficheiro`', 'Mostra o conteúdo'],
            ['`grep "texto" *.py`', '`Select-String`', 'Procura texto dentro de ficheiros'],
            ['`man comando`', '`help`', 'Manual do comando'],
          ],
        },
        { type: 'code', lang: 'bash', caption: 'encadear comandos é onde está o poder', code: `# quantas linhas tem cada ficheiro Python do projeto
wc -l *.py

# procurar onde a função é usada, em todo o projeto
grep -rn "calcularTotal" .

# listar os 5 ficheiros maiores
ls -lS | head -6

# canalizar (pipe): a saída de um é a entrada do seguinte
cat vendas.csv | grep "2026" | wc -l` },
        { type: 'callout', tone: 'tip', text: 'Duas teclas que poupam horas: **Tab** completa nomes de ficheiros e comandos; **seta para cima** repete comandos anteriores. E `Ctrl+C` interrompe um programa que não pára.' },
      ],
    },
    {
      id: 'git',
      title: 'Git: o histórico do teu trabalho',
      blocks: [
        { type: 'p', text: '**Git** é um sistema de controlo de versões: guarda o histórico completo das alterações, permite voltar atrás, trabalhar em várias funcionalidades em paralelo e colaborar sem sobrepor trabalho. **GitHub**, GitLab e Bitbucket são serviços que alojam repositórios Git na nuvem — não confundas a ferramenta com o serviço.' },
        { type: 'p', text: 'Sem Git, o histórico de um projeto é `projeto_final_v2_REALMENTE_FINAL_agora_sim.zip`. Com Git, é uma linha do tempo navegável com autor, data e motivo de cada alteração.' },
        { type: 'h', text: 'Os três estados' },
        { type: 'code', lang: 'text', code: `Diretório de trabalho  →  Área de estágio  →  Repositório local  →  Remoto
   (editas ficheiros)      (git add)          (git commit)        (git push)

  modificado                 preparado           confirmado          publicado` },
        { type: 'code', lang: 'bash', caption: 'o ciclo diário', code: `git init                      # criar repositório (uma vez)
git clone <url>               # ou copiar um existente

git status                    # o que mudou? (usa isto constantemente)
git add ficheiro.py           # preparar alterações específicas
git add .                     # preparar tudo
git commit -m "Adiciona validação de email"
git log --oneline --graph     # ver o histórico

git remote add origin <url>   # associar ao repositório remoto
git push                      # enviar
git pull                      # trazer o trabalho dos outros` },
        { type: 'callout', tone: 'tip', title: 'Boas mensagens de commit', text: 'No imperativo e a explicar o **porquê**: "Corrige cálculo de IVA para produtos isentos" é útil; "alterações", "fix" ou "asdf" não são. Um commit deve corresponder a **uma alteração lógica** — não juntes uma correção de bug com a mudança de indentação de todo o ficheiro.' },
        { type: 'h', text: 'Ramos (branches)' },
        { type: 'code', lang: 'bash', code: `git switch -c nova-funcionalidade   # criar e mudar para um ramo novo
# ... trabalhas e fazes commits sem tocar no ramo principal ...
git switch main
git merge nova-funcionalidade       # juntar o trabalho

git branch                          # listar ramos
git switch -                        # voltar ao ramo anterior` },
        { type: 'p', text: 'Um **conflito** acontece quando duas pessoas alteram as mesmas linhas. O Git marca as duas versões no ficheiro; tu escolhes o que fica, apagas os marcadores e fazes commit. É desconfortável na primeira vez e rotineiro na décima.' },
        { type: 'code', lang: 'text', caption: 'um conflito', code: `<<<<<<< HEAD
const TAXA = 0.23;
=======
const TAXA = 0.06;
>>>>>>> nova-funcionalidade` },
        {
          type: 'table',
          head: ['Situação', 'Comando'],
          rows: [
            ['Desfazer alterações não guardadas num ficheiro', '`git restore ficheiro`'],
            ['Tirar um ficheiro da área de estágio', '`git restore --staged ficheiro`'],
            ['Corrigir a mensagem do último commit', '`git commit --amend`'],
            ['Guardar trabalho a meio para mudar de ramo', '`git stash` / `git stash pop`'],
            ['Ver quem alterou cada linha', '`git blame ficheiro`'],
            ['Anular um commit já publicado', '`git revert <hash>`'],
          ],
        },
        { type: 'callout', tone: 'warn', title: 'Nunca commites segredos', text: 'Palavras-passe, chaves de API e ficheiros `.env` não entram no repositório — o histórico do Git é permanente e, uma vez publicado, considera-se comprometido. Usa um ficheiro `.gitignore` e variáveis de ambiente. Acrescenta também `node_modules/`, `__pycache__/`, `target/` e `dist/`: são gerados e não pertencem ao histórico.' },
      ],
    },
    {
      id: 'ambiente',
      title: 'O teu ambiente de trabalho',
      blocks: [
        {
          type: 'list', items: [
            '**Editor ou IDE**: VS Code é a escolha por omissão para quase tudo; JetBrains (IntelliJ, PyCharm) é excelente para Java e Python; Neovim para quem gosta do teclado.',
            '**Extensões essenciais**: realce de sintaxe da tua linguagem, formatador automático, *linter*, integração com Git.',
            '**Formatador automático** (Prettier, Black, gofmt): elimina discussões sobre estilo e mantém tudo consistente. Configura-o para correr ao gravar.',
            '**Linter** (ESLint, Ruff, Checkstyle): apanha erros e maus hábitos antes de correres o programa.',
            '**Gestor de versões da linguagem** (nvm, pyenv, sdkman): permite ter várias versões instaladas sem conflitos.',
            '**Gestor de dependências** (npm, pip, Maven, Go modules): instala bibliotecas e fixa versões.',
          ],
        },
        { type: 'callout', tone: 'key', title: 'Aprender a ler documentação', text: 'A competência mais subestimada. A documentação oficial de uma biblioteca é quase sempre melhor do que o primeiro resultado de pesquisa. Habitua-te a procurar "python datetime **docs**" em vez de "como somar dias python", e a ler a assinatura das funções em vez de copiar exemplos sem os perceber.' },
        { type: 'h', text: 'Pedir ajuda de forma eficaz' },
        {
          type: 'steps', items: [
            { title: 'Diz o que querias que acontecesse', text: 'O objetivo, não só o sintoma.' },
            { title: 'Diz o que aconteceu', text: 'Com a mensagem de erro completa, copiada, não descrita de memória.' },
            { title: 'Mostra o código mínimo que reproduz o problema', text: 'Reduzir o exemplo resolve o problema sozinho em metade dos casos.' },
            { title: 'Diz o que já tentaste', text: 'Evita que te sugiram o que já experimentaste e mostra que fizeste o trabalho.' },
          ],
        },
        { type: 'callout', tone: 'info', title: 'Sobre assistentes de IA', text: 'Um assistente acelera muito, mas há uma diferença decisiva entre usá-lo para **aprender** ("explica-me porque este código falha") e usá-lo para **evitar aprender** (colar código que não compreendes). Regra segura enquanto estudas: nunca aceites código que não consegues explicar linha a linha a outra pessoa. O objetivo é a competência ficar em ti.' },
      ],
    },
  ],
  quiz: [
    { id: 'f1', prompt: 'O que significa `..` num caminho?', options: ['O diretório atual', 'O diretório acima (pai)', 'A raiz do sistema', 'A pasta pessoal'], answer: 1, explain: '`.` é o atual, `..` é o pai e `~` é a pasta pessoal do utilizador em Unix.' },
    { id: 'f2', prompt: 'Qual é a diferença entre Git e GitHub?', options: ['Nenhuma, são sinónimos', 'Git é o sistema de controlo de versões; GitHub é um serviço que aloja repositórios Git', 'Git é pago e GitHub é gratuito', 'Git só funciona em Linux'], answer: 1, explain: 'Podes usar Git localmente sem GitHub, e alojar em GitLab, Bitbucket ou num servidor próprio.' },
    { id: 'f3', prompt: 'O comando `git add` faz o quê?', options: ['Envia as alterações para o servidor', 'Guarda as alterações no histórico', 'Prepara as alterações para o próximo commit', 'Cria um novo ramo'], answer: 2, explain: 'Coloca as alterações na área de estágio. É o `commit` que as grava no histórico e o `push` que as envia.' },
    { id: 'f4', prompt: 'Porque é que um ficheiro `.env` com palavras-passe não deve ir para o repositório?', options: ['Porque ocupa espaço', 'Porque o histórico do Git é permanente e o segredo fica exposto a quem tiver acesso', 'Porque o Git não suporta esse formato', 'Porque torna o clone lento'], answer: 1, explain: 'Apagar num commit posterior não remove do histórico. Um segredo publicado deve ser considerado comprometido e rodado.' },
    { id: 'f5', prompt: 'Um caminho relativo é preferível em código porque…', options: ['é mais curto', 'não depende da estrutura de pastas de uma máquina específica', 'é mais rápido', 'permite aceder a mais ficheiros'], answer: 1, explain: 'Um caminho absoluto com o teu nome de utilizador falha em qualquer outra máquina ou servidor.' },
    { id: 'f6', prompt: 'O que faz `git pull`?', options: ['Envia os teus commits para o remoto', 'Traz e integra as alterações do repositório remoto', 'Apaga o ramo atual', 'Cria uma cópia do repositório'], answer: 1, explain: '`pull` traz e funde; `push` envia; `clone` copia um repositório pela primeira vez.' },
  ],
  exercises: [
    { id: 'e11-1', difficulty: 1, kind: 'input', title: 'Subir dois níveis', statement: 'Estás em `/home/ana/projetos/site/src`. Que caminho relativo escreves para chegar a `/home/ana/projetos/dados.csv`?', accept: ['../../dados.csv', '..\\..\\dados.csv'], hint: 'Sobe de src para site, e de site para projetos.', solution: '`../../dados.csv` — dois níveis acima e depois o ficheiro.' },
    { id: 'e11-2', difficulty: 2, kind: 'open', title: 'Sequência de comandos Git', statement: 'Escreve a sequência completa de comandos para: criar um repositório numa pasta nova, adicionar um ficheiro `main.py`, fazer o primeiro commit, associar a um remoto e publicar.', solution: '`mkdir projeto && cd projeto` · `git init` · criar o ficheiro `main.py` · `git add main.py` · `git commit -m "Primeira versão do programa"` · `git remote add origin https://github.com/utilizador/projeto.git` · `git push -u origin main`. A opção `-u` associa o ramo local ao remoto, e a partir daí basta `git push`.' },
    { id: 'e11-3', difficulty: 2, kind: 'open', title: 'Recuperar de um erro', statement: 'Alteraste um ficheiro, arrependeste-te e ainda não fizeste `git add`. Como voltas atrás? E se já tinhas feito `git add`? E se já tinhas feito commit mas ainda não publicaste?', solution: 'Antes do `add`: `git restore ficheiro` descarta as alterações locais (irreversível — confirma antes). Depois do `add`: `git restore --staged ficheiro` tira-o da área de estágio, e depois `git restore ficheiro` descarta as alterações. Depois do commit e antes do push: `git reset --soft HEAD~1` desfaz o commit mantendo as alterações preparadas, ou `git reset --hard HEAD~1` desfaz tudo (perde as alterações). Se já publicaste, não reescrevas o histórico partilhado: usa `git revert <hash>`, que cria um novo commit que anula o anterior.' },
    { id: 'e11-4', difficulty: 3, kind: 'open', title: 'Fluxo de trabalho em equipa', statement: 'Descreve um fluxo de trabalho com Git para uma equipa de três pessoas a desenvolver funcionalidades em paralelo, com revisão de código antes de integrar. Indica os ramos, os comandos e onde entram os testes.', solution: 'Fluxo baseado em ramos de funcionalidade: (1) o ramo `main` está sempre em estado publicável e é protegido — ninguém escreve nele diretamente. (2) Cada pessoa cria o seu ramo a partir de `main` atualizado: `git switch main && git pull && git switch -c feat/validacao-email`. (3) Trabalha com commits pequenos e descritivos; publica com `git push -u origin feat/validacao-email`. (4) Abre um *pull request*, onde a integração contínua corre automaticamente os testes e o linter. (5) Pelo menos um colega revê; a discussão fica registada no PR. (6) Depois da aprovação e dos testes verdes, integra-se em `main` (com *squash* se se quiser um commit por funcionalidade) e apaga-se o ramo. (7) Os outros atualizam com `git pull`. Benefícios: `main` nunca parte, cada alteração tem revisão e histórico do porquê, e os conflitos são pequenos porque os ramos são curtos — regra prática: um ramo não deve viver mais do que dois ou três dias.' },
  ],
};
