import { useState } from 'react';
import { WidgetShell } from './Shell';

interface Layer {
  n: number; name: string; pdu: string; header: string; color: string;
  role: string; examples: string; devices: string;
}

export const OSI_LAYERS: Layer[] = [
  { n: 7, name: 'Aplicação', pdu: 'Dados', header: 'GET /index.html HTTP/1.1', color: 'bg-rose-500', role: 'Interface com o utilizador e com as aplicações: é aqui que vive o protocolo que a app fala.', examples: 'HTTP, HTTPS, DNS, SMTP, FTP, SSH', devices: 'Browser, servidor web, cliente de email' },
  { n: 6, name: 'Apresentação', pdu: 'Dados', header: 'TLS / UTF-8 / gzip', color: 'bg-orange-500', role: 'Traduz, cifra e comprime: formato dos dados, codificação de caracteres, criptografia.', examples: 'TLS/SSL, JPEG, ASCII, UTF-8, gzip', devices: '(software)' },
  { n: 5, name: 'Sessão', pdu: 'Dados', header: 'Sessão #A91F', color: 'bg-amber-500', role: 'Abre, mantém e fecha o diálogo entre duas aplicações; controla quem fala e quando.', examples: 'NetBIOS, RPC, sockets, cookies de sessão', devices: '(software)' },
  { n: 4, name: 'Transporte', pdu: 'Segmento', header: 'TCP src=54321 dst=80 seq=1', color: 'bg-emerald-500', role: 'Entrega fim-a-fim: divide em segmentos, numera-os, confirma receção e controla o fluxo.', examples: 'TCP (fiável), UDP (rápido), portas', devices: 'Firewall de estado, balanceador L4' },
  { n: 3, name: 'Rede', pdu: 'Pacote', header: 'IP 192.168.1.10 → 93.184.216.34', color: 'bg-sky-500', role: 'Endereçamento lógico e encaminhamento entre redes diferentes: escolhe o caminho.', examples: 'IP, ICMP, OSPF, BGP, NAT', devices: 'Router' },
  { n: 2, name: 'Ligação de dados', pdu: 'Trama (frame)', header: 'MAC A4:83:E7 → 3C:22:FB', color: 'bg-indigo-500', role: 'Entrega dentro da mesma rede local, endereços MAC e deteção de erros (CRC).', examples: 'Ethernet, Wi-Fi (802.11), ARP, PPP', devices: 'Switch, placa de rede' },
  { n: 1, name: 'Física', pdu: 'Bits', header: '10110100 01101001 …', color: 'bg-slate-500', role: 'Transmite bits como sinais elétricos, luz ou ondas de rádio pelo meio físico.', examples: 'Cabo UTP, fibra ótica, rádio, RJ45, USB', devices: 'Cabo, hub, repetidor, antena' },
];

export function OsiSimulator() {
  const [message, setMessage] = useState('Olá, servidor!');
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'down' | 'up'>('down');

  const active = dir === 'down' ? 7 - step : step + 1;
  const wrapped = OSI_LAYERS.filter((l) => (dir === 'down' ? l.n > active : l.n >= active));

  const next = () => {
    if (step < 6) setStep(step + 1);
    else if (dir === 'down') { setDir('up'); setStep(0); }
  };
  const reset = () => { setStep(0); setDir('down'); };

  return (
    <WidgetShell
      title="Encapsulamento no modelo OSI"
      subtitle="Ao sair, cada camada acrescenta um cabeçalho. Ao chegar, cada camada retira o seu."
      actions={
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={reset}>Reiniciar</button>
          <button className="btn btn-primary btn-sm" onClick={next} disabled={dir === 'up' && step === 6}>
            {dir === 'down' ? 'Descer uma camada' : 'Subir uma camada'}
          </button>
        </div>
      }
    >
      <label className="block max-w-md">
        <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">Mensagem a enviar</span>
        <input className="field" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={40} />
      </label>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
        <span className={`chip ${dir === 'down' ? 'bg-brand-600 text-white' : 'surface-sunken text-muted'}`}>📤 Emissor: a descer (encapsula)</span>
        <span className={`chip ${dir === 'up' ? 'bg-brand-600 text-white' : 'surface-sunken text-muted'}`}>📥 Recetor: a subir (desencapsula)</span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <ol className="space-y-1.5">
          {OSI_LAYERS.map((l) => {
            const isActive = l.n === active;
            const passed = dir === 'down' ? l.n > active : l.n < active;
            return (
              <li
                key={l.n}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${isActive ? 'border-brand-500 bg-brand-50 shadow-sm dark:bg-brand-500/10' : passed ? 'border-soft opacity-55' : 'border-soft'}`}
              >
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${l.color}`}>{l.n}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-strong">{l.name}</p>
                  <p className="truncate text-[0.7rem] text-muted">{l.pdu} · {l.examples.split(',')[0]}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div>
          <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Unidade de dados nesta camada</p>
          <div className="scrollbar-thin overflow-x-auto rounded-xl border border-soft surface-sunken p-3">
            <div className="flex min-w-max items-stretch">
              {wrapped.slice().reverse().map((l) => (
                <div key={l.n} className={`${l.color} animate-pop rounded-l-md px-2 py-3 text-[0.6rem] font-bold text-white`} title={l.header}>
                  {l.pdu === 'Bits' ? 'PHY' : `L${l.n}`}
                </div>
              ))}
              <div className="rounded-md border-2 border-dashed border-brand-500 bg-white px-3 py-3 text-xs font-semibold dark:bg-slate-900">{message || '(vazio)'}</div>
            </div>
          </div>
          <div className="card mt-3 p-3.5">
            <p className="text-sm font-bold text-strong">Camada {active} — {OSI_LAYERS.find((l) => l.n === active)!.name}</p>
            <p className="mt-1 text-[0.85rem] leading-relaxed">{OSI_LAYERS.find((l) => l.n === active)!.role}</p>
            <p className="mt-2 font-mono text-[0.72rem] text-brand-700 dark:text-brand-300">
              {dir === 'down' ? '+ acrescenta: ' : '− remove: '}{OSI_LAYERS.find((l) => l.n === active)!.header}
            </p>
            <p className="mt-2 text-xs text-muted">Equipamento típico: {OSI_LAYERS.find((l) => l.n === active)!.devices}</p>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* ------------------------------------------------ Inspetor de pacote */

const PACKET = [
  {
    id: 'eth', label: 'Trama Ethernet (camada 2)', color: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
    fields: [['MAC destino', '3C:22:FB:11:0A:9E', 'Placa de rede do router local'], ['MAC origem', 'A4:83:E7:44:1B:02', 'A tua placa de rede'], ['EtherType', '0x0800', 'O que vem a seguir é IPv4'], ['FCS', '0x9A21C3D4', 'Verificação de erros (CRC)']],
  },
  {
    id: 'ip', label: 'Cabeçalho IP (camada 3)', color: 'border-sky-400 bg-sky-50 dark:bg-sky-500/10',
    fields: [['Versão', '4', 'IPv4'], ['IP origem', '192.168.1.10', 'O teu computador na rede local'], ['IP destino', '93.184.216.34', 'O servidor'], ['TTL', '64', 'Máximo de saltos antes de descartar'], ['Protocolo', '6', '6 = TCP, 17 = UDP']],
  },
  {
    id: 'tcp', label: 'Cabeçalho TCP (camada 4)', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    fields: [['Porta origem', '54321', 'Porta efémera do teu browser'], ['Porta destino', '443', '443 = HTTPS, 80 = HTTP'], ['Nº de sequência', '1 842 001', 'Permite remontar os dados pela ordem certa'], ['Flags', 'PSH, ACK', 'Confirma o que recebeu e pede entrega imediata'], ['Janela', '64240', 'Controlo de fluxo: quanto ainda aguenta receber']],
  },
  {
    id: 'http', label: 'Dados HTTP (camada 7)', color: 'border-rose-400 bg-rose-50 dark:bg-rose-500/10',
    fields: [['Método', 'GET', 'Quer ler um recurso, sem o alterar'], ['Caminho', '/index.html', 'O recurso pedido'], ['Host', 'exemplo.pt', 'Que site, quando um IP serve vários'], ['User-Agent', 'Mozilla/5.0 …', 'Que programa fez o pedido']],
  },
];

export function PacketInspector() {
  const [open, setOpen] = useState('http');
  return (
    <WidgetShell title="Anatomia de um pedido web" subtitle="O que viaja realmente no cabo quando escreves um endereço no browser.">
      <div className="space-y-2">
        {PACKET.map((p) => (
          <div key={p.id} className={`rounded-xl border-2 ${p.color} ${open === p.id ? '' : 'opacity-80'}`}>
            <button className="flex w-full items-center justify-between px-3.5 py-2.5 text-left" onClick={() => setOpen(open === p.id ? '' : p.id)} aria-expanded={open === p.id}>
              <span className="text-sm font-bold text-strong">{p.label}</span>
              <span className="text-muted">{open === p.id ? '−' : '+'}</span>
            </button>
            {open === p.id && (
              <table className="w-full border-t border-black/5 text-left text-xs dark:border-white/10">
                <tbody>
                  {p.fields.map(([k, v, d]) => (
                    <tr key={k} className="border-b border-black/5 last:border-0 dark:border-white/5">
                      <th className="w-32 px-3.5 py-2 text-left font-semibold text-strong">{k}</th>
                      <td className="px-2 py-2 font-mono text-brand-700 dark:text-brand-300">{v}</td>
                      <td className="px-3.5 py-2 text-muted">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        As camadas de fora são as mais baixas: o switch só lê a trama Ethernet, o router só precisa do cabeçalho IP, e apenas o servidor abre o HTTP lá dentro.
      </p>
    </WidgetShell>
  );
}
