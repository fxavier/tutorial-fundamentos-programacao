/** Utilitários de sistemas de numeração usados pelos widgets e pelos exercícios. */

export const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Converte uma string numa base (2..36) para BigInt. Lança se houver dígito inválido. */
export function parseInBase(text: string, base: number): bigint {
  const clean = text.trim().toLowerCase().replace(/[\s_.]/g, '');
  if (clean === '') throw new Error('vazio');
  const neg = clean.startsWith('-');
  const body = neg ? clean.slice(1) : clean;
  if (body === '') throw new Error('vazio');
  let acc = 0n;
  const b = BigInt(base);
  for (const ch of body) {
    const v = DIGITS.indexOf(ch);
    if (v < 0 || v >= base) throw new Error(`dígito inválido "${ch}" na base ${base}`);
    acc = acc * b + BigInt(v);
  }
  return neg ? -acc : acc;
}

/** Converte BigInt para string numa base (2..36). */
export function toBase(value: bigint, base: number): string {
  if (value === 0n) return '0';
  const neg = value < 0n;
  let v = neg ? -value : value;
  const b = BigInt(base);
  let out = '';
  while (v > 0n) {
    out = DIGITS[Number(v % b)] + out;
    v /= b;
  }
  return (neg ? '-' : '') + out;
}

/** Agrupa uma string binária em blocos (4 por omissão) para leitura: 11010110 -> 1101 0110 */
export function groupBits(bin: string, size = 4, sep = ' '): string {
  const neg = bin.startsWith('-');
  const body = neg ? bin.slice(1) : bin;
  const pad = body.padStart(Math.ceil(body.length / size) * size, '0');
  const parts = pad.match(new RegExp(`.{1,${size}}`, 'g')) ?? [];
  return (neg ? '-' : '') + parts.join(sep);
}

/** Passos didáticos de decimal -> base, por divisões sucessivas. */
export function divisionSteps(value: bigint, base: number): { dividend: string; quotient: string; remainder: string }[] {
  const steps: { dividend: string; quotient: string; remainder: string }[] = [];
  let v = value < 0n ? -value : value;
  const b = BigInt(base);
  if (v === 0n) return [{ dividend: '0', quotient: '0', remainder: '0' }];
  while (v > 0n) {
    const q = v / b;
    const r = v % b;
    steps.push({ dividend: v.toString(), quotient: q.toString(), remainder: DIGITS[Number(r)].toUpperCase() });
    v = q;
  }
  return steps;
}

/** Passos didáticos de base -> decimal, por soma de potências posicionais. */
export function positionalSteps(text: string, base: number): { digit: string; value: number; power: number; product: bigint }[] {
  const body = text.trim().toLowerCase().replace(/[\s_]/g, '');
  const out: { digit: string; value: number; power: number; product: bigint }[] = [];
  const n = body.length;
  for (let i = 0; i < n; i++) {
    const ch = body[i];
    const v = DIGITS.indexOf(ch);
    const power = n - 1 - i;
    out.push({ digit: ch.toUpperCase(), value: v, power, product: BigInt(v) * BigInt(base) ** BigInt(power) });
  }
  return out;
}

/** Representação em complemento de dois com N bits. */
export function twosComplement(value: number, bits: number): { bin: string; ok: boolean; min: number; max: number } {
  const min = -(2 ** (bits - 1));
  const max = 2 ** (bits - 1) - 1;
  const ok = Number.isInteger(value) && value >= min && value <= max;
  const mask = (1n << BigInt(bits)) - 1n;
  const raw = BigInt(Math.trunc(value)) & mask;
  const bin = raw.toString(2).padStart(bits, '0');
  return { bin, ok, min, max };
}

/** Interpreta um padrão de bits como inteiro com sinal em complemento de dois. */
export function fromTwosComplement(bin: string): number {
  const bits = bin.length;
  const unsigned = parseInt(bin, 2);
  return bin[0] === '1' ? unsigned - 2 ** bits : unsigned;
}

export const BYTE_UNITS_SI = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB'] as const;
export const BYTE_UNITS_IEC = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'] as const;

/** Formata bytes em unidades SI (1000) ou IEC (1024). */
export function formatBytes(bytes: number, mode: 'si' | 'iec' = 'iec', digits = 2): string {
  const step = mode === 'si' ? 1000 : 1024;
  const units = mode === 'si' ? BYTE_UNITS_SI : BYTE_UNITS_IEC;
  if (bytes === 0) return `0 ${units[0]}`;
  const i = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(step)), units.length - 1);
  const n = bytes / step ** i;
  return `${n.toFixed(i === 0 ? 0 : digits).replace(/\.?0+$/, '')} ${units[i]}`;
}

/** Quantos valores distintos cabem em N bits. */
export function combinations(bits: number): bigint {
  return 2n ** BigInt(bits);
}

/** Decompõe um float de 32 bits (IEEE 754 single) nos seus campos. */
export function float32Parts(value: number): { sign: string; exponent: string; mantissa: string; bits: string; stored: number } {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, value, false);
  const raw = new DataView(buf).getUint32(0, false);
  const bits = raw.toString(2).padStart(32, '0');
  return {
    sign: bits.slice(0, 1),
    exponent: bits.slice(1, 9),
    mantissa: bits.slice(9),
    bits,
    stored: new DataView(buf).getFloat32(0, false),
  };
}

/** Codifica um code point em UTF-8 e devolve os bytes. */
export function utf8Bytes(ch: string): number[] {
  return Array.from(new TextEncoder().encode(ch));
}

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_.,]/g, '')
    .replace(/^0b|^0x|^0o/, '')
    .replace(/^0+(?=[0-9a-z])/, '');
}
