import type { Module } from '../types';

export const m04: Module = {
  id: 'redes',
  number: 4,
  title: 'Redes e o modelo OSI',
  subtitle: 'As sete camadas, o TCP/IP e o que acontece quando escreves um endereço no browser',
  icon: '🌐',
  minutes: 45,
  goals: [
    'Enumerar as sete camadas do modelo OSI e a função de cada uma',
    'Explicar encapsulamento e desencapsulamento',
    'Relacionar o OSI com o modelo TCP/IP usado na prática',
    'Distinguir IP, porta, MAC e DNS',
    'Descrever o percurso completo de um pedido HTTP',
  ],
  sections: [
    {
      id: 'porque-camadas',
      title: 'Porquê dividir em camadas',
      blocks: [
        { type: 'p', text: 'Ligar dois computadores envolve problemas muito diferentes: transformar bits em sinais elétricos, encontrar a máquina certa do outro lado do mundo, garantir que nada se perdeu pelo caminho, e finalmente perceber que o que chegou é uma página HTML. Resolver tudo isto num só bloco seria impossível de manter.' },
        { type: 'p', text: 'A solução é a mesma que usamos em software: **camadas**. Cada camada resolve um problema, oferece um serviço à camada de cima e não precisa de saber como a de baixo funciona. Trocar Wi-Fi por cabo não obriga a reescrever o browser.' },
        { type: 'p', text: 'O **modelo OSI** (*Open Systems Interconnection*, ISO 1984) é o mapa de referência com sete camadas. Não é o que corre nas máquinas — isso é o TCP/IP — mas é a linguagem comum com que todos os profissionais de redes discutem problemas.' },
        { type: 'callout', tone: 'key', text: 'Quando alguém diz "isto é um problema de camada 3" está a dizer "é encaminhamento/IP"; "erro de camada 7" é a aplicação. Saber o vocabulário poupa horas de diagnóstico.' },
      ],
    },
    {
      id: 'camadas',
      title: 'As sete camadas, de cima para baixo',
      blocks: [
        {
          type: 'table',
          head: ['#', 'Camada', 'Responsabilidade', 'Unidade', 'Exemplos'],
          rows: [
            ['7', '**Aplicação**', 'O protocolo que a aplicação fala', 'Dados', 'HTTP, DNS, SMTP, SSH, FTP'],
            ['6', '**Apresentação**', 'Formato, codificação, cifra e compressão', 'Dados', 'TLS, UTF-8, JPEG, gzip'],
            ['5', '**Sessão**', 'Abre, mantém e fecha o diálogo entre aplicações', 'Dados', 'Sockets, RPC, NetBIOS'],
            ['4', '**Transporte**', 'Entrega fim-a-fim, portas, fiabilidade, controlo de fluxo', 'Segmento', 'TCP, UDP'],
            ['3', '**Rede**', 'Endereçamento lógico e encaminhamento entre redes', 'Pacote', 'IP, ICMP, BGP, NAT'],
            ['2', '**Ligação de dados**', 'Entrega na rede local, endereços MAC, deteção de erros', 'Trama', 'Ethernet, Wi-Fi, ARP'],
            ['1', '**Física**', 'Bits como sinais elétricos, luz ou rádio', 'Bits', 'Cabo UTP, fibra, RJ45'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'Mnemónica', text: 'De baixo para cima: **F**ísica, **L**igação, **R**ede, **T**ransporte, **S**essão, **A**presentação, **A**plicação. Uma frase que ajuda: *"Fui Ligar Rapidamente Todos Sistemas Antes de Amanhecer"*.' },
        { type: 'widget', id: 'osi-simulator' },
      ],
    },
    {
      id: 'encapsulamento',
      title: 'Encapsulamento: o modelo dos envelopes',
      blocks: [
        { type: 'p', text: 'Imagina uma carta. Escreves o texto (camada 7), metes num envelope com o nome do destinatário (camada 4), esse envelope vai dentro de outro com a morada completa (camada 3), e esse dentro de um saco dos correios com a rota do camião (camada 2). Cada nível acrescenta a informação de que **aquele** nível precisa.' },
        { type: 'p', text: 'Ao chegar, o processo inverte-se: o carteiro abre o saco, o rececionista abre o envelope da morada, e só o destinatário lê o texto. É isto o **desencapsulamento**.' },
        { type: 'code', lang: 'text', caption: 'como cresce a unidade de dados ao descer', code: `Camada 7   [ GET /index.html HTTP/1.1 ]
Camada 4   [ TCP | GET /index.html HTTP/1.1 ]
Camada 3   [ IP | TCP | GET /index.html HTTP/1.1 ]
Camada 2   [ ETH | IP | TCP | GET /index.html HTTP/1.1 | CRC ]
Camada 1    1011010010110100101101001011010010110100…` },
        { type: 'widget', id: 'packet-inspector' },
      ],
    },
    {
      id: 'tcpip',
      title: 'O modelo TCP/IP, que é o que corre de facto',
      blocks: [
        { type: 'p', text: 'A Internet não implementa o OSI: implementa o **TCP/IP**, com quatro camadas. O OSI ficou como modelo pedagógico e vocabulário; o TCP/IP ficou como realidade.' },
        {
          type: 'table',
          head: ['TCP/IP', 'Corresponde ao OSI', 'Protocolos'],
          rows: [
            ['Aplicação', 'Camadas 5, 6 e 7', 'HTTP, DNS, SMTP, SSH, TLS'],
            ['Transporte', 'Camada 4', 'TCP, UDP, QUIC'],
            ['Internet', 'Camada 3', 'IP, ICMP, ARP'],
            ['Acesso à rede', 'Camadas 1 e 2', 'Ethernet, Wi-Fi, PPP'],
          ],
        },
        { type: 'h', text: 'TCP contra UDP' },
        {
          type: 'compare',
          left: { title: 'TCP — fiável', items: ['Estabelece ligação (aperto de mão em 3 passos)', 'Numera e reordena os segmentos', 'Retransmite o que se perde', 'Controla o fluxo e o congestionamento', 'Usado em: HTTP, email, SSH, bases de dados'] },
          right: { title: 'UDP — rápido', items: ['Sem ligação prévia e sem garantias', 'Não reordena nem retransmite', 'Muito menos sobrecarga e latência', 'Perder um pacote é melhor do que esperar por ele', 'Usado em: DNS, voz, vídeo em direto, jogos'] },
        },
        { type: 'callout', tone: 'info', title: 'E o QUIC / HTTP/3', text: 'Os protocolos web mais recentes correm sobre UDP e reimplementam a fiabilidade no espaço da aplicação, para evitar limitações do TCP e reduzir o tempo de estabelecimento da ligação. É um bom exemplo de como as camadas são convenção, não lei da física.' },
      ],
    },
    {
      id: 'enderecamento',
      title: 'Endereços: MAC, IP, porta e nome',
      blocks: [
        {
          type: 'terms', items: [
            { term: 'Endereço MAC', def: 'Identificador físico de uma placa de rede, gravado de fábrica (48 bits, ex.: A4:83:E7:44:1B:02). Só tem significado dentro da rede local.' },
            { term: 'Endereço IP', def: 'Identificador lógico, atribuído pela rede. IPv4 tem 32 bits (192.168.1.10); IPv6 tem 128 bits e resolve o esgotamento de endereços.' },
            { term: 'Porta', def: 'Número de 16 bits (0–65535) que identifica a aplicação dentro da máquina. 80 = HTTP, 443 = HTTPS, 22 = SSH, 5432 = PostgreSQL.' },
            { term: 'DNS', def: 'A lista telefónica da Internet: traduz nomes (exemplo.pt) em endereços IP.' },
            { term: 'DHCP', def: 'Protocolo que atribui automaticamente IP, máscara, gateway e DNS a uma máquina que se liga à rede.' },
            { term: 'NAT', def: 'Tradução de endereços que permite a muitos dispositivos privados partilhar um IP público.' },
          ],
        },
        { type: 'code', lang: 'text', caption: 'um endereço completo', code: `https://exemplo.pt:443/produtos?id=7
  │        │        │    │        └── parâmetros (camada 7)
  │        │        │    └─────────── recurso pedido (camada 7)
  │        │        └──────────────── porta (camada 4)
  │        └───────────────────────── nome, resolvido por DNS num IP (camada 3)
  └────────────────────────────────── protocolo (camada 7 + TLS na 6)` },
        { type: 'p', text: 'Redes privadas usam gamas reservadas que não circulam na Internet: `10.0.0.0/8`, `172.16.0.0/12` e `192.168.0.0/16`. É por isso que o teu computador em casa e o do vizinho podem ambos ser `192.168.1.10`.' },
      ],
    },
    {
      id: 'percurso',
      title: 'O que acontece ao escrever um endereço no browser',
      blocks: [
        {
          type: 'steps', items: [
            { title: '1. Resolução do nome (DNS)', text: 'O browser procura `exemplo.pt` na sua cache, depois no sistema, depois pergunta ao servidor DNS configurado. A resposta é um endereço IP. Isto viaja normalmente em UDP na porta 53.' },
            { title: '2. Rota até ao destino', text: 'O sistema compara o IP de destino com a sua máscara de sub-rede. Se for local, pergunta o MAC por ARP; se for remoto, envia ao *gateway* (o router).' },
            { title: '3. Ligação TCP', text: 'Aperto de mão em três passos: SYN → SYN-ACK → ACK. A partir daqui há um canal fiável entre as duas portas.' },
            { title: '4. Aperto de mão TLS', text: 'Em HTTPS, negoceiam-se as chaves e valida-se o certificado do servidor. A partir daqui tudo o que passa é cifrado.' },
            { title: '5. Pedido HTTP', text: 'O browser envia `GET /index.html` com cabeçalhos (Host, User-Agent, Cookie, Accept).' },
            { title: '6. Resposta e composição', text: 'O servidor responde com um código de estado e o corpo. O browser lê o HTML, descobre CSS, JavaScript e imagens, e repete o processo para cada recurso.' },
          ],
        },
        {
          type: 'table',
          head: ['Código HTTP', 'Significado', 'Quando aparece'],
          rows: [
            ['**200 OK**', 'Sucesso', 'O recurso foi devolvido'],
            ['**301 / 302**', 'Redireccionamento', 'O recurso mudou de sítio'],
            ['**400**', 'Pedido inválido', 'Falta um campo, o JSON está mal formado'],
            ['**401 / 403**', 'Não autenticado / sem permissão', 'Falta credencial ou o utilizador não pode aceder'],
            ['**404**', 'Não encontrado', 'O caminho não existe'],
            ['**500**', 'Erro interno do servidor', 'Exceção não tratada no código do servidor'],
            ['**503**', 'Serviço indisponível', 'Sobrecarga ou manutenção'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'Ferramentas para ver isto ao vivo', text: '`ping` testa a camada 3; `traceroute` mostra os saltos até ao destino; `nslookup`/`dig` consultam o DNS; `netstat`/`ss` listam ligações e portas; o separador *Network* das ferramentas de programador do browser mostra cada pedido HTTP com tempos e cabeçalhos.' },
      ],
    },
  ],
  quiz: [
    { id: 'r1', prompt: 'Em que camada do OSI trabalha um router?', options: ['Camada 1 (física)', 'Camada 2 (ligação de dados)', 'Camada 3 (rede)', 'Camada 4 (transporte)'], answer: 2, explain: 'O router lê endereços IP e decide o caminho — isso é camada 3. O switch trabalha na 2, com endereços MAC.' },
    { id: 'r2', prompt: 'Qual é a unidade de dados da camada de transporte?', options: ['Trama', 'Pacote', 'Segmento', 'Bit'], answer: 2, explain: 'Segmento na camada 4, pacote na 3, trama na 2 e bits na 1.' },
    { id: 'r3', prompt: 'Que protocolo escolherias para transmissão de vídeo em direto?', options: ['TCP, para garantir que nada se perde', 'UDP, porque a latência importa mais do que a perfeição', 'HTTP, por ser mais simples', 'ARP, por ser mais rápido'], answer: 1, explain: 'Retransmitir uma imagem antiga é inútil num direto: mais vale saltá-la. Daí o UDP (ou QUIC).' },
    { id: 'r4', prompt: 'O que faz o DNS?', options: ['Atribui endereços IP às máquinas da rede', 'Traduz nomes de domínio em endereços IP', 'Cifra a ligação', 'Encaminha pacotes entre redes'], answer: 1, explain: 'Atribuir IPs é o DHCP; cifrar é o TLS; encaminhar é o IP/router. O DNS resolve nomes.' },
    { id: 'r5', prompt: 'Encapsulamento significa…', options: ['comprimir os dados para ocuparem menos espaço', 'cada camada acrescentar o seu cabeçalho aos dados que recebe da camada de cima', 'esconder o endereço IP de origem', 'dividir o ficheiro em vários ficheiros'], answer: 1, explain: 'Cada camada embrulha o que recebe e acrescenta a informação de controlo de que precisa.' },
    { id: 'r6', prompt: 'Um pedido devolve 403. O que significa?', options: ['O servidor não existe', 'O recurso não foi encontrado', 'O utilizador está identificado mas não tem permissão', 'O servidor teve um erro interno'], answer: 2, explain: '401 é "não autenticado" (não sabemos quem és); 403 é "autenticado mas proibido"; 404 é "não existe"; 500 é erro do servidor.' },
    { id: 'r7', prompt: 'Porque é que o endereço MAC não chega para comunicar na Internet?', options: ['Porque é demasiado curto', 'Porque só tem significado dentro da rede local e não permite encaminhamento hierárquico', 'Porque muda a cada ligação', 'Porque não é único'], answer: 1, explain: 'Os MAC são planos e não agrupáveis; o IP é hierárquico, o que permite aos routers decidir caminhos sem conhecer todas as máquinas do mundo.' },
  ],
  exercises: [
    { id: 'e4-1', difficulty: 1, kind: 'input', title: 'Camada do HTTPS', statement: 'Em que número de camada do OSI se situa o protocolo HTTP? Responde com o número.', accept: ['7', 'sete'], hint: 'É o protocolo que a aplicação fala diretamente.', solution: 'Camada **7**, aplicação. A cifra do HTTPS (TLS) é normalmente mapeada na camada 6.' },
    { id: 'e4-2', difficulty: 2, kind: 'open', title: 'Diagnóstico em camadas', statement: 'Um utilizador diz "a internet não funciona". Descreve uma sequência de testes, camada a camada, para isolar o problema.', hint: 'Começa por baixo e sobe.', solution: 'Camada 1: o cabo está ligado? A luz da porta acende? O Wi-Fi está associado? Camada 2: `ip addr` mostra a interface ativa? Camada 3: `ping 192.168.1.1` chega ao gateway? `ping 8.8.8.8` chega à Internet? Camada 4: `telnet exemplo.pt 443` abre a porta? Camada 7: `nslookup exemplo.pt` resolve o nome? `curl -v https://exemplo.pt` devolve resposta? Se `ping 8.8.8.8` funciona mas `nslookup` falha, o problema é DNS — muito comum e frequentemente diagnosticado como "a internet não funciona".' },
    { id: 'e4-3', difficulty: 2, kind: 'open', title: 'TCP ou UDP', statement: 'Indica o protocolo de transporte mais adequado e justifica: (a) transferência bancária; (b) chamada de vídeo; (c) consulta DNS; (d) descarregar um ficheiro ZIP.', solution: '(a) TCP — um byte perdido corrompe a transação; a fiabilidade é obrigatória. (b) UDP — a latência domina; um fotograma perdido é preferível a um atraso visível. (c) UDP — a consulta cabe num pacote e repetir é mais barato do que estabelecer ligação; DNS usa TCP quando a resposta é grande. (d) TCP — o ficheiro tem de chegar íntegro e por ordem.' },
    { id: 'e4-4', difficulty: 3, kind: 'open', title: 'O percurso completo', statement: 'Descreve, com pelo menos oito passos, tudo o que acontece entre carregares Enter em `https://loja.pt/carrinho` e veres a página. Indica a camada envolvida em cada passo.', solution: '1) O browser procura `loja.pt` nas suas caches (7). 2) Envia consulta DNS ao resolvedor configurado, em UDP porta 53 (7 sobre 4). 3) Recebe o IP e prepara o pedido. 4) Compara o IP de destino com a máscara de sub-rede; sendo remoto, dirige a trama ao gateway, cujo MAC obtém por ARP (3 e 2). 5) Estabelece ligação TCP com aperto de mão em três passos para a porta 443 (4). 6) Negoceia TLS: valida o certificado, acorda chaves de sessão (6). 7) Envia `GET /carrinho` com cabeçalhos Host e Cookie, já cifrado (7). 8) Os routers intermédios encaminham os pacotes salto a salto, decrementando o TTL (3). 9) O servidor processa, consulta a base de dados e responde 200 com HTML (7). 10) O browser lê o HTML e repete o processo para CSS, JavaScript e imagens, muitas vezes reutilizando a mesma ligação. 11) O motor de renderização compõe a página e executa o JavaScript.' },
    { id: 'e4-5', difficulty: 3, kind: 'open', title: 'Portas e serviços', statement: 'Um servidor tem as portas 22, 80, 443 e 5432 abertas para a Internet. Que serviços são estes e que problema de segurança identificas?', solution: 'Porta 22 = SSH (administração remota), 80 = HTTP, 443 = HTTPS, 5432 = PostgreSQL. O problema grave é a **5432 exposta à Internet**: uma base de dados nunca deve estar acessível publicamente — deve ficar numa rede privada, acessível apenas pela aplicação, ou por túnel/VPN. Também é discutível manter a 80 aberta sem redirecionar tudo para 443, e a 22 devia estar restrita por firewall a endereços conhecidos e configurada apenas com chaves, sem palavra-passe.' },
  ],
};
