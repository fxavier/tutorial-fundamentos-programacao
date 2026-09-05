import type { Module } from '../types';

export const m13: Module = {
  id: 'python',
  number: 13,
  title: 'Fundamentos de Python',
  subtitle: 'Da lógica que já conheces para código real que corre — sintaxe, tipos, decisões, ciclos e funções',
  icon: '🐍',
  minutes: 65,
  goals: [
    'Escrever, correr e depurar programas Python dentro do browser',
    'Usar os tipos primitivos, a conversão entre eles e as f-strings',
    'Traduzir para Python tudo o que já sabes fazer em Portugol',
    'Escrever funções com parâmetros, valores por omissão e valor de retorno',
    'Ler uma mensagem de erro e perceber onde está o problema',
  ],
  sections: [
    {
      id: 'porque-python',
      title: 'Porquê Python',
      blocks: [
        { type: 'p', text: 'Até aqui escreveste algoritmos em Portugol: pseudocódigo feito para aprender, não para trabalhar. Python é o passo seguinte natural — é uma linguagem real, usada em ciência de dados, inteligência artificial, automação, web e ensino, e a sua sintaxe é a mais próxima do pseudocódigo entre as linguagens populares.' },
        {
          type: 'compare',
          left: { title: 'O que Python te dá', items: ['Sintaxe curta: menos cerimónia, mais lógica', 'Tipagem dinâmica — não declaras tipos', 'Uma biblioteca-padrão enorme', 'Ecossistema científico: pandas, numpy, scikit-learn', 'Interpretado: escreves e corres, sem compilar'] },
          right: { title: 'O que Python te cobra', items: ['Mais lento do que C, Java ou Go', 'Erros de tipo só aparecem em execução', 'A indentação é sintaxe — um espaço a mais é um erro', 'Consumo de memória elevado por objeto', 'Concorrência limitada pelo GIL'] },
        },
        { type: 'callout', tone: 'key', text: 'A lógica não muda de linguagem para linguagem. `se`/`entao` passa a `if`/`:`, `enquanto` passa a `while`, `escreval` passa a `print`. O que aprendeste nos módulos 5 a 9 continua todo válido — só muda a forma de escrever.' },
        {
          type: 'table',
          head: ['Portugol', 'Python', 'Nota'],
          rows: [
            ['`escreval("Olá")`', '`print("Olá")`', 'Muda a linha automaticamente'],
            ['`leia(x)`', '`x = input()`', '`input()` devolve **sempre** texto'],
            ['`x <- 5`', '`x = 5`', 'Atribuição com um único `=`'],
            ['`se x > 3 entao ... fimse`', '`if x > 3:` + indentação', 'Sem `fimse`: o fim é a indentação'],
            ['`enquanto c faca ... fimenquanto`', '`while c:`', ''],
            ['`para i de 1 ate 10 faca`', '`for i in range(1, 11):`', '`range` exclui o limite superior'],
            ['`funcao f(x) : inteiro`', '`def f(x):`', 'Sem declaração de tipos'],
            ['`e`, `ou`, `nao`', '`and`, `or`, `not`', ''],
            ['`verdadeiro`, `falso`', '`True`, `False`', 'Com maiúscula inicial'],
          ],
        },
      ],
    },
    {
      id: 'primeiro-programa',
      title: 'O primeiro programa',
      blocks: [
        { type: 'p', text: 'O laboratório abaixo corre **Python 3 a sério** — o mesmo interpretador CPython que corre num servidor, compilado para WebAssembly e a executar dentro do teu browser. Não é uma simulação. Na primeira execução demora alguns segundos a carregar o interpretador; a partir daí é instantâneo.' },
        { type: 'callout', tone: 'tip', title: 'Como usar o laboratório', text: 'Escolhe um exemplo no menu, carrega em **▶ Executar** (ou Ctrl/Cmd + Enter), altera o código e volta a correr. Se escreveres um ciclo infinito, o botão **■ Parar** mata o interpretador sem perderes a página. A caixa **Entrada** serve para os `input()`: uma linha por cada chamada.' },
        { type: 'widget', id: 'python-lab', props: { set: 'basico' } },
        { type: 'p', text: 'Repara em três coisas no primeiro exemplo: não há declaração de variáveis, não há tipos escritos, e não há chavetas nem `fim`. O que delimita um bloco é a **indentação** — os espaços à esquerda.' },
        { type: 'code', lang: 'python', caption: 'a indentação é sintaxe, não estética', code: `idade = 20

if idade >= 18:
    print("Maior de idade")      # dentro do if — 4 espaços
    print("Pode votar")          # ainda dentro do if
print("Fim do programa")         # fora do if: corre sempre` },
        { type: 'callout', tone: 'trap', title: 'O erro nº 1 de quem chega a Python', text: 'Misturar tabulações e espaços, ou indentar de forma inconsistente, dá `IndentationError` ou — pior — código que corre mas faz outra coisa. A convenção universal é **4 espaços**, nunca tabulações. No laboratório, a tecla Tab já insere 4 espaços.' },
      ],
    },
    {
      id: 'variaveis-tipos',
      title: 'Variáveis, tipos e conversões',
      blocks: [
        { type: 'p', text: 'Em Python não declaras o tipo: a variável recebe o tipo do valor que lhe atribuis, e pode mudar. Diz-se que a tipagem é **dinâmica** (o tipo é do valor, não da variável) e **forte** (não somas texto com número sem converter).' },
        { type: 'code', lang: 'python', caption: 'os tipos primitivos', code: `n = 42                 # int    — inteiro, sem limite de tamanho
preco = 19.99          # float  — vírgula flutuante (IEEE 754, módulo 3)
nome = "Ana"           # str    — texto
ativo = True           # bool   — True ou False
nada = None            # NoneType — ausência de valor

print(type(n), type(preco), type(nome), type(ativo), type(nada))` },
        {
          type: 'table',
          head: ['Tipo', 'Exemplo', 'Mutável?', 'Usa quando'],
          rows: [
            ['`int`', '`0`, `-7`, `10**30`', 'não', 'Contagens, índices, quantidades exatas'],
            ['`float`', '`3.14`, `1e-9`', 'não', 'Medidas, médias, tudo o que é aproximado'],
            ['`str`', '`"olá"`, `\'a\'`', 'não', 'Texto — em Python não há tipo carácter'],
            ['`bool`', '`True`, `False`', 'não', 'Condições e sinalizadores'],
            ['`None`', '`None`', '—', '"ainda não há valor", "não encontrado"'],
            ['`list`', '`[1, 2, 3]`', '**sim**', 'Sequências que mudam (módulo 14)'],
            ['`dict`', '`{"a": 1}`', '**sim**', 'Associação chave → valor (módulo 14)'],
          ],
        },
        { type: 'h', text: 'Conversão de tipos' },
        { type: 'p', text: '`input()` devolve **sempre** uma `str`, mesmo que o utilizador escreva `42`. Esquecer a conversão é a origem de metade dos erros dos primeiros programas.' },
        { type: 'code', lang: 'python', caption: 'converter antes de calcular', code: `idade = input("Idade: ")        # "20"  ← isto é texto!
print(idade + 1)                # TypeError: can only concatenate str

idade = int(input("Idade: "))   # 20    ← agora é inteiro
print(idade + 1)                # 21

# int() trunca, não arredonda; round() arredonda
print(int(7.9), round(7.9))     # 7 8
print(float("3.5"), str(10) + "€", bool(0), bool("x"))` },
        { type: 'callout', tone: 'trap', text: 'Em Python `"5" * 3` não é 15 — é `"555"`. O operador `*` entre texto e inteiro repete o texto. É legal, corre sem erro, e dá um resultado errado se te esqueceste do `int()`.' },
        { type: 'h', text: 'f-strings: a forma moderna de compor texto' },
        { type: 'code', lang: 'python', caption: 'f-strings', code: `nome, saldo, taxa = "Ana", 1234.5678, 0.075

print("Olá, " + nome + "! Saldo: " + str(saldo))   # a forma antiga e desajeitada
print(f"Olá, {nome}! Saldo: {saldo}")              # f-string
print(f"Saldo: {saldo:.2f} €")                     # 2 casas decimais
print(f"Taxa: {taxa:.1%}")                         # percentagem
print(f"{'Produto':<12}{'Preço':>8}")              # alinhamento em colunas
print(f"{nome=}, {saldo=}")                        # depuração: mostra nome e valor` },
      ],
    },
    {
      id: 'operadores',
      title: 'Operadores e strings',
      blocks: [
        {
          type: 'table',
          head: ['Operador', 'Faz', 'Exemplo', 'Resultado'],
          rows: [
            ['`+ - *`', 'Soma, subtração, produto', '`3 * 4`', '`12`'],
            ['`/`', 'Divisão — devolve **sempre** float', '`7 / 2`', '`3.5`'],
            ['`//`', 'Divisão inteira (arredonda para baixo)', '`7 // 2`', '`3`'],
            ['`%`', 'Resto', '`7 % 2`', '`1`'],
            ['`**`', 'Potência', '`2 ** 10`', '`1024`'],
            ['`== !=`', 'Igual / diferente', '`3 == 3.0`', '`True`'],
            ['`< <= > >=`', 'Comparações (encadeáveis)', '`0 < x <= 10`', '`True`/`False`'],
            ['`and or not`', 'Lógicos, com curto-circuito', '`a and b`', ''],
            ['`in`', 'Pertence a', '`"a" in "casa"`', '`True`'],
            ['`is`', 'É o **mesmo objeto**', '`x is None`', ''],
          ],
        },
        { type: 'callout', tone: 'trap', title: '`==` compara valores, `is` compara identidade', text: 'Usa `==` para valores e reserva `is` para `None`, `True` e `False`. `a == b` pergunta "têm o mesmo valor?"; `a is b` pergunta "são o mesmo objeto em memória?". Com listas iguais mas distintas, `==` é `True` e `is` é `False`.' },
        { type: 'h', text: 'Strings: o essencial' },
        { type: 'code', lang: 'python', caption: 'operações sobre texto', code: `s = "  Fundamentos de Programação  "

print(len(s))                 # comprimento, com os espaços
print(s.strip())              # remove espaços nas pontas
print(s.strip().lower())      # minúsculas
print(s.strip().upper())
print(s.replace("Programação", "Python").strip())
print(s.strip().split(" "))   # divide em lista de palavras
print("-".join(["a", "b", "c"]))
print(s.strip()[0], s.strip()[-1], s.strip()[:11])   # índices e fatias
print("Prog" in s, s.strip().startswith("Fund"))` },
        { type: 'callout', tone: 'key', text: 'As strings são **imutáveis**: `s.upper()` não altera `s`, devolve uma string nova. Se não guardares o resultado, ele perde-se. Isto vale para todos os métodos de `str`.' },
      ],
    },
    {
      id: 'decisao',
      title: 'Decisão: if, elif, else',
      blocks: [
        { type: 'code', lang: 'python', caption: 'a estrutura completa', code: `nota = 15

if nota >= 18:
    mencao = "Excelente"
elif nota >= 14:            # só é testado se o anterior for falso
    mencao = "Bom"
elif nota >= 10:
    mencao = "Suficiente"
else:
    mencao = "Insuficiente"

print(mencao)

# forma condensada (operador ternário)
estado = "aprovado" if nota >= 10 else "reprovado"
print(estado)` },
        { type: 'p', text: 'A ordem das condições importa: `elif` só é avaliado quando todos os anteriores falharam. Se puseres `nota >= 10` em primeiro lugar, um 18 nunca chega a "Excelente" — é o erro clássico das cascatas de condições.' },
        { type: 'h', text: 'Valores "verdadeiros" e "falsos"' },
        { type: 'p', text: 'Qualquer valor pode ser usado numa condição. São falsos: `False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `()`, `set()`. **Todo o resto é verdadeiro** — incluindo `"False"`, `[0]` e `-1`.' },
        { type: 'code', lang: 'python', caption: 'idiomas que isto permite', code: `nomes = []

if not nomes:                       # em vez de len(nomes) == 0
    print("A lista está vazia")

texto = ""
print(texto or "(sem texto)")       # or devolve o primeiro verdadeiro
print(bool("False"), bool([0]), bool(-1), bool(0.0))` },
      ],
    },
    {
      id: 'ciclos',
      title: 'Ciclos: for e while',
      blocks: [
        { type: 'p', text: 'O `for` de Python não é o `para` de Portugol. Não conta números: **percorre uma sequência**, item a item. Para contar, pede-se uma sequência de números à função `range`.' },
        { type: 'code', lang: 'python', caption: 'for percorre, range conta', code: `for letra in "abc":
    print(letra)

for nome in ["Ana", "Rui", "Sara"]:
    print(f"Olá, {nome}")

print(list(range(5)))         # 0 1 2 3 4     — para em 5, não o inclui
print(list(range(1, 6)))      # 1 2 3 4 5
print(list(range(0, 20, 5)))  # 0 5 10 15     — de 5 em 5
print(list(range(3, 0, -1)))  # 3 2 1         — para trás

# quando precisas do índice e do valor
for i, nome in enumerate(["Ana", "Rui"], start=1):
    print(i, nome)` },
        { type: 'callout', tone: 'trap', title: '`range(1, 10)` não inclui o 10', text: 'É o erro "off-by-one" do módulo 6, agora em Python. `range(a, b)` produz de `a` até `b-1`. Para os números de 1 a 10 escreve-se `range(1, 11)`.' },
        { type: 'code', lang: 'python', caption: 'while, break e continue', code: `# while: repete enquanto a condição for verdadeira
tentativas = 0
while tentativas < 3:
    tentativas += 1
    print("Tentativa", tentativas)

# break sai do ciclo; continue salta para a iteração seguinte
for n in range(1, 11):
    if n % 2 == 0:
        continue          # ignora os pares
    if n > 7:
        break             # e para no primeiro ímpar acima de 7
    print(n)` },
        { type: 'callout', tone: 'warn', text: 'Um `while` cuja condição nunca fica falsa é um ciclo infinito. Em Python não há rede de segurança: no laboratório usa o botão **■ Parar**; num computador seria Ctrl+C. Garante sempre que alguma coisa dentro do ciclo aproxima a condição do fim.' },
        { type: 'widget', id: 'python-lab', props: { set: 'basico', code: `# Experimenta: quantos anos até duplicar o capital a 5%/ano?\ncapital = 1000\nanos = 0\n\nwhile capital < 2000:\n    capital *= 1.05\n    anos += 1\n    print(f"ano {anos}: {capital:.2f}")\n\nprint(f"Duplicou ao fim de {anos} anos.")` } },
      ],
    },
    {
      id: 'funcoes',
      title: 'Funções',
      blocks: [
        { type: 'p', text: 'Uma função é um bloco com nome que recebe dados, faz uma coisa e devolve um resultado. Serve para não repetir código e, sobretudo, para dar um nome a uma ideia — o que torna o programa legível.' },
        { type: 'code', lang: 'python', caption: 'anatomia de uma função', code: `def area_retangulo(largura, altura):
    """Devolve a área. Esta linha é a docstring: documenta a função."""
    return largura * altura

def saudar(nome, saudacao="Olá"):        # parâmetro com valor por omissão
    return f"{saudacao}, {nome}!"

def estatisticas(valores):
    return min(valores), max(valores), sum(valores) / len(valores)

print(area_retangulo(3, 4))
print(saudar("Ana"))
print(saudar("Rui", saudacao="Bom dia"))    # argumento por nome
minimo, maximo, media = estatisticas([4, 8, 15, 16])   # devolve um tuplo
print(minimo, maximo, media)` },
        {
          type: 'terms',
          items: [
            { term: 'Parâmetro vs argumento', def: 'Parâmetro é o nome na definição (`largura`); argumento é o valor na chamada (`3`).' },
            { term: 'return', def: 'Termina a função imediatamente e devolve o valor. Sem `return`, a função devolve `None`.' },
            { term: 'Escopo local', def: 'Uma variável criada dentro da função só existe lá dentro; desaparece quando a função termina.' },
            { term: 'Docstring', def: 'Texto entre `"""` logo a seguir ao `def`. É o que aparece em `help(funcao)`.' },
          ],
        },
        { type: 'callout', tone: 'trap', title: 'Valor por omissão mutável', text: 'Nunca escrevas `def f(lista=[]):`. O valor por omissão é criado **uma só vez**, quando a função é definida, e fica partilhado entre todas as chamadas — a lista vai crescendo entre chamadas. A forma correta é `def f(lista=None):` e, dentro, `if lista is None: lista = []`.' },
        { type: 'code', lang: 'python', caption: 'o problema em três linhas', code: `def acrescenta(item, destino=[]):
    destino.append(item)
    return destino

print(acrescenta("a"))    # ['a']
print(acrescenta("b"))    # ['a', 'b']  ← surpresa!
print(acrescenta("c"))    # ['a', 'b', 'c']` },
      ],
    },
    {
      id: 'erros',
      title: 'Erros: ler a mensagem',
      blocks: [
        { type: 'p', text: 'Um erro em Python não é um castigo — é a informação mais útil que vais receber. A mensagem diz o tipo de erro, a linha e, quase sempre, a causa. Lê-a de baixo para cima: a última linha é o quê, as anteriores são o onde.' },
        {
          type: 'table',
          head: ['Erro', 'Significa', 'Causa típica'],
          rows: [
            ['`SyntaxError`', 'O código não é Python válido', 'Faltam `:`, parêntesis ou aspas'],
            ['`IndentationError`', 'Indentação inconsistente', 'Mistura de tabulações e espaços'],
            ['`NameError`', 'Nome não definido', 'Erro de escrita ou variável usada antes de existir'],
            ['`TypeError`', 'Operação entre tipos incompatíveis', '`"5" + 1` — faltou o `int()`'],
            ['`ValueError`', 'Tipo certo, valor impossível', '`int("abc")`'],
            ['`IndexError`', 'Índice fora do intervalo', '`lista[5]` numa lista de 3'],
            ['`KeyError`', 'Chave inexistente num dicionário', 'Usa `.get()` para evitar'],
            ['`ZeroDivisionError`', 'Divisão por zero', 'Falta validar o denominador'],
            ['`AttributeError`', 'O objeto não tem esse método', '`None.upper()` — a variável era `None`'],
          ],
        },
        { type: 'code', lang: 'python', caption: 'apanhar erros com try/except', code: `def dividir(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        print("Não se pode dividir por zero.")
        return None

print(dividir(10, 2))
print(dividir(10, 0))

# validar entrada do utilizador
valor = "abc"
try:
    n = int(valor)
except ValueError:
    print(f"{valor!r} não é um número inteiro.")` },
        { type: 'callout', tone: 'tip', title: 'Depurar com print', text: 'Antes de aprenderes um depurador, o `print` resolve 90% dos casos. `print(f"{x=}, {tipo=}")` mostra o nome e o valor. Coloca prints antes e depois da linha suspeita: o erro está entre o último print que apareceu e o primeiro que não apareceu.' },
        { type: 'callout', tone: 'key', text: 'A ordem de ataque a um erro: **1)** lê a última linha da mensagem; **2)** vai à linha indicada; **3)** imprime as variáveis envolvidas; **4)** só depois muda o código. Alterar código à sorte é a forma mais lenta de resolver um erro.' },
      ],
    },
  ],
  quiz: [
    { id: 'py1', prompt: 'Que valor tem `7 // 2` em Python?', options: ['`3.5`', '`3`', '`4`', '`1`'], answer: 1, explain: '`//` é a divisão inteira, que trunca para baixo. `7 / 2` daria `3.5` e `7 % 2` daria `1`.' },
    { id: 'py2', prompt: 'O que devolve `input()`?', options: ['Um inteiro se o utilizador escrever um número', 'Sempre uma string', 'O tipo mais adequado, automaticamente', 'None se não houver entrada'], answer: 1, explain: '`input()` devolve sempre `str`. Para calcular é preciso converter com `int()` ou `float()` — esquecer isso é a causa nº 1 de `TypeError` nos primeiros programas.' },
    { id: 'py3', prompt: 'Quantos números produz `range(1, 10)`?', options: ['10', '9', '11', '8'], answer: 1, explain: 'Produz 1, 2, …, 9 — nove números. O limite superior é sempre excluído. Para chegar ao 10 seria `range(1, 11)`.' },
    { id: 'py4', prompt: 'O que delimita um bloco de código em Python?', options: ['As chavetas `{ }`', 'As palavras `inicio` e `fim`', 'A indentação', 'O ponto e vírgula'], answer: 2, explain: 'A indentação é sintaxe. Por convenção usam-se 4 espaços, e misturar tabulações com espaços provoca `IndentationError`.' },
    { id: 'py5', prompt: 'Qual destes valores é considerado **verdadeiro** numa condição?', options: ['`0`', '`""`', '`[]`', '`"False"`'], answer: 3, explain: '`"False"` é uma string não vazia, logo é verdadeira. São falsos: `False`, `None`, `0`, `0.0`, `""`, `[]`, `{}`, `()`.' },
    { id: 'py6', prompt: 'Depois de `s = "ola"` e `s.upper()`, quanto vale `s`?', options: ['`"OLA"`', '`"ola"`', '`None`', 'Erro'], answer: 1, explain: 'As strings são imutáveis: `upper()` devolve uma string nova e não altera a original. Seria preciso `s = s.upper()`.' },
    { id: 'py7', prompt: 'Que erro dá `int("abc")`?', options: ['`TypeError`', '`ValueError`', '`NameError`', '`SyntaxError`'], answer: 1, explain: 'O tipo do argumento está certo (é uma string, que `int()` aceita), mas o valor é impossível de converter — isso é exatamente um `ValueError`.' },
    { id: 'py8', prompt: 'Porque é que `def f(lista=[])` é perigoso?', options: ['É mais lento', 'O valor por omissão é criado uma só vez e fica partilhado entre chamadas', 'Não é Python válido', 'Obriga a passar sempre o argumento'], answer: 1, explain: 'A lista é criada quando a função é definida, não em cada chamada. Todas as chamadas partilham a mesma lista, que vai crescendo. Usa-se `=None` e cria-se a lista dentro da função.' },
  ],
  exercises: [
    {
      id: 'e13-1', difficulty: 1, kind: 'predict', title: 'Divisões',
      statement: 'Lê o código e escreve, numa linha e separada por espaços, a saída que ele produz. Depois confirma a correr.',
      code: `print(7 / 2, 7 // 2, 7 % 2, 2 ** 3)`,
      accept: ['3.5 3 1 8'],
      hint: '`/` devolve sempre float; `//` trunca; `%` é o resto; `**` é potência.',
      solution: '`3.5 3 1 8`. Repara que `7 / 2` dá `3.5` (float) mesmo sendo uma divisão de dois inteiros — é a grande diferença entre Python 2 e Python 3.',
    },
    {
      id: 'e13-2', difficulty: 1, kind: 'predict', title: 'Texto vezes número',
      statement: 'Este código não dá erro. Que valores imprime?',
      code: `a = "5"
b = 3
print(a * b)
print(int(a) * b)`,
      accept: ['555 15', '555\n15', '55515'],
      hint: '`*` entre string e inteiro repete a string.',
      solution: 'Imprime `555` e depois `15`. Multiplicar uma string por um inteiro repete-a; só depois de `int(a)` é que a multiplicação é aritmética. É um erro que **não rebenta** — corre e dá resultado errado.',
    },
    {
      id: 'e13-3', difficulty: 2, kind: 'predict', title: 'Cascata de condições',
      statement: 'Qual é a saída? Presta atenção à ordem dos `elif`.',
      code: `nota = 19

if nota >= 10:
    print("Suficiente")
elif nota >= 14:
    print("Bom")
elif nota >= 18:
    print("Excelente")`,
      accept: ['suficiente'],
      hint: 'O `elif` só é avaliado se todos os anteriores falharem.',
      solution: 'Imprime apenas `Suficiente`. Como `19 >= 10` é verdadeiro, os `elif` seguintes nunca são avaliados. Numa cascata de condições sobrepostas, a **mais restritiva tem de vir primeiro**: 18, depois 14, depois 10.',
    },
    {
      id: 'e13-4', difficulty: 2, kind: 'predict', title: 'break e continue',
      statement: 'Que números são impressos, por ordem e separados por espaços?',
      code: `for n in range(1, 11):
    if n % 3 == 0:
        continue
    if n > 7:
        break
    print(n, end=" ")`,
      accept: ['1 2 4 5 7'],
      hint: '`continue` salta a iteração; `break` termina o ciclo. Testa o que acontece em n = 8.',
      solution: '`1 2 4 5 7`. Os múltiplos de 3 (3, 6, 9) são saltados pelo `continue`. Em n = 8 a segunda condição é verdadeira e o `break` termina o ciclo, por isso o 8 nunca é impresso.',
    },
    {
      id: 'e13-5', difficulty: 2, kind: 'code', title: 'Conversor de temperatura',
      statement: 'Escreve no laboratório uma função `celsius_para_fahrenheit(c)` que aplique a fórmula `F = C × 9/5 + 32` e imprima uma tabela de −10 °C a 40 °C, de 10 em 10 graus, com uma casa decimal.',
      hint: 'Usa `range(-10, 41, 10)` e uma f-string com `{valor:.1f}`.',
      solution: `def celsius_para_fahrenheit(c):
    return c * 9 / 5 + 32

for c in range(-10, 41, 10):
    print(f"{c:>4} °C = {celsius_para_fahrenheit(c):>6.1f} °F")`,
    },
    {
      id: 'e13-6', difficulty: 3, kind: 'code', title: 'Validar entrada com try/except',
      statement: 'Escreve uma função `ler_inteiro(texto)` que peça um número ao utilizador e repita o pedido até receber um inteiro válido entre 0 e 100. Testa-a com a caixa Entrada a conter `abc`, depois `250`, depois `42`.',
      hint: 'Um `while True` com `try`/`except ValueError` lá dentro, e um `return` quando o valor for válido.',
      solution: `def ler_inteiro(texto):
    while True:
        bruto = input(texto)
        try:
            n = int(bruto)
        except ValueError:
            print(f"{bruto!r} não é um inteiro. Tenta outra vez.")
            continue
        if not 0 <= n <= 100:
            print("Tem de estar entre 0 e 100.")
            continue
        return n

print("Recebido:", ler_inteiro("Valor (0-100): "))`,
    },
  ],
};
