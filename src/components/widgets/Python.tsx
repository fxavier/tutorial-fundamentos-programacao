import { useMemo, useRef, useState } from 'react';
import { WidgetShell, ConsoleOutput, useCodeRunner } from './Shell';
import { pythonRunner } from '../../lib/python';

type ExampleSet = 'basico' | 'estruturas' | 'poo' | 'pandas';

export const PY_EXAMPLES: { id: string; set: ExampleSet; name: string; input: string; packages?: string[]; code: string }[] = [
  {
    id: 'ola', set: 'basico', name: '1. Olá, mundo e variáveis', input: '',
    code: `nome = "Ana"
idade = 30
altura = 1.72
estuda = True

print("Olá,", nome)
print(f"{nome} tem {idade} anos e {altura} m.")
print("Tipos:", type(nome), type(idade), type(altura), type(estuda))`,
  },
  {
    id: 'entrada', set: 'basico', name: '2. Entrada e conversão de tipos', input: 'Ana\n2000',
    code: `nome = input("Qual é o teu nome? ")
bruto = float(input("Salário bruto? "))

liquido = bruto * 0.89          # desconta 11%

print(f"Olá, {nome}")
print(f"Salário líquido: {liquido:.2f} €")`,
  },
  {
    id: 'decisao', set: 'basico', name: '3. Decisão (if / elif / else)', input: '15',
    code: `nota = float(input("Nota (0 a 20): "))

if nota < 0 or nota > 20:
    print("Nota inválida.")
elif nota >= 18:
    print("Excelente")
elif nota >= 14:
    print("Bom")
elif nota >= 10:
    print("Suficiente")
else:
    print("Insuficiente")`,
  },
  {
    id: 'ciclos', set: 'basico', name: '4. Ciclos: for e while', input: '',
    code: `# for percorre uma sequência
for i in range(1, 11):
    print(f"7 x {i} = {7 * i}")

print("---")

# while repete enquanto a condição for verdadeira
saldo = 1000
anos = 0
while saldo < 2000:
    saldo *= 1.05
    anos += 1
print(f"Duplicou em {anos} anos: {saldo:.2f}")`,
  },
  {
    id: 'funcoes', set: 'basico', name: '5. Funções', input: '',
    code: `def imc(peso, altura):
    """Índice de massa corporal."""
    return peso / altura ** 2

def classificar(valor):
    if valor < 18.5:
        return "abaixo do peso"
    if valor < 25:
        return "normal"
    return "acima do peso"

for peso, altura in [(52, 1.70), (70, 1.75), (95, 1.72)]:
    v = imc(peso, altura)
    print(f"{peso} kg, {altura} m -> IMC {v:.1f} ({classificar(v)})")`,
  },
  {
    id: 'listas', set: 'estruturas', name: '1. Listas: o essencial', input: '',
    code: `notas = [14, 9, 18, 11, 20, 7]

print("original:", notas)
print("primeira:", notas[0], "| última:", notas[-1])
print("fatia [1:4]:", notas[1:4])

notas.append(16)
notas.remove(7)
print("depois de append/remove:", notas)

print("máximo:", max(notas), "| soma:", sum(notas))
print("média:", sum(notas) / len(notas))
print("ordenada:", sorted(notas))
print("original continua:", notas)`,
  },
  {
    id: 'compreensao', set: 'estruturas', name: '2. Compreensões de lista', input: '',
    code: `numeros = list(range(1, 11))

quadrados = [n ** 2 for n in numeros]
pares = [n for n in numeros if n % 2 == 0]
etiquetas = ["par" if n % 2 == 0 else "ímpar" for n in numeros]

print(quadrados)
print(pares)
print(etiquetas)

# o equivalente com ciclo — mesmo resultado, mais linhas
resultado = []
for n in numeros:
    if n % 2 == 0:
        resultado.append(n)
print(resultado == pares)`,
  },
  {
    id: 'dicionarios', set: 'estruturas', name: '3. Dicionários e conjuntos', input: '',
    code: `aluno = {"nome": "Rui", "curso": "Informática", "notas": [14, 16, 12]}

print(aluno["nome"])
print(aluno.get("email", "sem email"))     # get evita o KeyError

aluno["ano"] = 2
for chave, valor in aluno.items():
    print(f"  {chave}: {valor}")

# contar ocorrências: o caso de uso clássico
texto = "a casa da cara da caca"
contagem = {}
for palavra in texto.split():
    contagem[palavra] = contagem.get(palavra, 0) + 1
print(contagem)

# conjuntos: sem repetidos, com operações de teoria de conjuntos
a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a & b, a | b, a - b)`,
  },
  {
    id: 'tuplos', set: 'estruturas', name: '4. Tuplos, pilhas e filas', input: '',
    code: `from collections import deque

ponto = (3, 7)          # tuplo: imutável
x, y = ponto            # desempacotamento
print(x, y)

pilha = []              # LIFO — uma lista chega
pilha.append("a"); pilha.append("b"); pilha.append("c")
print("pop:", pilha.pop(), "| resta:", pilha)

fila = deque(["a", "b", "c"])   # FIFO — deque é O(1) nas duas pontas
fila.append("d")
print("popleft:", fila.popleft(), "| resta:", list(fila))`,
  },
  {
    id: 'classe', set: 'poo', name: '1. Primeira classe', input: '',
    code: `class Conta:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.saldo = saldo

    def depositar(self, valor):
        if valor <= 0:
            raise ValueError("O depósito tem de ser positivo.")
        self.saldo += valor

    def levantar(self, valor):
        if valor > self.saldo:
            return False
        self.saldo -= valor
        return True

    def __str__(self):
        return f"Conta de {self.titular}: {self.saldo:.2f} €"

c = Conta("Ana", 100)
c.depositar(50)
print(c.levantar(500))   # False — saldo insuficiente
print(c)`,
  },
  {
    id: 'heranca', set: 'poo', name: '2. Herança e polimorfismo', input: '',
    code: `class Figura:
    def area(self):
        raise NotImplementedError

    def descrever(self):
        return f"{type(self).__name__} com área {self.area():.2f}"

class Retangulo(Figura):
    def __init__(self, largura, altura):
        self.largura, self.altura = largura, altura
    def area(self):
        return self.largura * self.altura

class Circulo(Figura):
    def __init__(self, raio):
        self.raio = raio
    def area(self):
        return 3.14159 * self.raio ** 2

# polimorfismo: o mesmo ciclo trata os dois tipos
for f in [Retangulo(3, 4), Circulo(2), Retangulo(5, 5)]:
    print(f.descrever())`,
  },
  {
    id: 'encapsulamento', set: 'poo', name: '3. Encapsulamento e @property', input: '',
    code: `class Temperatura:
    def __init__(self, celsius=0):
        self._celsius = celsius          # o _ diz "não mexas diretamente"

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, valor):
        if valor < -273.15:
            raise ValueError("Abaixo do zero absoluto.")
        self._celsius = valor

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperatura(25)
print(t.celsius, "°C =", t.fahrenheit, "°F")
t.celsius = 100
print(t.fahrenheit)
try:
    t.celsius = -300
except ValueError as e:
    print("Erro:", e)`,
  },
  {
    id: 'dataclass', set: 'poo', name: '4. Dataclasses e coleções de objetos', input: '',
    code: `from dataclasses import dataclass

@dataclass
class Produto:
    nome: str
    preco: float
    stock: int = 0

    @property
    def valor_em_stock(self):
        return self.preco * self.stock

catalogo = [
    Produto("Teclado", 25.0, 10),
    Produto("Rato", 12.5, 40),
    Produto("Monitor", 149.9, 3),
]

for p in catalogo:
    print(p)

total = sum(p.valor_em_stock for p in catalogo)
print(f"Valor total em stock: {total:.2f} €")
print("Mais caro:", max(catalogo, key=lambda p: p.preco).nome)`,
  },
  {
    id: 'series', set: 'pandas', name: '1. Series e DataFrame', input: '', packages: ['pandas'],
    code: `import pandas as pd

s = pd.Series([14, 9, 18, 11], index=["Ana", "Rui", "Sara", "Tomás"], name="nota")
print(s)
print("média:", s.mean(), "| máximo:", s.max())
print()

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info"],
    "nota": [14, 9, 18, 11, 20],
    "faltas": [2, 7, 0, 4, 1],
})
print(df)
print()
print(df.dtypes)
print("dimensões:", df.shape)`,
  },
  {
    id: 'selecao', set: 'pandas', name: '2. Seleção e filtros', input: '', packages: ['pandas'],
    code: `import pandas as pd

df = pd.DataFrame({
    "nome": ["Ana", "Rui", "Sara", "Tomás", "Inês"],
    "curso": ["Info", "Gestão", "Info", "Gestão", "Info"],
    "nota": [14, 9, 18, 11, 20],
    "faltas": [2, 7, 0, 4, 1],
})

print(df["nota"].tolist())            # uma coluna
print(df[["nome", "nota"]].head(3))   # várias colunas
print()
print(df.loc[df["nota"] >= 14])       # filtro por condição
print()
print(df.loc[(df["curso"] == "Info") & (df["faltas"] < 2), "nome"].tolist())
print()
df["aprovado"] = df["nota"] >= 10     # coluna calculada
print(df)`,
  },
  {
    id: 'groupby', set: 'pandas', name: '3. groupby e agregações', input: '', packages: ['pandas'],
    code: `import pandas as pd

vendas = pd.DataFrame({
    "loja": ["Lisboa", "Porto", "Lisboa", "Faro", "Porto", "Lisboa"],
    "mes": ["jan", "jan", "fev", "fev", "fev", "mar"],
    "valor": [1200, 800, 1500, 400, 950, 1100],
})

print(vendas.groupby("loja")["valor"].sum())
print()
print(vendas.groupby("loja")["valor"].agg(["count", "sum", "mean"]))
print()
print(vendas.pivot_table(index="loja", columns="mes", values="valor", fill_value=0))
print()
print(vendas.sort_values("valor", ascending=False).head(3))`,
  },
  {
    id: 'limpeza', set: 'pandas', name: '4. Dados em falta e junções', input: '', packages: ['pandas'],
    code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "id": [1, 2, 3, 4],
    "nome": ["Ana", "Rui", "Sara", "Tomás"],
    "nota": [14, np.nan, 18, np.nan],
})

print(df.isna().sum())
print()
print(df.fillna({"nota": df["nota"].mean()}))
print()
print(df.dropna())
print()

cursos = pd.DataFrame({"id": [1, 2, 3], "curso": ["Info", "Gestão", "Info"]})
print(df.merge(cursos, on="id", how="left"))`,
  },
];

const SET_LABEL: Record<ExampleSet, string> = {
  basico: 'Fundamentos', estruturas: 'Estruturas de dados', poo: 'Objetos', pandas: 'Pandas',
};

export const usePython = () => useCodeRunner(pythonRunner);

export function PythonLab({ initial, initialInput, packages, set, compact }: {
  initial?: string; initialInput?: string; packages?: string[]; set?: ExampleSet; compact?: boolean;
}) {
  const examples = useMemo(() => (set ? PY_EXAMPLES.filter((e) => e.set === set) : PY_EXAMPLES), [set]);
  const [code, setCode] = useState(initial ?? examples[0].code);
  const [input, setInput] = useState(initialInput ?? examples[0].input);
  const [pkgs, setPkgs] = useState<string[]>(packages ?? examples[0].packages ?? []);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const { busy, status, result, execute, abort, clear } = usePython();
  const correr = () => execute({ code, stdin: input, packages: pkgs });

  const lines = useMemo(() => code.split('\n').length, [code]);

  const loadExample = (id: string) => {
    const ex = PY_EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setCode(ex.code);
    setInput(ex.input);
    setPkgs(ex.packages ?? []);
    clear();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = areaRef.current!;
      const s = el.selectionStart, en = el.selectionEnd;
      setCode(code.slice(0, s) + '    ' + code.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); correr(); }
  };

  return (
    <WidgetShell
      title="Laboratório de Python"
      subtitle="Python 3 a sério, dentro do browser. A primeira execução demora alguns segundos a carregar o interpretador. Ctrl/Cmd + Enter para correr."
      actions={
        <div className="flex flex-wrap gap-2">
          {!compact && (
            <select className="field w-auto py-1.5 text-xs" onChange={(e) => loadExample(e.target.value)} defaultValue="" aria-label="Carregar exemplo">
              <option value="" disabled>Carregar exemplo…</option>
              {(['basico', 'estruturas', 'poo', 'pandas'] as ExampleSet[])
                .filter((s) => examples.some((e) => e.set === s))
                .map((s) => (
                  <optgroup key={s} label={SET_LABEL[s]}>
                    {examples.filter((e) => e.set === s).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </optgroup>
                ))}
            </select>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => correr()} disabled={busy}>
            {busy ? 'A correr…' : '▶ Executar'}
          </button>
          {busy && <button className="btn btn-ghost btn-sm" onClick={abort}>■ Parar</button>}
        </div>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">Código ({lines} linhas)</span>
            <button className="text-xs text-muted underline" onClick={() => { setCode(''); clear(); }}>limpar</button>
          </div>
          <textarea
            ref={areaRef}
            className="field scrollbar-thin h-80 resize-y leading-relaxed"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            aria-label="Editor de código Python"
          />
          <div className="mt-2">
            <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Entrada (uma linha por cada input())</span>
            <textarea className="field h-20 resize-y" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} aria-label="Dados de entrada" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">
            Saída {pkgs.length > 0 && <span className="normal-case">· usa {pkgs.join(', ')}</span>}
          </span>
          <div className="h-80"><ConsoleOutput result={result} busy={busy} status={status} /></div>
        </div>
      </div>
    </WidgetShell>
  );
}
