import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInBase, toBase, groupBits, divisionSteps, positionalSteps, twosComplement, fromTwosComplement, formatBytes, normalizeAnswer, float32Parts, utf8Bytes } from '../.tmp/numbers.mjs';

test('conversoes basicas', () => {
  assert.equal(toBase(parseInBase('11010110', 2), 10), '214');
  assert.equal(toBase(parseInBase('214', 10), 2), '11010110');
  assert.equal(toBase(parseInBase('214', 10), 16), 'd6');
  assert.equal(toBase(parseInBase('ff', 16), 2), '11111111');
  assert.equal(toBase(parseInBase('755', 8), 2), '111101101');
  assert.equal(toBase(0n, 2), '0');
});

test('digito invalido', () => {
  assert.throws(() => parseInBase('102', 2), /dígito inválido/);
});

test('agrupamento de bits', () => {
  assert.equal(groupBits('11010110'), '1101 0110');
  assert.equal(groupBits('101', 4), '0101');
});

test('divisoes sucessivas', () => {
  const s = divisionSteps(13n, 2).map((x) => x.remainder).join('');
  assert.equal(s, '1011'); // lido de baixo para cima da 1101
});

test('soma posicional', () => {
  const total = positionalSteps('1011', 2).reduce((a, b) => a + b.product, 0n);
  assert.equal(total, 11n);
});

test('complemento de dois', () => {
  assert.equal(twosComplement(5, 8).bin, '00000101');
  assert.equal(twosComplement(-5, 8).bin, '11111011');
  assert.equal(twosComplement(-128, 8).ok, true);
  assert.equal(twosComplement(128, 8).ok, false);
  assert.equal(fromTwosComplement('11111011'), -5);
  assert.equal(fromTwosComplement('01111111'), 127);
});

test('formatacao de bytes', () => {
  assert.equal(formatBytes(1024, 'iec'), '1 KiB');
  assert.equal(formatBytes(1000, 'si'), '1 kB');
  assert.equal(formatBytes(1_000_000_000, 'iec'), '953.67 MiB');
  assert.equal(formatBytes(0), '0 B');
});

test('normalizacao de respostas', () => {
  assert.equal(normalizeAnswer(' 0b1101 '), '1101');
  assert.equal(normalizeAnswer('0xFF'), 'ff');
  assert.equal(normalizeAnswer('Não'), 'nao');
});

test('ieee 754', () => {
  const p = float32Parts(1);
  assert.equal(p.bits, '00111111100000000000000000000000');
  assert.equal(p.exponent, '01111111');
});

test('utf-8', () => {
  assert.deepEqual(utf8Bytes('A'), [65]);
  assert.deepEqual(utf8Bytes('ç'), [195, 167]);
  assert.equal(utf8Bytes('€').length, 3);
});
