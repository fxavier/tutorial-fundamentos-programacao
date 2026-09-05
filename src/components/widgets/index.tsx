import type { WidgetId } from '../../types';
import { BaseConverter, BitToggler, TwosComplementLab, StorageCalculator, AsciiExplorer, FloatBits } from './Numeric';
import { MemoryVisualizer, CpuCycle, StackHeap } from './System';
import { OsiSimulator, PacketInspector } from './Network';
import { TruthTable, Flowchart, DeskCheck } from './Logic';
import { SortingVisualizer, BinarySearchViz, BigOChart, ComplexityRace } from './Algorithms';
import { PortugolPlayground } from './Portugol';
import { PythonLab } from './Python';

export function Widget({ id, props }: { id: WidgetId; props?: Record<string, unknown> }) {
  switch (id) {
    case 'base-converter': return <BaseConverter />;
    case 'bit-toggler': return <BitToggler bits={(props?.bits as number) ?? 8} />;
    case 'twos-complement': return <TwosComplementLab />;
    case 'storage-calculator': return <StorageCalculator />;
    case 'ascii-explorer': return <AsciiExplorer />;
    case 'float-bits': return <FloatBits />;
    case 'memory-visualizer': return <MemoryVisualizer />;
    case 'cpu-cycle': return <CpuCycle />;
    case 'stack-heap': return <StackHeap />;
    case 'osi-simulator': return <OsiSimulator />;
    case 'packet-inspector': return <PacketInspector />;
    case 'truth-table': return <TruthTable />;
    case 'flowchart': return <Flowchart />;
    case 'desk-check': return <DeskCheck />;
    case 'sorting-visualizer': return <SortingVisualizer />;
    case 'binary-search': return <BinarySearchViz />;
    case 'bigo-chart': return <BigOChart />;
    case 'complexity-race': return <ComplexityRace />;
    case 'python-lab':
      return (
        <PythonLab
          initial={props?.code as string | undefined}
          initialInput={props?.input as string | undefined}
          packages={props?.packages as string[] | undefined}
          set={props?.set as 'basico' | 'estruturas' | 'poo' | 'pandas' | undefined}
          compact={props?.compact as boolean | undefined}
        />
      );
    case 'portugol':
      return <PortugolPlayground initial={props?.code as string | undefined} initialInput={props?.input as string | undefined} compact={props?.compact as boolean | undefined} />;
  }
}

export const WIDGET_CATALOG: { id: WidgetId; name: string; description: string; icon: string }[] = [
  { id: 'base-converter', name: 'Conversor de bases', description: 'Binário, octal, decimal e hexadecimal com os passos das conversões.', icon: '🔢' },
  { id: 'bit-toggler', name: 'Bits ligados', description: 'Liga e desliga bits e vê o valor decimal a formar-se.', icon: '🔘' },
  { id: 'twos-complement', name: 'Complemento de dois', description: 'Como se guardam números negativos e o que é overflow.', icon: '➖' },
  { id: 'storage-calculator', name: 'Calculadora de armazenamento', description: 'KB vs KiB, quantos ficheiros cabem num disco.', icon: '💾' },
  { id: 'ascii-explorer', name: 'Texto → bits', description: 'ASCII, Unicode e a codificação UTF-8 carácter a carácter.', icon: '🔤' },
  { id: 'float-bits', name: 'IEEE 754', description: 'Sinal, expoente e mantissa — e porque 0.1 + 0.2 ≠ 0.3.', icon: '🎯' },
  { id: 'memory-visualizer', name: 'Mapa de memória', description: 'Declara variáveis e vê os bytes e endereços ocupados.', icon: '🧠' },
  { id: 'cpu-cycle', name: 'Ciclo da CPU', description: 'Busca, descodificação e execução, instrução a instrução.', icon: '⚙️' },
  { id: 'stack-heap', name: 'Pilha e heap', description: 'Chamadas de função empilhadas e o que é stack overflow.', icon: '🥞' },
  { id: 'osi-simulator', name: 'Simulador OSI', description: 'Encapsulamento e desencapsulamento nas 7 camadas.', icon: '🌐' },
  { id: 'packet-inspector', name: 'Inspetor de pacote', description: 'Ethernet, IP, TCP e HTTP num pedido real.', icon: '📦' },
  { id: 'truth-table', name: 'Tabela verdade', description: 'Escreve expressões lógicas e vê todas as combinações.', icon: '✅' },
  { id: 'flowchart', name: 'Fluxogramas', description: 'Sequência, decisão e repetição desenhadas.', icon: '📐' },
  { id: 'desk-check', name: 'Teste de mesa', description: 'Segue algoritmos linha a linha com a tabela de variáveis.', icon: '📋' },
  { id: 'portugol', name: 'Editor de Portugol', description: 'Escreve e executa pseudocódigo em português no browser.', icon: '💻' },
  { id: 'sorting-visualizer', name: 'Ordenação animada', description: 'Cinco algoritmos de ordenação passo a passo.', icon: '📊' },
  { id: 'binary-search', name: 'Pesquisa binária', description: 'Corta o problema ao meio e compara com a pesquisa linear.', icon: '🔍' },
  { id: 'bigo-chart', name: 'Gráfico Big-O', description: 'Como o custo cresce com o tamanho da entrada.', icon: '📈' },
  { id: 'complexity-race', name: 'Tempos reais', description: 'Quanto demora cada complexidade com n grande.', icon: '⏱️' },
  { id: 'python-lab', name: 'Laboratório de Python', description: 'Python 3 real no browser, com pandas. Escreve, corre e vê a saída.', icon: '🐍' },
];
