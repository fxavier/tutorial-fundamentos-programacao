import type { Module } from '../types';

export const m13: Module = {
  id: 'java25',
  number: 13,
  title: 'Java 25 — a tua primeira linguagem a sério',
  subtitle: 'Do "Hello, world" ao Virtual Threads: sintaxe moderna, POO, Records, Pattern Matching, Streams e concorrência',
  icon: '☕',
  minutes: 120,
  goals: [
    'Instalar o JDK 25 e executar o primeiro programa em três comandos',
    'Dominar tipos, variáveis, Strings, Text Blocks e inferência com `var`',
    'Usar if/else, switch moderno com pattern matching e ciclos idiomáticos',
    'Modelar o domínio com classes, Records e Sealed Classes',
    'Escrever código funcional com lambdas, Streams e Optional',
    'Entender Virtual Threads, Structured Concurrency e Scoped Values',
    'Escrever testes, organizar o projeto com Maven e saber onde avançar',
  ],
  sections: [
    {
      id: 'porque-java-25',
      title: 'Porquê Java 25',
      blocks: [
        { type: 'p', text: 'Java nasceu em 1995 com um lema simples: *write once, run anywhere*. Hoje, trinta anos depois, é a linguagem por trás dos bancos onde tens conta, da Netflix, do LinkedIn, do Minecraft e de uma boa parte da Google. Não é moda — é infraestrutura.' },
        { type: 'p', text: '**Java 25** saiu em setembro de 2025 e é uma versão **LTS** (*Long-Term Support*): tem suporte garantido até 2033. Se vais aprender Java hoje, aprende esta.' },
        {
          type: 'table',
          head: ['Versão', 'Ano', 'LTS?', 'Trouxe'],
          rows: [
            ['Java 8', '2014', 'Sim (até 2030)', 'Lambdas, Streams, Optional'],
            ['Java 11', '2018', 'Sim', '`var` local, HTTP client moderno'],
            ['Java 17', '2021', 'Sim', 'Records, Sealed Classes, Text Blocks'],
            ['Java 21', '2023', 'Sim', 'Virtual Threads, Pattern Matching para switch'],
            ['**Java 25**', '**2025**', '**Sim (até 2033)**', '**Compact Source Files, Scoped Values, Flexible Constructors, Module Imports**'],
          ],
          caption: 'Só precisas de saber uma versão: a mais recente LTS. Tudo o que vinha antes está lá.',
        },
        {
          type: 'callout', tone: 'key', title: 'O que mudou mesmo com Java 25',
          text: 'Java deixou de ser verboso. O "Hello, world" tem agora **três linhas** em vez de seis. Podes escrever `void main() { ... }` sem classe, usar `IO.println(...)` sem imports, e correr um ficheiro `.java` diretamente — sem compilar à mão. Para quem aprende, muda tudo.',
        },
        {
          type: 'compare',
          left: {
            title: 'Pontos fortes de Java',
            items: [
              'Tipagem estática forte — o compilador apanha erros antes de correres',
              'Imenso mercado de trabalho, sobretudo em backend empresarial',
              'JVM: a mesma aplicação corre em Linux, macOS, Windows',
              'Ecossistema maduro (Spring, Jackson, JUnit, Maven)',
              'Performance que escala: o compilador JIT otimiza em tempo real',
              'Retrocompatibilidade — código de 2005 ainda corre em 2026',
            ],
          },
          right: {
            title: 'Reputações a atualizar',
            items: [
              '"É verboso" — deixou de ser em grande parte',
              '"É lento" — já não é há uma década; a JVM é excelente',
              '"Precisa de IDE pesado" — podes escrever num editor de texto',
              '"Threads são caros" — Virtual Threads mudaram isso em Java 21',
              '"Falta inferência de tipos" — `var` resolve na maior parte dos casos',
              '"Só para empresas grandes" — tens Spring Boot a correr em segundos',
            ],
          },
        },
        {
          type: 'callout', tone: 'info', title: 'Java vs. JavaScript',
          text: '**São linguagens completamente diferentes.** O nome é um acidente de marketing de 1996. Java é tipada e corre na JVM; JavaScript corre no browser e em Node. Confundi-las é como confundir *carpete* com *carpinteiro*.',
        },
      ],
    },
    {
      id: 'instalar-primeiro-programa',
      title: 'Instalar o JDK 25 e o primeiro programa',
      blocks: [
        { type: 'p', text: 'Precisas de duas coisas: o **JDK** (*Java Development Kit*) — que inclui o compilador e a máquina virtual — e um editor. Recomenda-se **IntelliJ IDEA Community** (grátis) ou **VS Code** com a extensão *Extension Pack for Java*.' },
        {
          type: 'steps', items: [
            { title: 'Instalar o JDK 25', text: 'Recomendação: [Temurin 25](https://adoptium.net) ou [Oracle JDK 25](https://jdk.java.net/25/). No macOS: `brew install --cask temurin@25`. No Ubuntu: `sudo apt install openjdk-25-jdk`. No Windows: descarrega o instalador `.msi` do Adoptium.' },
            { title: 'Confirmar a instalação', text: 'Abre o terminal e corre `java --version`. Deves ver algo como `openjdk 25 2025-09-16`. Se vires uma versão mais antiga, atualiza a variável `PATH` ou usa `sdkman` (ver abaixo).' },
            { title: 'Criar o primeiro ficheiro', text: 'Cria uma pasta `curso-java` e dentro dela um ficheiro `Ola.java` com o conteúdo do exemplo abaixo.' },
            { title: 'Executar', text: 'Com Java 25 podes correr diretamente: `java Ola.java`. Sem compilar à parte. Sem gerar `.class`. Modo *script*, mas em Java a sério.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'confirmar que o JDK 25 está instalado',
          code: `$ java --version
openjdk 25 2025-09-16
OpenJDK Runtime Environment Temurin-25+36 (build 25+36)
OpenJDK 64-Bit Server VM Temurin-25+36 (build 25+36, mixed mode)

$ javac --version
javac 25`,
        },
        {
          type: 'code', lang: 'java', caption: 'Ola.java — o "Hello, world" moderno',
          code: `// JEP 512: Compact Source Files + Instance Main Methods (final em Java 25)
// Sem class. Sem static. Sem String[] args. Sem imports.
void main() {
    IO.println("Olá, Java 25!");
}`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Compara com o Java "clássico"',
          text: 'Antes de Java 25 precisavas de `public class Ola { public static void main(String[] args) { System.out.println("..."); } }`. Isto confundia principiantes com oito conceitos (classe, visibilidade, static, void, array, imports) antes de ensinar um único. A nova forma esconde essa complexidade — mas tudo isso continua lá, e vais aprendê-lo nos próximos capítulos.',
        },
        {
          type: 'code', lang: 'bash', caption: 'executar sem compilar — Java 25',
          code: `$ java Ola.java
Olá, Java 25!

# Se preferires compilar primeiro (modo clássico, projetos reais):
$ javac Ola.java       # gera Ola.class
$ java Ola             # corre a classe`,
        },
        {
          type: 'callout', tone: 'info', title: 'O que é a JVM?',
          text: 'A JVM (*Java Virtual Machine*) é um pequeno sistema operativo dentro do teu sistema operativo. O compilador transforma `.java` em *bytecode* (`.class`) — instruções para a JVM, não para o teu processador. A JVM lê esse bytecode e traduz para o CPU real em tempo real (JIT). Resultado: o mesmo `.class` corre em Linux, macOS e Windows, sem alterações.',
        },
      ],
    },
    {
      id: 'tipos-variaveis',
      title: 'Tipos, variáveis e `var`',
      blocks: [
        { type: 'p', text: 'Java é **tipada estaticamente**: cada variável tem um tipo e esse tipo é verificado pelo compilador antes de o programa correr. Isso apanha uma categoria inteira de erros antes de sequer executares.' },
        { type: 'h', text: 'Tipos primitivos (8 no total)' },
        {
          type: 'table',
          head: ['Tipo', 'Tamanho', 'Intervalo', 'Exemplo'],
          rows: [
            ['`byte`', '1 byte', '-128 a 127', '`byte b = 42;`'],
            ['`short`', '2 bytes', '-32 768 a 32 767', '`short s = 1000;`'],
            ['`int`', '4 bytes', '≈ ±2.1 mil milhões', '`int i = 1_000_000;`'],
            ['`long`', '8 bytes', '≈ ±9.2 triliões', '`long l = 99_000_000_000L;`'],
            ['`float`', '4 bytes', '≈ ±3.4×10³⁸ (7 dígitos)', '`float f = 3.14f;`'],
            ['`double`', '8 bytes', '≈ ±1.7×10³⁰⁸ (15 dígitos)', '`double d = 3.14159;`'],
            ['`char`', '2 bytes', '0 a 65 535 (Unicode)', `\`char c = 'A';\``],
            ['`boolean`', '1 bit (lógico)', '`true` ou `false`', '`boolean activo = true;`'],
          ],
          caption: 'O underscore `_` é apenas visual: `1_000_000` é igual a `1000000`, mas lê-se melhor.',
        },
        {
          type: 'code', lang: 'java', caption: 'declarações explícitas',
          code: `int idade = 30;
double saldo = 1_250.75;
boolean activo = true;
char letra = 'J';
long segundosDesdeEpoch = 1_763_000_000L;   // 'L' no fim porque é long
float pi = 3.14f;                           // 'f' no fim porque é float
String nome = "Ana";                        // String é um tipo de referência, não primitivo`,
        },
        { type: 'h', text: '`var` — o compilador infere o tipo' },
        { type: 'p', text: 'Desde Java 10 podes usar `var` para variáveis locais. O compilador deduz o tipo a partir do valor atribuído. **Continua a ser tipagem estática** — o tipo fica fixo, só não o escreves.' },
        {
          type: 'code', lang: 'java', caption: 'var reduz ruído sem perder segurança',
          code: `// Sem var — repetitivo
HashMap<String, List<Cliente>> clientesPorPais = new HashMap<String, List<Cliente>>();

// Com var — o tipo infere-se da direita
var clientesPorPais = new HashMap<String, List<Cliente>>();

var nome = "Ana";       // String
var idade = 30;         // int
var saldo = 1_250.75;   // double

// ⚠ Não funciona sem valor inicial — não há como inferir
// var algo;            // erro de compilação`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Quando NÃO usar `var`',
          text: 'Se o tipo não for óbvio ao ler, prefere o nome explícito. `var resultado = calcular(x);` obriga a saltar à definição de `calcular` para perceber. `BigDecimal resultado = calcular(x);` conta a história ali mesmo. **`var` é para reduzir ruído, não para esconder tipos.**',
        },
        { type: 'h', text: 'Operadores aritméticos e o truque dos inteiros' },
        {
          type: 'code', lang: 'java', caption: 'aritmética — e uma armadilha famosa',
          code: `int a = 10, b = 3;
int quociente = a / b;        // 3  (divisão inteira — trunca!)
int resto = a % b;            // 1  (módulo)

double exacto = 10.0 / 3;     // 3.3333...
double tambem = (double) a / b;  // 3.3333... (cast explícito)

// Armadilha clássica: percentagem com inteiros
int percentagem = (50 / 100) * 200;   // → 0, porque 50/100 == 0 em int
int correcto = 50 * 200 / 100;        // → 100  (multiplica antes de dividir)`,
        },
        {
          type: 'callout', tone: 'trap', title: 'Inteiro / inteiro em Java dá sempre inteiro',
          text: 'Esta foi provavelmente a causa #1 de bugs em principiantes nos últimos 30 anos. Se queres divisão com vírgula, pelo menos um dos operandos tem de ser `double` ou `float`.',
        },
      ],
    },
    {
      id: 'strings-text-blocks',
      title: 'Strings e Text Blocks',
      blocks: [
        { type: 'p', text: 'Uma `String` em Java é um objeto **imutável**: as operações não alteram a string original, criam uma nova. Isto parece desperdício, mas permite otimizações agressivas e elimina bugs de concorrência.' },
        {
          type: 'code', lang: 'java', caption: 'operações comuns com Strings',
          code: `String nome = "Ana Silva";

nome.length();              // 9
nome.toUpperCase();          // "ANA SILVA"  (nome continua "Ana Silva")
nome.toLowerCase();          // "ana silva"
nome.substring(4);           // "Silva"
nome.substring(0, 3);        // "Ana"
nome.replace("Ana", "Beatriz");  // "Beatriz Silva"
nome.contains("Silva");      // true
nome.startsWith("Ana");      // true
nome.indexOf("Silva");       // 4
nome.strip();                // remove espaços nas pontas
nome.split(" ");             // ["Ana", "Silva"]  (array de String)

// Comparação — ERRO clássico
"Ana" == "Ana"               // pode ser true por acaso (string pool)
"Ana".equals("Ana")          // SEMPRE true  — usa SEMPRE equals para comparar Strings`,
        },
        {
          type: 'callout', tone: 'trap', title: '`==` vs `.equals()`',
          text: 'Em Java, `==` compara **referências** (o mesmo objeto na memória), não conteúdo. Para Strings e todos os outros objetos, usa `.equals()`. Esquecer isto é o erro #2 do mundo Java.',
        },
        { type: 'h', text: 'Text Blocks — texto multilinha sem dor' },
        { type: 'p', text: 'Desde Java 15 (em Java 25 completamente integrados), os **Text Blocks** permitem escrever JSON, HTML, SQL ou qualquer texto multilinha de forma legível.' },
        {
          type: 'code', lang: 'java', caption: 'antes e depois dos Text Blocks',
          code: `// Antes — concatenação com \\n explícitos
String jsonAntigo =
    "{\\n" +
    "  \\"nome\\": \\"Ana\\",\\n" +
    "  \\"idade\\": 30\\n" +
    "}";

// Com Text Block — três aspas e o texto literal
String json = """
    {
      "nome": "Ana",
      "idade": 30
    }
    """;

String sql = """
    SELECT nome, email
    FROM clientes
    WHERE pais = 'PT'
      AND activo = true
    ORDER BY nome;
    """;`,
        },
        { type: 'h', text: 'Formatação e concatenação' },
        {
          type: 'code', lang: 'java',
          code: `String nome = "Ana";
int idade = 30;

// 1. Concatenação com +
String msg1 = "Nome: " + nome + ", idade: " + idade;

// 2. String.format — estilo printf
String msg2 = String.format("Nome: %s, idade: %d", nome, idade);
String saldo = String.format("Saldo: %,.2f €", 1250.75);  // "Saldo: 1 250,75 €"

// 3. formatted (instância, Java 15+)
String msg3 = "Nome: %s, idade: %d".formatted(nome, idade);

// 4. StringBuilder — quando concatenas muitas vezes num ciclo
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("linha ").append(i).append("\\n");
}
String grande = sb.toString();`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Porque não concatenar num ciclo',
          text: 'Cada `str += "..."` dentro de um ciclo cria uma String nova. Mil iterações = mil Strings. O `StringBuilder` usa um *buffer* interno mutável e só produz a String final uma vez. Em volumes grandes, a diferença é de milissegundos para minutos.',
        },
      ],
    },
    {
      id: 'controlo-fluxo',
      title: 'Controlo de fluxo: if, switch moderno e pattern matching',
      blocks: [
        { type: 'p', text: 'As três estruturas básicas que já conheces dos módulos de lógica e algoritmos: sequência, decisão e repetição. Aqui ganham superpoderes modernos.' },
        { type: 'h', text: 'if / else' },
        {
          type: 'code', lang: 'java',
          code: `int nota = 15;

if (nota >= 18) {
    IO.println("Excelente");
} else if (nota >= 14) {
    IO.println("Bom");
} else if (nota >= 10) {
    IO.println("Suficiente");
} else {
    IO.println("Reprovado");
}

// Operador ternário — quando é uma expressão simples
String estado = (nota >= 10) ? "passou" : "chumbou";`,
        },
        { type: 'h', text: 'switch expression (Java 14+)' },
        { type: 'p', text: 'O `switch` moderno é uma **expressão**: devolve um valor. Nada de `break` esquecido, nada de *fall-through* acidental.' },
        {
          type: 'code', lang: 'java', caption: 'switch clássico vs. moderno',
          code: `int dia = 3;

// ❌ Clássico — tem fall-through, precisa de break
String nome;
switch (dia) {
    case 1: nome = "Segunda"; break;
    case 2: nome = "Terça"; break;
    case 3: nome = "Quarta"; break;
    default: nome = "Desconhecido";
}

// ✅ Moderno — expressão, arrow syntax, sem fall-through
String nomeDia = switch (dia) {
    case 1 -> "Segunda";
    case 2 -> "Terça";
    case 3 -> "Quarta";
    case 4, 5 -> "Quinta ou sexta";       // vários valores
    case 6, 7 -> "Fim-de-semana";
    default -> "Desconhecido";
};`,
        },
        { type: 'h', text: 'Pattern matching em `switch` (Java 21+)' },
        { type: 'p', text: 'O caso pode ser um **padrão** sobre o tipo do valor. O compilador obriga-te a tratar todos os casos possíveis (exaustividade).' },
        {
          type: 'code', lang: 'java', caption: 'pattern matching: o fim da cadeia de instanceof',
          code: `sealed interface Forma permits Circulo, Rectangulo, Triangulo {}
record Circulo(double raio) implements Forma {}
record Rectangulo(double largura, double altura) implements Forma {}
record Triangulo(double base, double altura) implements Forma {}

double area(Forma f) {
    return switch (f) {
        case Circulo c          -> Math.PI * c.raio() * c.raio();
        case Rectangulo r       -> r.largura() * r.altura();
        case Triangulo t        -> (t.base() * t.altura()) / 2;
    };
    // sem default! O compilador sabe que sealed Forma tem 3 implementações
    // e verifica exaustividade. Se amanhã acrescentares Hexagono, o compilador
    // avisa-te em TODOS os sítios onde tens switch sobre Forma.
}`,
        },
        { type: 'h', text: 'Pattern matching em `instanceof`' },
        {
          type: 'code', lang: 'java', caption: 'instanceof com binding de variável',
          code: `Object obj = "Olá";

// Antes: 3 passos — test, cast, usar
if (obj instanceof String) {
    String s = (String) obj;
    IO.println(s.length());
}

// Agora: 1 passo — testa, declara e dá o valor
if (obj instanceof String s) {
    IO.println(s.length());   // 's' já é String neste bloco
}

// Com negação
if (!(obj instanceof String s)) {
    return;
}
// 's' continua disponível aqui — o compilador segue o fluxo`,
        },
        { type: 'h', text: 'Record patterns — desconstruir ao mesmo tempo' },
        {
          type: 'code', lang: 'java', caption: 'desconstruir records diretamente no switch',
          code: `record Ponto(int x, int y) {}

Object o = new Ponto(3, 4);

// Desconstrução direta — x e y ficam disponíveis
if (o instanceof Ponto(int x, int y)) {
    IO.println("Distância à origem: " + Math.hypot(x, y));
}

// Em switch, aninhado:
sealed interface Forma permits Circulo, Rectangulo {}
record Circulo(double raio) implements Forma {}
record Rectangulo(double largura, double altura) implements Forma {}

String descrever(Forma f) {
    return switch (f) {
        case Circulo(double r) when r > 10 -> "Círculo grande (r=" + r + ")";
        case Circulo(double r)             -> "Círculo pequeno (r=" + r + ")";
        case Rectangulo(double l, double a) when l == a -> "Quadrado " + l;
        case Rectangulo(double l, double a)             -> "Rectângulo " + l + "x" + a;
    };
}`,
        },
        {
          type: 'callout', tone: 'key', title: 'Guards com `when`',
          text: 'A cláusula `when` permite refinar o padrão. "Se é um Círculo **e** o raio é superior a 10, então…". Útil para evitar aninhar `if` dentro do `case`.',
        },
      ],
    },
    {
      id: 'ciclos-metodos',
      title: 'Ciclos e métodos',
      blocks: [
        { type: 'h', text: 'Os quatro ciclos' },
        {
          type: 'code', lang: 'java',
          code: `// 1. for clássico — quando precisas do índice
for (int i = 0; i < 10; i++) {
    IO.println(i);
}

// 2. for-each (enhanced for) — quando só queres os valores
int[] numeros = {10, 20, 30, 40};
for (int n : numeros) {
    IO.println(n);
}

// 3. while — quando a condição não depende de um contador
int tentativas = 0;
while (!conectado && tentativas < 5) {
    tentar();
    tentativas++;
}

// 4. do-while — executa pelo menos uma vez
int opcao;
do {
    opcao = pedirMenu();
} while (opcao != 0);`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Qual ciclo escolher',
          text: '**for-each** é a escolha por omissão para iterar sobre coleções. **for clássico** só quando precisas mesmo do índice. **while** quando não sabes quantas vezes vais iterar. **do-while** quase nunca — raramente é o certo.',
        },
        { type: 'h', text: '`break` e `continue`' },
        {
          type: 'code', lang: 'java',
          code: `for (int i = 0; i < 100; i++) {
    if (i == 50) break;        // sai do ciclo
    if (i % 2 == 0) continue;  // salta para a próxima iteração
    IO.println(i);
}`,
        },
        { type: 'h', text: 'Métodos' },
        { type: 'p', text: 'Um **método** é uma função que vive numa classe (ou, em Java 25, dentro de um compact source file). Tem assinatura — nome, parâmetros e tipo de retorno — e um corpo.' },
        {
          type: 'code', lang: 'java', caption: 'anatomia de um método',
          code: `// Ficheiro Calc.java — Java 25 compact source file
int somar(int a, int b) {
    return a + b;
}

double media(double[] valores) {
    if (valores.length == 0) {
        throw new IllegalArgumentException("lista vazia");
    }
    double total = 0;
    for (double v : valores) total += v;
    return total / valores.length;
}

// Overloading — vários métodos com o mesmo nome e assinaturas diferentes
int somar(int a, int b, int c)       { return a + b + c; }
double somar(double a, double b)     { return a + b; }

// Varargs — número variável de argumentos
int somarTudo(int... numeros) {
    int total = 0;
    for (int n : numeros) total += n;
    return total;
}

void main() {
    IO.println(somar(3, 4));            // 7
    IO.println(somar(3.5, 4.2));        // 7.7
    IO.println(somarTudo(1, 2, 3, 4));  // 10
}`,
        },
        {
          type: 'callout', tone: 'info', title: 'Passagem por valor',
          text: 'Java passa sempre **por valor**. Para primitivos, isso significa uma cópia do número. Para objetos, é uma cópia da **referência** — o teu método pode alterar o conteúdo do objeto apontado, mas se reatribuíres a variável dentro do método, nada muda cá fora.',
        },
      ],
    },
    {
      id: 'arrays-colecoes',
      title: 'Arrays, List, Map e Set',
      blocks: [
        { type: 'h', text: 'Arrays — tamanho fixo, muito rápidos' },
        {
          type: 'code', lang: 'java',
          code: `int[] numeros = new int[5];          // array de 5 ints (todos a 0)
numeros[0] = 10;
numeros[4] = 50;
int n = numeros.length;              // 5

int[] inicializado = {1, 2, 3, 4, 5};
String[] nomes = {"Ana", "Bruno", "Carla"};

// Matrizes (array de arrays)
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
};
int meio = matriz[1][1];             // 5`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Arrays têm tamanho fixo',
          text: 'Uma vez criado, não cresce. Para coleções que mudam de tamanho, usa `List`. Arrays servem sobretudo para dados fixos e para alto desempenho numérico.',
        },
        { type: 'h', text: 'List — a coleção que vais usar 90% das vezes' },
        {
          type: 'code', lang: 'java',
          code: `import java.util.*;

var lista = new ArrayList<String>();
lista.add("Ana");
lista.add("Bruno");
lista.add("Carla");

lista.get(0);              // "Ana"
lista.size();              // 3
lista.contains("Bruno");   // true
lista.remove("Bruno");     // remove por valor
lista.set(0, "Alice");     // substitui por índice

for (var nome : lista) {
    IO.println(nome);
}

// Lista imutável — não dá para alterar depois de criada
var nomes = List.of("Ana", "Bruno", "Carla");
// nomes.add("David");    // ❌ UnsupportedOperationException`,
        },
        { type: 'h', text: 'Map — associa chaves a valores' },
        {
          type: 'code', lang: 'java',
          code: `var idades = new HashMap<String, Integer>();
idades.put("Ana", 30);
idades.put("Bruno", 25);
idades.put("Carla", 28);

idades.get("Ana");             // 30
idades.getOrDefault("X", -1);  // -1 (chave não existe)
idades.containsKey("Bruno");   // true
idades.size();                 // 3

for (var entrada : idades.entrySet()) {
    IO.println(entrada.getKey() + " tem " + entrada.getValue() + " anos");
}

// Map imutável
var capitais = Map.of(
    "Portugal", "Lisboa",
    "Espanha", "Madrid",
    "França", "Paris"
);`,
        },
        { type: 'h', text: 'Set — coleção sem duplicados' },
        {
          type: 'code', lang: 'java',
          code: `var paises = new HashSet<String>();
paises.add("PT");
paises.add("ES");
paises.add("PT");              // ignorado — já lá está
paises.size();                 // 2
paises.contains("PT");         // true

// TreeSet — mantém ordenação
var ordenado = new TreeSet<>(Set.of("banana", "abacate", "cereja"));
// Itera por ordem: abacate, banana, cereja`,
        },
        {
          type: 'table',
          head: ['Operação', '`ArrayList`', '`LinkedList`', '`HashMap`', '`HashSet`', '`TreeMap/TreeSet`'],
          rows: [
            ['Acesso por índice/chave', 'O(1)', 'O(n)', 'O(1) média', 'O(1) média', 'O(log n)'],
            ['Inserção no fim', 'O(1) amortizado', 'O(1)', '—', '—', '—'],
            ['Inserção em posição', 'O(n)', 'O(1) se já tens nó', '—', '—', '—'],
            ['Remoção', 'O(n)', 'O(n)', 'O(1) média', 'O(1) média', 'O(log n)'],
            ['Ordenação', 'Não', 'Não', 'Não', 'Não', 'Sim (automática)'],
          ],
          caption: 'Na dúvida, `ArrayList` + `HashMap` + `HashSet`. 95% dos casos.',
        },
      ],
    },
    {
      id: 'classes-objetos',
      title: 'Classes, objetos e encapsulamento',
      blocks: [
        { type: 'p', text: 'Quando sais do mundo dos *scripts* e começas a construir sistemas, passas a modelar o problema com **classes** — moldes que agrupam dados e comportamento.' },
        {
          type: 'code', lang: 'java', caption: 'uma classe completa',
          code: `public class ContaBancaria {

    // 1. Campos — privados, para proteger o estado
    private final String titular;
    private final String iban;
    private long saldoCentimos;

    // 2. Construtor — como se cria uma instância
    public ContaBancaria(String titular, String iban) {
        if (titular == null || titular.isBlank()) {
            throw new IllegalArgumentException("titular obrigatório");
        }
        this.titular = titular;
        this.iban = iban;
        this.saldoCentimos = 0;
    }

    // 3. Métodos — o comportamento válido
    public void depositar(long centimos) {
        if (centimos <= 0) throw new IllegalArgumentException("valor > 0");
        this.saldoCentimos += centimos;
    }

    public void levantar(long centimos) {
        if (centimos <= 0) throw new IllegalArgumentException("valor > 0");
        if (centimos > saldoCentimos) {
            throw new IllegalStateException("saldo insuficiente");
        }
        this.saldoCentimos -= centimos;
    }

    // 4. Getters — leitura controlada
    public long getSaldoCentimos() { return saldoCentimos; }
    public String getTitular() { return titular; }
}

// Usar:
void main() {
    var conta = new ContaBancaria("Ana", "PT50 0000 0000 0000 0000 0000 0");
    conta.depositar(10_000);                 // 100,00 €
    conta.levantar(2_500);                   // 25,00 €
    IO.println(conta.getSaldoCentimos());    // 7500
}`,
        },
        {
          type: 'terms', items: [
            { term: 'Encapsulamento', def: 'Os campos são `private`. Ninguém acede ao saldo diretamente — só através de `depositar()` e `levantar()`, que validam. Impossível pôr saldo negativo por acidente.' },
            { term: 'final', def: '`private final` significa que o valor não muda depois do construtor. Reduz bugs e torna a classe mais segura para usar em concorrência.' },
            { term: 'this', def: 'Referência ao objeto atual. Dentro do construtor, `this.titular = titular` distingue o campo do parâmetro.' },
            { term: 'new', def: 'Cria uma instância. Aloca memória, chama o construtor e devolve a referência.' },
          ],
        },
        { type: 'h', text: 'Flexible constructor bodies (JEP 513, final em Java 25)' },
        { type: 'p', text: 'Antes de Java 25, a primeira instrução de um construtor tinha de ser `super(...)` ou `this(...)`. Agora podes validar os argumentos primeiro — algo que parece óbvio e que sempre esteve bloqueado.' },
        {
          type: 'code', lang: 'java',
          code: `public class PessoaAdulta extends Pessoa {
    public PessoaAdulta(String nome, int idade) {
        // Antes: isto era proibido — super tinha de vir primeiro
        if (idade < 18) {
            throw new IllegalArgumentException("menor");
        }
        super(nome, idade);   // Java 25: válido
    }
}`,
        },
        { type: 'h', text: 'Herança — usar com moderação' },
        {
          type: 'code', lang: 'java',
          code: `public class Animal {
    protected final String nome;

    public Animal(String nome) { this.nome = nome; }

    public String fazerSom() { return "um som qualquer"; }
}

public class Cao extends Animal {
    public Cao(String nome) { super(nome); }

    @Override                         // declara que estás a sobrescrever
    public String fazerSom() { return "Woof!"; }
}

var rex = new Cao("Rex");
IO.println(rex.fazerSom());           // "Woof!"  (polimorfismo)

Animal a = rex;                       // Cao É-UM Animal
IO.println(a.fazerSom());             // "Woof!"  (chama o método do Cao, não do Animal)`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Composição > Herança',
          text: 'Hierarquias profundas tornam-se rígidas. Em vez de `Carro extends Veiculo extends ObjectoMovel`, prefere `class Carro { private Motor motor; private Rodas rodas; }`. Mais fácil de testar, trocar e perceber.',
        },
      ],
    },
    {
      id: 'records-sealed',
      title: 'Records e Sealed Classes — modelar dados em poucas linhas',
      blocks: [
        { type: 'p', text: 'Quando a tua classe serve apenas para **transportar dados** (um ponto, uma coordenada, uma resposta de API), não precisas de 50 linhas. Records resolvem isso num único.' },
        {
          type: 'code', lang: 'java', caption: 'um record vale por 50 linhas de classe',
          code: `// Classe tradicional — 35 linhas, mesmo com IDE a gerar:
public final class Ponto {
    private final int x;
    private final int y;
    public Ponto(int x, int y) { this.x = x; this.y = y; }
    public int x() { return x; }
    public int y() { return y; }
    @Override public boolean equals(Object o) { /* ... */ }
    @Override public int hashCode() { /* ... */ }
    @Override public String toString() { /* ... */ }
}

// Record — uma linha. Faz tudo isto automaticamente.
public record Ponto(int x, int y) {}

// Usar:
var p = new Ponto(3, 4);
p.x();                          // 3 — getter automático
p.y();                          // 4
p.equals(new Ponto(3, 4));      // true — igualdade por valor
p.toString();                   // "Ponto[x=3, y=4]"`,
        },
        { type: 'p', text: 'Um `record` é **imutável** por construção, tem `equals` e `hashCode` por valor, e `toString` útil. É o tipo certo para DTOs, eventos, respostas de API, coordenadas, dinheiro — qualquer "pacote de dados".' },
        {
          type: 'code', lang: 'java', caption: 'validação e métodos num record',
          code: `public record Email(String valor) {
    // Compact constructor — valida sem repetir parâmetros
    public Email {
        if (valor == null || !valor.contains("@")) {
            throw new IllegalArgumentException("email inválido: " + valor);
        }
        valor = valor.toLowerCase();   // podes normalizar
    }

    // Métodos adicionais são permitidos
    public String dominio() {
        return valor.substring(valor.indexOf('@') + 1);
    }
}

var e = new Email("Ana@Example.COM");
IO.println(e.valor());      // "ana@example.com" (normalizado)
IO.println(e.dominio());    // "example.com"`,
        },
        { type: 'h', text: 'Sealed Classes — hierarquias fechadas' },
        { type: 'p', text: 'Uma `sealed` *interface* ou classe declara **quem pode herdar dela**. O compilador passa a saber que há um conjunto finito de implementações, o que desbloqueia pattern matching exaustivo.' },
        {
          type: 'code', lang: 'java', caption: 'modelar um resultado como união fechada',
          code: `sealed interface Resultado<T> permits Sucesso, Falha {}

record Sucesso<T>(T valor) implements Resultado<T> {}
record Falha<T>(String mensagem, Throwable causa) implements Resultado<T> {}

// Agora podes usar pattern matching com garantia de exaustividade
<T> void imprimir(Resultado<T> r) {
    switch (r) {
        case Sucesso<T>(var v)     -> IO.println("✓ " + v);
        case Falha<T>(var msg, var _) -> IO.println("✗ " + msg);
    }
    // Sem default! Se amanhã acrescentares 'Pendente' a permits,
    // o compilador obriga-te a tratá-lo aqui.
}`,
        },
        {
          type: 'callout', tone: 'key', title: 'A combinação ganhadora',
          text: '**`sealed` + `record` + `switch` com patterns** é a forma moderna de modelar domínios em Java. Dá-te tipos de dados algébricos (como em Haskell ou Rust), mas com a sintaxe de Java. Usa-a sempre que tenhas "uma coisa que é A, B **ou** C".',
        },
      ],
    },
    {
      id: 'enums-interfaces',
      title: 'Enums e interfaces',
      blocks: [
        { type: 'h', text: 'Enums — conjuntos fechados de valores' },
        { type: 'p', text: 'Um `enum` representa um valor que é uma de poucas opções conhecidas. É um antídoto para números mágicos e Strings mal escritas.' },
        {
          type: 'code', lang: 'java',
          code: `public enum Prioridade {
    BAIXA, MEDIA, ALTA, CRITICA;
}

var p = Prioridade.ALTA;

// Pattern matching sobre enum — exaustivo
int sla(Prioridade p) {
    return switch (p) {
        case BAIXA    -> 72;
        case MEDIA    -> 24;
        case ALTA     -> 4;
        case CRITICA  -> 1;
    };
}

// Iterar todos os valores
for (var v : Prioridade.values()) {
    IO.println(v.name() + " → " + sla(v));
}`,
        },
        { type: 'h', text: 'Enums com estado e comportamento' },
        {
          type: 'code', lang: 'java',
          code: `public enum Moeda {
    EUR("€", 2),
    USD("$", 2),
    JPY("¥", 0);

    private final String simbolo;
    private final int decimais;

    Moeda(String simbolo, int decimais) {
        this.simbolo = simbolo;
        this.decimais = decimais;
    }

    public String formatar(double valor) {
        return String.format("%." + decimais + "f %s", valor, simbolo);
    }
}

IO.println(Moeda.EUR.formatar(1234.5));   // "1234,50 €"
IO.println(Moeda.JPY.formatar(1234.5));   // "1235 ¥"`,
        },
        { type: 'h', text: 'Interfaces' },
        { type: 'p', text: 'Uma `interface` declara um **contrato**: um conjunto de métodos que quem a implementa tem de fornecer. Permite polimorfismo sem herança.' },
        {
          type: 'code', lang: 'java',
          code: `public interface Comparavel<T> {
    int comparar(T outro);
}

public record Produto(String nome, double preco) implements Comparavel<Produto> {
    @Override
    public int comparar(Produto outro) {
        return Double.compare(this.preco, outro.preco);
    }
}

// Métodos default — implementação por omissão na interface
public interface Log {
    void info(String msg);

    default void warn(String msg) {
        info("[WARN] " + msg);
    }

    default void error(String msg, Throwable t) {
        info("[ERROR] " + msg + ": " + t.getMessage());
    }
}

// Quem implementa Log só precisa de implementar info() — warn e error vêm grátis
public class LogConsola implements Log {
    @Override public void info(String msg) { System.out.println(msg); }
}`,
        },
      ],
    },
    {
      id: 'excecoes-generics-optional',
      title: 'Exceções, Generics e Optional',
      blocks: [
        { type: 'h', text: 'Exceções — falhas que o código deve antecipar' },
        {
          type: 'code', lang: 'java',
          code: `public class ContaInsuficiente extends RuntimeException {
    public ContaInsuficiente(String msg) { super(msg); }
}

public void transferir(ContaBancaria origem, ContaBancaria destino, long cents) {
    if (origem.getSaldoCentimos() < cents) {
        throw new ContaInsuficiente("faltam " + (cents - origem.getSaldoCentimos()) + " cêntimos");
    }
    origem.levantar(cents);
    destino.depositar(cents);
}

// Apanhar
try {
    transferir(a, b, 1_000_000);
} catch (ContaInsuficiente e) {
    IO.println("Falhou: " + e.getMessage());
} catch (Exception e) {
    IO.println("Erro inesperado: " + e);
}`,
        },
        {
          type: 'compare',
          left: {
            title: 'Usa exceções para…',
            items: [
              'Situações de erro genuínas (ficheiro não existe, rede falhou, dados inválidos)',
              'Preservar o *stack trace* — ajuda imenso a diagnosticar',
              'Falhar ruidosamente quando o programa não consegue cumprir o que prometeu',
            ],
          },
          right: {
            title: 'Não uses exceções para…',
            items: [
              'Controlo de fluxo normal (ex.: sair de um ciclo)',
              'Validar entradas óbvias — valida antes, com `if`',
              'Esconder bugs — `catch (Exception e) { /* nada */ }` é o pior pecado',
            ],
          },
        },
        { type: 'h', text: 'try-with-resources — recursos fechados automaticamente' },
        {
          type: 'code', lang: 'java',
          code: `import java.nio.file.*;

// O recurso dentro de () é fechado automaticamente, mesmo que lance exceção
try (var reader = Files.newBufferedReader(Path.of("dados.csv"))) {
    String linha;
    while ((linha = reader.readLine()) != null) {
        IO.println(linha);
    }
}
// reader.close() chamado automaticamente aqui — mesmo com throw lá dentro`,
        },
        { type: 'h', text: 'Generics — tipos parametrizados' },
        { type: 'p', text: 'Generics permitem escrever classes e métodos que funcionam com qualquer tipo, mantendo a verificação de tipos em tempo de compilação.' },
        {
          type: 'code', lang: 'java',
          code: `// Classe genérica
public class Caixa<T> {
    private T conteudo;
    public void por(T item) { this.conteudo = item; }
    public T ver() { return conteudo; }
}

var caixaString = new Caixa<String>();
caixaString.por("Olá");
String s = caixaString.ver();          // sem cast

var caixaInt = new Caixa<Integer>();
caixaInt.por(42);

// Método genérico
public <T> T primeiro(List<T> lista) {
    if (lista.isEmpty()) throw new IllegalArgumentException();
    return lista.get(0);
}

String nome = primeiro(List.of("Ana", "Bruno"));
Integer n = primeiro(List.of(1, 2, 3));`,
        },
        { type: 'h', text: '`Optional` — o fim das NullPointerException' },
        { type: 'p', text: '`Optional<T>` representa "pode ter um valor **ou** não ter nenhum". Usa em métodos que podem não ter resultado, em vez de devolver `null`.' },
        {
          type: 'code', lang: 'java',
          code: `public Optional<Cliente> procurarPorEmail(String email) {
    // ... procura na BD
    return cliente == null ? Optional.empty() : Optional.of(cliente);
}

// Quem usa é obrigado a pensar no caso "não existe"
var resultado = procurarPorEmail("ana@example.com");

// Opção 1: if-else ergonómico
resultado.ifPresentOrElse(
    c  -> IO.println("Encontrei " + c.nome()),
    () -> IO.println("Não existe")
);

// Opção 2: valor por omissão
Cliente c = resultado.orElse(Cliente.ANONIMO);

// Opção 3: lançar exceção
Cliente c2 = resultado.orElseThrow(() -> new NaoEncontrado(email));

// Opção 4: transformar se existir
Optional<String> dominio = resultado.map(Cliente::email).map(Email::dominio);`,
        },
        {
          type: 'callout', tone: 'trap', title: '`Optional` NÃO é para campos',
          text: 'Usa `Optional` apenas em retornos de métodos. Não o uses como tipo de parâmetro nem como campo de uma classe — é desenhado para ser o último passo de uma *pipeline*, não um substituto universal de `null`.',
        },
      ],
    },
    {
      id: 'lambdas-streams',
      title: 'Lambdas e Streams — Java funcional',
      blocks: [
        { type: 'p', text: 'Desde Java 8, podes tratar funções como valores. Isto permite escrever *pipelines* declarativos sobre coleções, muito próximos de SQL.' },
        { type: 'h', text: 'Lambdas e method references' },
        {
          type: 'code', lang: 'java',
          code: `// Lambda — uma função anónima
Function<Integer, Integer> quadrado = x -> x * x;
quadrado.apply(5);          // 25

BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;
soma.apply(3, 4);           // 7

Predicate<String> naoVazia = s -> !s.isBlank();
Consumer<String> imprimir = s -> IO.println(s);
Supplier<String> agora = () -> java.time.LocalDateTime.now().toString();

// Method references — atalho quando a lambda só chama um método
Consumer<String> imprimir2 = IO::println;           // igual a s -> IO.println(s)
Function<String, Integer> tamanho = String::length;
Function<String, String> maiusculas = String::toUpperCase;`,
        },
        { type: 'h', text: 'Streams — map, filter, reduce em Java' },
        {
          type: 'code', lang: 'java',
          code: `var numeros = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Soma dos quadrados dos pares
int soma = numeros.stream()
    .filter(n -> n % 2 == 0)        // seleciona pares: 2, 4, 6, 8, 10
    .mapToInt(n -> n * n)           // 4, 16, 36, 64, 100
    .sum();                         // 220

// Recolher para uma lista nova
List<String> nomes = List.of("ana", "Bruno", "", "carla");
List<String> maiusc = nomes.stream()
    .filter(n -> !n.isBlank())
    .map(String::toUpperCase)
    .sorted()
    .toList();                      // [ANA, BRUNO, CARLA]`,
        },
        {
          type: 'code', lang: 'java', caption: 'agrupar e contar — o verdadeiro poder dos streams',
          code: `record Compra(String produto, String categoria, double valor) {}

var compras = List.of(
    new Compra("iPhone",   "Electrónica", 1200),
    new Compra("Camisola", "Moda",         45),
    new Compra("MacBook",  "Electrónica", 2400),
    new Compra("Ténis",    "Moda",        110),
    new Compra("iPad",     "Electrónica",  800)
);

// Total por categoria
Map<String, Double> totalPorCat = compras.stream()
    .collect(Collectors.groupingBy(
        Compra::categoria,
        Collectors.summingDouble(Compra::valor)
    ));
// { Electrónica = 4400.0, Moda = 155.0 }

// Produto mais caro
Optional<Compra> maisCara = compras.stream()
    .max(Comparator.comparingDouble(Compra::valor));

// Contar compras acima de 100 €
long caras = compras.stream()
    .filter(c -> c.valor() > 100)
    .count();                       // 3`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Pensa em pipelines, não em ciclos',
          text: 'A diferença entre um iniciante e um programador experiente em Java moderno é que o primeiro escreve `for (int i = 0; i < lista.size(); i++) { if (...) { soma += ...; } }`. O segundo escreve `lista.stream().filter(...).mapToInt(...).sum();`. Lê-se como uma frase.',
        },
        {
          type: 'compare',
          left: {
            title: 'Usa Streams quando…',
            items: [
              'Trabalhas com coleções e queres transformá-las/filtrá-las',
              'A pipeline é mais clara que o ciclo equivalente',
              'Precisas de agrupar, contar ou agregar (groupingBy, counting, summingDouble)',
            ],
          },
          right: {
            title: 'Fica pelo ciclo quando…',
            items: [
              'Precisas de índices, `break` ou `continue` complexos',
              'Alteras uma estrutura externa com efeitos colaterais',
              'A performance extrema importa (ciclo for é quase sempre mais rápido)',
            ],
          },
        },
      ],
    },
    {
      id: 'virtual-threads',
      title: 'Virtual Threads, Structured Concurrency e Scoped Values',
      blocks: [
        { type: 'p', text: 'Aqui está a razão número um para aprender Java em 2026: a JVM passou a ter **threads praticamente gratuitos**. Podes lançar um milhão deles no mesmo processo.' },
        { type: 'h', text: 'O problema que Virtual Threads resolvem' },
        {
          type: 'table',
          head: ['', 'Platform threads (clássicos)', 'Virtual threads (Java 21+)'],
          rows: [
            ['Custo de criação', '≈ 1 ms + 1 MB stack', '≈ 1 µs + poucos KB'],
            ['Máximo prático', 'Milhares', 'Milhões'],
            ['Mapeamento', '1 ↔ 1 com SO', 'M ↔ N (muitos virtuais sobre poucos reais)'],
            ['Bloqueio em I/O', 'Thread SO fica parada', 'Thread SO é libertada'],
            ['Usa-se para', 'Threads de longa duração', 'Cada pedido HTTP, cada tarefa'],
          ],
          caption: 'Virtual threads tornam "thread por pedido" uma arquitetura viável outra vez.',
        },
        {
          type: 'code', lang: 'java',
          code: `// Criar e lançar um virtual thread
Thread.ofVirtual().start(() -> {
    IO.println("Olá de um virtual thread");
});

// 10 000 chamadas HTTP em paralelo — sem romper o processo
try (var scope = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futuros = new ArrayList<>();
    for (int i = 0; i < 10_000; i++) {
        futuros.add(scope.submit(() -> httpGet("https://api.exemplo.com/" + i)));
    }
    for (var f : futuros) {
        IO.println(f.get());
    }
}`,
        },
        { type: 'h', text: 'Structured Concurrency (preview, Java 25)' },
        { type: 'p', text: 'Agrupa tarefas concorrentes como se fossem um único bloco de código. Se uma falha, as outras são canceladas automaticamente. Trata concorrência como estrutura de controlo, não como pesadelo.' },
        {
          type: 'code', lang: 'java',
          code: `// Buscar dados do utilizador e do pedido em paralelo
// Se qualquer um falhar, o outro é cancelado.
try (var scope = StructuredTaskScope.open()) {
    var utilizador = scope.fork(() -> buscarUtilizador(id));
    var pedido     = scope.fork(() -> buscarPedido(pedidoId));

    scope.join();        // espera por ambas
    scope.throwIfFailed(); // propaga exceção se alguma falhou

    return new Dashboard(utilizador.get(), pedido.get());
}`,
        },
        { type: 'h', text: 'Scoped Values (final em Java 25) — substituto moderno de ThreadLocal' },
        { type: 'p', text: '**ScopedValue** passa contexto implicitamente a toda uma pilha de chamadas, de forma imutável e segura para virtual threads — algo que `ThreadLocal` fazia mal.' },
        {
          type: 'code', lang: 'java',
          code: `private static final ScopedValue<User> UTILIZADOR_ACTUAL = ScopedValue.newInstance();

public void processarPedido(Request req) {
    User u = autenticar(req);
    ScopedValue.where(UTILIZADOR_ACTUAL, u).run(() -> {
        aplicarRegras();        // pode ler UTILIZADOR_ACTUAL.get() sem o receber como parâmetro
        guardarAuditoria();     // idem
    });
    // Fora do run(), UTILIZADOR_ACTUAL já não está disponível
}`,
        },
        {
          type: 'callout', tone: 'key', title: 'Porque isto muda tudo',
          text: 'A JVM passa a competir diretamente com Go e Node em concorrência de I/O, mas com tipagem estática forte. Aplicações que antes precisavam de frameworks reativos complicados (`CompletableFuture`, Reactor, RxJava) podem voltar a ser escritas de forma linear — "primeiro isto, depois aquilo" — enquanto o runtime escala por baixo.',
        },
      ],
    },
    {
      id: 'module-imports',
      title: 'Module Import Declarations (JEP 511)',
      blocks: [
        { type: 'p', text: 'Mais uma novidade final em Java 25: podes importar todos os tipos públicos de um módulo com uma única linha. Especialmente útil em ficheiros curtos (scripts, exercícios, protótipos).' },
        {
          type: 'code', lang: 'java', caption: 'antes: 5 imports',
          code: `import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Collectors;

void main() {
    var nomes = new ArrayList<String>();
    nomes.add("Ana");
    var porTamanho = nomes.stream()
        .collect(Collectors.groupingBy(String::length));
}`,
        },
        {
          type: 'code', lang: 'java', caption: 'depois: 1 import de módulo',
          code: `import module java.base;

void main() {
    var nomes = new ArrayList<String>();
    nomes.add("Ana");
    var porTamanho = nomes.stream()
        .collect(Collectors.groupingBy(String::length));
}`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Em projetos reais, continua a importar classes específicas',
          text: 'Importar um módulo inteiro torna mais difícil perceber de onde vem cada classe. Guarda `import module` para scripts e ficheiros exploratórios. Em produção, prefere imports granulares.',
        },
      ],
    },
    {
      id: 'ficheiros-io',
      title: 'Ficheiros e I/O',
      blocks: [
        {
          type: 'code', lang: 'java', caption: 'ler e escrever ficheiros de texto',
          code: `import java.nio.file.*;
import java.util.List;

// Ler tudo de uma vez (ficheiros pequenos)
String texto = Files.readString(Path.of("dados.txt"));

// Ler linha a linha
List<String> linhas = Files.readAllLines(Path.of("dados.txt"));

// Ler em streaming (ficheiros grandes)
try (var stream = Files.lines(Path.of("enorme.txt"))) {
    long linhasNaoVazias = stream
        .filter(l -> !l.isBlank())
        .count();
}

// Escrever
Files.writeString(Path.of("saida.txt"), "Olá, mundo!");

// Acrescentar
Files.writeString(Path.of("log.txt"), "entrada nova\\n", StandardOpenOption.APPEND, StandardOpenOption.CREATE);`,
        },
        {
          type: 'code', lang: 'java', caption: 'pedido HTTP com o cliente nativo',
          code: `import java.net.http.*;
import java.net.URI;

var client = HttpClient.newHttpClient();

var pedido = HttpRequest.newBuilder()
    .uri(URI.create("https://api.github.com/users/octocat"))
    .header("Accept", "application/json")
    .GET()
    .build();

HttpResponse<String> resposta = client.send(pedido, HttpResponse.BodyHandlers.ofString());

IO.println("status: " + resposta.statusCode());
IO.println(resposta.body());`,
        },
      ],
    },
    {
      id: 'testes-ferramentas',
      title: 'Testes, Maven e o que ler a seguir',
      blocks: [
        { type: 'h', text: 'JUnit 5 — o padrão de facto' },
        {
          type: 'code', lang: 'java',
          code: `import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculadoraTest {

    @Test
    void somaDeDoisPositivos() {
        assertEquals(7, Calculadora.somar(3, 4));
    }

    @Test
    void divisaoPorZeroLancaExcecao() {
        assertThrows(ArithmeticException.class, () -> Calculadora.dividir(10, 0));
    }

    @ParameterizedTest
    @CsvSource({
        "2, 3, 5",
        "0, 0, 0",
        "-1, 1, 0"
    })
    void parametrizado(int a, int b, int esperado) {
        assertEquals(esperado, Calculadora.somar(a, b));
    }
}`,
        },
        { type: 'h', text: 'Estrutura de projeto Maven' },
        {
          type: 'code', lang: 'bash', caption: 'árvore padrão',
          code: `curso-java/
├── pom.xml                              # dependências e build
└── src/
    ├── main/
    │   └── java/
    │       └── pt/exemplo/
    │           └── App.java             # código da aplicação
    └── test/
        └── java/
            └── pt/exemplo/
                └── AppTest.java         # testes`,
        },
        {
          type: 'code', lang: 'bash', caption: 'comandos essenciais',
          code: `# criar um projeto novo
mvn archetype:generate -DgroupId=pt.exemplo -DartifactId=curso-java \\
    -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

mvn compile        # compila
mvn test           # corre os testes
mvn package        # cria um JAR executável em target/
mvn clean          # apaga target/`,
        },
        { type: 'h', text: 'Onde ir a seguir' },
        {
          type: 'list', ordered: true, items: [
            '**[Spring Boot](https://spring.io/projects/spring-boot)** — o framework que domina o backend em Java. Em 30 minutos tens uma API REST com base de dados.',
            '**[Jackson](https://github.com/FasterXML/jackson)** — serializar/deserializar JSON.',
            '**[Testcontainers](https://testcontainers.com/)** — testes de integração com bases de dados reais em Docker.',
            '**[Micrometer + Grafana](https://micrometer.io/)** — métricas e observabilidade.',
            '**[Project Reactor](https://projectreactor.io/)** ou **virtual threads** — para I/O concorrente em larga escala.',
            '**Livro:** *Effective Java* (Joshua Bloch, 3ª ed.) — o padrão-ouro, independentemente da versão da linguagem.',
            '**Livro:** *Modern Java in Action* (Urma, Fusco, Mycroft) — streams, lambdas e concorrência moderna.',
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'O caminho do iniciante em Java 25',
          text: '(1) Resolver 30 exercícios em compact source files. (2) Construir uma aplicação de linha de comandos com classes, records e streams. (3) Expor isso como API com Spring Boot e Postgres. (4) Testar com JUnit + Testcontainers. (5) Entrar em concorrência com virtual threads. É muito, mas não é vago — cada passo tem fim claro e pode ser concluído em dias de prática.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'j1',
      prompt: 'Qual destas afirmações sobre Java 25 é verdadeira?',
      options: [
        'Requer sempre uma classe com `public static void main(String[] args)`',
        'Permite correr um ficheiro `.java` diretamente, sem `javac`',
        'Já não é retrocompatível com código de Java 8',
        'Deixou de suportar Streams e lambdas',
      ],
      answer: 1,
      explain: 'A partir de Java 11 já podias correr ficheiros `.java` em modo script; em Java 25, com Compact Source Files, até podes omitir a classe. A retrocompatibilidade com Java 8 continua.',
    },
    {
      id: 'j2',
      prompt: 'Qual é o resultado de `System.out.println(10 / 3);` em Java?',
      options: ['3.3333', '3.3', '3', 'Erro de compilação'],
      answer: 2,
      explain: 'Inteiro dividido por inteiro dá inteiro — a parte decimal é truncada. Para obter 3.333…, pelo menos um dos operandos tem de ser `double` (ex.: `10.0 / 3`).',
    },
    {
      id: 'j3',
      prompt: 'Como comparas duas Strings pelo conteúdo em Java?',
      options: ['`a == b`', '`a.equals(b)`', '`a.compareTo(b) == 0` apenas', '`a.content(b)`'],
      answer: 1,
      explain: '`==` compara se é a mesma referência; pode dar `true` por acaso em literais mas é incorreto no geral. `.equals()` compara conteúdo.',
    },
    {
      id: 'j4',
      prompt: 'O que faz um `record Ponto(int x, int y) {}`?',
      options: [
        'Declara uma variável `Ponto`',
        'Gera automaticamente construtor, `equals`, `hashCode`, `toString` e getters `x()` e `y()`',
        'É apenas sintaxe alternativa para uma interface',
        'Obriga a implementar `Comparable`',
      ],
      answer: 1,
      explain: 'Records são data carriers: numa linha ganhas construtor canónico, acessores, igualdade por valor e representação textual. São imutáveis.',
    },
    {
      id: 'j5',
      prompt: 'Qual é a vantagem principal de uma `sealed interface`?',
      options: [
        'É mais rápida em tempo de execução',
        'Ocupa menos memória',
        'O compilador conhece todas as implementações, permitindo pattern matching exaustivo',
        'Impede o uso de generics',
      ],
      answer: 2,
      explain: '`sealed … permits X, Y, Z` dá ao compilador um conjunto fechado. Combinado com `switch` sobre padrões, obténs tratamento exaustivo garantido em compilação.',
    },
    {
      id: 'j6',
      prompt: 'Qual destes é o uso **correto** de `Optional`?',
      options: [
        'Como campo privado de uma classe',
        'Como parâmetro de um método',
        'Como tipo de retorno de métodos que podem não ter resultado',
        'Em substituição de todas as variáveis `null`',
      ],
      answer: 2,
      explain: '`Optional` foi desenhado como tipo de retorno. Usá-lo em campos ou parâmetros é considerado má prática.',
    },
    {
      id: 'j7',
      prompt: 'Virtual Threads são melhores que platform threads porque…',
      options: [
        'executam mais rápido em CPU',
        'são extremamente leves e suspendem-se automaticamente em I/O, libertando a thread do SO',
        'não precisam de JVM',
        'tornam o código paralelo automaticamente',
      ],
      answer: 1,
      explain: 'Virtual threads usam poucos KB e o runtime liberta a thread do SO durante operações bloqueantes de I/O. Isto permite milhões de tarefas concorrentes.',
    },
    {
      id: 'j8',
      prompt: 'Qual é o resultado do `switch` moderno em Java 25 com um `sealed interface Forma` de três casos, se te esqueceres de um `case`?',
      options: [
        'Compila mas lança `MatchError` em tempo de execução',
        'Compila com `default` implícito',
        'Falha a compilar — exaustividade não satisfeita',
        'Imprime um aviso mas compila',
      ],
      answer: 2,
      explain: 'O compilador verifica exaustividade sobre tipos *sealed*. Se faltar um caso, não compila — e é precisamente este o grande valor da combinação.',
    },
    {
      id: 'j9',
      prompt: 'Para que serve `try-with-resources`?',
      options: [
        'Apanhar exceções mais rapidamente',
        'Fechar automaticamente recursos (ficheiros, ligações) mesmo em caso de exceção',
        'Converter exceções em valores',
        'Tornar o `catch` opcional',
      ],
      answer: 1,
      explain: 'Qualquer recurso que implemente `AutoCloseable` pode ser colocado no `try (…)` e será fechado no fim do bloco, mesmo com exceção a meio.',
    },
    {
      id: 'j10',
      prompt: 'A diferença entre `ArrayList` e `LinkedList` é que…',
      options: [
        '`ArrayList` não permite duplicados',
        '`ArrayList` é mais rápido para acesso aleatório (`get(i)`); `LinkedList` para inserções no meio se já tens a posição',
        '`LinkedList` é thread-safe por omissão',
        '`ArrayList` ordena automaticamente',
      ],
      answer: 1,
      explain: '`ArrayList` usa um array dinâmico (O(1) para acesso por índice, O(n) para inserções). `LinkedList` é dupla ligada (O(n) para acesso, O(1) se tens o nó). No dia-a-dia, usa `ArrayList`.',
    },
  ],
  exercises: [
    {
      id: 'e13-1',
      difficulty: 1,
      kind: 'open',
      title: 'Primeiro programa',
      statement: 'Escreve um ficheiro `Saudacao.java` que, usando compact source files, pergunta o teu nome (podes usar `java.util.Scanner` ou simplesmente fixar uma variável) e imprime `"Olá, <nome>!"`. Corre-o com `java Saudacao.java`.',
      hint: 'Começa por declarar `void main() { ... }`. Para ler entrada: `var sc = new java.util.Scanner(System.in); var nome = sc.nextLine();`.',
      solution: 'import java.util.Scanner;\n\nvoid main() {\n    var sc = new Scanner(System.in);\n    IO.println("Como te chamas?");\n    var nome = sc.nextLine();\n    IO.println("Olá, " + nome + "!");\n}\n\nCorrer: `java Saudacao.java`. Nota que não precisas de class nem de public static — Java 25 trata tudo isso por ti.',
    },
    {
      id: 'e13-2',
      difficulty: 1,
      kind: 'open',
      title: 'FizzBuzz',
      statement: 'Imprime os números de 1 a 100, mas: múltiplos de 3 trocados por "Fizz", múltiplos de 5 trocados por "Buzz", múltiplos de ambos por "FizzBuzz". Usa um `switch` com uma expressão booleana.',
      hint: 'Usa `switch (new boolean[]{n % 3 == 0, n % 5 == 0})` **ou** mais simplesmente `n % 15 == 0 ? "FizzBuzz" : ...` com if-else.',
      solution: 'void main() {\n    for (int n = 1; n <= 100; n++) {\n        var r = (n % 15 == 0) ? "FizzBuzz"\n              : (n % 3 == 0)  ? "Fizz"\n              : (n % 5 == 0)  ? "Buzz"\n              : String.valueOf(n);\n        IO.println(r);\n    }\n}\n\nA ordem importa: tens de testar múltiplo de 15 **antes** de 3 e 5. Alternativa idiomática com switch e record patterns:\n\nString fizzbuzz(int n) {\n    return switch (new int[]{n % 3, n % 5}) {\n        case int[] a when a[0]==0 && a[1]==0 -> "FizzBuzz";\n        case int[] a when a[0]==0            -> "Fizz";\n        case int[] a when a[1]==0            -> "Buzz";\n        default                              -> String.valueOf(n);\n    };\n}',
    },
    {
      id: 'e13-3',
      difficulty: 2,
      kind: 'open',
      title: 'Modelar um domínio com Record',
      statement: 'Cria um record `Produto(String nome, double preco, int stock)` com (a) validação: preço > 0 e stock ≥ 0 no compact constructor; (b) um método `comDesconto(double percent)` que devolve **um novo** Produto com o preço descontado; (c) um método `temStock()` que retorna `boolean`.',
      hint: 'Records são imutáveis — o método de desconto não altera o atual, devolve um novo. Validação vai no compact constructor: `public Produto { ... }`.',
      solution: 'public record Produto(String nome, double preco, int stock) {\n\n    public Produto {\n        if (preco <= 0) throw new IllegalArgumentException("preço > 0");\n        if (stock < 0) throw new IllegalArgumentException("stock ≥ 0");\n        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("nome obrigatório");\n    }\n\n    public Produto comDesconto(double percent) {\n        if (percent < 0 || percent > 100) {\n            throw new IllegalArgumentException("desconto 0-100%");\n        }\n        return new Produto(nome, preco * (1 - percent / 100), stock);\n    }\n\n    public boolean temStock() {\n        return stock > 0;\n    }\n}\n\nvoid main() {\n    var p = new Produto("iPhone", 1200, 5);\n    var promocao = p.comDesconto(10);\n    IO.println(promocao);            // Produto[nome=iPhone, preco=1080.0, stock=5]\n    IO.println(promocao.temStock()); // true\n}\n\nRepara em três ideias: compact constructor para validação, imutabilidade (devolve um novo em vez de alterar), e o getter `preco()` gerado automaticamente.',
    },
    {
      id: 'e13-4',
      difficulty: 2,
      kind: 'open',
      title: 'Pattern Matching com Sealed',
      statement: 'Modela uma linguagem de expressões aritméticas: `Soma`, `Produto`, `Negativo` e `Numero`. Escreve uma função `double avaliar(Expr e)` que calcule o valor, usando `sealed interface` e `switch` com record patterns.',
      hint: 'A recursão faz-se naturalmente: `avaliar(Soma(a, b))` devolve `avaliar(a) + avaliar(b)`.',
      solution: 'sealed interface Expr permits Numero, Soma, Produto, Negativo {}\n\nrecord Numero(double valor)              implements Expr {}\nrecord Soma(Expr esq, Expr dir)          implements Expr {}\nrecord Produto(Expr esq, Expr dir)       implements Expr {}\nrecord Negativo(Expr e)                  implements Expr {}\n\ndouble avaliar(Expr e) {\n    return switch (e) {\n        case Numero(var v)        -> v;\n        case Soma(var a, var b)   -> avaliar(a) + avaliar(b);\n        case Produto(var a, var b)-> avaliar(a) * avaliar(b);\n        case Negativo(var x)      -> -avaliar(x);\n    };\n}\n\nvoid main() {\n    // (3 + 4) * -2  →  -14\n    Expr e = new Produto(\n        new Soma(new Numero(3), new Numero(4)),\n        new Negativo(new Numero(2))\n    );\n    IO.println(avaliar(e));    // -14.0\n}\n\nRepara: não há `default` nem `else`, e o compilador garante que trataste todos os quatro casos. Se amanhã acrescentares `Divisao`, o compilador avisa em todos os `switch` sobre `Expr`.',
    },
    {
      id: 'e13-5',
      difficulty: 2,
      kind: 'open',
      title: 'Streams: análise de vendas',
      statement: 'Dado `List<Compra>` com `record Compra(String cliente, String produto, double valor, LocalDate data)`, usa Streams para: (a) o total gasto; (b) o total gasto por cliente; (c) o cliente que mais gastou; (d) os 3 produtos mais caros.',
      hint: 'Pipeline típica: `.filter(...).map(...).collect(Collectors.groupingBy(...))`. Para o top-N: `.sorted(Comparator.reverseOrder()).limit(3)`.',
      solution: 'import java.time.LocalDate;\nimport java.util.*;\nimport java.util.stream.*;\n\nrecord Compra(String cliente, String produto, double valor, LocalDate data) {}\n\nList<Compra> compras = List.of(\n    new Compra("Ana",   "iPhone",   1200, LocalDate.of(2025, 11, 1)),\n    new Compra("Bruno", "Camisola",   45, LocalDate.of(2025, 11, 2)),\n    new Compra("Ana",   "MacBook",  2400, LocalDate.of(2025, 11, 3)),\n    new Compra("Carla", "Ténis",     110, LocalDate.of(2025, 11, 5))\n);\n\n// (a) Total\ndouble total = compras.stream()\n    .mapToDouble(Compra::valor)\n    .sum();\n\n// (b) Total por cliente\nMap<String, Double> porCliente = compras.stream()\n    .collect(Collectors.groupingBy(\n        Compra::cliente,\n        Collectors.summingDouble(Compra::valor)\n    ));\n\n// (c) Cliente que mais gastou\nString topCliente = porCliente.entrySet().stream()\n    .max(Map.Entry.comparingByValue())\n    .map(Map.Entry::getKey)\n    .orElseThrow();\n\n// (d) Top 3 produtos mais caros\nList<Compra> top3 = compras.stream()\n    .sorted(Comparator.comparingDouble(Compra::valor).reversed())\n    .limit(3)\n    .toList();\n\nA pipeline lê-se como SQL: "pega nas compras, agrupa por cliente, soma valores". A mesma lógica em ciclos clássicos ocuparia 20+ linhas com variáveis auxiliares.',
    },
    {
      id: 'e13-6',
      difficulty: 3,
      kind: 'open',
      title: 'Virtual Threads — 1000 pedidos em paralelo',
      statement: 'Escreve um programa que faz 1000 pedidos HTTP GET a `https://httpbin.org/delay/1` (cada um demora 1 segundo no servidor). Mede o tempo total. Compara: (a) sequencial; (b) com virtual threads. Explica a diferença.',
      hint: 'Sequencial: ciclo simples a chamar `httpGet`. Virtual threads: `Executors.newVirtualThreadPerTaskExecutor()` e submete 1000 tarefas.',
      solution: 'import java.net.http.*;\nimport java.net.URI;\nimport java.util.concurrent.*;\nimport java.util.stream.*;\n\nHttpClient client = HttpClient.newHttpClient();\n\nString httpGet(String url) throws Exception {\n    return client.send(\n        HttpRequest.newBuilder(URI.create(url)).build(),\n        HttpResponse.BodyHandlers.ofString()\n    ).body();\n}\n\nvoid main() throws Exception {\n    var urls = IntStream.range(0, 1000)\n        .mapToObj(i -> "https://httpbin.org/delay/1")\n        .toList();\n\n    // (a) Sequencial\n    long t1 = System.currentTimeMillis();\n    for (var u : urls) httpGet(u);\n    long seq = System.currentTimeMillis() - t1;\n\n    // (b) Virtual threads\n    long t2 = System.currentTimeMillis();\n    try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {\n        var futuros = urls.stream()\n            .map(u -> exec.submit(() -> httpGet(u)))\n            .toList();\n        for (var f : futuros) f.get();\n    }\n    long vt = System.currentTimeMillis() - t2;\n\n    IO.println("Sequencial:      " + seq + " ms");\n    IO.println("Virtual threads: " + vt  + " ms");\n}\n\n**Diferença esperada:** sequencial ≈ 1000 × 1s = **~1000 s** (16 minutos); virtual threads ≈ **2–3 s**, porque todas as chamadas estão a aguardar o servidor em paralelo.\n\n**Porquê:** o tempo não é CPU — é **I/O à espera do servidor**. Com virtual threads, durante o `send()` bloqueante, a thread virtual **é retirada da thread do SO**, que fica livre para correr outras milhares. Antes de Java 21, isto exigia APIs reativas complicadas (CompletableFuture + non-blocking HTTP). Hoje é a mesma função `send()` síncrona, a correr mil vezes em paralelo. É a maior revolução de Java em 15 anos.',
    },
    {
      id: 'e13-7',
      difficulty: 3,
      kind: 'open',
      title: 'Refatorar para Java 25',
      statement: 'Dá-se o seguinte código "estilo Java 8". Reescreve-o usando: records, pattern matching, sealed interfaces, streams e Optional. Explica cada decisão.\n\npublic class Resposta {\n    private int codigo;\n    private String corpo;\n    private String erro;\n    public Resposta(int c, String b, String e) { codigo=c; corpo=b; erro=e; }\n    public int getCodigo() { return codigo; }\n    public String getCorpo() { return corpo; }\n    public String getErro() { return erro; }\n    public boolean teveSucesso() { return erro == null; }\n}\n\npublic class Processador {\n    public String processar(List<Resposta> respostas) {\n        List<String> corpos = new ArrayList<>();\n        for (Resposta r : respostas) {\n            if (r.teveSucesso()) corpos.add(r.getCorpo());\n        }\n        if (corpos.isEmpty()) return "vazio";\n        return String.join(",", corpos);\n    }\n}',
      hint: 'A classe tem dois estados mutuamente exclusivos — sucesso **ou** erro. Isso pede uma sealed interface com dois records.',
      solution: '// 1. Modelar os dois estados como union fechado\nsealed interface Resposta permits Sucesso, Falha {\n    int codigo();\n}\n\nrecord Sucesso(int codigo, String corpo)  implements Resposta {}\nrecord Falha(int codigo, String mensagem) implements Resposta {}\n\n// 2. Processador usa streams e pattern matching\nString processar(List<Resposta> respostas) {\n    var corpos = respostas.stream()\n        .flatMap(r -> switch (r) {\n            case Sucesso(var _, var corpo) -> Stream.of(corpo);\n            case Falha f                   -> Stream.empty();\n        })\n        .toList();\n\n    return corpos.isEmpty() ? "vazio" : String.join(",", corpos);\n}\n\n**Decisões:**\n\n1. **Sealed interface + records em vez da classe nullable:** o antigo `Resposta` tinha `corpo` **e** `erro` como campos — nada impede ambos serem `null` ou ambos preenchidos. Com `Sucesso` e `Falha` separados, o tipo torna impossível um estado inválido.\n\n2. **Records em vez de classe com getters/setters:** 2 linhas em vez de 30, com igualdade por valor e imutabilidade de borla.\n\n3. **Pattern matching em vez de `if (teveSucesso())`:** o compilador verifica que trataste todos os casos. Amanhã, se acrescentares `Timeout` a `permits`, o compilador avisa em todos os sítios.\n\n4. **Stream.flatMap em vez do ciclo com `if` + `add`:** declarativo, sem variável mutável. Lê-se "para cada resposta, se for sucesso devolve o corpo, senão nada; junta tudo".\n\n5. **`toList()` em vez de `.collect(Collectors.toList())`:** desde Java 16 há atalho directo, e devolve uma lista imutável (mais segura).\n\nO resultado tem **metade das linhas, zero nulls e zero getters**. É mais seguro e lê-se melhor.',
    },
  ],
};
