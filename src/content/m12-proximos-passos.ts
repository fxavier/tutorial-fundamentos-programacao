import type { Module } from '../types';

export const m12: Module = {
  id: 'proximos-passos',
  number: 12,
  title: 'Próximos passos',
  subtitle: 'Um plano de estudo realista, projetos para praticar e recursos de confiança',
  icon: '🚀',
  minutes: 25,
  goals: [
    'Definir um percurso de estudo para os próximos seis meses',
    'Escolher uma área e a linguagem correspondente',
    'Ter uma lista de projetos práticos de dificuldade crescente',
    'Conhecer fontes fiáveis e evitar as armadilhas mais comuns',
  ],
  sections: [
    {
      id: 'onde-estas',
      title: 'O que já sabes',
      blocks: [
        { type: 'p', text: 'Se percorreste os onze módulos anteriores, tens hoje uma base que muita gente que já programa nunca chegou a construir: sabes o que acontece por baixo do código, sabes raciocinar sobre custo, e sabes escrever e validar um algoritmo antes de o programar.' },
        { type: 'p', text: 'O que falta é **volume de prática**. Não existe atalho: programar aprende-se a programar, tal como uma língua se aprende a falar. A boa notícia é que a partir daqui o progresso é visível de semana para semana.' },
        { type: 'callout', tone: 'key', title: 'A regra dos 30 minutos', text: 'Trinta minutos por dia, todos os dias, produzem muito mais do que oito horas ao sábado. A programação exige carregar contexto na cabeça, e a repetição frequente é o que consolida. Consistência bate intensidade.' },
      ],
    },
    {
      id: 'escolher-area',
      title: 'Escolher uma área',
      blocks: [
        {
          type: 'table',
          head: ['Área', 'O que se faz', 'Tecnologias base', 'Primeiro projeto típico'],
          rows: [
            ['**Desenvolvimento web (frontend)**', 'Interfaces que as pessoas usam no browser', 'HTML, CSS, JavaScript, React', 'Página pessoal, depois uma app de tarefas'],
            ['**Backend**', 'Servidores, APIs, bases de dados, regras de negócio', 'Java/Spring, Python/FastAPI, Go, SQL', 'API REST com autenticação'],
            ['**Dados e IA**', 'Analisar, visualizar e modelar dados', 'Python, pandas, SQL, scikit-learn', 'Análise de um conjunto de dados público'],
            ['**Mobile**', 'Aplicações para telemóvel', 'Kotlin, Swift, Flutter, React Native', 'App de notas com armazenamento local'],
            ['**DevOps / Infraestrutura**', 'Automatizar entrega, escalar sistemas', 'Linux, Docker, Kubernetes, Terraform, CI/CD', 'Publicar uma app com pipeline automático'],
            ['**Sistemas embebidos**', 'Software para dispositivos e sensores', 'C, C++, Rust, Arduino', 'Estação meteorológica com sensores'],
          ],
        },
        { type: 'callout', tone: 'tip', text: 'Não tentes decidir "para sempre". Escolhe a que te dá mais curiosidade agora e dá-lhe seis meses. As bases são comuns a todas: mudar de área mais tarde custa semanas, não anos.' },
      ],
    },
    {
      id: 'plano',
      title: 'Um plano de seis meses',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'Mês 1 — Sintaxe de uma linguagem', text: 'Escolhe uma (Python é a recomendação por omissão) e transporta para ela tudo o que fizeste em Portugol: variáveis, condições, ciclos, funções, listas. Objetivo: resolver 30 a 50 exercícios pequenos sem consultar sintaxe a cada linha.' },
            { title: 'Mês 2 — Estruturas de dados e ficheiros', text: 'Listas, dicionários, conjuntos, ler e escrever ficheiros CSV e JSON. Objetivo: um programa de linha de comandos que faça algo genuinamente útil para ti.' },
            { title: 'Mês 3 — Git, testes e código limpo', text: 'Publica tudo o que escreves no GitHub, com commits pequenos. Escreve os primeiros testes automáticos. Refatora código antigo teu — vais ficar surpreendido.' },
            { title: 'Mês 4 — Bases de dados e SQL', text: 'Modelação relacional, SELECT com junções, agregações, índices. Seja qual for a tua área, SQL vai aparecer.' },
            { title: 'Mês 5 — A tua área específica', text: 'Web, dados, mobile ou infraestrutura. Segue um curso estruturado e constrói ao mesmo tempo.' },
            { title: 'Mês 6 — Um projeto a sério', text: 'Algo com várias partes, publicado e documentado com um README decente. É este projeto que vais mostrar a alguém.' },
          ],
        },
      ],
    },
    {
      id: 'projetos',
      title: 'Projetos por ordem de dificuldade',
      blocks: [
        { type: 'p', text: 'Cursos ensinam; projetos consolidam. Constrói na ordem, e não avances antes de terminar o anterior — terminar é uma competência em si.' },
        {
          type: 'list', ordered: true, items: [
            '**Calculadora de linha de comandos** com as quatro operações, validação de entrada e menu. Consolida ciclos e condições.',
            '**Jogo de adivinhar o número**, com contagem de tentativas e pistas. Consolida ciclos e comparações.',
            '**Gestor de tarefas** que guarda num ficheiro e sobrevive a fechar o programa. Introduz persistência.',
            '**Analisador de um CSV**: lê um ficheiro real (despesas, notas, um conjunto de dados público) e produz estatísticas.',
            '**Cliente de uma API pública** (meteorologia, câmbios): faz um pedido HTTP, lê JSON e apresenta o resultado.',
            '**Uma API REST tua** com quatro operações e base de dados. Introduz servidores e modelação.',
            '**Aplicação web completa** com interface, backend e autenticação, publicada online.',
          ],
        },
        { type: 'callout', tone: 'trap', title: 'A armadilha dos tutoriais', text: 'Ver vídeos e seguir tutoriais dá uma sensação de progresso que não corresponde a competência. O teste é simples: fecha o tutorial e constrói qualquer coisa parecida sozinho. Se não conseguires, ainda não aprendeste — e não faz mal, é o sinal para voltar atrás e praticar.' },
      ],
    },
    {
      id: 'recursos',
      title: 'Recursos que valem a pena',
      blocks: [
        { type: 'h', text: 'Documentação oficial (a primeira paragem, sempre)' },
        {
          type: 'list', items: [
            '[Documentação de Python](https://docs.python.org/pt-br/3/) — completa e com tutorial oficial',
            '[MDN Web Docs](https://developer.mozilla.org/pt-BR/) — a referência para HTML, CSS e JavaScript',
            '[Documentação de Java](https://docs.oracle.com/en/java/) e [Spring](https://spring.io/guides)',
            '[A Tour of Go](https://go.dev/tour/) — a melhor introdução interativa a uma linguagem que existe',
            '[Git Book](https://git-scm.com/book/pt-pt/v2) — o livro oficial do Git, em português',
            '[PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) — SQL a partir da fonte',
          ],
        },
        { type: 'h', text: 'Prática' },
        {
          type: 'list', items: [
            '[Exercism](https://exercism.org/) — exercícios com mentoria humana, em dezenas de linguagens',
            '[Codewars](https://www.codewars.com/) — desafios curtos e progressivos',
            '[LeetCode](https://leetcode.com/) — algoritmos e estruturas de dados, útil para entrevistas',
            '[Advent of Code](https://adventofcode.com/) — 25 problemas por ano, excelentes para consolidar lógica',
            '[The Odin Project](https://www.theodinproject.com/) — currículo completo e gratuito de desenvolvimento web',
            '[CS50 de Harvard](https://cs50.harvard.edu/x/) — o melhor curso introdutório de informática, gratuito',
          ],
        },
        { type: 'h', text: 'Livros de referência' },
        {
          type: 'list', items: [
            '*Código Limpo* (Robert C. Martin) — sobre escrever código legível',
            '*O Programador Pragmático* (Hunt & Thomas) — hábitos profissionais',
            '*Introduction to Algorithms* (Cormen et al.) — a referência de algoritmos, para consultar, não para ler de fio a pavio',
            '*Designing Data-Intensive Applications* (Kleppmann) — quando chegares a sistemas distribuídos',
          ],
        },
      ],
    },
    {
      id: 'habitos',
      title: 'Hábitos que fazem a diferença',
      blocks: [
        {
          type: 'compare',
          left: { title: 'Faz', items: ['Escreve código todos os dias, mesmo que pouco', 'Lê código de outras pessoas em projetos abertos', 'Explica o que aprendeste a alguém — ou escreve sobre isso', 'Termina os projetos, mesmo os imperfeitos', 'Aceita ficar confuso: é o estado normal de quem aprende', 'Faz pausas quando estás bloqueado — a solução costuma aparecer longe do teclado'] },
          right: { title: 'Evita', items: ['Comparar o teu mês 1 com o ano 10 de outra pessoa', 'Saltar de linguagem em linguagem sem dominar nenhuma', 'Copiar código que não consegues explicar', 'Ficar em cursos sem nunca construir nada', 'Estudar só teoria à espera de "estar pronto"', 'Desistir num bug — é precisamente aí que se aprende'] },
        },
        { type: 'callout', tone: 'key', title: 'Uma última coisa', text: 'Toda a gente que programa bem passou por onde tu estás agora, incluindo a sensação de que todos os outros percebem menos mal do que tu. A diferença entre quem aprende e quem desiste raramente é talento: é continuar a aparecer depois do dia em que nada funcionou.' },
      ],
    },
  ],
  quiz: [
    { id: 'n1', prompt: 'Qual é a forma mais eficaz de consolidar o que aprendes?', options: ['Ver mais vídeos', 'Construir projetos sozinho, sem tutorial', 'Ler documentação de cabo a rabo', 'Decorar sintaxe'], answer: 1, explain: 'A produção ativa, com as dificuldades que traz, é o que transforma reconhecimento em competência.' },
    { id: 'n2', prompt: 'Trinta minutos por dia comparados com quatro horas ao sábado…', options: ['são equivalentes', 'são menos eficazes', 'são mais eficazes, pela frequência e consolidação', 'só funcionam para iniciantes'], answer: 2, explain: 'A prática distribuída consolida muito melhor do que sessões longas e espaçadas.' },
    { id: 'n3', prompt: 'Qual destas competências é útil praticamente em todas as áreas?', options: ['Programação de shaders', 'SQL', 'Assembly', 'Desenvolvimento de jogos'], answer: 1, explain: 'Praticamente todos os sistemas guardam dados numa base de dados relacional; SQL aparece em web, dados, backend e infraestrutura.' },
    { id: 'n4', prompt: 'Sinal de que ainda não aprendeste um tópico:', options: ['Não decoraste a sintaxe', 'Não consegues construir algo parecido sem seguir o tutorial', 'Demoraste mais do que o vídeo', 'Precisaste de consultar a documentação'], answer: 1, explain: 'Consultar documentação é normal e profissional. Depender do tutorial para reproduzir o resultado é que indica que falta prática.' },
  ],
  exercises: [
    { id: 'e12-1', difficulty: 1, kind: 'open', title: 'O teu plano', statement: 'Escreve o teu plano dos próximos três meses: que linguagem, quantos minutos por dia, que dois projetos vais construir e como vais saber que os terminaste.', solution: 'Não há resposta certa — mas um bom plano é específico e verificável. Exemplo: "Python, 40 minutos por dia às 7h00, antes do trabalho. Projeto 1 (semanas 1–5): programa de linha de comandos que lê o extrato bancário em CSV e mostra despesas por categoria. Projeto 2 (semanas 6–12): API REST com FastAPI e SQLite para gerir esse orçamento, com testes e README. Critério de conclusão: publicado no GitHub, com README que outra pessoa consiga seguir para o correr." Repara nos elementos: hora fixa, âmbito delimitado, e um critério objetivo de "terminado".' },
    { id: 'e12-2', difficulty: 2, kind: 'open', title: 'Revisão geral', statement: 'Sem consultar, explica por palavras tuas: (a) porque é que os computadores usam binário; (b) o que é encapsulamento no modelo OSI; (c) porque é que O(n²) é problemático com dados grandes; (d) para que serve um teste de mesa.', hint: 'Se alguma resposta não sair com fluência, volta ao módulo correspondente — é para isso que serve este exercício.', solution: '(a) Porque um transístor distingue de forma fiável dois estados (conduz ou não conduz); distinguir dez níveis de tensão seria caro e sensível ao ruído. (b) Cada camada acrescenta o seu cabeçalho aos dados que recebe da camada acima, como envelopes dentro de envelopes; no destino, cada camada retira apenas o seu. (c) Porque o custo cresce com o quadrado da entrada: multiplicar os dados por 10 multiplica o tempo por 100, o que transforma segundos em horas. (d) Para simular o algoritmo à mão, registando o valor de cada variável a cada passo, e apanhar erros de lógica antes de escrever código.' },
  ],
};
