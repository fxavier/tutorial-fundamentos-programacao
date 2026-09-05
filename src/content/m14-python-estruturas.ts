import type { Module } from '../types';

export const m14: Module = {
  id: 'python-estruturas',
  number: 14,
  title: 'Estruturas de dados em Python',
  subtitle: 'Listas, tuplos, dicionários e conjuntos — e como escolher a estrutura certa',
  icon: '🗂️',
  minutes: 60,
  goals: [
    'Dominar listas: índices, fatias, métodos e compreensões',
    'Usar dicionários para associar chaves a valores e contar ocorrências',
    'Distinguir mutável de imutável e perceber as consequências',
    'Escolher a estrutura certa a partir do custo das operações',
    'Implementar pilhas, filas e matrizes com o que a linguagem já traz',
  ],
  sections: [
    {
      id: 'panorama',
      title: 'As quatro estruturas nativas',
      blocks: [
        { type: 'p', text: 'No módulo 8 viste as estruturas de dados em abstrato. Python traz quatro delas embutidas na linguagem, com sintaxe própria — não é preciso importar nada nem implementar nada. Escolher bem entre elas é metade do trabalho de escrever código eficiente.' },
        {
          type: 'table',
          head: ['Estrutura', 'Sintaxe', 'Ordenada?', 'Mutável?', 'Repetidos?', 'Serve para'],
          rows: [
            ['`list`', '`[1, 2, 3]`', 'sim', 'sim', 'sim', 'Sequência que cresce e muda'],
            ['`tuple`', '`(1, 2, 3)`', 'sim', '**não**', 'sim', 'Registo fixo, chave de dicionário'],
            ['`dict`', '`{"a": 1}`', 'sim (inserção)', 'sim', 'chaves únicas', 'Associação chave → valor'],
            ['`set`', '`{1, 2, 3}`', '**não**', 'sim', '**não**', 'Pertença, remover repetidos'],
          ],
        },
        { type: 'callout', tone: 'key', text: 'A pergunta que decide quase sempre: **preciso de procurar por posição ou por nome?** Por posição (o terceiro elemento) → lista. Por nome/identificador (o aluno nº 4712) → dicionário. Só preciso de saber se lá está → conjunto.' },
        { type: 'widget', id: 'python-lab', props: { set: 'estruturas' } },
      ],
    },
    {
      id: 'listas',
      title: 'Listas',
      blocks: [
        { type: 'p', text: 'A lista é o cavalo de batalha de Python: uma sequência ordenada, mutável, que aceita valores de tipos diferentes e cresce conforme necessário. É o equivalente ao vetor do módulo 8, mas sem tamanho fixo.' },
        { type: 'code', lang: 'python', caption: 'índices e fatias', code: `notas = [14, 9, 18, 11, 20, 7]
#         0   1   2   3   4  5      índices positivos
#        -6  -5  -4  -3  -2 -1      índices negativos

print(notas[0], notas[-1])      # 14 7   — o -1 é o último
print(notas[1:4])               # [9, 18, 11]   — do 1 até ao 3
print(notas[:3])                # [14, 9, 18]   — do início
print(notas[3:])                # [11, 20, 7]   — até ao fim
print(notas[::2])               # [14, 18, 20]  — de 2 em 2
print(notas[::-1])              # invertida` },
        { type: 'callout', tone: 'trap', text: 'Numa fatia `lista[a:b]`, o `b` é excluído — tal como no `range`. E `lista[len(lista)]` é sempre `IndexError`: o último índice válido é `len(lista) - 1`.' },
        {
          type: 'table',
          head: ['Método', 'Faz', 'Custo', 'Devolve'],
          rows: [
            ['`append(x)`', 'Acrescenta ao fim', 'O(1)', '`None` (altera a lista)'],
            ['`insert(i, x)`', 'Insere na posição i', 'O(n)', '`None`'],
            ['`pop()` / `pop(i)`', 'Remove e devolve o último / o i-ésimo', 'O(1) / O(n)', 'o elemento'],
            ['`remove(x)`', 'Remove a **primeira** ocorrência de x', 'O(n)', '`None`'],
            ['`sort()`', 'Ordena **no sítio**', 'O(n log n)', '`None`'],
            ['`sorted(lista)`', 'Devolve uma **cópia** ordenada', 'O(n log n)', 'nova lista'],
            ['`reverse()`', 'Inverte no sítio', 'O(n)', '`None`'],
            ['`index(x)`', 'Posição da primeira ocorrência', 'O(n)', 'índice'],
            ['`count(x)`', 'Quantas vezes x aparece', 'O(n)', 'inteiro'],
            ['`x in lista`', 'Pertence?', 'O(n)', '`True`/`False`'],
          ],
        },
        { type: 'callout', tone: 'trap', title: 'Os métodos que devolvem None', text: '`notas = notas.sort()` destrói a lista — `sort()` ordena no sítio e devolve `None`. Ou escreves `notas.sort()` sozinho, ou `notas = sorted(notas)`. O mesmo vale para `append`, `remove` e `reverse`.' },
        { type: 'h', text: 'Cópia: o erro que morde mais tarde' },
        { type: 'code', lang: 'python', caption: 'atribuir não copia', code: `a = [1, 2, 3]
b = a                # b é OUTRO NOME para a MESMA lista
b.append(4)
print(a)             # [1, 2, 3, 4]  ← a também mudou!

c = a.copy()         # ou list(a), ou a[:]
c.append(5)
print(a, c)          # a não mudou
print(a is b, a is c)` },
      ],
    },
    {
      id: 'compreensoes',
      title: 'Compreensões de lista',
      blocks: [
        { type: 'p', text: 'A compreensão de lista (*list comprehension*) é a construção mais característica de Python: transforma um ciclo de quatro linhas numa expressão que se lê como uma frase — "os quadrados de cada n em números".' },
        { type: 'code', lang: 'python', caption: 'o mesmo resultado, duas formas', code: `numeros = [1, 2, 3, 4, 5, 6]

# com ciclo
quadrados = []
for n in numeros:
    quadrados.append(n ** 2)

# com compreensão
quadrados = [n ** 2 for n in numeros]

pares = [n for n in numeros if n % 2 == 0]                 # com filtro
etiquetas = ["par" if n % 2 == 0 else "ímpar" for n in numeros]   # com condição

nomes = ["  ana ", "RUI", " Sara"]
limpos = [n.strip().capitalize() for n in nomes]

print(quadrados, pares, etiquetas, limpos, sep="\\n")` },
        { type: 'callout', tone: 'tip', title: 'A regra prática', text: 'Usa compreensão quando cabe confortavelmente numa linha e faz **uma** transformação. Se precisas de dois `if`, um `try`, ou a linha passa dos ~80 caracteres, um ciclo normal é mais legível. Compreensões aninhadas de três níveis são código para decifrar às 3 da manhã.' },
        { type: 'code', lang: 'python', caption: 'também há para dicionários e conjuntos', code: `palavras = ["casa", "pão", "computador", "a"]

comprimentos = {p: len(p) for p in palavras}      # dict comprehension
iniciais = {p[0] for p in palavras}               # set comprehension
print(comprimentos)
print(iniciais)` },
      ],
    },
    {
      id: 'dicionarios',
      title: 'Dicionários',
      blocks: [
        { type: 'p', text: 'O dicionário associa **chaves** a **valores** e é a estrutura mais usada em Python depois da lista. É a tabela de dispersão (*hash map*) do módulo 8: procurar por chave custa O(1) em média, independentemente do tamanho.' },
        { type: 'code', lang: 'python', caption: 'operações essenciais', code: `aluno = {"nome": "Rui", "curso": "Informática", "notas": [14, 16, 12]}

print(aluno["nome"])                  # KeyError se a chave não existir
print(aluno.get("email"))             # None — não rebenta
print(aluno.get("email", "sem email"))# valor por omissão

aluno["ano"] = 2                      # acrescenta ou substitui
del aluno["curso"]

print("nome" in aluno)                # testa a chave, não o valor
print(list(aluno.keys()))
print(list(aluno.values()))

for chave, valor in aluno.items():    # a forma correta de percorrer
    print(f"{chave}: {valor}")` },
        { type: 'callout', tone: 'key', text: 'As chaves têm de ser **imutáveis**: `str`, `int`, `float`, `bool` e `tuple` servem; `list`, `dict` e `set` não. É por isso que os tuplos existem — `{(41.15, -8.61): "Porto"}` é legal, `{[41.15, -8.61]: "Porto"}` dá `TypeError`.' },
        { type: 'h', text: 'O idioma mais útil: contar' },
        { type: 'code', lang: 'python', caption: 'contar ocorrências', code: `texto = "o rato roeu a rolha da garrafa do rei da russia"
palavras = texto.split()

contagem = {}
for p in palavras:
    contagem[p] = contagem.get(p, 0) + 1      # get com 0 evita o KeyError

print(contagem)

# ordenar por frequência, do mais comum para o menos comum
top = sorted(contagem.items(), key=lambda par: par[1], reverse=True)
print(top[:3])

# a biblioteca-padrão já traz isto feito
from collections import Counter
print(Counter(palavras).most_common(3))` },
        { type: 'h', text: 'Dicionários aninhados' },
        { type: 'code', lang: 'python', caption: 'estruturar dados a sério', code: `turma = {
    "a12": {"nome": "Ana", "notas": [14, 18]},
    "r07": {"nome": "Rui", "notas": [9, 12]},
}

for numero, dados in turma.items():
    media = sum(dados["notas"]) / len(dados["notas"])
    print(f"{numero} — {dados['nome']}: média {media:.1f}")` },
      ],
    },
    {
      id: 'tuplos-conjuntos',
      title: 'Tuplos e conjuntos',
      blocks: [
        { type: 'p', text: 'O **tuplo** é uma lista imutável. Usa-se quando o conjunto de valores forma um registo fixo — um ponto `(x, y)`, uma cor `(r, g, b)`, o resultado de uma função que devolve várias coisas.' },
        { type: 'code', lang: 'python', caption: 'tuplos e desempacotamento', code: `ponto = (3, 7)
x, y = ponto                       # desempacotamento
print(x, y)

a, b = 1, 2
a, b = b, a                        # troca sem variável auxiliar
print(a, b)

def minmax(v):
    return min(v), max(v)          # devolve um tuplo

menor, maior = minmax([4, 8, 15, 16, 23])
print(menor, maior)

primeiro, *resto = [1, 2, 3, 4]    # desempacotamento com resto
print(primeiro, resto)` },
        { type: 'p', text: 'O **conjunto** (`set`) não guarda ordem nem repetidos, e responde a "está cá?" em O(1). É a estrutura certa para remover duplicados e para comparar coleções.' },
        { type: 'code', lang: 'python', caption: 'conjuntos', code: `emails = ["a@x.pt", "b@x.pt", "a@x.pt", "c@x.pt"]
unicos = set(emails)
print(len(emails), len(unicos))

inscritos = {"Ana", "Rui", "Sara"}
presentes = {"Rui", "Sara", "Tomás"}

print(inscritos & presentes)   # interseção: quem estava inscrito e veio
print(inscritos - presentes)   # diferença: inscritos que faltaram
print(presentes - inscritos)   # veio sem estar inscrito
print(inscritos | presentes)   # união
print(inscritos ^ presentes)   # só num dos dois` },
        { type: 'callout', tone: 'tip', title: 'A troca que salva programas lentos', text: 'Testar `x in lista` percorre a lista toda: O(n). Testar `x in conjunto` é O(1). Num ciclo sobre 10 000 elementos a verificar pertença a uma lista de 10 000, são 100 milhões de comparações; com um conjunto, são 10 000. Converter a lista para conjunto **uma vez** antes do ciclo resolve.' },
      ],
    },
    {
      id: 'pilhas-filas-matrizes',
      title: 'Pilhas, filas e matrizes',
      blocks: [
        { type: 'p', text: 'As estruturas do módulo 8 não precisam de bibliotecas: constroem-se com o que a linguagem já traz.' },
        { type: 'code', lang: 'python', caption: 'pilha (LIFO) e fila (FIFO)', code: `# Pilha: uma lista basta — append e pop trabalham no fim, ambos O(1)
pilha = []
pilha.append("página 1")
pilha.append("página 2")
pilha.append("página 3")
print("voltar ->", pilha.pop())      # página 3
print("resta:", pilha)

# Fila: usar list.pop(0) é O(n) porque desloca tudo. deque é O(1).
from collections import deque
fila = deque(["Ana", "Rui"])
fila.append("Sara")                  # entra no fim
print("atendido ->", fila.popleft()) # sai do início
print("resta:", list(fila))` },
        { type: 'code', lang: 'python', caption: 'matrizes: listas de listas', code: `matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(matriz[1][2])                        # linha 1, coluna 2 -> 6
print([linha[0] for linha in matriz])      # primeira coluna

for linha in matriz:
    print(" ".join(f"{v:3}" for v in linha))

# diagonal principal e soma total
print(sum(matriz[i][i] for i in range(3)))
print(sum(sum(linha) for linha in matriz))` },
        { type: 'callout', tone: 'trap', title: 'A armadilha do `[[0] * 3] * 3`', text: 'Multiplicar uma lista de listas **repete a referência**, não o conteúdo: as três linhas são a mesma lista, e mudar `m[0][0]` muda as três. A forma correta é uma compreensão: `[[0] * 3 for _ in range(3)]`.' },
        { type: 'code', lang: 'python', caption: 'ver o problema a acontecer', code: `errado = [[0] * 3] * 3
errado[0][0] = 9
print(errado)         # [[9,0,0],[9,0,0],[9,0,0]]  ← as três mudaram

certo = [[0] * 3 for _ in range(3)]
certo[0][0] = 9
print(certo)          # [[9,0,0],[0,0,0],[0,0,0]]` },
      ],
    },
    {
      id: 'escolher',
      title: 'Escolher a estrutura certa',
      blocks: [
        {
          type: 'table',
          head: ['Operação', '`list`', '`dict`', '`set`', '`deque`'],
          rows: [
            ['Aceder por índice', 'O(1)', '—', '—', 'O(n)'],
            ['Aceder por chave', '—', 'O(1)', '—', '—'],
            ['`x in ...`', 'O(n)', 'O(1)', 'O(1)', 'O(n)'],
            ['Inserir no fim', 'O(1)', 'O(1)', 'O(1)', 'O(1)'],
            ['Inserir/remover no início', 'O(n)', '—', '—', '**O(1)**'],
            ['Remover por valor', 'O(n)', 'O(1) por chave', 'O(1)', 'O(n)'],
            ['Manter ordem', 'sim', 'sim (inserção)', '**não**', 'sim'],
          ],
        },
        {
          type: 'steps',
          items: [
            { title: 'Precisas de ordem e de aceder por posição?', text: 'Lista. Se também inseres e removes no início com frequência, `deque`.' },
            { title: 'Procuras por um identificador?', text: 'Dicionário. Procurar num dicionário de um milhão de chaves custa o mesmo que num de dez.' },
            { title: 'Só precisas de saber se um valor já apareceu?', text: 'Conjunto. É a estrutura para deduplicar e para testar pertença.' },
            { title: 'Os valores nunca mudam e formam um registo?', text: 'Tuplo. E só um tuplo pode ser chave de dicionário ou elemento de conjunto.' },
          ],
        },
        { type: 'callout', tone: 'key', text: 'A diferença entre um programa que demora 10 ms e outro que demora 10 s raramente está no algoritmo exótico — está em ter usado uma lista onde devia estar um dicionário ou um conjunto. É a aplicação prática direta do módulo 9.' },
      ],
    },
  ],
  quiz: [
    { id: 'pe1', prompt: 'Que valor tem `[10, 20, 30, 40][1:3]`?', options: ['`[20, 30]`', '`[10, 20, 30]`', '`[20, 30, 40]`', '`[10, 20]`'], answer: 0, explain: 'A fatia começa no índice 1 (inclusive) e termina no 3 (exclusivo), logo apanha os índices 1 e 2: `[20, 30]`.' },
    { id: 'pe2', prompt: 'Depois de `a = [1, 2]` e `b = a`, o que faz `b.append(3)` a `a`?', options: ['Nada, `a` continua `[1, 2]`', '`a` passa a `[1, 2, 3]`', 'Dá erro', 'Depende da versão de Python'], answer: 1, explain: 'A atribuição não copia: `a` e `b` são dois nomes para o mesmo objeto. Para copiar é preciso `a.copy()`, `list(a)` ou `a[:]`.' },
    { id: 'pe3', prompt: 'Qual é o resultado de `notas = notas.sort()`?', options: ['A lista ordenada', '`notas` fica com `None`', 'Uma cópia ordenada', 'Erro de sintaxe'], answer: 1, explain: '`sort()` ordena no sítio e devolve `None`. Ou se chama `notas.sort()` isolado, ou se usa `notas = sorted(notas)`.' },
    { id: 'pe4', prompt: 'Que estrutura devolve `{p: len(p) for p in ["a", "bb"]}`?', options: ['Uma lista', 'Um conjunto', 'Um dicionário', 'Um tuplo'], answer: 2, explain: 'É uma compreensão de dicionário: a sintaxe `chave: valor` dentro de chavetas produz `{"a": 1, "bb": 2}`.' },
    { id: 'pe5', prompt: 'Porque é que uma lista não pode ser chave de dicionário?', options: ['Porque é demasiado grande', 'Porque é mutável e o valor da dispersão mudaria', 'Porque só se admitem strings', 'Pode, desde que tenha menos de 10 elementos'], answer: 1, explain: 'As chaves têm de ser imutáveis para que o valor de dispersão (hash) se mantenha estável. Um tuplo serve; uma lista não.' },
    { id: 'pe6', prompt: 'Para testar 10 000 vezes se um valor pertence a uma coleção de 10 000 elementos, o que é mais rápido?', options: ['Uma lista', 'Um conjunto', 'É igual', 'Um tuplo'], answer: 1, explain: '`in` numa lista é O(n) — 100 milhões de comparações no total. Num conjunto é O(1) em média — 10 000. É a otimização mais rentável do dia a dia.' },
    { id: 'pe7', prompt: 'Que problema tem `grelha = [[0] * 3] * 3`?', options: ['Nenhum', 'As três linhas são o mesmo objeto: mudar uma muda todas', 'Cria uma lista de 9 elementos', 'Dá TypeError'], answer: 1, explain: 'A multiplicação repete a referência. A forma correta é `[[0] * 3 for _ in range(3)]`, que cria três listas distintas.' },
    { id: 'pe8', prompt: 'Qual é a estrutura certa para uma fila de atendimento com muitas entradas e saídas?', options: ['`list` com `pop(0)`', '`collections.deque`', '`set`', '`tuple`'], answer: 1, explain: '`list.pop(0)` é O(n) porque desloca todos os elementos. `deque` insere e remove em O(1) nas duas pontas — é a implementação certa de uma fila.' },
  ],
  exercises: [
    {
      id: 'e14-1', difficulty: 1, kind: 'predict', title: 'Fatias',
      statement: 'Escreve a saída exata deste código.',
      code: `v = [10, 20, 30, 40, 50]
print(v[1:4], v[-2:], v[::2])`,
      accept: ['[20, 30, 40] [40, 50] [10, 30, 50]'],
      hint: 'O limite superior é sempre excluído; `-2:` são os dois últimos; `::2` salta de 2 em 2.',
      solution: '`[20, 30, 40] [40, 50] [10, 30, 50]`. A fatia `[1:4]` apanha os índices 1, 2 e 3; `[-2:]` começa no penúltimo e vai até ao fim; `[::2]` percorre tudo com passo 2.',
    },
    {
      id: 'e14-2', difficulty: 2, kind: 'predict', title: 'Aliasing',
      statement: 'Que imprime este código? Pensa bem no que `b = a` faz.',
      code: `a = [1, 2, 3]
b = a
c = a.copy()
b.append(4)
c.append(5)
print(a)
print(c)`,
      accept: ['[1, 2, 3, 4] [1, 2, 3, 5]', '[1,2,3,4][1,2,3,5]'],
      hint: '`b = a` cria um nome novo, não uma lista nova. `copy()` cria uma lista nova.',
      solution: 'Imprime `[1, 2, 3, 4]` e `[1, 2, 3, 5]`. O `append` em `b` alterou a lista que `a` também refere; o `append` em `c` alterou apenas a cópia. É a diferença entre **referência** e **cópia** — a causa de muitos erros difíceis de encontrar.',
    },
    {
      id: 'e14-3', difficulty: 2, kind: 'predict', title: 'Contar com dicionário',
      statement: 'Qual é o dicionário impresso?',
      code: `texto = "banana"
c = {}
for letra in texto:
    c[letra] = c.get(letra, 0) + 1
print(c)`,
      accept: ["{'b': 1, 'a': 3, 'n': 2}", '{b: 1, a: 3, n: 2}'],
      hint: 'A ordem é a de **primeira inserção**: b, a, n.',
      solution: "`{'b': 1, 'a': 3, 'n': 2}`. Desde o Python 3.7 os dicionários preservam a ordem de inserção, por isso o `b` aparece primeiro. O `get(letra, 0)` devolve 0 na primeira vez que cada letra aparece, evitando o `KeyError`.",
    },
    {
      id: 'e14-4', difficulty: 2, kind: 'predict', title: 'Conjuntos',
      statement: 'Que valores imprime?',
      code: `a = {1, 2, 3, 4}
b = {3, 4, 5}
print(sorted(a & b), sorted(a - b), sorted(a | b))`,
      accept: ['[3, 4] [1, 2] [1, 2, 3, 4, 5]'],
      hint: '`&` é interseção, `-` é diferença, `|` é união. O `sorted` só serve para a saída ser previsível.',
      solution: '`[3, 4] [1, 2] [1, 2, 3, 4, 5]`. Sem o `sorted` a ordem de um conjunto não é garantida — é por isso que se ordena antes de imprimir num exercício de previsão.',
    },
    {
      id: 'e14-5', difficulty: 2, kind: 'code', title: 'Agenda telefónica',
      statement: 'No laboratório, cria um dicionário `agenda` com pelo menos quatro contactos (nome → telefone). Depois escreve funções `adicionar(nome, numero)`, `procurar(nome)` (que devolva uma mensagem simpática se não existir) e `listar()` (que imprima os contactos ordenados por nome).',
      hint: 'Usa `.get()` em `procurar` e `sorted(agenda.items())` em `listar`.',
      solution: `agenda = {"Ana": "912345678", "Rui": "934567890", "Sara": "961112233", "Tomás": "925556677"}

def adicionar(nome, numero):
    agenda[nome] = numero

def procurar(nome):
    return agenda.get(nome, f"{nome} não está na agenda.")

def listar():
    for nome, numero in sorted(agenda.items()):
        print(f"{nome:<8} {numero}")

adicionar("Inês", "938887766")
print(procurar("Rui"))
print(procurar("Zé"))
listar()`,
    },
    {
      id: 'e14-6', difficulty: 3, kind: 'code', title: 'Palavras mais frequentes',
      statement: 'Escreve uma função `top_palavras(texto, n=3)` que devolva as `n` palavras mais frequentes de um texto, ignorando maiúsculas/minúsculas e pontuação, e ignorando palavras com 2 ou menos letras. Testa com um parágrafo à tua escolha.',
      hint: 'Passa tudo a minúsculas, substitui a pontuação por espaços, usa um dicionário para contar e ordena com `key=lambda par: par[1]`.',
      solution: `def top_palavras(texto, n=3):
    for sinal in ".,;:!?()\\"'":
        texto = texto.replace(sinal, " ")
    contagem = {}
    for p in texto.lower().split():
        if len(p) > 2:
            contagem[p] = contagem.get(p, 0) + 1
    return sorted(contagem.items(), key=lambda par: par[1], reverse=True)[:n]

texto = "O rato roeu a rolha. O rato fugiu, e a rolha ficou; o rato voltou."
print(top_palavras(texto))
print(top_palavras(texto, n=1))`,
    },
  ],
};
