import type { Module } from '../types';

export const m15: Module = {
  id: 'python-poo',
  number: 15,
  title: 'Programação orientada a objetos',
  subtitle: 'Classes, objetos, herança e encapsulamento — organizar código à volta dos dados',
  icon: '🧱',
  minutes: 60,
  goals: [
    'Escrever classes com atributos, métodos e construtor',
    'Perceber a diferença entre classe e instância, e o papel do `self`',
    'Usar herança e polimorfismo sem exagerar na hierarquia',
    'Encapsular estado com `_atributo` e `@property`',
    'Escolher entre uma classe, uma função e uma dataclass',
  ],
  sections: [
    {
      id: 'porque-objetos',
      title: 'Porquê objetos',
      blocks: [
        { type: 'p', text: 'Até agora os teus programas tinham dados de um lado (variáveis, listas, dicionários) e comportamento do outro (funções). Funciona bem até o programa crescer. A partir de certa dimensão, começas a passar sempre os mesmos cinco argumentos às mesmas dez funções — sinal de que aqueles dados e aquelas funções pertencem juntos.' },
        { type: 'code', lang: 'python', caption: 'o mesmo problema, duas organizações', code: `# Sem objetos: os dados andam soltos e as funções repetem argumentos
conta = {"titular": "Ana", "saldo": 100}

def depositar(conta, valor):
    conta["saldo"] += valor

def levantar(conta, valor):
    if valor > conta["saldo"]:
        return False
    conta["saldo"] -= valor
    return True

# Nada impede isto:
conta["saldo"] = -5000        # ninguém validou nada
conta["sldo"] = 100           # erro de escrita, aceite em silêncio` },
        { type: 'p', text: 'Uma **classe** resolve os dois problemas: junta os dados ao comportamento que os manipula, e permite impor regras sobre o que é um valor válido. Um **objeto** (ou instância) é um exemplar concreto criado a partir dessa classe.' },
        {
          type: 'terms',
          items: [
            { term: 'Classe', def: 'O molde: define que atributos e que métodos vão existir. `Conta`.' },
            { term: 'Objeto / instância', def: 'Um exemplar concreto criado a partir do molde, com valores próprios. `Conta("Ana", 100)`.' },
            { term: 'Atributo', def: 'Um dado guardado no objeto: `self.saldo`.' },
            { term: 'Método', def: 'Uma função definida dentro da classe, que opera sobre o objeto: `depositar()`.' },
            { term: 'Construtor', def: 'O método `__init__`, chamado automaticamente quando o objeto é criado.' },
          ],
        },
        { type: 'widget', id: 'python-lab', props: { set: 'poo' } },
      ],
    },
    {
      id: 'classes',
      title: 'A primeira classe',
      blocks: [
        { type: 'code', lang: 'python', caption: 'a mesma conta, agora como classe', code: `class Conta:
    def __init__(self, titular, saldo=0):
        self.titular = titular      # atributo de instância
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

c1 = Conta("Ana", 100)       # __init__ corre aqui
c2 = Conta("Rui")            # saldo fica com o valor por omissão, 0

c1.depositar(50)
print(c1.titular, c1.saldo)  # Ana 150
print(c2.titular, c2.saldo)  # Rui 0  — objetos independentes
print(c1.levantar(1000))     # False` },
        { type: 'callout', tone: 'key', title: 'O que é o `self`', text: '`self` é o próprio objeto, passado automaticamente como primeiro argumento de todos os métodos. Quando escreves `c1.depositar(50)`, o Python chama `Conta.depositar(c1, 50)`. É por isso que `self` aparece na definição mas não na chamada — e é por isso que **todos os atributos se acedem por `self.`**.' },
        { type: 'callout', tone: 'trap', text: 'Esquecer `self` na definição de um método dá `TypeError: método takes 1 positional argument but 2 were given`. E esquecer `self.` dentro do método cria uma variável local que desaparece quando o método termina — o atributo nunca chega a mudar.' },
        { type: 'h', text: 'Atributos de classe vs de instância' },
        { type: 'code', lang: 'python', caption: 'partilhado vs próprio', code: `class Conta:
    banco = "Caixa Central"      # atributo de CLASSE: partilhado por todas
    contador = 0

    def __init__(self, titular):
        self.titular = titular   # atributo de INSTÂNCIA: um por objeto
        Conta.contador += 1
        self.numero = Conta.contador

a = Conta("Ana")
b = Conta("Rui")
print(a.banco, b.banco)          # o mesmo para as duas
print(a.numero, b.numero)        # 1 2 — próprio de cada uma
print(Conta.contador)            # 2` },
      ],
    },
    {
      id: 'metodos-especiais',
      title: 'Métodos especiais',
      blocks: [
        { type: 'p', text: 'Os métodos com dois underscores de cada lado (chamados *dunder*, de *double underscore*) ligam a tua classe à sintaxe da linguagem: são eles que fazem `print(obj)`, `len(obj)`, `a + b` e `a == b` funcionarem em objetos teus.' },
        {
          type: 'table',
          head: ['Método', 'Ativa-se com', 'Devolve'],
          rows: [
            ['`__init__`', '`Conta("Ana")`', 'Nada — inicializa o objeto'],
            ['`__str__`', '`print(obj)`, `str(obj)`', 'Texto para humanos'],
            ['`__repr__`', 'Consola, `repr(obj)`, listas', 'Texto para programadores'],
            ['`__len__`', '`len(obj)`', 'Inteiro'],
            ['`__eq__`', '`a == b`', '`True`/`False`'],
            ['`__lt__`', '`a < b`, `sorted(lista)`', '`True`/`False`'],
            ['`__add__`', '`a + b`', 'Um objeto novo'],
            ['`__getitem__`', '`obj[i]`', 'O elemento'],
          ],
        },
        { type: 'code', lang: 'python', caption: 'uma classe que se integra na linguagem', code: `class Turma:
    def __init__(self, nome, alunos=None):
        self.nome = nome
        self.alunos = alunos or []

    def __str__(self):
        return f"Turma {self.nome} ({len(self.alunos)} alunos)"

    def __repr__(self):
        return f"Turma({self.nome!r}, {self.alunos!r})"

    def __len__(self):
        return len(self.alunos)

    def __getitem__(self, i):
        return self.alunos[i]

t = Turma("12A", ["Ana", "Rui", "Sara"])
print(t)             # usa __str__
print([t])           # dentro de uma lista usa __repr__
print(len(t))        # 3
print(t[1])          # Rui
for aluno in t:      # __getitem__ chega para o for funcionar
    print(" -", aluno)` },
        { type: 'callout', tone: 'tip', text: 'Se só implementares um, implementa `__repr__`: o Python usa-o como alternativa quando não há `__str__`, e é o que aparece quando o objeto está dentro de uma lista ou dicionário. A convenção é que `repr` mostre algo que, colado no código, recriaria o objeto.' },
      ],
    },
    {
      id: 'heranca',
      title: 'Herança e polimorfismo',
      blocks: [
        { type: 'p', text: '**Herança** é dizer "esta classe é como aquela, mais isto". A subclasse recebe todos os atributos e métodos da superclasse e pode acrescentar ou substituir o que quiser.' },
        { type: 'code', lang: 'python', caption: 'herança com super()', code: `class Funcionario:
    def __init__(self, nome, salario):
        self.nome = nome
        self.salario = salario

    def pagamento(self):
        return self.salario

    def __str__(self):
        return f"{type(self).__name__} {self.nome}: {self.pagamento():.2f} €"

class Gestor(Funcionario):
    def __init__(self, nome, salario, bonus):
        super().__init__(nome, salario)    # reaproveita o construtor do pai
        self.bonus = bonus

    def pagamento(self):                    # substitui (override) o método
        return self.salario + self.bonus

class Estagiario(Funcionario):
    def pagamento(self):
        return self.salario * 0.5

equipa = [Funcionario("Ana", 1500), Gestor("Rui", 2500, 800), Estagiario("Sara", 1000)]

for p in equipa:            # polimorfismo: o mesmo ciclo, comportamentos diferentes
    print(p)

print(f"Total: {sum(p.pagamento() for p in equipa):.2f} €")` },
        { type: 'callout', tone: 'key', title: 'Polimorfismo em uma frase', text: 'O mesmo `p.pagamento()` chama três implementações diferentes, decididas em execução pelo tipo real de `p`. O ciclo não sabe — nem precisa de saber — que tipos existem. Acrescentar uma classe `Diretor` não obriga a mexer no ciclo.' },
        { type: 'code', lang: 'python', caption: 'isinstance e a hierarquia', code: `g = Gestor("Rui", 2500, 800)
print(isinstance(g, Gestor))        # True
print(isinstance(g, Funcionario))   # True — um gestor é um funcionário
print(type(g) is Funcionario)       # False — o tipo exato é Gestor
print(Gestor.__mro__)               # a ordem em que o Python procura os métodos` },
        { type: 'callout', tone: 'trap', title: 'Herança é a ferramenta de que se abusa mais', text: 'Só uses herança quando a frase "**um X é um Y**" for verdadeira sem torcer o sentido. Um gestor é um funcionário: certo. Um carro é um motor: errado — o carro **tem** um motor, e isso é composição (um atributo), não herança. Hierarquias com mais de 2 ou 3 níveis são quase sempre um erro de desenho.' },
        {
          type: 'compare',
          left: { title: 'Herança — "é um"', items: ['`class Gestor(Funcionario)`', 'Partilha e especializa comportamento', 'Ligação rígida: mudar o pai afeta todos os filhos', 'Boa para 2 ou 3 níveis, no máximo'] },
          right: { title: 'Composição — "tem um"', items: ['`self.motor = Motor()`', 'Junta peças independentes', 'Ligação frouxa: fácil de substituir e testar', 'A escolha por omissão quando há dúvida'] },
        },
      ],
    },
    {
      id: 'encapsulamento',
      title: 'Encapsulamento e propriedades',
      blocks: [
        { type: 'p', text: 'Encapsular é esconder o estado interno e expor apenas operações válidas. Python não tem `private` — tem uma convenção que toda a gente respeita: um underscore à frente do nome significa "isto é interno, não mexas".' },
        {
          type: 'table',
          head: ['Nome', 'Significa', 'O Python impede o acesso?'],
          rows: [
            ['`saldo`', 'Público — faz parte da interface', 'Não'],
            ['`_saldo`', 'Interno por convenção', 'Não — mas quem lá mexer sabe o risco que corre'],
            ['`__saldo`', 'Sofre *name mangling* para `_Classe__saldo`', 'Dificulta, sobretudo para evitar colisões em subclasses'],
          ],
        },
        { type: 'code', lang: 'python', caption: '@property: um atributo com regras', code: `class Temperatura:
    def __init__(self, celsius=0):
        self.celsius = celsius        # passa pelo setter, logo é validado

    @property
    def celsius(self):                # leitura: t.celsius
        return self._celsius

    @celsius.setter
    def celsius(self, valor):         # escrita: t.celsius = 30
        if valor < -273.15:
            raise ValueError("Abaixo do zero absoluto.")
        self._celsius = valor

    @property
    def fahrenheit(self):             # calculado, só de leitura
        return self._celsius * 9 / 5 + 32

t = Temperatura(25)
print(t.celsius, t.fahrenheit)
t.celsius = 100                       # parece um atributo, corre código
print(t.fahrenheit)
try:
    t.celsius = -300
except ValueError as e:
    print("Erro:", e)` },
        { type: 'callout', tone: 'key', text: 'A vantagem de `@property` é poderes começar com um atributo público simples e, mais tarde, acrescentar validação **sem mudar uma linha do código que usa a classe**. Em Java isso obrigaria a `getSaldo()`/`setSaldo()` desde o início; em Python só se paga a complexidade quando ela é precisa.' },
      ],
    },
    {
      id: 'dataclasses',
      title: 'Dataclasses e quando não usar classes',
      blocks: [
        { type: 'p', text: 'Quando a classe existe sobretudo para **guardar dados**, escrever `__init__`, `__repr__` e `__eq__` à mão é trabalho repetitivo. O decorador `@dataclass` gera-os por ti.' },
        { type: 'code', lang: 'python', caption: 'dataclass', code: `from dataclasses import dataclass, field

@dataclass
class Produto:
    nome: str
    preco: float
    stock: int = 0
    etiquetas: list = field(default_factory=list)   # nunca uses = [] aqui!

    @property
    def valor_em_stock(self):
        return self.preco * self.stock

p = Produto("Teclado", 25.0, 10)
q = Produto("Teclado", 25.0, 10)

print(p)              # __repr__ gerado, legível
print(p == q)         # True — __eq__ compara campo a campo
print(p.valor_em_stock)` },
        { type: 'callout', tone: 'trap', text: 'Numa dataclass, um valor por omissão mutável (`= []`) dá erro logo na definição — o Python obriga-te a usar `field(default_factory=list)`. É a mesma armadilha do parâmetro mutável do módulo 13, aqui apanhada pela linguagem.' },
        { type: 'h', text: 'Nem tudo precisa de ser uma classe' },
        {
          type: 'compare',
          left: { title: 'Faz uma classe quando…', items: ['Há estado que muda ao longo do tempo', 'Há regras sobre o que é um valor válido', 'Vais ter várias instâncias independentes', 'Há várias variantes com o mesmo contrato (polimorfismo)'] },
          right: { title: 'Chega uma função quando…', items: ['É uma transformação sem estado: entra, sai', 'A "classe" só tem um método além do `__init__`', 'Nunca vais criar mais do que uma instância', 'Um dicionário ou um tuplo nomeado resolve'] },
        },
        { type: 'callout', tone: 'warn', title: 'O antipadrão mais comum', text: 'Uma classe com `__init__` e um único método `executar()` é uma função disfarçada. Escreve a função. A orientação a objetos serve para gerir estado e variação de comportamento, não para dar um ar profissional ao ficheiro.' },
      ],
    },
    {
      id: 'exemplo-completo',
      title: 'Um exemplo completo',
      blocks: [
        { type: 'p', text: 'Junta tudo: construtor, validação, propriedade calculada, métodos especiais, herança e polimorfismo — num tamanho realista.' },
        { type: 'widget', id: 'python-lab', props: { set: 'poo', code: `class Biblioteca:
    def __init__(self, nome):
        self.nome = nome
        self._itens = []

    def acrescentar(self, item):
        self._itens.append(item)
        return self

    def __len__(self):
        return len(self._itens)

    def disponiveis(self):
        return [i for i in self._itens if i.disponivel]


class Item:
    def __init__(self, titulo, ano):
        self.titulo = titulo
        self.ano = ano
        self.disponivel = True

    def requisitar(self):
        if not self.disponivel:
            return False
        self.disponivel = False
        return True

    def prazo_dias(self):
        raise NotImplementedError("Cada tipo de item define o seu prazo.")

    def __str__(self):
        estado = "disponível" if self.disponivel else "requisitado"
        return f"{type(self).__name__}: {self.titulo} ({self.ano}) — {estado}, {self.prazo_dias()} dias"


class Livro(Item):
    def prazo_dias(self):
        return 21


class DVD(Item):
    def prazo_dias(self):
        return 7


class Revista(Item):
    def prazo_dias(self):
        return 3


b = Biblioteca("Municipal")
b.acrescentar(Livro("Os Maias", 1888)).acrescentar(DVD("Blade Runner", 1982)).acrescentar(Revista("Nature", 2024))

b.disponiveis()[1].requisitar()

print(f"{b.nome}: {len(b)} itens")
for item in b._itens:
    print(" -", item)
print("Disponíveis agora:", len(b.disponiveis()))` } },
      ],
    },
  ],
  quiz: [
    { id: 'oo1', prompt: 'O que é o `self` num método?', options: ['Uma palavra reservada da linguagem', 'O próprio objeto, passado automaticamente como primeiro argumento', 'Uma cópia do objeto', 'A classe'], answer: 1, explain: '`c.metodo(x)` é açúcar sintático para `Classe.metodo(c, x)`. `self` é apenas o nome convencional desse primeiro parâmetro — podia chamar-se outra coisa, mas ninguém o faz.' },
    { id: 'oo2', prompt: 'Quando é que `__init__` é executado?', options: ['Sempre que se acede a um atributo', 'Quando o objeto é criado', 'Quando o objeto é destruído', 'Só se for chamado explicitamente'], answer: 1, explain: '`Conta("Ana")` cria o objeto e chama `__init__` com ele como `self`. É onde se definem os atributos de instância.' },
    { id: 'oo3', prompt: 'Qual é a diferença entre atributo de classe e de instância?', options: ['Nenhuma', 'O de classe é partilhado por todas as instâncias; o de instância é próprio de cada objeto', 'O de classe é sempre privado', 'O de instância não pode mudar'], answer: 1, explain: 'O atributo de classe vive na classe e é visto por todas as instâncias; o de instância é criado com `self.x = ...` e existe uma cópia por objeto.' },
    { id: 'oo4', prompt: 'Para que serve `super().__init__(...)`?', options: ['Criar um objeto novo', 'Chamar o construtor da superclasse para não repetir código', 'Tornar a classe abstrata', 'Apagar os atributos herdados'], answer: 1, explain: 'A subclasse reaproveita a inicialização do pai e só acrescenta o que é seu. Sem isso, os atributos definidos no construtor do pai não chegam a existir.' },
    { id: 'oo5', prompt: 'Qual destas relações justifica herança?', options: ['Um carro **tem** um motor', 'Uma encomenda **tem** produtos', 'Um gestor **é** um funcionário', 'Uma fatura **tem** um cliente'], answer: 2, explain: 'Herança modela "é um". As outras três são relações "tem um" — resolvem-se com composição, ou seja, guardando o outro objeto como atributo.' },
    { id: 'oo6', prompt: 'O que faz `@property` num método?', options: ['Torna-o privado', 'Permite lê-lo como se fosse um atributo, mas com código a correr', 'Torna-o mais rápido', 'Obriga a passar argumentos por nome'], answer: 1, explain: 'Permite manter a sintaxe simples `obj.x` e, ao mesmo tempo, validar ou calcular o valor. É o que evita ter de escrever getters e setters desde o início.' },
    { id: 'oo7', prompt: 'O que significa `_saldo` com um underscore à frente?', options: ['O Python impede o acesso de fora', 'É uma convenção: "interno, não mexas"', 'É um atributo de classe', 'É obrigatório em dataclasses'], answer: 1, explain: 'Python não impõe privacidade. O underscore é um sinal para quem lê o código; ferramentas e programadores respeitam-no, mas o acesso continua tecnicamente possível.' },
    { id: 'oo8', prompt: 'Uma classe com `__init__` e um único método `executar()` é normalmente sinal de quê?', options: ['Bom desenho orientado a objetos', 'Uma função disfarçada de classe', 'Falta de herança', 'Necessidade de uma dataclass'], answer: 1, explain: 'Se não há estado a gerir nem variação de comportamento, a classe só acrescenta cerimónia. Uma função faz o mesmo com menos código e é mais fácil de testar.' },
  ],
  exercises: [
    {
      id: 'e15-1', difficulty: 1, kind: 'predict', title: 'Instâncias independentes',
      statement: 'Que valores são impressos?',
      code: `class Caixa:
    def __init__(self, valor=0):
        self.valor = valor
    def somar(self, n):
        self.valor += n

a = Caixa(10)
b = Caixa()
a.somar(5)
b.somar(3)
print(a.valor, b.valor)`,
      accept: ['15 3'],
      hint: 'Cada objeto tem os seus próprios atributos de instância.',
      solution: '`15 3`. Cada chamada a `Caixa(...)` cria um objeto novo com o seu próprio `valor`; alterar um não afeta o outro.',
    },
    {
      id: 'e15-2', difficulty: 2, kind: 'predict', title: 'Atributo de classe',
      statement: 'Atenção: `total` está definido na classe, não em `__init__`. Que imprime?',
      code: `class Contador:
    total = 0
    def __init__(self):
        Contador.total += 1

a = Contador()
b = Contador()
c = Contador()
print(Contador.total, a.total, c.total)`,
      accept: ['3 3 3'],
      hint: '`Contador.total` é partilhado; as instâncias leem-no da classe.',
      solution: '`3 3 3`. Foram criadas três instâncias e cada `__init__` incrementou o **mesmo** atributo de classe. Como nenhuma instância criou um `self.total` próprio, `a.total` e `c.total` vão ler o valor da classe.',
    },
    {
      id: 'e15-3', difficulty: 2, kind: 'predict', title: 'Polimorfismo',
      statement: 'Qual é a saída, linha a linha?',
      code: `class Animal:
    def som(self):
        return "..."
    def falar(self):
        return f"{type(self).__name__} faz {self.som()}"

class Cao(Animal):
    def som(self):
        return "ão ão"

class Gato(Animal):
    def som(self):
        return "miau"

for a in [Animal(), Cao(), Gato()]:
    print(a.falar())`,
      accept: ['Animal faz ... Cao faz ão ão Gato faz miau'],
      hint: '`falar()` está definido só uma vez, mas `self.som()` resolve-se pelo tipo real do objeto.',
      solution: '`Animal faz ...`, `Cao faz ão ão`, `Gato faz miau`. O método `falar` é herdado tal e qual pelas três classes, mas a chamada `self.som()` é resolvida em execução pelo tipo do objeto — é exatamente isso o polimorfismo.',
    },
    {
      id: 'e15-4', difficulty: 2, kind: 'predict', title: '__str__ e __repr__',
      statement: 'Repara em qual dos dois métodos é usado em cada `print`.',
      code: `class P:
    def __init__(self, n):
        self.n = n
    def __str__(self):
        return f"P bonito {self.n}"
    def __repr__(self):
        return f"P({self.n})"

p = P(1)
print(p)
print([p, P(2)])`,
      accept: ['P bonito 1 [P(1), P(2)]'],
      hint: 'Dentro de coleções, o Python usa sempre `__repr__`.',
      solution: 'Imprime `P bonito 1` e depois `[P(1), P(2)]`. `print(obj)` usa `__str__`; um objeto dentro de uma lista é formatado com `__repr__`, mesmo que exista `__str__`.',
    },
    {
      id: 'e15-5', difficulty: 2, kind: 'code', title: 'Classe Retangulo',
      statement: 'Escreve uma classe `Retangulo` com largura e altura, propriedades calculadas `area` e `perimetro`, um método `e_quadrado()`, e `__str__`. Valida no setter que largura e altura são positivas. Cria três retângulos, ordena-os por área e imprime-os.',
      hint: 'Usa `@property` para `area` (só leitura) e `sorted(lista, key=lambda r: r.area)`.',
      solution: `class Retangulo:
    def __init__(self, largura, altura):
        self.largura = largura
        self.altura = altura

    @property
    def largura(self):
        return self._largura

    @largura.setter
    def largura(self, v):
        if v <= 0:
            raise ValueError("A largura tem de ser positiva.")
        self._largura = v

    @property
    def altura(self):
        return self._altura

    @altura.setter
    def altura(self, v):
        if v <= 0:
            raise ValueError("A altura tem de ser positiva.")
        self._altura = v

    @property
    def area(self):
        return self.largura * self.altura

    @property
    def perimetro(self):
        return 2 * (self.largura + self.altura)

    def e_quadrado(self):
        return self.largura == self.altura

    def __str__(self):
        return f"{self.largura}x{self.altura} — área {self.area}, perímetro {self.perimetro}"

figuras = [Retangulo(3, 4), Retangulo(5, 5), Retangulo(2, 9)]
for r in sorted(figuras, key=lambda r: r.area):
    print(r, "(quadrado)" if r.e_quadrado() else "")`,
    },
    {
      id: 'e15-6', difficulty: 3, kind: 'code', title: 'Carrinho de compras',
      statement: 'Modela um carrinho de compras: uma dataclass `Artigo` (nome, preço, quantidade) com propriedade `subtotal`, e uma classe `Carrinho` que acrescente artigos, calcule o total, aplique um desconto percentual e implemente `__len__` e `__str__`. Junta pelo menos três artigos e imprime o recibo.',
      hint: 'Usa `@dataclass` para o `Artigo` e uma lista dentro do `Carrinho`. O total é `sum(a.subtotal for a in self.artigos)`.',
      solution: `from dataclasses import dataclass, field

@dataclass
class Artigo:
    nome: str
    preco: float
    quantidade: int = 1

    @property
    def subtotal(self):
        return self.preco * self.quantidade


class Carrinho:
    def __init__(self, desconto=0.0):
        self.artigos: list = []
        self.desconto = desconto

    def acrescentar(self, artigo):
        self.artigos.append(artigo)
        return self

    @property
    def subtotal(self):
        return sum(a.subtotal for a in self.artigos)

    @property
    def total(self):
        return self.subtotal * (1 - self.desconto)

    def __len__(self):
        return sum(a.quantidade for a in self.artigos)

    def __str__(self):
        linhas = [f"{a.quantidade:>2} x {a.nome:<12} {a.subtotal:>8.2f} €" for a in self.artigos]
        linhas.append(f"{'subtotal':<19}{self.subtotal:>8.2f} €")
        linhas.append(f"{'desconto':<19}{-self.subtotal * self.desconto:>8.2f} €")
        linhas.append(f"{'TOTAL':<19}{self.total:>8.2f} €")
        return "\\n".join(linhas)


c = Carrinho(desconto=0.10)
c.acrescentar(Artigo("Teclado", 25.0)).acrescentar(Artigo("Rato", 12.5, 2)).acrescentar(Artigo("Monitor", 149.9))
print(c)
print("artigos:", len(c))`,
    },
  ],
};
