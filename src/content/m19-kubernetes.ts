import type { Module } from '../types';

export const m19: Module = {
  id: 'kubernetes',
  number: 19,
  title: 'Kubernetes — orquestração de containers em produção',
  subtitle: 'Pods, Deployments, Services, Ingress, Helm, observabilidade e GitOps — do kubectl ao cluster multi-tenant',
  icon: '☸️',
  minutes: 130,
  goals: [
    'Perceber o modelo de controlo declarativo do Kubernetes',
    'Dominar os objetos essenciais: Pod, Deployment, Service, ConfigMap, Secret',
    'Expor aplicações com Services e Ingress',
    'Gerir configuração, segredos e volumes persistentes',
    'Fazer scaling, rolling updates e rollbacks em segundos',
    'Configurar health checks e limites de recursos sensatos',
    'Usar Helm para empacotar aplicações',
    'Adotar observabilidade e GitOps como standard',
  ],
  sections: [
    {
      id: 'porque-k8s',
      title: 'Porquê Kubernetes',
      blocks: [
        { type: 'p', text: 'Docker tornou trivial empacotar uma aplicação. Quando passas de uma para 50, de um servidor para 30, e precisas de zero-downtime deploys, autoscaling, service discovery, segredos geridos, rollouts controlados — precisas de um orquestrador. **Kubernetes** é o que a indústria convergiu, nascido da experiência da Google a correr containers desde 2003.' },
        { type: 'p', text: 'É complexo porque o problema é complexo. Mas 90% do dia-a-dia é um subconjunto previsível — e dominá-lo é das competências com maior retorno em 2026.' },
        {
          type: 'compare',
          left: {
            title: 'O que Kubernetes te dá',
            items: [
              'Declarativo: descreves o estado desejado, o cluster reconcilia',
              'Self-healing: container morre → recria; nó cai → migra',
              'Rolling updates e rollbacks instantâneos',
              'Autoscaling horizontal baseado em CPU/RAM/métricas',
              'Service discovery e load balancing por DNS interno',
              'Segredos, configuração e volumes como primeiros cidadãos',
              'Portável — corre em qualquer cloud, on-prem ou laptop',
            ],
          },
          right: {
            title: 'O custo',
            items: [
              'Curva de aprendizagem séria — meses até estares à vontade',
              'Complexidade operacional: cluster, networking, storage, security',
              'Overhead para projetos pequenos (<5 serviços)',
              'YAML em todo o lado — fácil de desalinhar',
              'Debugging distribuído: logs em 10 nós, rede virtual, DNS',
              'Custo em cloud: cada nó + control plane + storage',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'Quando (e quando não) escolher K8s',
          text: '**Vale a pena:** mais de 5-10 serviços, múltiplas equipas, requisitos de SLA sérios, autoscaling dinâmico, multi-cloud. **Não vale:** monólito único, equipa pequena, orçamento apertado. Alternativas: Nomad (mais simples), ECS/Fargate (gerido), Fly.io / Railway / Render (PaaS modernos). Um `docker compose` num VPS leva longe.',
        },
      ],
    },
    {
      id: 'arquitectura',
      title: 'Arquitetura de um cluster',
      blocks: [
        {
          type: 'code', lang: 'text', caption: 'o quadro geral',
          code: `                     ┌─────────────────────────────────┐
                     │        Control Plane            │
                     │                                 │
                     │  ┌──────────┐  ┌──────────────┐ │
   kubectl ────────▶ │  │ API      │  │  etcd         │ │
   GitOps  ────────▶ │  │ Server   │  │  (estado)     │ │
                     │  └────┬─────┘  └──────┬────────┘ │
                     │       │               │          │
                     │  ┌────┴─────┐  ┌──────┴────────┐ │
                     │  │Scheduler │  │  Controller   │ │
                     │  │          │  │  Manager      │ │
                     │  └──────────┘  └───────────────┘ │
                     └─────────────────┬───────────────┘
                                       │
         ┌─────────────────────────────┼──────────────────────────────┐
         │                             │                              │
  ┌──────▼──────┐              ┌───────▼─────┐                ┌───────▼─────┐
  │   Node 1    │              │   Node 2    │                │   Node 3    │
  │             │              │             │                │             │
  │  kubelet    │              │  kubelet    │                │  kubelet    │
  │  kube-proxy │              │  kube-proxy │                │  kube-proxy │
  │  containerd │              │  containerd │                │  containerd │
  │             │              │             │                │             │
  │  Pod  Pod   │              │  Pod  Pod   │                │  Pod  Pod   │
  └─────────────┘              └─────────────┘                └─────────────┘`,
        },
        {
          type: 'terms', items: [
            { term: 'Control Plane', def: 'O cérebro do cluster. Em clusters geridos (GKE, EKS, AKS) é invisível. Em DIY, são 3+ máquinas replicadas.' },
            { term: 'API Server', def: 'Única porta de entrada para o cluster. Tudo o resto (kubectl, kubelet, controllers) fala com ele via REST sobre HTTP.' },
            { term: 'etcd', def: 'Base de dados distribuída que guarda **todo** o estado do cluster. Se perderes o etcd, perdes o cluster — faz backup.' },
            { term: 'Scheduler', def: 'Decide em que nó colocar cada Pod novo, com base em CPU, RAM, afinidades e taints.' },
            { term: 'Controller Manager', def: 'Loops de reconciliação: compara o estado observado com o desejado e corrige. "Queria 3 réplicas, vejo 2, crio 1".' },
            { term: 'Node', def: 'Máquina (VM ou física) que corre workloads. Cada nó tem `kubelet` (agente) e um runtime (containerd, CRI-O).' },
            { term: 'kubelet', def: 'Agente em cada nó. Garante que os containers do Pod estão a correr; reporta estado ao API Server.' },
            { term: 'kube-proxy', def: 'Mantém regras de rede (iptables/IPVS/eBPF) que permitem a comunicação entre Services e Pods.' },
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'O princípio essencial: reconciliação contínua',
          text: 'Nunca "corres" nada no Kubernetes — **descreves o que queres** num YAML, e o cluster trabalha para manter isso. Pod morre? Recria. Nó falha? Reaparece noutro. Configuração muda? Rolling update. É esta propriedade que torna K8s self-healing.',
        },
      ],
    },
    {
      id: 'instalar',
      title: 'Instalar e começar local',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'kubectl', text: 'Cliente oficial. **macOS:** `brew install kubectl`. **Linux:** descarrega o binário. **Windows:** `choco install kubernetes-cli`. Confirma com `kubectl version --client`.' },
            { title: 'Cluster local', text: '[**kind**](https://kind.sigs.k8s.io/) (recomendado — K8s em contentores Docker) ou [**minikube**](https://minikube.sigs.k8s.io/). `brew install kind` / `brew install minikube`.' },
            { title: 'Criar o cluster', text: '`kind create cluster --name curso` → pronto em ~30 segundos. `kubectl get nodes` mostra o nó de controlo.' },
            { title: 'IDE', text: 'VS Code com extensão "Kubernetes" (Microsoft). Mostra os recursos no explorador, logs ao vivo, exec em pods, YAML schema validation.' },
            { title: 'Visualização', text: '[**k9s**](https://k9scli.io/) — UI de terminal, torna 90% das tarefas instantâneas. `brew install k9s`.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'os 15 comandos que vais usar sempre',
          code: `# Contexto e cluster
kubectl config get-contexts
kubectl config use-context <nome>
kubectl cluster-info
kubectl get nodes

# Ver objetos
kubectl get pods                             # no namespace atual
kubectl get pods -A                          # todos os namespaces
kubectl get pods -n kube-system
kubectl get deploy,svc,ing                   # várias tipos de uma vez
kubectl get pods -o wide                     # mostra IP e nó
kubectl get pods -l app=api                  # filtra por label

# Descrever e debugar
kubectl describe pod <nome>
kubectl logs <pod>
kubectl logs -f <pod>                        # follow (tail)
kubectl logs <pod> -c <container>            # multi-container
kubectl logs <pod> --previous                # do anterior (depois de crash)
kubectl exec -it <pod> -- bash               # shell dentro do pod

# Aplicar e remover
kubectl apply -f deployment.yaml
kubectl apply -f ./manifests/                # directório inteiro
kubectl delete -f deployment.yaml
kubectl delete pod <nome>                    # será recriado pelo Deployment

# Debugging rápido
kubectl run tmp --rm -it --image=alpine -- sh
kubectl port-forward svc/api 8080:80         # túnel local → cluster
kubectl top pods                             # CPU/RAM (precisa de metrics-server)`,
        },
      ],
    },
    {
      id: 'objetos',
      title: 'Os objetos essenciais',
      blocks: [
        {
          type: 'table',
          head: ['Objeto', 'Para que serve'],
          rows: [
            ['**Pod**', 'A unidade mais pequena — um ou mais containers partilhando rede e volumes. Raramente criados directamente.'],
            ['**Deployment**', 'Gere Pods através de ReplicaSets. Faz rolling updates e rollbacks. É o que usas 90% das vezes.'],
            ['**StatefulSet**', 'Como Deployment mas com identidade estável e armazenamento por instância. Para BDs, Kafka, Redis em HA.'],
            ['**DaemonSet**', 'Um Pod em cada nó. Para agentes de log, métricas, networking.'],
            ['**Job / CronJob**', 'Tarefa única / agendada (como `cron`).'],
            ['**Service**', 'Endpoint estável para um conjunto de Pods. DNS interno, load balancing.'],
            ['**Ingress**', 'Roteamento HTTP(S) do exterior para Services, com TLS e hostnames.'],
            ['**ConfigMap**', 'Configuração não-sensível (ficheiros, variáveis de ambiente).'],
            ['**Secret**', 'Segredos (passwords, tokens, certificados). Idealmente geridos por External Secrets + Vault/SOPS.'],
            ['**PersistentVolumeClaim**', 'Pedido de armazenamento persistente para um Pod.'],
            ['**Namespace**', 'Divisão lógica do cluster — isola recursos e permissões.'],
            ['**ServiceAccount**', 'Identidade com que um Pod se autentica ao API Server e a serviços externos.'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Pods não se criam à mão',
          text: 'Criar um Pod sozinho significa que, se ele morrer, não volta. Sempre **através de um Deployment** (ou StatefulSet/DaemonSet/Job). Se vires alguém a aplicar `kind: Pod` em produção, é bandeira vermelha.',
        },
      ],
    },
    {
      id: 'primeiro-deployment',
      title: 'Primeiro Deployment e Service',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'deployment.yaml — API com 3 réplicas',
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: loja-api
  labels:
    app: loja-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: loja-api
  template:                           # molde do Pod
    metadata:
      labels:
        app: loja-api
    spec:
      containers:
        - name: api
          image: ghcr.io/ana/loja-api:0.3.1       # tag imutável
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: prod
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: loja-secrets
                  key: database-url
          resources:
            requests:
              cpu: "100m"             # 0.1 CPU — o que pede ao scheduler
              memory: "256Mi"
            limits:
              cpu: "1"                # ceiling absoluto
              memory: "512Mi"
          livenessProbe:
            httpGet: { path: /actuator/health/liveness, port: 8080 }
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet: { path: /actuator/health/readiness, port: 8080 }
            periodSeconds: 5
      terminationGracePeriodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: loja-api
spec:
  selector:
    app: loja-api
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP`,
        },
        {
          type: 'code', lang: 'bash',
          code: `kubectl apply -f deployment.yaml
# deployment.apps/loja-api created
# service/loja-api created

kubectl get deploy,pods,svc
# NAME                           READY   UP-TO-DATE   AVAILABLE
# deployment.apps/loja-api       3/3     3            3
#
# NAME                            READY   STATUS    AGE
# pod/loja-api-7f8b9c-abc12       1/1     Running   20s
# pod/loja-api-7f8b9c-def34       1/1     Running   20s
# pod/loja-api-7f8b9c-ghi56       1/1     Running   20s
#
# NAME                 TYPE        CLUSTER-IP     PORT(S)
# service/loja-api     ClusterIP   10.96.123.45   80/TCP

# Testar rápido sem ingress
kubectl port-forward svc/loja-api 8080:80
curl http://localhost:8080/actuator/health`,
        },
        {
          type: 'terms', items: [
            { term: 'Labels e selectors', def: 'O Deployment procura Pods com labels que batam no `selector.matchLabels`. O Service usa o mesmo mecanismo para encontrar backends. Pensa nisto como "tags + query".' },
            { term: 'ClusterIP', def: 'Service só acessível dentro do cluster — é o default e o que usas entre serviços.' },
            { term: 'NodePort', def: 'Service exposto numa porta alta de cada nó — útil para dev/debug, mal para prod.' },
            { term: 'LoadBalancer', def: 'Service exposto por um load balancer externo (AWS NLB, GCP LB). Caro mas é o que usas na cloud.' },
          ],
        },
      ],
    },
    {
      id: 'config-secrets',
      title: 'ConfigMaps e Secrets',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'configmap.yaml',
          code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: loja-config
data:
  LOG_LEVEL: info
  CACHE_TTL: "300"
  application.yml: |
    server:
      port: 8080
    logging:
      level:
        root: INFO`,
        },
        {
          type: 'code', lang: 'bash', caption: 'secret.yaml (nunca commits — ver nota em baixo)',
          code: `apiVersion: v1
kind: Secret
metadata:
  name: loja-secrets
type: Opaque
stringData:          # texto claro — K8s codifica em base64
  database-url: "jdbc:postgresql://pg:5432/loja"
  jwt-secret: "super-secret-change-me"`,
        },
        {
          type: 'code', lang: 'bash', caption: 'usar no Pod',
          code: `spec:
  containers:
    - name: api
      image: ghcr.io/ana/loja-api:0.3.1
      envFrom:
        - configMapRef: { name: loja-config }     # todas as chaves como env
        - secretRef:    { name: loja-secrets }
      env:
        - name: DATABASE_URL                       # alternativa: por chave
          valueFrom:
            secretKeyRef:
              name: loja-secrets
              key: database-url
      volumeMounts:
        - name: config-file
          mountPath: /app/config
  volumes:
    - name: config-file
      configMap:
        name: loja-config
        items:
          - key: application.yml
            path: application.yml`,
        },
        {
          type: 'callout', tone: 'trap', title: 'Secrets no git — nunca',
          text: 'Secrets em K8s são **base64**, não encriptados. `echo <base64> | base64 -d` recupera o texto. Em produção usa: **[External Secrets Operator](https://external-secrets.io/)** (lê de Vault/AWS Secrets Manager), **SOPS** (encripta ficheiros no git), ou **Sealed Secrets** (encripta com chave do cluster).',
        },
        {
          type: 'callout', tone: 'tip', title: 'Rolling restart quando a ConfigMap muda',
          text: 'K8s **não** reinicia Pods quando uma ConfigMap muda (Pods lêem no arranque). Soluções: **(1)** `kubectl rollout restart deploy/loja-api`; **(2)** [stakater/Reloader](https://github.com/stakater/Reloader) faz-o automaticamente; **(3)** nomear a ConfigMap com hash do conteúdo (`loja-config-abc123`) e deixar o Deployment referenciá-la — mudança = novo nome = rolling update.',
        },
      ],
    },
    {
      id: 'storage',
      title: 'Volumes persistentes',
      blocks: [
        { type: 'p', text: 'Containers são efémeros. Para dados que sobrevivem (bases de dados, uploads), K8s tem o conceito de **PersistentVolumeClaim (PVC)**: o Pod pede armazenamento; o cluster provisiona.' },
        {
          type: 'code', lang: 'bash', caption: 'PVC + Pod que o usa',
          code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pg-data
spec:
  accessModes: ["ReadWriteOnce"]      # ligado a um nó de cada vez
  storageClassName: gp3                # depende do provider (gp3 = AWS)
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector: { matchLabels: { app: postgres } }
  template:
    metadata: { labels: { app: postgres } }
    spec:
      containers:
        - name: postgres
          image: postgres:17-alpine
          env:
            - name: POSTGRES_PASSWORD
              valueFrom: { secretKeyRef: { name: pg-secrets, key: password } }
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata: { name: data }
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: gp3
        resources: { requests: { storage: 50Gi } }`,
        },
        {
          type: 'callout', tone: 'key', title: 'Bases de dados no Kubernetes?',
          text: 'Tecnicamente possível. **Aconselhado?** Para dev/test, sim. Em produção, a maioria opta por BDs **geridas** (RDS, Cloud SQL, Neon, Supabase) — backups, HA, point-in-time recovery, patching automático. Operar Postgres HA em K8s exige saber muito — considera operators (Zalando, CloudNativePG) se tiver mesmo que ser no cluster.',
        },
      ],
    },
    {
      id: 'rollouts-scaling',
      title: 'Rollouts, rollbacks e autoscaling',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: 'rolling update e rollback',
          code: `# Atualizar a imagem — dispara rolling update
kubectl set image deploy/loja-api api=ghcr.io/ana/loja-api:0.3.2

# Seguir o rollout
kubectl rollout status deploy/loja-api
# Waiting for rollout...  2 of 3 updated...  3 of 3 updated and available

# Histórico
kubectl rollout history deploy/loja-api

# Reverter se 0.3.2 for mau
kubectl rollout undo deploy/loja-api
# ou para uma versão específica:
kubectl rollout undo deploy/loja-api --to-revision=2`,
        },
        {
          type: 'code', lang: 'bash', caption: 'estratégias de update',
          code: `spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1      # quantos podem estar em baixo durante o update
      maxSurge: 1            # quantos a mais podem existir temporariamente
  # Alternativas:
  # type: Recreate         # mata tudo, depois cria — downtime, mas simples
  # Argo Rollouts / Flagger — canary, blue/green, traffic shifting`,
        },
        { type: 'h', text: 'Autoscaling horizontal (HPA)' },
        {
          type: 'code', lang: 'bash',
          code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: loja-api }
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: loja-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300    # evita flapping`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Scale baseado em filas, não em CPU',
          text: 'Para workers assíncronos, escalar por CPU é tarde demais. [**KEDA**](https://keda.sh/) acrescenta scalers por fila (RabbitMQ, SQS, Kafka), gatilhos HTTP, Prometheus, etc. É o padrão moderno — escala de 0 a 100 instantaneamente.',
        },
      ],
    },
    {
      id: 'ingress',
      title: 'Ingress — tráfego HTTP do exterior',
      blocks: [
        { type: 'p', text: '`Service` tipo `ClusterIP` só é visível dentro do cluster. Para expor APIs à internet com HTTPS e múltiplos hostnames, usa **Ingress** — camada 7, routing HTTP.' },
        {
          type: 'code', lang: 'bash', caption: 'ingress.yaml',
          code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: loja-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  ingressClassName: nginx            # ou traefik, contour, aws-alb...
  tls:
    - hosts: [api.loja.pt, www.loja.pt]
      secretName: loja-tls           # cert-manager preenche automaticamente
  rules:
    - host: api.loja.pt
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: loja-api
                port: { number: 80 }
    - host: www.loja.pt
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: loja-frontend, port: { number: 80 } }`,
        },
        {
          type: 'table',
          head: ['Ingress controller', 'Melhor para'],
          rows: [
            ['**NGINX Ingress**', 'Caso geral — maduro, documentação abundante'],
            ['**Traefik**', 'Developer experience, discovery automática, dashboard'],
            ['**Contour / Envoy**', 'Service mesh, gRPC first-class, alta performance'],
            ['**AWS ALB Controller**', 'Clusters EKS — usa ALB nativo da AWS'],
            ['**Gateway API** (sucessor)', 'Novo standard, substitui Ingress — vale ir aprendendo'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'cert-manager para TLS automático',
          text: '[**cert-manager**](https://cert-manager.io/) + Let\'s Encrypt = TLS grátis, renovado automaticamente. Instala uma vez, pões uma annotation, e os teus hostnames têm HTTPS para sempre. Essencial.',
        },
      ],
    },
    {
      id: 'helm',
      title: 'Helm — package manager',
      blocks: [
        { type: 'p', text: 'Aplicar 20 YAMLs em ordem em cada ambiente, substituir valores à mão, é um pesadelo. **Helm** empacota tudo num *chart* parametrizado.' },
        {
          type: 'code', lang: 'bash',
          code: `# Instalar
brew install helm

# Procurar e instalar charts públicos
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm install pg bitnami/postgresql \\
    --set auth.postgresPassword=secret \\
    --set primary.persistence.size=10Gi

# Ver releases
helm list
helm status pg

# Atualizar
helm upgrade pg bitnami/postgresql --set primary.persistence.size=20Gi

# Rollback
helm rollback pg 1

# Remover
helm uninstall pg`,
        },
        {
          type: 'code', lang: 'bash', caption: 'estrutura de um chart próprio',
          code: `loja-api/
├── Chart.yaml              # metadata
├── values.yaml             # defaults
├── values-prod.yaml        # override para prod
├── templates/
│   ├── deployment.yaml     # usa {{ .Values.replicas }}
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   └── _helpers.tpl        # macros reutilizáveis
└── charts/                 # dependências

# Instalar o próprio chart
helm install loja ./loja-api -f values-prod.yaml`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Alternativas modernas',
          text: '**Kustomize** (built-in no `kubectl`) — overlays declarativos sem templating; melhor para quem acha Helm template-hell. **Carvel ytt** — templating programático. **Jsonnet** — para produções com muita lógica. Helm continua a ser o mais comum, mas vale conhecer as alternativas.',
        },
      ],
    },
    {
      id: 'observabilidade',
      title: 'Observabilidade e debugging',
      blocks: [
        {
          type: 'table',
          head: ['Pilar', 'Ferramentas típicas'],
          rows: [
            ['**Logs**', 'Loki + Grafana, Elasticsearch + Kibana, Datadog, CloudWatch'],
            ['**Métricas**', 'Prometheus + Grafana (o standard aberto); Datadog, New Relic (geridos)'],
            ['**Tracing**', 'OpenTelemetry + Jaeger / Tempo / Honeycomb'],
            ['**Eventos**', '`kubectl get events`, Argo Events, PagerDuty para alertas'],
            ['**Dashboards de cluster**', 'Grafana + kube-prometheus-stack (tudo em 1 helm install)'],
            ['**Visualizar workloads**', 'k9s, Lens (IDE), Octant (desktop)'],
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'o toolkit de debug diário',
          code: `# Eventos recentes (ajuda a ver porque é que um Pod não arranca)
kubectl get events --sort-by='.lastTimestamp'

# Descrever recurso — mostra eventos e condições
kubectl describe pod loja-api-abc12

# Logs (incluindo do container anterior se crashou)
kubectl logs loja-api-abc12 --previous
kubectl logs -l app=loja-api --tail=100 --prefix     # agregado de várias réplicas

# Debug com sidecar temporário (precisa de ephemeral containers)
kubectl debug loja-api-abc12 -it --image=nicolaka/netshoot --target=api

# Métricas instantâneas
kubectl top pods
kubectl top nodes

# Dentro do pod, confirmar DNS e networking
kubectl exec -it loja-api-abc12 -- sh
nslookup postgres
curl http://postgres:5432                         # testa serviço interno`,
        },
        {
          type: 'callout', tone: 'key', title: 'Os três sintomas mais comuns',
          text: '**`ImagePullBackOff`** → tag errada, imagem privada sem credential. **`CrashLoopBackOff`** → container arranca e morre repetidamente (lê os logs). **`Pending`** → scheduler não arranjou nó (falta CPU/RAM, PVC não provisiona, taints). `kubectl describe pod` responde a 90% dos casos.',
        },
      ],
    },
    {
      id: 'producao',
      title: 'Práticas de produção',
      blocks: [
        {
          type: 'list', items: [
            '**Health probes correctas:** `readiness` para "estou pronto a receber tráfego?"; `liveness` para "estou vivo, não é preciso reiniciar"; `startup` para arranques lentos (Java, migrations).',
            '**Requests e limits em todos os containers** — sem isto, o scheduler trabalha às cegas e um Pod rebelde pode consumir o nó.',
            '**PodDisruptionBudget** — `minAvailable: 2` garante que o cluster nunca tira abaixo mais do que isso durante drains/updates.',
            '**NetworkPolicy** — firewall L3/L4 entre Pods. Por omissão tudo fala com tudo; define zero-trust explicitamente.',
            '**RBAC apertado** — cada ServiceAccount só com permissões mínimas. `cluster-admin` apenas em casos genuínos.',
            '**PodSecurity Standards** — `restricted` por omissão: não-root, read-only filesystem, sem capabilities extra, seccomp.',
            '**Imagens imutáveis com digest** — `image: ghcr.io/x/y@sha256:abc...` em vez de `:latest`. Reprodutível e auditável.',
            '**Observabilidade desde o dia 1** — Prometheus + logs centralizados + tracing antes do primeiro incidente.',
            '**GitOps**: ArgoCD ou Flux. O git é a verdade; o cluster reconcilia. Deploys via PR.',
            '**Policy as code**: Kyverno ou OPA/Gatekeeper validam manifestos no admission webhook.',
          ],
        },
        { type: 'h', text: 'GitOps em uma imagem mental' },
        {
          type: 'code', lang: 'text',
          code: `  dev        git repo         ArgoCD           cluster
   │          │ (manifestos)    │                   │
   │          │                 │                   │
   │  PR + merge                │                   │
   ├─────────▶│                 │                   │
   │          │                 │                   │
   │          │   polling ou webhook                │
   │          │◀────────────────┤                   │
   │          │                 │                   │
   │          │   diff vs cluster                   │
   │          │                 │─── apply ───────▶│
   │          │                 │                   │
   │          │                 │   reconcile ◀────┤
   │          │                 │                   │

Benefícios: histórico completo, PRs revistos, rollback = git revert,
            o estado desejado nunca sai do repo.`,
        },
        { type: 'h', text: 'Onde ir a seguir' },
        {
          type: 'list', ordered: true, items: [
            '**[Documentação oficial](https://kubernetes.io/docs/)** — referência densa mas essencial.',
            '**[Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)** — montar um cluster do zero. Doloroso e iluminador.',
            '**Livro:** *Kubernetes in Action* (Marko Lukša) — a referência em livro.',
            '**Livro:** *Kubernetes Patterns* (Bilgin Ibryam, Roland Huß) — padrões de desenho.',
            '**[CNCF Landscape](https://landscape.cncf.io/)** — o ecossistema todo num mapa.',
            '**[Helm Hub / Artifact Hub](https://artifacthub.io/)** — charts para quase tudo.',
            '**[ArgoCD](https://argo-cd.readthedocs.io/)** — GitOps declarativo.',
            '**[eBPF e Cilium](https://cilium.io/)** — networking e observabilidade de próxima geração.',
            '**Certificações:** CKA (Administrator), CKAD (Developer), CKS (Security) — exames práticos, muito respeitados no mercado.',
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'A regra do bom senso',
          text: 'Kubernetes é uma ferramenta, não um objetivo. Se um `docker compose` num VPS resolve o teu problema, usa-o. Se precisas de autoscaling, deploys contínuos, multi-equipa, SLAs, aí sim. Nada é pior que uma equipa de 3 pessoas a gerir um cluster de 20 nós para correr 2 serviços.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'k1',
      prompt: 'A unidade mais pequena que podes correr no Kubernetes é…',
      options: ['Container', 'Pod', 'Deployment', 'Node'],
      answer: 1,
      explain: 'O Pod agrupa um ou mais containers com rede e volumes partilhados. O container não é agendado directamente.',
    },
    {
      id: 'k2',
      prompt: 'Para quê um Deployment em vez de criar Pods directamente?',
      options: [
        'É só uma abstração sem valor prático',
        'Garante que N réplicas estão sempre a correr, suporta rolling updates e rollbacks',
        'Permite correr containers privilegiados',
        'Melhora a performance',
      ],
      answer: 1,
      explain: 'Deployment → ReplicaSet → Pods. Se um Pod morre, o ReplicaSet recria. Atualizações fazem rolling update sem downtime.',
    },
    {
      id: 'k3',
      prompt: 'O Kubernetes é fundamentalmente…',
      options: [
        'Imperativo — dás ordens "faz X"',
        'Declarativo — descreves o estado desejado e o cluster reconcilia',
        'Reativo — espera eventos externos',
        'Interactivo — responde a comandos SQL',
      ],
      answer: 1,
      explain: 'Entregas um YAML com o estado desejado. Controllers comparam continuamente com o real e corrigem. É esta propriedade que dá self-healing.',
    },
    {
      id: 'k4',
      prompt: 'Qual destes é um Service tipo…',
      options: [
        'ClusterIP: acessível apenas dentro do cluster',
        'NodePort: expõe numa porta alta de cada nó',
        'LoadBalancer: provisiona um load balancer externo',
        'Todas as anteriores',
      ],
      answer: 3,
      explain: 'ClusterIP (default), NodePort (dev/debug) e LoadBalancer (cloud) são os três tipos mais usados. Há também ExternalName (CNAME DNS).',
    },
    {
      id: 'k5',
      prompt: 'Secrets em Kubernetes são…',
      options: [
        'Encriptados por omissão',
        'Codificados em base64, sem encriptação a não ser que configures encryption at rest',
        'Guardados em ficheiros do nó',
        'Armazenados no Vault',
      ],
      answer: 1,
      explain: 'base64 ≠ encriptação. Precisas de encryption at rest no etcd, ou External Secrets Operator com Vault/AWS Secrets Manager/SOPS.',
    },
    {
      id: 'k6',
      prompt: 'Para expor uma API HTTP ao exterior com hostnames e TLS, usas…',
      options: ['Service ClusterIP', 'Service NodePort', 'Ingress', 'ConfigMap'],
      answer: 2,
      explain: 'Ingress (ou Gateway API) faz routing camada 7 com múltiplos hosts, TLS, rate limit, etc. Precisa de um Ingress Controller instalado.',
    },
    {
      id: 'k7',
      prompt: 'Qual é a diferença entre `livenessProbe` e `readinessProbe`?',
      options: [
        'São sinónimos',
        'Liveness reinicia o container se falha; readiness retira-o dos endpoints do Service sem o reiniciar',
        'Readiness é só em StatefulSets',
        'Liveness é mais rápida',
      ],
      answer: 1,
      explain: 'Readiness falha → tráfego é redireccionado para outras réplicas; o Pod não é reiniciado, pode recuperar. Liveness falha → kubelet mata e reinicia o container.',
    },
    {
      id: 'k8',
      prompt: 'Um Pod aparece em `Pending` indefinidamente. A causa mais comum é…',
      options: [
        'Imagem corrupta',
        'Recursos insuficientes no cluster (CPU/RAM pedidos não cabem em nenhum nó), ou PVC que não provisiona',
        'Erro de sintaxe no YAML',
        'DNS mal configurado',
      ],
      answer: 1,
      explain: '`kubectl describe pod` mostra "FailedScheduling" com o motivo exacto — insufficient cpu/memory, taints, PVC pendente, etc.',
    },
    {
      id: 'k9',
      prompt: 'Para que serve o Horizontal Pod Autoscaler (HPA)?',
      options: [
        'Mover Pods entre nós',
        'Aumentar/reduzir o número de réplicas com base em métricas (CPU, memória, custom)',
        'Autoscaling vertical (mais CPU/RAM por pod)',
        'Backup automático',
      ],
      answer: 1,
      explain: 'HPA escala réplicas; VPA escala recursos por pod; Cluster Autoscaler escala nós. Os três são complementares.',
    },
    {
      id: 'k10',
      prompt: 'Helm serve para…',
      options: [
        'Monitorizar o cluster',
        'Empacotar aplicações K8s em "charts" parametrizáveis e versionados',
        'Encriptar segredos',
        'Fazer backup',
      ],
      answer: 1,
      explain: 'Chart = template de manifestos + valores. Permite instalar, atualizar e desinstalar aplicações complexas com um comando.',
    },
    {
      id: 'k11',
      prompt: 'GitOps significa…',
      options: [
        'Deploy manual via git push',
        'O git é a fonte da verdade do estado desejado; uma ferramenta (ArgoCD, Flux) reconcilia o cluster com o repo',
        'Guardar containers no GitHub',
        'Usar git submodules',
      ],
      answer: 1,
      explain: 'ArgoCD/Flux observam um repo com os manifestos; qualquer alteração aprovada por PR é aplicada automaticamente. Rollback = git revert.',
    },
    {
      id: 'k12',
      prompt: 'Qual destas práticas é **má** em produção?',
      options: [
        'Definir `resources.requests` e `resources.limits`',
        'Usar `:latest` como tag das imagens',
        'Readiness e liveness probes configuradas',
        'Usar ServiceAccount dedicado por workload',
      ],
      answer: 1,
      explain: '`:latest` muda silenciosamente; deploys deixam de ser reproduzíveis. Usa tags imutáveis (versão exacta) ou digests (`@sha256:...`).',
    },
  ],
  exercises: [
    {
      id: 'e19-1',
      difficulty: 1,
      kind: 'open',
      title: 'Cluster local e primeiro Pod',
      statement: 'Cria um cluster local com `kind`, confirma que o nó está Ready, e corre um Pod `nginx` directamente (sem Deployment). Expõe-no via `port-forward` e testa com curl. No fim, apaga o Pod e confirma que **não** é recriado.',
      hint: '`kind create cluster`, `kubectl run`, `kubectl port-forward pod/...`, `kubectl delete pod`.',
      solution: '# 1. Criar o cluster\nkind create cluster --name curso\n\nkubectl cluster-info\nkubectl get nodes\n# NAME                  STATUS   ROLES           AGE   VERSION\n# curso-control-plane   Ready    control-plane   30s   v1.30.0\n\n# 2. Correr um Pod directo (sem Deployment)\nkubectl run web --image=nginx --restart=Never\n\nkubectl get pods\n# NAME   READY   STATUS    AGE\n# web    1/1     Running   15s\n\n# 3. port-forward e testar\nkubectl port-forward pod/web 8080:80 &\ncurl -I http://localhost:8080\n# HTTP/1.1 200 OK\n# Server: nginx/1.27\n\n# 4. Apagar\nkubectl delete pod web\n\nkubectl get pods\n# No resources found in default namespace.\n\n# → Confirma: um Pod sem controlador NÃO é recriado.\n# É por isto que em produção se usa SEMPRE Deployment/StatefulSet/DaemonSet.\n\n# Limpar\nkind delete cluster --name curso\n\nNota: `--restart=Never` cria um Pod avulso. Sem essa flag, `kubectl run` cria um Deployment (comportamento antigo foi depreciado).',
    },
    {
      id: 'e19-2',
      difficulty: 1,
      kind: 'open',
      title: 'Deployment + Service',
      statement: 'Escreve um manifesto YAML com: (a) Deployment `web` de 3 réplicas de `nginx:1.27`; (b) Service `ClusterIP` que expõe a porta 80; (c) limites de recursos sensatos. Aplica e verifica que o Service distribui pedidos pelos 3 Pods.',
      hint: 'Mesma label `app: web` no `selector` do Deployment, no `template.metadata.labels`, e no `selector` do Service.',
      solution: '# manifesto.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\n  labels: { app: web }\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: web }\n  template:\n    metadata:\n      labels: { app: web }\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.27\n          ports: [{ containerPort: 80 }]\n          resources:\n            requests:\n              cpu: "50m"\n              memory: "64Mi"\n            limits:\n              cpu: "200m"\n              memory: "128Mi"\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector: { app: web }\n  ports:\n    - port: 80\n      targetPort: 80\n  type: ClusterIP\n\n# Aplicar\nkubectl apply -f manifesto.yaml\n\nkubectl get all\n# deployment.apps/web   3/3     3            3\n# service/web           ClusterIP   10.96.x.y\n# 3 pods com nomes web-abc...\n\n# Confirmar distribuição — modifica o index.html de cada Pod para ver\nfor p in $(kubectl get pod -l app=web -o name); do\n    kubectl exec $p -- sh -c "echo <h1>$HOSTNAME</h1> > /usr/share/nginx/html/index.html"\ndone\n\n# Fazer 10 pedidos a partir de outro Pod\nkubectl run tmp --rm -it --image=curlimages/curl -- \\\\\n    sh -c "for i in $(seq 10); do curl -s web; done"\n# Vais ver mistura dos 3 hostnames — load balancing round-robin.\n\nNotas: (1) O Service usa `kube-proxy` + iptables/IPVS para fazer load balancing entre endpoints; (2) `web` resolve por DNS dentro do cluster (`web.default.svc.cluster.local`); (3) `requests` é o que o scheduler reserva; `limits` é o máximo real.',
    },
    {
      id: 'e19-3',
      difficulty: 2,
      kind: 'open',
      title: 'ConfigMap, Secret e variáveis de ambiente',
      statement: 'Para uma app que lê `LOG_LEVEL`, `CACHE_TTL` e `DATABASE_URL`: cria ConfigMap com as duas primeiras e Secret com a terceira. Injecta no Deployment, uma por variável explícita e a ConfigMap inteira via `envFrom`. Mostra como fazer rolling restart quando o ConfigMap muda.',
      hint: 'Cada variável do Secret via `valueFrom.secretKeyRef`; ConfigMap via `envFrom.configMapRef`. Para rolling restart manual: `kubectl rollout restart`.',
      solution: '# configmap.yaml\napiVersion: v1\nkind: ConfigMap\nmetadata: { name: app-config }\ndata:\n  LOG_LEVEL: info\n  CACHE_TTL: "300"\n\n---\n# secret.yaml (criar via `kubectl create secret generic`, não commitar)\napiVersion: v1\nkind: Secret\nmetadata: { name: app-secrets }\ntype: Opaque\nstringData:\n  database-url: "postgres://user:pass@pg:5432/loja"\n\n---\n# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: app }\nspec:\n  replicas: 2\n  selector: { matchLabels: { app: app } }\n  template:\n    metadata: { labels: { app: app } }\n    spec:\n      containers:\n        - name: app\n          image: ghcr.io/ana/app:0.1.0\n          envFrom:\n            - configMapRef: { name: app-config }     # LOG_LEVEL e CACHE_TTL\n          env:\n            - name: DATABASE_URL                      # explicito\n              valueFrom:\n                secretKeyRef:\n                  name: app-secrets\n                  key: database-url\n\n# Aplicar\nkubectl apply -f configmap.yaml -f secret.yaml -f deployment.yaml\n\n# Rolling restart após alterar ConfigMap:\nkubectl edit configmap app-config          # ou apply\nkubectl rollout restart deployment/app\n\nkubectl rollout status deployment/app      # segue o rollout\n\n# Alternativa automática — stakater/Reloader:\nkubectl apply -f https://raw.githubusercontent.com/stakater/Reloader/master/deployments/kubernetes/reloader.yaml\n\n# Adicionar annotation ao Deployment:\n# metadata:\n#   annotations:\n#     reloader.stakater.com/auto: "true"\n\n# → A partir daqui, qualquer alteração ao ConfigMap ou Secret linkados\n#   dispara rolling restart automaticamente.\n\nSegurança: NUNCA commits do `secret.yaml` com `stringData` em claro. Alternativas: (a) criar via CLI `kubectl create secret generic app-secrets --from-literal=database-url=...`; (b) SOPS/sealed-secrets para versionar encriptado; (c) External Secrets Operator a ler de Vault/AWS Secrets Manager.',
    },
    {
      id: 'e19-4',
      difficulty: 2,
      kind: 'open',
      title: 'Health probes e rolling update sem downtime',
      statement: 'Escreve o spec de um container Spring Boot com probes correctas: (a) `startupProbe` para esperar que arranque (pode demorar 30-60s); (b) `readinessProbe` em `/actuator/health/readiness`; (c) `livenessProbe` em `/actuator/health/liveness`. Explica porque é que cada uma existe e que acontece sem elas.',
      hint: 'startupProbe desbloqueia as outras duas. Readiness falha → fora do Service. Liveness falha → kubelet reinicia.',
      solution: 'containers:\n  - name: api\n    image: ghcr.io/ana/loja-api:0.3.1\n    ports: [{ containerPort: 8080 }]\n\n    # Esperar que a app arranque. Enquanto este falhar,\n    # readiness e liveness NÃO são avaliadas.\n    startupProbe:\n      httpGet: { path: /actuator/health/liveness, port: 8080 }\n      failureThreshold: 30       # 30 x 2s = até 60s\n      periodSeconds: 2\n\n    # "Posso receber tráfego agora?"\n    # Se falha, o Pod sai dos endpoints do Service — não recebe pedidos.\n    # NÃO é reiniciado; pode recuperar.\n    readinessProbe:\n      httpGet: { path: /actuator/health/readiness, port: 8080 }\n      periodSeconds: 5\n      timeoutSeconds: 2\n      failureThreshold: 3\n\n    # "Estou vivo? Preciso de ser reiniciado?"\n    # Se falha, o kubelet mata e reinicia o container.\n    livenessProbe:\n      httpGet: { path: /actuator/health/liveness, port: 8080 }\n      periodSeconds: 10\n      timeoutSeconds: 2\n      failureThreshold: 3\n      initialDelaySeconds: 0     # já esperámos no startupProbe\n\n**Porquê cada uma:**\n\n1. **startupProbe**: aplicações Java demoram a inicializar (JVM + Spring + connection pool + Flyway). Sem este probe, o `livenessProbe` começa logo e pode matar o container antes de ele estar pronto — loop infinito de restart. `failureThreshold × periodSeconds = tempo máximo de arranque permitido`.\n\n2. **readinessProbe**: a aplicação pode estar viva mas não pronta — a aquecer caches, a aguardar dependências, a receber um novo ficheiro de dados. Enquanto falhar, o Service retira o Pod dos seus endpoints. Essencial durante rolling updates — permite ao K8s saber quando começar a enviar tráfego para a nova versão.\n\n3. **livenessProbe**: a aplicação pode ficar em deadlock, com GC descontrolado, ou num estado irrecuperável. Reinício automático. Deve apontar para um endpoint **barato** (não valide BD aqui — se Postgres cair, não queres reiniciar todas as réplicas).\n\n**Sem probes:**\n- K8s assume que o container está pronto assim que arranca → tráfego entra antes da app estar pronta → erros 503.\n- Deadlocks ficam para sempre → degradação silenciosa, Pods a receber tráfego mas a não responder.\n- Rolling updates sobrepõem versão nova e antiga de forma caótica.\n\n**Erro clássico:** liveness que chama `/health` que por sua vez valida BD. Se BD cai, todas as réplicas falham liveness, são todas reiniciadas em simultâneo — tempestade. Separa: liveness = "o processo está vivo"; readiness = "estou pronto para servir" (pode incluir dependências).',
    },
    {
      id: 'e19-5',
      difficulty: 3,
      kind: 'open',
      title: 'Pipeline K8s completo: Ingress + TLS + HPA',
      statement: 'Esboça o conjunto de YAMLs mínimo para pôr em produção: Deployment de 3 réplicas, Service ClusterIP, Ingress com TLS via cert-manager para `api.loja.pt`, HPA entre 3 e 20 réplicas por CPU 70%. Assume que o cluster tem nginx-ingress e cert-manager já instalados.',
      hint: '4 recursos: Deployment, Service, Ingress, HPA. Annotations no Ingress para cert-manager.',
      solution: '# 1. Deployment\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: loja-api\n  labels: { app: loja-api }\nspec:\n  replicas: 3\n  revisionHistoryLimit: 10\n  strategy:\n    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }\n  selector: { matchLabels: { app: loja-api } }\n  template:\n    metadata:\n      labels: { app: loja-api }\n      annotations:\n        prometheus.io/scrape: "true"\n        prometheus.io/port: "8080"\n    spec:\n      terminationGracePeriodSeconds: 30\n      containers:\n        - name: api\n          image: ghcr.io/ana/loja-api:0.3.1\n          imagePullPolicy: IfNotPresent\n          ports: [{ name: http, containerPort: 8080 }]\n          env:\n            - name: SPRING_PROFILES_ACTIVE\n              value: prod\n          resources:\n            requests: { cpu: "200m", memory: "512Mi" }\n            limits:   { cpu: "1",    memory: "1Gi" }\n          startupProbe:\n            httpGet: { path: /actuator/health/liveness, port: http }\n            failureThreshold: 30\n            periodSeconds: 2\n          readinessProbe:\n            httpGet: { path: /actuator/health/readiness, port: http }\n            periodSeconds: 5\n          livenessProbe:\n            httpGet: { path: /actuator/health/liveness, port: http }\n            periodSeconds: 10\n          securityContext:\n            runAsNonRoot: true\n            runAsUser: 10001\n            readOnlyRootFilesystem: true\n            capabilities: { drop: ["ALL"] }\n            allowPrivilegeEscalation: false\n---\n# 2. Service\napiVersion: v1\nkind: Service\nmetadata:\n  name: loja-api\nspec:\n  selector: { app: loja-api }\n  ports:\n    - name: http\n      port: 80\n      targetPort: http\n  type: ClusterIP\n---\n# 3. Ingress com TLS automático\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: loja-api\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\n    nginx.ingress.kubernetes.io/rate-limit: "100"\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts: [api.loja.pt]\n      secretName: loja-api-tls         # cert-manager cria\n  rules:\n    - host: api.loja.pt\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: loja-api\n                port: { name: http }\n---\n# 4. Horizontal Pod Autoscaler\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata: { name: loja-api }\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: loja-api\n  minReplicas: 3\n  maxReplicas: 20\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target: { type: Utilization, averageUtilization: 70 }\n  behavior:\n    scaleUp:\n      stabilizationWindowSeconds: 0\n    scaleDown:\n      stabilizationWindowSeconds: 300    # evita flapping\n---\n# 5. PodDisruptionBudget (bónus — essencial em produção)\napiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata: { name: loja-api }\nspec:\n  minAvailable: 2\n  selector: { matchLabels: { app: loja-api } }\n\n**Decisões explicadas:**\n\n1. **`maxUnavailable: 0, maxSurge: 1`** — nunca desce abaixo das 3 réplicas durante update. Zero-downtime garantido.\n2. **`terminationGracePeriodSeconds: 30`** — dá tempo ao app a terminar pedidos em curso antes do SIGKILL.\n3. **`securityContext`** restritivo — não-root, read-only filesystem, zero capabilities, non-privileged. PodSecurity Standard `restricted`.\n4. **`startupProbe`** generoso (60s) permite arranque sem falsos positivos de liveness.\n5. **`cluster-issuer: letsencrypt-prod`** + `cert-manager.io` annotations → certificado automático, renovado a cada 60 dias.\n6. **`ssl-redirect`** força HTTPS; **`rate-limit: 100`** proteção básica.\n7. **HPA** com `stabilizationWindowSeconds: 300` no scaleDown impede ping-pong quando a carga oscila.\n8. **PDB `minAvailable: 2`** — durante drains (patch de nó, autoscaler cluster), K8s só pode tirar 1 Pod abaixo de cada vez. Protege de falhas durante manutenção.\n9. **Annotations Prometheus** no pod template — o scraper descobre automaticamente.\n\n**O que falta para "production-ready":**\n- NetworkPolicy — isolar tráfego Pod-to-Pod.\n- ServiceAccount dedicado com RBAC mínimo.\n- Observabilidade: métricas + logs + tracing.\n- PodAntiAffinity — espalhar réplicas por nós/zonas.\n- Alertas (PrometheusRule).\n- GitOps a aplicar isto via ArgoCD a partir de um repo.',
    },
    {
      id: 'e19-6',
      difficulty: 3,
      kind: 'open',
      title: 'Debugar um Pod que não arranca',
      statement: 'Diagnostica cada cenário, incluindo o comando a correr e a provável causa: (a) Pod em `ImagePullBackOff`; (b) Pod em `CrashLoopBackOff`; (c) Pod em `Pending` há 10 minutos; (d) Pod `Running` mas o Service devolve 503 em cada pedido; (e) Pod é reiniciado a cada 60s mesmo "a funcionar".',
      hint: '`kubectl describe` + `kubectl logs --previous` + `kubectl get events` são os três comandos-chave.',
      solution: '**(a) ImagePullBackOff**\n```\nkubectl describe pod <nome> | grep -A5 "Events:"\n```\nCausas típicas:\n- Imagem ou tag não existe (`:lateest` em vez de `:latest`).\n- Registry privado sem `imagePullSecrets`. Fix: `kubectl create secret docker-registry ghcr --docker-server=ghcr.io --docker-username=... --docker-password=...` e referenciar no Pod.\n- Rate limit do Docker Hub (6/h sem autenticar).\n- Problema de rede com o registry — `kubectl run tmp --image=alpine --rm -it -- wget -qO- https://ghcr.io/v2/`.\n- Arquitetura errada — imagem x86 num nó ARM: `kubectl get nodes -o wide` e `kubectl describe pod` (vês `exec format error` nos eventos).\n\n**(b) CrashLoopBackOff**\nO container arranca e morre repetidamente.\n```\nkubectl logs <pod>                    # logs atuais\nkubectl logs <pod> --previous         # logs do crash anterior (chave!)\nkubectl describe pod <pod>            # exit code e motivo\n```\nCausas comuns:\n- Erro de configuração — variável em falta, URL de BD errado.\n- Dependência em baixo — BD/Redis não arrancou primeiro (usa initContainer ou startupProbe para esperar).\n- Erro no comando/entrypoint do container.\n- Falta de permissões de ficheiro (readOnlyRootFilesystem sem volume para escritas).\n\n**(c) Pending há 10 min**\n```\nkubectl describe pod <pod> | grep -A10 "Events:"\n```\nVais ver "FailedScheduling: 0/3 nodes available: insufficient cpu/memory" ou similar.\n- **Resources demasiado altos** — baixa `requests` ou acrescenta nós.\n- **Node taints sem toleration** — `kubectl describe node | grep Taints`.\n- **PVC pendente** — `kubectl get pvc`; verifica se existe StorageClass default e se o provisioner está a correr.\n- **nodeSelector/affinity** não bate em nenhum nó.\n- **PodDisruptionBudget bloqueia** durante drains.\n\n**(d) Running mas Service devolve 503**\nO Pod está vivo mas fora dos endpoints do Service.\n```\nkubectl get endpoints <service>       # lista Pods que o Service vê\nkubectl describe svc <service>        # selector correcto?\nkubectl describe pod <pod>            # readiness a falhar?\n```\nCausas:\n- **readinessProbe a falhar** — porta errada, path errado, timeout pequeno.\n- **Selectors não batem** — Service procura `app: api` mas o Pod tem `app: web`.\n- **Porta errada** — `containerPort: 8080` mas app escuta em 8000.\n- Fix: `kubectl exec -it <pod> -- curl -v http://localhost:<porta>/health` dentro do Pod.\n\n**(e) Reiniciado a cada 60s**\n```\nkubectl describe pod <pod>            # procura "Liveness probe failed"\nkubectl get events --field-selector involvedObject.name=<pod>\n```\n- **livenessProbe a falhar intermitentemente** — talvez endpoint de health está a validar BD que às vezes lenta. Fix: separa liveness (barato) de readiness (pode validar dependências).\n- **OOMKilled** — `kubectl get pod -o yaml | grep -A5 lastState`. O container excedeu `memory limits`. Fix: aumenta limits ou corrige leak.\n- **`terminationGracePeriodSeconds` muito curto** — a app não termina a tempo após SIGTERM e é morta com SIGKILL.\n\n**Toolkit de debug diário:**\n```\nkubectl get events --sort-by=.lastTimestamp\nkubectl describe pod <pod>\nkubectl logs <pod> --previous --tail=100\nkubectl exec -it <pod> -- sh\nkubectl debug <pod> -it --image=nicolaka/netshoot --target=<container>\nstern <pod-pattern>                   # logs agregados de várias réplicas\n```\n\n`kubectl describe` resolve 80% dos casos; `logs --previous` resolve mais 15%; o resto exige exec + inspeção do interior.',
    },
  ],
};
