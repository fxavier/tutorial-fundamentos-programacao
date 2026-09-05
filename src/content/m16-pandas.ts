import type { Module } from '../types';

export const m16: Module = {
  id: 'pandas',
  number: 16,
  title: 'Análise de dados com pandas',
  subtitle: 'Series, DataFrames, filtros, agregações e limpeza — a tabela como estrutura de dados',
  icon: '🐼',
  minutes: 70,
  goals: [
    'Criar e explorar Series e DataFrames',
    'Selecionar linhas e colunas com `loc`, `iloc` e filtros booleanos',
    'Criar colunas derivadas e transformar valores',
    'Agrupar e agregar dados com `groupby` e `pivot_table`',
    'Tratar valores em falta e juntar tabelas com `merge`',
  ],
  sections: [
    {
      id: 'porque-pandas',
      title: 'Porquê pandas',
      blocks: [
        { type: 'p', text: 'Com listas e dicionários já consegues tratar dados. O problema é a escala e a expressividade: calcular a média das vendas por loja e por mês com listas são vinte linhas de ciclos aninhados; com pandas é uma. O **pandas** é a biblioteca-padrão de facto para dados tabelados em Python — é o que está por baixo de quase toda a análise de dados e de muito do trabalho de preparação em aprendizagem automática.' },
        {
          type: 'compare',
          left: { title: 'Com listas e dicionários', items: ['Ciclos aninhados para tudo', 'Cada agregação é código novo', 'Tipos e valores em falta tratados à mão', 'Rápido de perceber, lento de escrever'] },
          right: { title: 'Com pandas', items: ['Operações sobre colunas inteiras de uma vez', '`groupby`, `merge`, `pivot_table` já feitos', 'Valores em falta (`NaN`) tratados pela biblioteca', 'Executa em C por baixo — ordens de grandeza mais rápido'] },
        },
        {
          type: 'terms',
          items: [
            { term: 'Series', def: 'Uma coluna: um vetor de valores com um índice associado a cada posição.' },
            { term: 'DataFrame', def: 'Uma tabela: um conjunto de Series que partilham o mesmo índice. É a estrutura central.' },
            { term: 'Índice (index)', def: 'As etiquetas das linhas. Por omissão são 0, 1, 2… mas podem ser nomes ou datas.' },
            { term: 'NaN', def: '*Not a Number* — a marca de valor em falta. Propaga-se nas operações e é ignorado nas agregações.' },
            { term: 'Vetorização', def: 'Aplicar uma operação a uma coluna inteira de uma vez, sem escrever o ciclo. É o que torna o pandas rápido.' },
          ],
        },
        { type: 'callout', tone: 'warn', title: 'Antes de correres o laboratório', text: 'O pandas são vários megabytes e é descarregado na primeira execução de um exemplo que o use — pode demorar 10 a 30 segundos, conforme a ligação. Depois disso fica em memória e as execuções seguintes são imediatas.' },
        { type: 'widget', id: 'python-lab', props: { set: 'pandas' } },
      ],
    },
    {
      id: 'series-dataframe',
      title: 'Series e DataFrame',
      blocks: [
        { type: 'code', lang: 'python', caption: 'uma Series é uma coluna com índice', code: `import pandas as pd

s = pd.Series([14, 9, 18, 11], index=["Ana", "Rui", "Sara", "Tomás"], name="nota")
print(s)
print()
print(s["Sara"])              # acesso por etiqueta
print(s.mean(), s.max(), s.std())
print(s > 12)                 # operação vetorizada: devolve uma Series de booleanos
print(s[s > 12])              # e serve logo de filtro` },
        { type: 'p', text: 'Um **DataFrame** é um conjunto de Series com o mesmo índice — uma tabela. A forma mais comum de o criar à mão é a partir de um dicionário em que cada chave é uma coluna.' },
        { type: 'code', lang: 'python', caption: 'criar e inspecionar um DataFrame', code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info"],
    "nota": [14, 9, 18, 11, 20],
    "faltas": [2, 7, 0, 4, 1],
})

print(df)
print()
print(df.shape)        # (linhas, colunas)
print(df.columns.tolist())
print(df.dtypes)       # o tipo de cada coluna
print()
print(df.head(3))      # as primeiras 3 linhas
print(df.describe())   # estatísticas das colunas numéricas` },
        {
          type: 'table',
          head: ['Método', 'Mostra'],
          rows: [
            ['`df.head(n)` / `df.tail(n)`', 'As primeiras / últimas n linhas'],
            ['`df.shape`', 'Um tuplo (linhas, colunas)'],
            ['`df.info()`', 'Tipos, contagem de não-nulos e memória usada'],
            ['`df.describe()`', 'Contagem, média, desvio, mínimo, quartis e máximo'],
            ['`df.dtypes`', 'O tipo de cada coluna'],
            ['`df["c"].unique()`', 'Os valores distintos de uma coluna'],
            ['`df["c"].value_counts()`', 'Quantas vezes cada valor aparece'],
            ['`df.isna().sum()`', 'Quantos valores em falta por coluna'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'O primeiro reflexo com dados novos', text: 'Antes de qualquer análise: `df.shape`, `df.head()`, `df.dtypes`, `df.isna().sum()` e `df.describe()`. Cinco comandos que respondem a "quanto é", "com que aspeto", "de que tipo", "o que falta" e "que gamas de valores". Saltar este passo é a causa nº 1 de análises erradas.' },
      ],
    },
    {
      id: 'selecao',
      title: 'Selecionar e filtrar',
      blocks: [
        { type: 'code', lang: 'python', caption: 'colunas, linhas e condições', code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info"],
    "nota": [14, 9, 18, 11, 20],
    "faltas": [2, 7, 0, 4, 1],
})

print(df["nota"])                    # uma coluna -> Series
print(df[["nome", "nota"]])          # várias colunas -> DataFrame

print(df.loc[0])                     # linha pela ETIQUETA do índice
print(df.iloc[0])                    # linha pela POSIÇÃO
print(df.loc[1:3, ["nome", "nota"]]) # loc inclui o limite; iloc não

# filtros booleanos: a operação mais usada de todas
print(df[df["nota"] >= 14])
print(df[(df["curso"] == "Info") & (df["faltas"] < 2)])
print(df[df["curso"].isin(["Info"])])
print(df[df["nome"].str.startswith("A")])` },
        { type: 'callout', tone: 'trap', title: 'Em pandas usa-se `&`, `|` e `~` — nunca `and`, `or`, `not`', text: 'As palavras `and`/`or` exigem um único valor booleano e uma coluna tem muitos, o que dá `ValueError: The truth value of a Series is ambiguous`. Usa `&`, `|` e `~`, e **põe cada condição entre parêntesis** — a precedência de `&` é mais alta do que a de `==`.' },
        { type: 'code', lang: 'python', caption: 'ordenar e contar', code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info"],
    "nota": [14, 9, 18, 11, 20],
})

print(df.sort_values("nota", ascending=False))
print(df.sort_values(["curso", "nota"], ascending=[True, False]))
print(df["curso"].value_counts())
print(df.nlargest(2, "nota")[["nome", "nota"]])` },
      ],
    },
    {
      id: 'transformar',
      title: 'Criar e transformar colunas',
      blocks: [
        { type: 'p', text: 'Criar uma coluna nova a partir das existentes é uma atribuição. A operação é **vetorizada**: aplica-se a todas as linhas de uma vez, sem ciclo.' },
        { type: 'code', lang: 'python', caption: 'colunas derivadas', code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás"],
    "nota": [14, 9, 18, 11],
    "faltas": [2, 7, 0, 4],
})

df["aprovado"] = df["nota"] >= 10                       # booleana
df["nota_20"] = (df["nota"] / 20 * 100).round(1)        # aritmética
df["nome_maiusc"] = df["nome"].str.upper()              # texto, via .str

# classificar por escalões
df["mencao"] = pd.cut(df["nota"], bins=[0, 9.5, 13.5, 17.5, 20],
                      labels=["Insuf.", "Suf.", "Bom", "Excelente"])

# condição em duas vias
df["estado"] = np.where(df["faltas"] > 5, "excluído", "regular")

print(df)
print()
print(df["aprovado"].sum(), "aprovados de", len(df))` },
        { type: 'callout', tone: 'tip', title: 'Evita `apply` quando houver alternativa vetorizada', text: '`df["x"].apply(lambda v: v * 2)` corre um ciclo Python linha a linha; `df["x"] * 2` corre em C sobre o vetor inteiro e pode ser 100 vezes mais rápido. Guarda o `apply` para lógica que não tenha equivalente vetorizado.' },
        { type: 'code', lang: 'python', caption: 'renomear, remover, reordenar', code: `import pandas as pd

df = pd.DataFrame({"nome": ["Ana", "Rui"], "nota": [14, 9], "temp": [1, 2]})

df = df.rename(columns={"nota": "classificacao"})
df = df.drop(columns=["temp"])
df = df[["classificacao", "nome"]]            # reordenar
print(df)` },
      ],
    },
    {
      id: 'groupby',
      title: 'Agrupar e agregar',
      blocks: [
        { type: 'p', text: 'O `groupby` é a operação mais poderosa do pandas. Segue sempre o mesmo padrão em três tempos — **dividir, aplicar, combinar**: divide as linhas por grupos, aplica uma função a cada grupo, e junta os resultados numa tabela.' },
        {
          type: 'steps',
          items: [
            { title: 'Dividir (split)', text: '`df.groupby("loja")` separa as linhas em grupos, um por valor distinto da coluna.' },
            { title: 'Aplicar (apply)', text: '`["valor"].sum()` calcula a soma dentro de cada grupo, independentemente dos outros.' },
            { title: 'Combinar (combine)', text: 'O pandas junta os resultados numa Series ou DataFrame indexada pelos grupos.' },
          ],
        },
        { type: 'code', lang: 'python', caption: 'groupby na prática', code: `import pandas as pd

vendas = pd.DataFrame({
    "loja": ["Lisboa", "Porto", "Lisboa", "Faro", "Porto", "Lisboa"],
    "mes": ["jan", "jan", "fev", "fev", "fev", "mar"],
    "valor": [1200, 800, 1500, 400, 950, 1100],
})

print(vendas.groupby("loja")["valor"].sum())
print()
print(vendas.groupby("loja")["valor"].agg(["count", "sum", "mean", "max"]))
print()
print(vendas.groupby(["loja", "mes"])["valor"].sum())     # dois níveis
print()
print(vendas.groupby("loja")["valor"].sum().sort_values(ascending=False))` },
        { type: 'code', lang: 'python', caption: 'pivot_table: agrupar em duas dimensões', code: `import pandas as pd

vendas = pd.DataFrame({
    "loja": ["Lisboa", "Porto", "Lisboa", "Faro", "Porto", "Lisboa"],
    "mes": ["jan", "jan", "fev", "fev", "fev", "mar"],
    "valor": [1200, 800, 1500, 400, 950, 1100],
})

print(vendas.pivot_table(index="loja", columns="mes", values="valor",
                         aggfunc="sum", fill_value=0, margins=True))` },
        { type: 'callout', tone: 'key', text: '"Média de X por Y" é sempre `df.groupby("Y")["X"].mean()`. Quando ouvires "por" numa pergunta sobre dados — vendas **por** loja, notas **por** curso, tempo **por** utilizador — é um `groupby`.' },
      ],
    },
    {
      id: 'limpeza',
      title: 'Valores em falta e limpeza',
      blocks: [
        { type: 'p', text: 'Dados reais têm buracos. O pandas representa-os por `NaN` e dá-te três decisões possíveis: remover as linhas, preencher com um valor, ou deixar como está e agregar por cima (as agregações ignoram `NaN` por omissão).' },
        { type: 'code', lang: 'python', caption: 'diagnosticar e tratar', code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás"],
    "nota": [14, np.nan, 18, np.nan],
    "faltas": [2, 7, np.nan, 4],
})

print(df.isna().sum())                     # quantos faltam por coluna
print(df.isna().sum().sum(), "buracos no total")
print()
print(df.dropna())                          # remove as linhas com qualquer NaN
print(df.dropna(subset=["nota"]))           # só as que não têm nota
print()
print(df.fillna({"nota": df["nota"].mean(), "faltas": 0}))
print()
print(df["nota"].mean())                    # a média já ignora os NaN` },
        { type: 'callout', tone: 'trap', title: 'Preencher não é neutro', text: 'Substituir os valores em falta pela média reduz artificialmente a variância e pode enviesar a análise. Remover linhas perde informação e, se os buracos não forem aleatórios, enviesa também. Não há escolha automática: decide-se caso a caso e **regista-se a decisão**.' },
        { type: 'code', lang: 'python', caption: 'outras limpezas frequentes', code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["  ana ", "RUI", "Sara", "Sara"],
    "curso": ["info", "Info", "INFO", "INFO"],
    "nota": ["14", "9", "18", "18"],
})

df["nome"] = df["nome"].str.strip().str.title()
df["curso"] = df["curso"].str.upper()
df["nota"] = pd.to_numeric(df["nota"])       # texto -> número
print(df.duplicated().sum(), "duplicados")
df = df.drop_duplicates()
print(df)
print(df.dtypes)` },
      ],
    },
    {
      id: 'juncoes',
      title: 'Juntar tabelas',
      blocks: [
        { type: 'p', text: 'Os dados raramente vivem numa tabela só. `merge` junta duas tabelas por uma coluna comum — é o `JOIN` das bases de dados, com a mesma semântica.' },
        {
          type: 'table',
          head: ['`how=`', 'Fica com', 'Usa quando'],
          rows: [
            ['`inner` (por omissão)', 'Só as linhas com correspondência nas duas', 'Queres apenas registos completos'],
            ['`left`', 'Todas as da esquerda; `NaN` onde não há par', 'A tabela da esquerda é a principal'],
            ['`right`', 'Todas as da direita', 'Raro — costuma trocar-se a ordem e usar `left`'],
            ['`outer`', 'Todas as linhas de ambas', 'Queres ver o que falta de cada lado'],
          ],
        },
        { type: 'code', lang: 'python', caption: 'merge e concat', code: `import pandas as pd

alunos = pd.DataFrame({"id": [1, 2, 3, 4], "nome": ["Ana", "Rui", "Sara", "Tomás"]})
notas = pd.DataFrame({"id": [1, 2, 3, 9], "nota": [14, 9, 18, 15]})

print(alunos.merge(notas, on="id"))                  # inner: perde o 4 e o 9
print()
print(alunos.merge(notas, on="id", how="left"))      # mantém Tomás, com NaN
print()
print(alunos.merge(notas, on="id", how="outer"))     # mantém tudo

# concat empilha tabelas com as mesmas colunas
t1 = pd.DataFrame({"nome": ["Ana"], "nota": [14]})
t2 = pd.DataFrame({"nome": ["Rui"], "nota": [9]})
print(pd.concat([t1, t2], ignore_index=True))` },
        { type: 'callout', tone: 'warn', title: 'Verifica sempre o número de linhas depois de um merge', text: 'Se a chave estiver repetida numa das tabelas, o merge multiplica linhas e o total cresce sem aviso. `print(len(df))` antes e depois de cada junção apanha o problema em dois segundos — em vez de o descobrires quando os totais não batem certo.' },
      ],
    },
    {
      id: 'fluxo-completo',
      title: 'Um fluxo de análise completo',
      blocks: [
        { type: 'p', text: 'Junta tudo num caso realista: dados sujos, limpeza, colunas derivadas, agregação e resposta a uma pergunta concreta.' },
        { type: 'widget', id: 'python-lab', props: { set: 'pandas', packages: ['pandas'], code: `import pandas as pd
import numpy as np

# 1. Os dados, como costumam chegar: tipos trocados, buracos, texto inconsistente
dados = pd.DataFrame({
    "loja":     ["lisboa", "PORTO", "Lisboa ", "faro", "Porto", "LISBOA", "Faro"],
    "mes":      ["jan", "jan", "fev", "fev", "fev", "mar", "mar"],
    "vendas":   ["1200", "800", "1500", "400", "950", "1100", None],
    "clientes": [45, 30, 52, np.nan, 38, 41, 12],
})

print("== 1. Como chegou ==")
print(dados)
print()
print(dados.dtypes)
print(dados.isna().sum())

# 2. Limpeza
df = dados.copy()
df["loja"] = df["loja"].str.strip().str.title()
df["vendas"] = pd.to_numeric(df["vendas"])
df = df.dropna(subset=["vendas"])
df["clientes"] = df["clientes"].fillna(df["clientes"].median())

print()
print("== 2. Depois da limpeza ==")
print(df)

# 3. Colunas derivadas
df["ticket_medio"] = (df["vendas"] / df["clientes"]).round(2)

# 4. Perguntas
print()
print("== 3. Vendas por loja ==")
print(df.groupby("loja")["vendas"].agg(["count", "sum", "mean"]).round(1))

print()
print("== 4. Ticket médio por loja, do maior para o menor ==")
print(df.groupby("loja")["ticket_medio"].mean().sort_values(ascending=False).round(2))

print()
print("== 5. Tabela cruzada loja x mês ==")
print(df.pivot_table(index="loja", columns="mes", values="vendas", aggfunc="sum", fill_value=0))

melhor = df.loc[df["vendas"].idxmax()]
print()
print(f"Melhor registo: {melhor['loja']} em {melhor['mes']} com {melhor['vendas']:.0f} €")` } },
        { type: 'callout', tone: 'key', text: 'O fluxo é sempre o mesmo: **carregar → inspecionar → limpar → derivar → agregar → responder**. Noventa por cento do tempo de um trabalho de dados está nos passos 2 e 3; a parte "inteligente" costuma ser uma linha de `groupby`.' },
      ],
    },
  ],
  quiz: [
    { id: 'pd1', prompt: 'O que é uma `Series` em pandas?', options: ['Uma tabela com várias colunas', 'Uma coluna de valores com um índice', 'Uma função de agregação', 'Um ficheiro CSV'], answer: 1, explain: 'A Series é unidimensional: valores + índice. Um DataFrame é um conjunto de Series que partilham o mesmo índice.' },
    { id: 'pd2', prompt: 'Qual é a diferença entre `df.loc[2]` e `df.iloc[2]`?', options: ['Nenhuma', '`loc` usa a etiqueta do índice, `iloc` usa a posição', '`loc` é mais rápido', '`iloc` só funciona em colunas'], answer: 1, explain: 'Com o índice por omissão (0, 1, 2…) coincidem. Depois de filtrar ou ordenar, as etiquetas deixam de corresponder às posições e a diferença passa a ser crítica.' },
    { id: 'pd3', prompt: 'Como se combinam duas condições num filtro de pandas?', options: ['`df[(a) and (b)]`', '`df[(a) & (b)]`', '`df[a, b]`', '`df.filter(a, b)`'], answer: 1, explain: 'As palavras `and`/`or` exigem um único booleano e uma Series tem muitos. Usa-se `&`, `|` e `~`, com cada condição entre parêntesis por causa da precedência.' },
    { id: 'pd4', prompt: 'Que devolve `df.groupby("curso")["nota"].mean()`?', options: ['A média global das notas', 'A média da nota por cada curso', 'A lista dos cursos', 'O número de alunos por curso'], answer: 1, explain: 'É o padrão dividir-aplicar-combinar: divide as linhas por curso, calcula a média da nota em cada grupo e devolve uma Series indexada pelos cursos.' },
    { id: 'pd5', prompt: 'O que faz `df.dropna(subset=["nota"])`?', options: ['Apaga a coluna nota', 'Remove as linhas em que a nota está em falta', 'Substitui os NaN por zero', 'Remove todas as linhas com qualquer NaN'], answer: 1, explain: 'Sem `subset` removeria qualquer linha com pelo menos um `NaN`. Com `subset` só olha para as colunas indicadas.' },
    { id: 'pd6', prompt: 'Num `merge` com `how="left"`, o que acontece a uma linha da esquerda sem correspondência à direita?', options: ['É removida', 'Fica, com NaN nas colunas da direita', 'Dá erro', 'É duplicada'], answer: 1, explain: 'É a diferença face ao `inner`, que só mantém as linhas com par nas duas tabelas. O `left` preserva a tabela da esquerda inteira.' },
    { id: 'pd7', prompt: 'Porque é que `df["x"] * 2` costuma ser muito mais rápido do que `df["x"].apply(lambda v: v * 2)`?', options: ['Porque usa menos memória', 'Porque é uma operação vetorizada executada em C, sem ciclo Python', 'Porque o apply está obsoleto', 'Porque o resultado é aproximado'], answer: 1, explain: 'A operação vetorizada percorre o vetor em código compilado; o `apply` chama uma função Python por cada linha. A diferença chega facilmente a duas ordens de grandeza.' },
    { id: 'pd8', prompt: 'Qual é o primeiro conjunto de comandos a correr num DataFrame novo?', options: ['`df.plot()`', '`df.shape`, `df.head()`, `df.dtypes`, `df.isna().sum()`', '`df.to_csv()`', '`df.sort_values()`'], answer: 1, explain: 'Antes de analisar é preciso saber o tamanho, o aspeto, os tipos e o que falta. Saltar esta inspeção é a causa mais comum de conclusões erradas.' },
  ],
  exercises: [
    {
      id: 'e16-1', difficulty: 1, kind: 'predict', title: 'Filtro simples',
      statement: 'Que lista é impressa?',
      packages: ['pandas'],
      code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás"],
    "nota": [14, 9, 18, 11],
})
print(df[df["nota"] >= 12]["nome"].tolist())`,
      accept: ["['Ana', 'Sara']", '[Ana, Sara]'],
      hint: 'Só as linhas com nota maior ou igual a 12, e depois a coluna nome.',
      solution: "`['Ana', 'Sara']`. O filtro `df[\"nota\"] >= 12` produz uma Series de booleanos `[True, False, True, False]`, que seleciona as linhas correspondentes.",
    },
    {
      id: 'e16-2', difficulty: 2, kind: 'predict', title: 'Duas condições',
      statement: 'Atenção ao operador. Que nomes ficam?',
      packages: ['pandas'],
      code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info"],
    "nota": [14, 9, 18, 11, 20],
})
print(df[(df["curso"] == "Info") & (df["nota"] > 15)]["nome"].tolist())`,
      accept: ["['Sara', 'Inês']", '[Sara, Inês]'],
      hint: 'As duas condições têm de ser verdadeiras na mesma linha.',
      solution: "`['Sara', 'Inês']`. A Ana é de Info mas tem 14; o Rui e o Tomás são de Gestão. Repara nos parêntesis à volta de cada condição: sem eles, a precedência de `&` provoca um erro.",
    },
    {
      id: 'e16-3', difficulty: 2, kind: 'predict', title: 'groupby',
      statement: 'Qual é o valor impresso?',
      packages: ['pandas'],
      code: `import pandas as pd

v = pd.DataFrame({
    "loja": ["A", "B", "A", "B", "A"],
    "valor": [100, 200, 300, 400, 500],
})
print(v.groupby("loja")["valor"].sum().to_dict())`,
      accept: ["{'A': 900, 'B': 600}", '{A: 900, B: 600}'],
      hint: 'Soma os valores da loja A e, separadamente, os da loja B.',
      solution: "`{'A': 900, 'B': 600}`. A loja A tem 100 + 300 + 500 = 900 e a B tem 200 + 400 = 600. O `groupby` divide, o `sum` aplica e o pandas combina numa Series indexada pela loja.",
    },
    {
      id: 'e16-4', difficulty: 2, kind: 'predict', title: 'NaN nas agregações',
      statement: 'A coluna tem um valor em falta. Que média é impressa?',
      packages: ['pandas'],
      code: `import pandas as pd
import numpy as np

s = pd.Series([10, 20, np.nan, 30])
print(s.mean(), s.sum(), s.count(), len(s))`,
      accept: ['20.0 60.0 3 4'],
      hint: 'As agregações ignoram os NaN; `count()` não os conta, `len()` conta.',
      solution: '`20.0 60.0 3 4`. A média é 60/3 = 20, não 60/4 = 15: o `NaN` é **excluído**, não tratado como zero. `count()` devolve os não-nulos (3) e `len()` o total de posições (4). É a distinção que evita médias erradas.',
    },
    {
      id: 'e16-5', difficulty: 2, kind: 'code', title: 'Análise de uma pauta',
      statement: 'No laboratório, cria um DataFrame com 8 alunos (nome, curso, nota, faltas). Depois: acrescenta uma coluna `aprovado` (nota ≥ 10 **e** faltas ≤ 5); imprime a taxa de aprovação por curso; e mostra o melhor aluno de cada curso.',
      hint: 'Para o melhor de cada curso: `df.loc[df.groupby("curso")["nota"].idxmax()]`.',
      solution: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês", "Nuno", "Rita", "Zé"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info", "Gestão", "Info", "Gestão"],
    "nota": [14, 9, 18, 11, 20, 13, 8, 16],
    "faltas": [2, 7, 0, 4, 1, 6, 3, 2],
})

df["aprovado"] = (df["nota"] >= 10) & (df["faltas"] <= 5)

print(df)
print()
print("Taxa de aprovação por curso:")
print((df.groupby("curso")["aprovado"].mean() * 100).round(1))
print()
print("Melhor de cada curso:")
print(df.loc[df.groupby("curso")["nota"].idxmax(), ["curso", "nome", "nota"]])`,
    },
    {
      id: 'e16-6', difficulty: 3, kind: 'code', title: 'Limpar e cruzar duas tabelas',
      statement: 'Cria duas tabelas: `clientes` (id, nome, cidade — com o nome com espaços e maiúsculas inconsistentes) e `encomendas` (id_cliente, produto, valor — com um id que não existe em clientes e um valor em falta). Limpa os nomes, junta as tabelas mantendo todos os clientes, trata o valor em falta, e imprime o total gasto por cidade.',
      hint: 'Usa `.str.strip().str.title()`, `merge(..., how="left")`, `fillna(0)` e `groupby("cidade")["valor"].sum()`. Confirma o número de linhas antes e depois do merge.',
      solution: `import pandas as pd
import numpy as np

clientes = pd.DataFrame({
    "id": [1, 2, 3, 4],
    "nome": ["  ana silva", "RUI COSTA", "Sara Dias ", "tomás lima"],
    "cidade": ["Lisboa", "Porto", "Lisboa", "Faro"],
})

encomendas = pd.DataFrame({
    "id_cliente": [1, 1, 2, 3, 9],
    "produto": ["Teclado", "Rato", "Monitor", "Cabo", "Fantasma"],
    "valor": [25.0, 12.5, np.nan, 8.0, 99.0],
})

clientes["nome"] = clientes["nome"].str.strip().str.title()
encomendas["valor"] = encomendas["valor"].fillna(0)

print("clientes:", len(clientes), "| encomendas:", len(encomendas))
df = clientes.merge(encomendas, left_on="id", right_on="id_cliente", how="left")
print("depois do merge:", len(df))
print(df)

print()
print("Total gasto por cidade:")
print(df.groupby("cidade")["valor"].sum().sort_values(ascending=False))

print()
print("Clientes sem encomendas:", df.loc[df["produto"].isna(), "nome"].tolist())
print("Encomendas órfãs (id 9) foram descartadas pelo how='left'.")`,
    },
  ],
};
