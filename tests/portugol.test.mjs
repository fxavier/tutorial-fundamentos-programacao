import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../.tmp/portugol.mjs';

const out = (src, input = '') => {
  const r = run(src, input);
  assert.equal(r.error, null, r.error ?? '');
  return r.output;
};

test('escreval e aritmetica', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar x: inteiro\ninicio\nx <- 2 + 3 * 4\nescreval("x=", x)\nfimalgoritmo`), ['x=14']);
});

test('condicional', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar n: inteiro\ninicio\nleia(n)\nse n % 2 = 0 entao\n escreval("par")\nsenao\n escreval("impar")\nfimse\nfimalgoritmo`, '7'), ['impar']);
});

test('laco para com acumulador', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar i, s: inteiro\ninicio\ns <- 0\npara i de 1 ate 5 faca\n s <- s + i\nfimpara\nescreval(s)\nfimalgoritmo`), ['15']);
});

test('enquanto e interrompa', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar i: inteiro\ninicio\ni <- 0\nenquanto verdadeiro faca\n i <- i + 1\n se i >= 3 entao\n  interrompa\n fimse\nfimenquanto\nescreval(i)\nfimalgoritmo`), ['3']);
});

test('repita ate', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar i: inteiro\ninicio\ni <- 0\nrepita\n i <- i + 1\nate i = 4\nescreval(i)\nfimalgoritmo`), ['4']);
});

test('vetor', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar v: vetor[1..3] de inteiro\ni, s: inteiro\ninicio\npara i de 1 ate 3 faca\n v[i] <- i * 10\nfimpara\ns <- 0\npara i de 1 ate 3 faca\n s <- s + v[i]\nfimpara\nescreval(s)\nfimalgoritmo`), ['60']);
});

test('funcao recursiva', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar n: inteiro\nfuncao fat(x: inteiro) : inteiro\ninicio\n se x <= 1 entao\n  retorne 1\n fimse\n retorne x * fat(x - 1)\nfimfuncao\ninicio\nescreval(fat(6))\nfimalgoritmo`), ['720']);
});

test('procedimento', () => {
  assert.deepEqual(out(`algoritmo "t"\nprocedimento ola(nome: caractere)\ninicio\n escreval("Ola, ", nome)\nfimprocedimento\ninicio\nola("Ana")\nfimalgoritmo`), ['Ola, Ana']);
});

test('escreva sem quebra', () => {
  assert.deepEqual(out(`algoritmo "t"\ninicio\nescreva("a")\nescreva("b")\nescreval("c")\nfimalgoritmo`), ['abc']);
});

test('operadores logicos', () => {
  assert.deepEqual(out(`algoritmo "t"\ninicio\nescreval(verdadeiro e nao falso)\nescreval(3 > 5 ou 2 = 2)\nfimalgoritmo`), ['VERDADEIRO', 'VERDADEIRO']);
});

test('escolha caso', () => {
  assert.deepEqual(out(`algoritmo "t"\nvar n: inteiro\ninicio\nleia(n)\nescolha n\ncaso 1, 2\n escreval("baixo")\ncaso 3\n escreval("medio")\noutrocaso\n escreval("alto")\nfimescolha\nfimalgoritmo`, '3'), ['medio']);
});

test('deteta laco infinito', () => {
  const r = run(`algoritmo "t"\ninicio\nenquanto verdadeiro faca\nfimenquanto\nfimalgoritmo`);
  assert.match(r.error ?? '', /laço infinito/);
});

test('erro de sintaxe reporta linha', () => {
  const r = run(`algoritmo "t"\nvar x: inteiro\ninicio\nx <- \nfimalgoritmo`);
  assert.match(r.error ?? '', /Linha/);
});

test('variavel nao declarada', () => {
  const r = run(`algoritmo "t"\ninicio\ny <- 3\nfimalgoritmo`);
  assert.match(r.error ?? '', /não foi declarada/);
});

test('divisao por zero', () => {
  const r = run(`algoritmo "t"\nvar x: real\ninicio\nx <- 5 / 0\nfimalgoritmo`);
  assert.match(r.error ?? '', /divisão por zero/);
});

test('funcoes internas', () => {
  assert.deepEqual(out(`algoritmo "t"\ninicio\nescreval(raiz(16), " ", abs(-3), " ", maiusc("ab"), " ", tamanho("abcd"))\nfimalgoritmo`), ['4 3 AB 4']);
});

test('bubble sort completo', () => {
  const src = `algoritmo "ordena"
var v: vetor[1..6] de inteiro
i, j, tmp, n: inteiro
inicio
n <- 6
v[1] <- 5
v[2] <- 3
v[3] <- 8
v[4] <- 1
v[5] <- 9
v[6] <- 2
para i de 1 ate n - 1 faca
  para j de 1 ate n - i faca
    se v[j] > v[j + 1] entao
      tmp <- v[j]
      v[j] <- v[j + 1]
      v[j + 1] <- tmp
    fimse
  fimpara
fimpara
para i de 1 ate n faca
  escreva(v[i], " ")
fimpara
escreval("")
fimalgoritmo`;
  assert.deepEqual(out(src), ['1 2 3 5 8 9 ']);
});
