import type { Module } from '../types';

export const m20: Module = {
  id: 'terraform',
  number: 20,
  title: 'Terraform — infraestrutura como código',
  subtitle: 'HCL, providers, state, módulos, backends remotos, CI/CD e as armadilhas que separam ambientes bem geridos de pesadelos',
  icon: '🏗️',
  minutes: 110,
  goals: [
    'Perceber porque é que IaC substituiu cliques na consola',
    'Escrever recursos em HCL com variáveis, outputs e locals',
    'Gerir state remoto com locking para trabalho em equipa',
    'Organizar código em módulos reutilizáveis e versionados',
    'Importar infraestrutura existente para Terraform',
    'Gerir ambientes (dev/staging/prod) com segurança',
    'Automatizar com CI/CD (Terraform Cloud, Atlantis, Actions)',
    'Evitar desastres: state perdido, drift, segredos expostos',
  ],
  sections: [
    {
      id: 'porque-iac',
      title: 'Porquê IaC (e porquê Terraform)',
      blocks: [
        { type: 'p', text: 'Durante anos, infraestrutura foi criada com cliques em consolas da AWS/GCP/Azure, ou com scripts bash imperativos. Resultado: "ambiente de staging não é igual ao de produção", mudanças sem rasto, reconstruir em caso de desastre é um pesadelo de dias. **Infrastructure as Code** (IaC) resolve: a infraestrutura é descrita em ficheiros, versionada em git, revista em PRs, aplicada automaticamente.' },
        {
          type: 'compare',
          left: {
            title: 'Com IaC',
            items: [
              'Reproduzível: `terraform apply` cria o mesmo ambiente sempre',
              'Versionado: git mostra quem mudou o quê e porquê',
              'Revisto: PR com `terraform plan` mostra o impacto antes',
              'Portável: mesmos conceitos em AWS, GCP, Azure, Kubernetes, Cloudflare',
              'Rollback = git revert + apply',
            ],
          },
          right: {
            title: 'Sem IaC (click-ops)',
            items: [
              'Nenhum histórico de porque é que X foi criado',
              '"Ambientes" divergem silenciosamente',
              'Recuperação de desastre = dias de trabalho detetive',
              'Conhecimento tribal ("só o João sabe o que isto faz")',
              'Mudança em produção depende de quem tem acesso à consola',
            ],
          },
        },
        {
          type: 'table',
          head: ['Ferramenta', 'Modelo', 'Multi-cloud', 'Notas'],
          rows: [
            ['**Terraform**', 'Declarativo HCL, state separado', 'Sim', 'O mais usado. Fork aberto: OpenTofu.'],
            ['**OpenTofu**', 'Fork de Terraform 1.5 (open source)', 'Sim', 'Compatível com HCL do Terraform. Alternativa 100% aberta.'],
            ['**Pulumi**', 'Código em Python/TS/Go/C#', 'Sim', 'Lógica rica, testes mais naturais'],
            ['**AWS CloudFormation / CDK**', 'Declarativo YAML / código', 'Não (só AWS)', 'Nativo AWS'],
            ['**Ansible**', 'Imperativo com idempotência', 'Sim', 'Melhor para configuração (apt install), não para provisioning'],
            ['**Crossplane**', 'Recursos K8s para provisionar cloud', 'Sim', 'Se já vives em K8s + GitOps'],
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'Terraform 1.x ou OpenTofu?',
          text: 'Em agosto de 2023 a HashiCorp mudou a licença para BSL (Business Source License), restritiva. A comunidade respondeu com **OpenTofu** — fork, 100% compatível, open source, mantido pela Linux Foundation. Hoje (2026) os dois coexistem; para novos projetos, **OpenTofu** é a escolha neutra. Sintaxe idêntica — tudo o que leres aqui aplica aos dois.',
        },
      ],
    },
    {
      id: 'instalar',
      title: 'Instalar e primeiro recurso',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'Instalar', text: '**Terraform:** `brew install terraform` (macOS) ou descarregar de [terraform.io](https://www.terraform.io/downloads). **OpenTofu:** `brew install opentofu`. **Confirma:** `terraform -v` / `tofu -v`.' },
            { title: 'Escolher um provider', text: 'Começa com algo barato de ver: AWS (precisa conta + `aws configure`), DigitalOcean (API token em 30 segundos), ou Cloudflare (DNS grátis). Para exemplo local: `kreuzwerker/docker` — cria containers sem nuvem.' },
            { title: 'Criar `main.tf`', text: 'Um ficheiro com `terraform` block, `provider` e um `resource`. Mesmo diretório → mesmo workspace.' },
            { title: 'Workflow básico', text: '`terraform init` → `terraform plan` → `terraform apply` → `terraform destroy`. Está tudo neste loop.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'main.tf — exemplo com Docker (sem cloud, corre local)',
          code: `terraform {
  required_version = ">= 1.6"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "nginx" {
  name         = "nginx:1.27"
  keep_locally = false
}

resource "docker_container" "web" {
  name  = "web-tf"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = 8080
  }
}

output "url" {
  value = "http://localhost:8080"
}`,
        },
        {
          type: 'code', lang: 'bash', caption: 'o ciclo completo',
          code: `terraform init
# Terraform initialized — descarrega providers e módulos.

terraform fmt         # formatação canónica (como gofmt)
terraform validate    # valida sintaxe + tipos

terraform plan
# Terraform will perform the following actions:
#   + create docker_image.nginx
#   + create docker_container.web
# Plan: 2 to add, 0 to change, 0 to destroy.

terraform apply
# → confirmas com "yes" e o Terraform aplica.

terraform show                          # mostra o state actual
terraform output url                    # lê um output
curl $(terraform output -raw url)

terraform destroy                       # desfaz tudo`,
        },
        {
          type: 'callout', tone: 'tip', title: 'A regra de ouro: plan antes de apply',
          text: 'Nunca faças `apply` sem olhar para o `plan`. Procura `destroy` escondido no diff — pode significar "recriar" (perder dados). Em CI, regra: "plan automático em cada PR, apply só após merge e aprovação".',
        },
      ],
    },
    {
      id: 'hcl',
      title: 'HCL — a linguagem',
      blocks: [
        { type: 'p', text: 'HCL (*HashiCorp Configuration Language*) é declarativa: descreves **o quê**, o Terraform descobre **o como**. É JSON-friendly mas com expressões e tipos.' },
        {
          type: 'terms', items: [
            { term: 'Resource', def: '"Faz existir isto": uma VM, uma tabela, um bucket. `resource "<tipo>" "<nome_local>" { ... }`.' },
            { term: 'Data source', def: '"Lê isto sem criar": buscar o AMI mais recente, uma VPC existente, um secret no Vault.' },
            { term: 'Variable', def: 'Input parametrizável: região, tamanho da instância, nome do ambiente.' },
            { term: 'Output', def: 'Valor que o módulo expõe para outros consumidores (ou para humanos).' },
            { term: 'Local', def: 'Expressão calculada uma vez, reutilizável em todo o módulo. Evita repetição.' },
            { term: 'Module', def: 'Grupo de recursos reutilizável — como uma função que cria infraestrutura.' },
            { term: 'Provider', def: 'Plugin que fala com uma API (AWS, GCP, Cloudflare, GitHub, Datadog, Postgres, Vault...).' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'os blocos essenciais',
          code: `# Variáveis — inputs
variable "regiao" {
  description = "Região da AWS"
  type        = string
  default     = "eu-west-1"
  validation {
    condition     = can(regex("^eu-", var.regiao))
    error_message = "Só regiões europeias são permitidas."
  }
}

variable "ambientes" {
  type    = list(string)
  default = ["dev", "staging", "prod"]
}

# Locals — valores calculados
locals {
  tags_comuns = {
    Managed    = "terraform"
    Repository = "github.com/ana/infra"
    Ambiente   = var.ambiente
  }
  prefixo = "loja-\${var.ambiente}"
}

# Data source — leitura
data "aws_ami" "ubuntu_mais_recente" {
  most_recent = true
  owners      = ["099720109477"]            # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Resource — criação
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu_mais_recente.id
  instance_type = "t3.micro"

  tags = merge(local.tags_comuns, {
    Name = "\${local.prefixo}-web"
  })

  lifecycle {
    create_before_destroy = true
    prevent_destroy       = false
    ignore_changes        = [tags["LastSeen"]]
  }
}

# Output — expor valores
output "ip_publico" {
  description = "IP público da instância"
  value       = aws_instance.web.public_ip
}`,
        },
        { type: 'h', text: 'Expressões úteis' },
        {
          type: 'code', lang: 'bash',
          code: `# Interpolação de strings
name = "\${var.ambiente}-api"

# Condicional ternário
instance_type = var.ambiente == "prod" ? "t3.large" : "t3.micro"

# For — construir listas e mapas
tags = { for a in var.ambientes : a => "\${a}-config" }

# Count (dinâmico, mas rígido quanto a reordenações)
resource "aws_instance" "worker" {
  count         = var.ambiente == "prod" ? 3 : 1
  instance_type = "t3.small"
}

# for_each (preferido quando há chaves claras — resiste a renames)
resource "aws_s3_bucket" "logs" {
  for_each = toset(["api", "web", "mobile"])
  bucket   = "logs-\${each.key}"
}

# Dynamic blocks
resource "aws_security_group" "web" {
  dynamic "ingress" {
    for_each = [80, 443]
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
}`,
        },
        {
          type: 'callout', tone: 'tip', title: '`for_each` > `count` quase sempre',
          text: '`count` indexa por número (`[0]`, `[1]`, `[2]`). Se removes o elemento 1, todos os seguintes deslizam — o Terraform vê "destruir e recriar" vários recursos. `for_each` indexa por string — mudar um item não afeta os outros. Prefere `for_each` sempre que tiveres chaves estáveis.',
        },
      ],
    },
    {
      id: 'state',
      title: 'State — o ficheiro mais importante',
      blocks: [
        { type: 'p', text: 'O **state** (`terraform.tfstate`) é um ficheiro JSON que mapeia os recursos no teu código aos recursos reais na cloud. Sem ele, o Terraform não sabe o que já existe. **Perder o state = perder o controlo da infraestrutura.**' },
        {
          type: 'code', lang: 'text',
          code: `                                   ┌─────────────────┐
                                   │   Cloud (AWS)    │
                                   │                 │
            ┌─────────────────┐    │  EC2 i-abc123    │
            │   main.tf       │    │  S3  loja-logs   │
            │ (desejado)      │◀──▶│  RDS db-prod     │
            │                 │    │                 │
            └────────┬────────┘    └─────────────────┘
                     │                        ▲
                     │                        │
                     │                        │
                     ▼                        │
            ┌─────────────────┐              │
            │ terraform.tfstate│◀────────────┘
            │ (mapeamento)    │     refresh / apply
            │                 │
            └─────────────────┘

main.tf diz "quero EC2 X" — o state sabe "EC2 X é i-abc123".`,
        },
        { type: 'h', text: 'Backends remotos — não guardes state local em equipa' },
        {
          type: 'code', lang: 'bash', caption: 'backend.tf — state em S3 com locking via DynamoDB',
          code: `terraform {
  backend "s3" {
    bucket         = "loja-terraform-state"
    key            = "prod/network/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

# Pré-requisitos (bootstrap, uma vez):
# - Bucket S3 com versioning ligado, encrypt-at-rest
# - Tabela DynamoDB "terraform-locks" com LockID (string) como primary key
# - Políticas IAM a limitar quem lê/escreve`,
        },
        {
          type: 'table',
          head: ['Backend', 'Locking', 'Melhor para'],
          rows: [
            ['**S3 + DynamoDB**', 'Sim (DynamoDB)', 'AWS, popular, barato'],
            ['**GCS**', 'Sim (nativo)', 'Google Cloud'],
            ['**Azure Blob**', 'Sim (nativo)', 'Azure'],
            ['**Terraform Cloud / HCP**', 'Sim (gerido)', 'Equipas que querem UI, política, custo analysis'],
            ['**Consul**', 'Sim', 'On-prem com HashiCorp stack'],
            ['**Git backend** (Terragrunt + git)', 'Não — não usar', 'Nunca para produção'],
            ['**Local**', 'Não — ficheiro no laptop', 'Só para brincar'],
          ],
        },
        {
          type: 'callout', tone: 'trap', title: 'Secrets no state',
          text: 'O state contém **tudo** que o Terraform leu — incluindo passwords de BDs, chaves privadas, tokens. **Trata o state como um segredo**: bucket privado, encrypt-at-rest, versioning (para recuperar de corrupção), e acesso restrito via IAM. Nunca commits do state local (`.gitignore` sempre inclui `*.tfstate*`).',
        },
        {
          type: 'code', lang: 'bash', caption: 'comandos de state',
          code: `terraform state list                      # lista recursos geridos
terraform state show aws_instance.web      # mostra atributos
terraform state mv aws_instance.old \\
                   aws_instance.new        # renomeia sem recriar
terraform state rm aws_instance.x          # remove do state (não apaga no cloud)
terraform import aws_instance.web i-abc123 # adopta recurso existente
terraform refresh                          # atualiza o state face ao real`,
        },
      ],
    },
    {
      id: 'modules',
      title: 'Módulos — reutilização e organização',
      blocks: [
        { type: 'p', text: 'Um **módulo** é um grupo de recursos empacotado como uma "função". Recebe inputs (variáveis), cria recursos, devolve outputs. Qualquer diretório com `.tf` **é** um módulo; distinguimos "root module" (onde correr) de "child modules" (importados).' },
        {
          type: 'code', lang: 'bash', caption: 'estrutura típica',
          code: `infra/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── rds/
│   └── eks/
└── envs/
    ├── dev/
    │   ├── main.tf           # usa modules/vpc, modules/rds, modules/eks
    │   ├── backend.tf
    │   └── terraform.tfvars
    ├── staging/
    └── prod/`,
        },
        {
          type: 'code', lang: 'bash', caption: 'modules/vpc/main.tf',
          code: `variable "ambiente" { type = string }
variable "cidr"     { type = string }
variable "zonas"    { type = list(string) }

resource "aws_vpc" "main" {
  cidr_block           = var.cidr
  enable_dns_hostnames = true

  tags = { Name = "\${var.ambiente}-vpc" }
}

resource "aws_subnet" "private" {
  for_each = toset(var.zonas)

  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.cidr, 4, index(var.zonas, each.key))
  availability_zone = each.key

  tags = { Name = "\${var.ambiente}-private-\${each.key}" }
}

output "vpc_id"     { value = aws_vpc.main.id }
output "subnet_ids" { value = [for s in aws_subnet.private : s.id] }`,
        },
        {
          type: 'code', lang: 'bash', caption: 'envs/prod/main.tf — usar o módulo',
          code: `module "vpc" {
  source = "../../modules/vpc"
  # Ou de GitHub:  source = "github.com/ana/infra-modules//vpc?ref=v1.2.0"
  # Ou do registry: source = "terraform-aws-modules/vpc/aws"
  #                 version = "5.1.0"

  ambiente = "prod"
  cidr     = "10.0.0.0/16"
  zonas    = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
}

module "rds" {
  source = "../../modules/rds"

  ambiente  = "prod"
  vpc_id    = module.vpc.vpc_id
  subnets   = module.vpc.subnet_ids
  instancia = "db.r6g.large"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Registry público',
          text: 'Antes de escrever um módulo próprio, procura no [registry.terraform.io](https://registry.terraform.io/). Para AWS, os módulos [terraform-aws-modules/*](https://github.com/terraform-aws-modules) cobrem VPC, EKS, RDS, ALB — maduros, revistos por milhares de pessoas, versionados.',
        },
      ],
    },
    {
      id: 'ambientes',
      title: 'Ambientes: workspaces vs. pastas',
      blocks: [
        {
          type: 'table',
          head: ['Abordagem', 'Como funciona', 'Prós', 'Contras'],
          rows: [
            ['**Pasta por ambiente**', '`envs/dev`, `envs/prod` com backends separados', 'Isolamento total; diffs explícitos por ambiente', 'Duplicação se não usas módulos'],
            ['**Workspaces**', '`terraform workspace new dev` — mesmo code, states separados', 'Zero duplicação', 'Fácil aplicar em prod pensando que é dev — perigo'],
            ['**Terragrunt**', 'Wrapper que gera HCL dinamicamente', 'DRY sem riscos de workspaces', 'Mais uma ferramenta; curva de aprendizagem'],
          ],
          caption: 'A maioria das equipas sérias opta por **pasta por ambiente + módulos partilhados** (com ou sem Terragrunt).',
        },
        {
          type: 'code', lang: 'bash', caption: 'envs/dev/backend.tf',
          code: `terraform {
  backend "s3" {
    bucket         = "loja-terraform-state"
    key            = "dev/terraform.tfstate"     # chave única por ambiente
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}`,
        },
        {
          type: 'code', lang: 'bash', caption: 'envs/dev/terraform.tfvars',
          code: `ambiente         = "dev"
cidr_vpc         = "10.1.0.0/16"
instancia_db     = "db.t3.micro"
replicas_api     = 2`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Nunca partilhes state entre ambientes',
          text: 'Um state para dev, outro para prod. Se prod partilhasse state com dev, um `terraform destroy` em dev podia apagar recursos de produção. Isolamento com backends diferentes é a única resposta segura.',
        },
      ],
    },
    {
      id: 'drift-import',
      title: 'Drift, imports e recuperar do caos',
      blocks: [
        { type: 'p', text: '**Drift** acontece quando alguém altera a infraestrutura à margem do Terraform (cliques na consola, scripts). O state fica desalinhado com a realidade.' },
        {
          type: 'code', lang: 'bash',
          code: `# Detetar drift
terraform plan -refresh-only
# Note: Objects have changed outside of Terraform
# ... (lista alterações feitas na consola)

# Opções:
# 1) Reverter a alteração manual e re-aplicar
# 2) Aceitar a alteração: terraform apply -refresh-only (atualiza state)
# 3) Codificar a alteração no .tf e aplicar normalmente

# Policy: PROIBIR alterações manuais em produção.
# Service Control Policies (AWS) podem revogar permissões IAM de alterar
# recursos geridos pelo Terraform.`,
        },
        { type: 'h', text: 'Import — adotar o que já existe' },
        {
          type: 'code', lang: 'bash',
          code: `# Cenário: tens uma BD RDS criada à mão há 2 anos, e agora queres
# geri-la via Terraform.

# 1. Escreve o .tf com um placeholder:
resource "aws_db_instance" "legacy" {
  # Vais preencher depois do import
}

# 2. Import — associa o recurso real ao bloco no .tf
terraform import aws_db_instance.legacy loja-db-prod

# 3. terraform plan mostra o diff entre o .tf (vazio) e a realidade.
#    Copia os atributos reais para o .tf até o plan não mostrar diff.

# 4. Em Terraform 1.5+, podes usar import blocks declarativos:
import {
  to = aws_db_instance.legacy
  id = "loja-db-prod"
}

# Importar vários de uma vez (Terraform 1.5+):
# terraform plan -generate-config-out=generated.tf`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Importar massivamente?',
          text: 'Para bases com centenas de recursos, considera ferramentas: [**terraformer**](https://github.com/GoogleCloudPlatform/terraformer) gera `.tf` + state a partir da cloud existente. Útil como ponto de partida — mas revê o resultado, raramente é idiomático.',
        },
      ],
    },
    {
      id: 'ci-cd',
      title: 'Terraform em CI/CD',
      blocks: [
        {
          type: 'code', lang: 'bash', caption: '.github/workflows/terraform.yml',
          code: `name: Terraform

on:
  pull_request:
    paths: ["infra/**"]
  push:
    branches: [main]
    paths: ["infra/**"]

permissions:
  id-token: write          # para OIDC com AWS
  contents: read
  pull-requests: write     # para comentar no PR

jobs:
  plan:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: infra/envs/\${{ github.base_ref == 'main' && 'prod' || 'dev' }}
    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456:role/github-terraform
          aws-region: eu-west-1

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.9.0

      - run: terraform fmt -check -recursive
      - run: terraform init
      - run: terraform validate
      - run: terraform plan -out=plan.bin -no-color
      - run: terraform show -no-color plan.bin > plan.txt

      - uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const plan = require('fs').readFileSync('infra/envs/dev/plan.txt', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: '\\\`\\\`\\\`\\n' + plan.slice(0, 60000) + '\\n\\\`\\\`\\\`'
            });

  apply:
    needs: plan
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production         # exige aprovação manual na UI
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456:role/github-terraform
          aws-region: eu-west-1
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform apply -auto-approve`,
        },
        {
          type: 'table',
          head: ['Ferramenta', 'Para quê'],
          rows: [
            ['**Terraform Cloud / HCP Terraform**', 'UI gerida, policy checks, custo analysis, aprovações'],
            ['**Atlantis**', 'Auto-plan em PRs, apply via `atlantis apply` em comentário — self-hosted'],
            ['**Spacelift**', 'Alternativa comercial a Terraform Cloud; suporta Terragrunt/Pulumi/Ansible'],
            ['**env0**', 'Similar, com foco em custos e governance'],
            ['**OpenTofu + GitHub Actions**', 'DIY — mais barato, mais trabalho'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'OIDC > access keys',
          text: 'Nunca armazenes credenciais da AWS/GCP em secrets do GitHub. **OIDC** permite ao GitHub Actions assumir um IAM Role temporário — sem secrets permanentes. Mesma coisa com GitLab, CircleCI. Toda a cloud grande suporta.',
        },
      ],
    },
    {
      id: 'praticas',
      title: 'Boas práticas e armadilhas',
      blocks: [
        {
          type: 'compare',
          left: {
            title: 'Faz',
            items: [
              '`terraform fmt` + `validate` em pré-commit',
              '`.tf` em git, `.tfstate` **nunca**',
              'Backend remoto com locking desde o primeiro dia',
              'Módulos versionados com tags semver',
              'Pin de versão de providers (`version = "~> 5.1"`)',
              'Secrets fora do código (SOPS, Vault, AWS Secrets Manager)',
              'Tags consistentes (`merge(local.tags, ...)`)',
              'PR com output do `plan` visível',
              'Políticas (OPA/Sentinel) a bloquear recursos inseguros',
            ],
          },
          right: {
            title: 'Evita',
            items: [
              '`apply` sem ler o `plan`',
              '`count` quando devias usar `for_each`',
              'Alterações manuais na consola',
              'Partilhar state entre ambientes',
              'Secrets em `.tf` ou `.tfvars` versionados',
              'Workspaces para separar dev/prod em equipas pequenas',
              '`terraform destroy` sem backup do state recente',
              'Módulos sem `versions.tf` e sem README',
              'Usar `latest` do provider (break silencioso)',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'A regra da reversibilidade',
          text: 'Antes de `apply` em produção: **sabes como reverter?** State backup? Backup da BD afetada? Testaste em staging? Tens aprovação? IaC não te protege de pressa — amplifica-a.',
        },
        { type: 'h', text: 'Onde ir a seguir' },
        {
          type: 'list', ordered: true, items: [
            '**[Terraform Docs](https://developer.hashicorp.com/terraform/docs)** — referência oficial.',
            '**[OpenTofu Docs](https://opentofu.org/docs/)** — gémeo aberto.',
            '**[Terraform Registry](https://registry.terraform.io/)** — módulos públicos.',
            '**Livro:** *Terraform: Up and Running* (Yevgeniy Brikman) — a referência, atualizada regularmente.',
            '**[gruntwork.io](https://gruntwork.io/)** — módulos open-source maduros, blog excelente.',
            '**[Terragrunt](https://terragrunt.gruntwork.io/)** — wrapper para DRY em multi-ambiente.',
            '**[Infracost](https://www.infracost.io/)** — mostra custo no `plan` (quanto vai custar o que vais criar).',
            '**[Checkov](https://www.checkov.io/)** / **tfsec** — scan de segurança em `.tf`.',
            '**[OPA / Sentinel](https://www.openpolicyagent.org/)** — policy as code para IaC.',
            '**Certificação:** [HashiCorp Certified: Terraform Associate](https://www.hashicorp.com/certification/terraform-associate).',
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 't1',
      prompt: 'O principal valor de Infrastructure as Code é…',
      options: [
        'Ser mais rápido que cliques',
        'Tornar a infraestrutura reproduzível, versionada em git, e revista em PRs',
        'Dispensar DevOps',
        'Eliminar custos de cloud',
      ],
      answer: 1,
      explain: 'Reprodutibilidade, histórico e revisão por pares são os benefícios estruturais. A rapidez é consequência, não a causa.',
    },
    {
      id: 't2',
      prompt: 'HCL do Terraform é…',
      options: ['Imperativa', 'Declarativa', 'Orientada a objetos', 'Funcional pura'],
      answer: 1,
      explain: 'Descreves o estado desejado; o Terraform calcula as operações necessárias. Mesmo princípio do Kubernetes.',
    },
    {
      id: 't3',
      prompt: 'O ficheiro `terraform.tfstate`…',
      options: [
        'Deve ser committed no git para a equipa ver',
        'Mapeia os recursos no código aos recursos reais na cloud; tratado como segredo e guardado em backend remoto com locking',
        'Contém só metadados públicos',
        'É opcional',
      ],
      answer: 1,
      explain: 'O state tem segredos (passwords lidos de providers, etc.) e é o único ponto de verdade sobre o que o Terraform já criou. Nunca local, nunca em git.',
    },
    {
      id: 't4',
      prompt: 'Qual destes é idealmente usado em vez de `count`?',
      options: [
        'Sempre `count`',
        '`for_each` — resiliente a reordenações de elementos',
        '`dynamic` block',
        '`depends_on`',
      ],
      answer: 1,
      explain: '`count` indexa por posição; remover um item desloca os outros, causando destroy/recreate desnecessários. `for_each` indexa por chave estável.',
    },
    {
      id: 't5',
      prompt: 'Um módulo em Terraform é…',
      options: [
        'Um ficheiro `.tf` qualquer',
        'Um grupo reutilizável de recursos com inputs (variáveis), lógica e outputs',
        'Um provider',
        'Uma função HCL',
      ],
      answer: 1,
      explain: 'Módulos são a unidade de reutilização. Módulos públicos no registry.terraform.io cobrem a maioria dos casos (VPC, EKS, RDS, ...).',
    },
    {
      id: 't6',
      prompt: 'Para prevenir corrupção quando duas pessoas aplicam ao mesmo tempo…',
      options: [
        'Nada — Terraform resolve sozinho',
        'Backend remoto com locking (ex.: S3 + DynamoDB, ou Terraform Cloud)',
        'Um ficheiro `.lock` no git',
        'Chat interno a combinar horários',
      ],
      answer: 1,
      explain: 'O lock é essencial. S3+DynamoDB, GCS, Azure Blob e Terraform Cloud implementam-no nativamente.',
    },
    {
      id: 't7',
      prompt: 'Drift em Terraform é…',
      options: [
        'Um erro de HCL',
        'Divergência entre o state do Terraform e o estado real da cloud (ex.: alguém mudou algo na consola)',
        'Nome de um provider',
        'Uma fase do apply',
      ],
      answer: 1,
      explain: '`terraform plan -refresh-only` deteta drift. Soluções: reverter manualmente, codificar a mudança no `.tf`, ou aceitar com `apply -refresh-only`.',
    },
    {
      id: 't8',
      prompt: 'Para adotar um recurso existente (criado manualmente) no Terraform usas…',
      options: [
        '`terraform apply` — detecta automaticamente',
        '`terraform import` ou um bloco `import {}` (Terraform 1.5+)',
        '`terraform refresh`',
        '`terraform plan -adopt`',
      ],
      answer: 1,
      explain: 'Import associa o recurso real a um bloco no `.tf`. A partir daí é gerido pelo Terraform.',
    },
    {
      id: 't9',
      prompt: 'Para separar ambientes (dev/staging/prod) com segurança…',
      options: [
        'Workspaces são ideais',
        'Pastas separadas (`envs/dev`, `envs/prod`) com backends diferentes — mais seguro que workspaces',
        'Branches diferentes no git',
        'Providers diferentes',
      ],
      answer: 1,
      explain: 'Pasta por ambiente evita o risco de aplicar em prod pensando ser dev. Workspaces partilham código mas têm o mesmo backend — perigoso.',
    },
    {
      id: 't10',
      prompt: 'Qual destas é **má** prática?',
      options: [
        'Pin de versão do provider (`version = "~> 5.1"`)',
        'Commit do `terraform.tfstate` para a equipa',
        'Secrets em Vault ou AWS Secrets Manager',
        'Módulos versionados com tags semver',
      ],
      answer: 1,
      explain: 'State contém segredos e é o ponto único de verdade. Backend remoto com encryption é o caminho.',
    },
    {
      id: 't11',
      prompt: 'OpenTofu é…',
      options: [
        'Um editor de HCL',
        'Fork open-source do Terraform, com sintaxe 100% compatível, mantido pela Linux Foundation',
        'Terraform para Kubernetes',
        'Terraform v2',
      ],
      answer: 1,
      explain: 'Nasceu depois da HashiCorp mudar para a BSL em 2023. Hoje coexistem; OpenTofu é a escolha neutra para novos projetos.',
    },
    {
      id: 't12',
      prompt: 'A regra de ouro antes de `terraform apply` em produção é…',
      options: [
        'Fazer commit',
        'Ler o `plan` com atenção, especialmente procurando `destroy`',
        'Correr `terraform init`',
        'Avisar a equipa no chat',
      ],
      answer: 1,
      explain: '`destroy` esconde-se em diffs — às vezes é rename (`move` no state resolve), outras é recreate (perde dados). O plan é a tua última defesa antes de alterares infra real.',
    },
  ],
  exercises: [
    {
      id: 'e20-1',
      difficulty: 1,
      kind: 'open',
      title: 'Primeiro recurso',
      statement: 'Usando o provider `kreuzwerker/docker` (não precisa de cloud), escreve um `main.tf` que crie um container nginx que escute em `localhost:8080`. Usa `terraform init`, `plan`, `apply`, testa com curl, depois `destroy`.',
      hint: 'Dois recursos: `docker_image` e `docker_container`. Variável `required_providers`.',
      solution: '# main.tf\nterraform {\n  required_version = ">= 1.6"\n  required_providers {\n    docker = {\n      source  = "kreuzwerker/docker"\n      version = "~> 3.0"\n    }\n  }\n}\n\nprovider "docker" {}\n\nresource "docker_image" "nginx" {\n  name         = "nginx:1.27"\n  keep_locally = false\n}\n\nresource "docker_container" "web" {\n  name  = "web-tf"\n  image = docker_image.nginx.image_id\n\n  ports {\n    internal = 80\n    external = 8080\n  }\n}\n\noutput "url" {\n  value = "http://localhost:8080"\n}\n\n# Workflow:\nterraform init\n# Initializing provider plugins... kreuzwerker/docker v3.x\n\nterraform plan\n# Plan: 2 to add, 0 to change, 0 to destroy.\n\nterraform apply\n# yes\n# Apply complete! Resources: 2 added.\n# Outputs:\n# url = "http://localhost:8080"\n\ncurl -I $(terraform output -raw url)\n# HTTP/1.1 200 OK\n# Server: nginx/1.27\n\nterraform destroy\n# yes\n# Destroy complete! Resources: 2 destroyed.\n\nNotas: (1) o container é referenciado pelo `image_id` do recurso `docker_image` — Terraform resolve a ordem automaticamente; (2) `output` é uma forma de expor valores para humanos e para outros módulos; (3) todo o estado fica no `terraform.tfstate` — por isso é que depois `destroy` sabe o que remover.',
    },
    {
      id: 'e20-2',
      difficulty: 1,
      kind: 'open',
      title: 'Variáveis e outputs',
      statement: 'Reescreve o exercício anterior parametrizando: `nome_container` (default "web-tf"), `porta_externa` (default 8080), `versao_nginx` (default "1.27"). Acrescenta validação que a porta esteja entre 1024 e 65535. Mostra também como passar valores via CLI e via `.tfvars`.',
      hint: '`variable { ... validation { ... } }`. Para passar: `terraform apply -var "porta_externa=9000"` ou `-var-file=prod.tfvars`.',
      solution: '# variables.tf\nvariable "nome_container" {\n  description = "Nome do container Docker"\n  type        = string\n  default     = "web-tf"\n}\n\nvariable "porta_externa" {\n  description = "Porta no host"\n  type        = number\n  default     = 8080\n  validation {\n    condition     = var.porta_externa >= 1024 && var.porta_externa <= 65535\n    error_message = "Porta tem de estar entre 1024 e 65535."\n  }\n}\n\nvariable "versao_nginx" {\n  type    = string\n  default = "1.27"\n  validation {\n    condition     = can(regex("^[0-9]+\\\\.[0-9]+(\\\\.[0-9]+)?$", var.versao_nginx))\n    error_message = "Versão tem de ser no formato X.Y ou X.Y.Z."\n  }\n}\n\n# main.tf\nresource "docker_image" "nginx" {\n  name = "nginx:\\${var.versao_nginx}"\n}\n\nresource "docker_container" "web" {\n  name  = var.nome_container\n  image = docker_image.nginx.image_id\n\n  ports {\n    internal = 80\n    external = var.porta_externa\n  }\n}\n\n# outputs.tf\noutput "url" { value = "http://localhost:\\${var.porta_externa}" }\noutput "container_id" { value = docker_container.web.id }\n\n# Formas de passar valores (em ordem de precedência, baixo→alto):\n# 1. default no variable block\n# 2. ficheiro terraform.tfvars (auto-carregado)\n# 3. ficheiros *.auto.tfvars (auto-carregados)\n# 4. variável de ambiente TF_VAR_nome_container=...\n# 5. -var-file=prod.tfvars\n# 6. -var "nome_container=xyz"\n\n# Exemplos:\nterraform apply\nterraform apply -var "porta_externa=9000"\nterraform apply -var-file=prod.tfvars\n\nTF_VAR_versao_nginx=1.28 terraform apply\n\n# prod.tfvars\nnome_container = "web-prod"\nporta_externa  = 80\nversao_nginx   = "1.27"\n\nNotas: (1) `validation` corre no `plan` — falhas param antes de `apply`; (2) `can()` captura erros de função (regex) devolvendo `false`; (3) nunca metas segredos em `.tfvars` versionados — usa variáveis de ambiente, SOPS ou um secret manager.',
    },
    {
      id: 'e20-3',
      difficulty: 2,
      kind: 'open',
      title: 'Primeiro módulo',
      statement: 'Encapsula o container nginx num módulo `modules/nginx-container` com inputs (nome, versão, porta) e output (`url`). Depois usa o módulo duas vezes — para servir dois nginx em portas diferentes — a partir de um root module.',
      hint: '`module "nome" { source = "./modules/..." }`. Chamar duas vezes com nomes diferentes.',
      solution: '# Estrutura\n#\n# .\n# ├── main.tf                        # root module\n# └── modules/\n#     └── nginx-container/\n#         ├── main.tf\n#         ├── variables.tf\n#         └── outputs.tf\n\n# ==== modules/nginx-container/variables.tf ====\nvariable "nome"    { type = string }\nvariable "versao"  { type = string  default = "1.27" }\nvariable "porta"   { type = number }\n\n# ==== modules/nginx-container/main.tf ====\nterraform {\n  required_providers {\n    docker = { source = "kreuzwerker/docker"  version = "~> 3.0" }\n  }\n}\n\nresource "docker_image" "img" {\n  name = "nginx:\\${var.versao}"\n}\n\nresource "docker_container" "c" {\n  name  = var.nome\n  image = docker_image.img.image_id\n\n  ports {\n    internal = 80\n    external = var.porta\n  }\n}\n\n# ==== modules/nginx-container/outputs.tf ====\noutput "url"          { value = "http://localhost:\\${var.porta}" }\noutput "container_id" { value = docker_container.c.id }\n\n# ==== main.tf (root module) ====\nterraform {\n  required_providers {\n    docker = { source = "kreuzwerker/docker"  version = "~> 3.0" }\n  }\n}\n\nprovider "docker" {}\n\nmodule "site_a" {\n  source = "./modules/nginx-container"\n  nome   = "site-a"\n  porta  = 8080\n}\n\nmodule "site_b" {\n  source = "./modules/nginx-container"\n  nome   = "site-b"\n  porta  = 8081\n  versao = "1.26"        # override do default\n}\n\noutput "site_a_url" { value = module.site_a.url }\noutput "site_b_url" { value = module.site_b.url }\n\n# Correr:\nterraform init    # descarrega o provider; lê o módulo local\nterraform apply   # cria 4 recursos: 2 images + 2 containers\n\nterraform output\n# site_a_url = "http://localhost:8080"\n# site_b_url = "http://localhost:8081"\n\n**Pontos a notar:**\n\n1. **Cada chamada a `module` cria o seu próprio sub-tree de recursos** — `module.site_a.docker_container.c` e `module.site_b.docker_container.c` são recursos diferentes.\n2. **Outputs do módulo** são a única forma de expor valores — variáveis internas não estão acessíveis.\n3. **`required_providers` dentro do módulo** declara que o módulo precisa, mas a configuração (`provider "docker" {}`) fica no root module. Boa prática: módulos não configuram providers, só os requerem.\n4. **Para versionar módulos**: cria um repo git, tag com `v1.0.0`, usa `source = "git::https://github.com/ana/modules.git//nginx-container?ref=v1.0.0"`. Equipas grandes publicam no [Terraform Registry](https://registry.terraform.io/) privado.\n5. **Testar módulos**: [Terratest](https://terratest.gruntwork.io/) (Go) é o padrão. Em alternativa, `terraform test` nativo (1.6+) com ficheiros `.tftest.hcl`.',
    },
    {
      id: 'e20-4',
      difficulty: 2,
      kind: 'open',
      title: 'State remoto no AWS S3',
      statement: 'Para um projeto novo que vai gerir infraestrutura AWS, descreve o setup inicial do backend remoto: bucket S3 + DynamoDB para locking, com encryption. Explica porquê cada peça, e o paradoxo do bootstrap (não podes usar Terraform para criar o bucket onde o Terraform guarda o state).',
      hint: 'Bucket versionado + encriptado + DynamoDB com `LockID` como key. Bootstrap via consola ou um Terraform separado com state local.',
      solution: '**Objetivo:** state partilhado, seguro e com locking.\n\n**Passo 1 — Bootstrap (ovo-galinha)**\n\nPara criar o próprio bucket que vai guardar o state... o state precisa de viver em algum lado. Três opções:\n\n- **A) Criar manualmente na consola** (mais comum). Rápido, documentar depois.\n- **B) Terraform com state local**, apenas para bootstrap, depois `terraform state push` para o novo bucket.\n- **C) CloudFormation pequeno** só para isto.\n\nSeja qual for, o bootstrap é feito **uma vez por conta/região**.\n\n**Passo 2 — Recursos (via consola, Terraform local, ou CFN)**\n\n```hcl\nresource "aws_s3_bucket" "tf_state" {\n  bucket = "loja-terraform-state-${var.account_id}"\n\n  # Proteção contra apagar sem querer\n  lifecycle {\n    prevent_destroy = true\n  }\n}\n\nresource "aws_s3_bucket_versioning" "tf_state" {\n  bucket = aws_s3_bucket.tf_state.id\n  versioning_configuration { status = "Enabled" }\n}\n\nresource "aws_s3_bucket_server_side_encryption_configuration" "tf_state" {\n  bucket = aws_s3_bucket.tf_state.id\n  rule {\n    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }\n  }\n}\n\nresource "aws_s3_bucket_public_access_block" "tf_state" {\n  bucket                  = aws_s3_bucket.tf_state.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}\n\nresource "aws_dynamodb_table" "tf_locks" {\n  name         = "terraform-locks"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "LockID"\n\n  attribute {\n    name = "LockID"\n    type = "S"\n  }\n}\n```\n\n**Passo 3 — Cada projeto/ambiente usa este backend**\n\n```hcl\n# envs/prod/backend.tf\nterraform {\n  backend "s3" {\n    bucket         = "loja-terraform-state-123456"\n    key            = "prod/vpc/terraform.tfstate"\n    region         = "eu-west-1"\n    dynamodb_table = "terraform-locks"\n    encrypt        = true\n  }\n}\n```\n\n**Porquê cada peça:**\n\n- **Bucket versionado** → `terraform.tfstate` partido? Restaura a versão anterior. Recuperação de desastre com dois cliques.\n- **Encryption at rest (SSE-S3 ou SSE-KMS)** → state tem segredos. Encripta por omissão.\n- **Public access block** → bucket privado. Se expuseres o state publicamente, dás a chave da infraestrutura a quem passar por lá.\n- **`prevent_destroy = true`** → `terraform destroy` acidental no bootstrap não apaga o próprio state.\n- **DynamoDB com `LockID`** → cada `apply` escreve uma linha `LockID = "state_path"`; concurrent apply recebe erro. Resolve race conditions entre múltiplos operadores/CI.\n- **`PAY_PER_REQUEST`** → custo residual (≈0€ para workloads pequenos).\n- **Key diferente por ambiente** (`prod/...`, `dev/...`, `prod/network/...`, `prod/apps/...`) → isolamento + granularidade.\n\n**IAM:** cria role separado para o pipeline (`github-terraform`) com `s3:GetObject/PutObject` só no bucket, `dynamodb:GetItem/PutItem/DeleteItem` só na tabela, e as permissões dos recursos que vais provisionar. OIDC federado em vez de access keys.\n\n**Bónus:** replica o bucket para outra região (DR), e ativa Object Lock se queres imutabilidade. Para contas sérias, o bootstrap pode ter o seu próprio repo pequeno com state local — é o único que não precisa de state remoto.',
    },
    {
      id: 'e20-5',
      difficulty: 3,
      kind: 'open',
      title: 'Pipeline CI/CD seguro',
      statement: 'Desenha o pipeline Terraform para três ambientes (dev, staging, prod) em GitHub Actions. Deve: (a) plan automático em cada PR, com output comentado no PR; (b) apply automático em dev após merge em `main`; (c) apply em staging/prod exige aprovação manual; (d) usa OIDC em vez de secrets; (e) formata e valida em pré-commit também.',
      hint: '`environment:` + required reviewers no GitHub. Workflows separados por ambiente, ou um workflow com matrix. Pre-commit com hooks `terraform fmt`/`validate`/`tflint`.',
      solution: '**Estrutura do repo**\n\n```\ninfra/\n├── envs/\n│   ├── dev/      { main.tf, backend.tf, terraform.tfvars }\n│   ├── staging/  { ... }\n│   └── prod/     { ... }\n├── modules/\n└── .github/workflows/\n    ├── terraform-plan.yml      # PRs\n    ├── terraform-apply-dev.yml  # auto após merge\n    └── terraform-apply-prodlike.yml  # manual approval\n```\n\n**`.github/workflows/terraform-plan.yml`**\n\n```yaml\nname: Terraform Plan\n\non:\n  pull_request:\n    paths: ["infra/**"]\n\npermissions:\n  id-token: write\n  contents: read\n  pull-requests: write\n\njobs:\n  plan:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        env: [dev, staging, prod]\n    defaults:\n      run:\n        working-directory: infra/envs/${{ matrix.env }}\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::ACCOUNT:role/github-tf-plan-${{ matrix.env }}\n          aws-region: eu-west-1\n\n      - uses: hashicorp/setup-terraform@v3\n        with: { terraform_version: 1.9.0 }\n\n      - name: fmt\n        run: terraform fmt -check -recursive ../..\n\n      - run: terraform init\n      - run: terraform validate\n      - run: terraform plan -out=plan.bin -no-color -input=false\n      - run: terraform show -no-color plan.bin > plan.txt\n\n      - name: tflint\n        uses: terraform-linters/setup-tflint@v4\n        with: { tflint_version: latest }\n      - run: tflint --init && tflint\n\n      - name: Comentar o plan no PR\n        uses: actions/github-script@v7\n        with:\n          script: |\n            const fs = require("fs");\n            const plan = fs.readFileSync("infra/envs/${{ matrix.env }}/plan.txt", "utf8");\n            const body = `### Plan: \\`${{ matrix.env }}\\`\\n\\n<details>\\n\\n\\`\\`\\`\\n${plan.slice(0, 50000)}\\n\\`\\`\\`\\n</details>`;\n            await github.rest.issues.createComment({\n              owner: context.repo.owner,\n              repo: context.repo.repo,\n              issue_number: context.issue.number,\n              body\n            });\n```\n\n**`.github/workflows/terraform-apply-dev.yml`**\n\n```yaml\nname: Apply dev (auto)\n\non:\n  push:\n    branches: [main]\n    paths: ["infra/envs/dev/**", "infra/modules/**"]\n\npermissions:\n  id-token: write\n  contents: read\n\njobs:\n  apply:\n    runs-on: ubuntu-latest\n    defaults:\n      run:\n        working-directory: infra/envs/dev\n    steps:\n      - uses: actions/checkout@v4\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::ACCOUNT:role/github-tf-apply-dev\n          aws-region: eu-west-1\n      - uses: hashicorp/setup-terraform@v3\n      - run: terraform init\n      - run: terraform apply -auto-approve -input=false\n```\n\n**`.github/workflows/terraform-apply-prodlike.yml`**\n\n```yaml\nname: Apply (manual)\n\non:\n  workflow_dispatch:\n    inputs:\n      environment:\n        type: choice\n        required: true\n        options: [staging, prod]\n\npermissions:\n  id-token: write\n  contents: read\n\njobs:\n  apply:\n    runs-on: ubuntu-latest\n    environment: ${{ inputs.environment }}      # exige approvers configurados\n    defaults:\n      run:\n        working-directory: infra/envs/${{ inputs.environment }}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::ACCOUNT:role/github-tf-apply-${{ inputs.environment }}\n          aws-region: eu-west-1\n      - uses: hashicorp/setup-terraform@v3\n      - run: terraform init\n      - run: terraform plan -out=plan.bin -input=false\n      - run: terraform apply -input=false plan.bin\n```\n\n**`.pre-commit-config.yaml`** (local dev)\n\n```yaml\nrepos:\n  - repo: https://github.com/antonbabenko/pre-commit-terraform\n    rev: v1.88.0\n    hooks:\n      - id: terraform_fmt\n      - id: terraform_validate\n      - id: terraform_tflint\n      - id: terraform_docs\n```\n\n**Decisões explicadas:**\n\n1. **Matrix nos plans** — gera plan para os 3 ambientes em cada PR. Mostras o impacto em todos; ninguém se esquece de olhar.\n2. **OIDC em vez de access keys** — zero secrets permanentes em GitHub. Cada workflow assume um role temporário, scoped ao ambiente.\n3. **Roles separados para plan e apply** — `tf-plan-prod` tem apenas leitura (`*:Get*`, `*:List*`, `*:Describe*`); `tf-apply-prod` tem escrita. Minimiza blast radius.\n4. **Environments do GitHub com required reviewers** — o `environment: prod` exige aprovação manual de dois reviewers na UI antes do job correr. Não confies em "olha antes de merge"; força o passo.\n5. **Apply em dev automático**, staging/prod manual via `workflow_dispatch`. Dev é playground; prod é ritual.\n6. **tflint** — captura erros que o `validate` não vê (ex.: tipos de instância inexistentes, deprecated args).\n7. **Pre-commit** — formata e valida no laptop; evita CI falhar em coisas triviais.\n8. **Não `apply -auto-approve` em prod** — o workflow faz `plan` separado antes do `apply`, para teres um artefacto gravado.\n9. **State path por ambiente** (visto no exercício anterior) + **DynamoDB locking** — impossível two apply ao mesmo tempo.\n10. **Infracost** (opcional, muito recomendado): pluga no PR e mostra "estas mudanças vão custar +$120/mês".\n\n**O que falta num setup verdadeiramente maduro:**\n\n- Policy as code (OPA/Sentinel, Checkov) a bloquear recursos inseguros (buckets públicos, security groups abertos a 0.0.0.0/0).\n- Drift detection diária (cron job a correr `plan` e a avisar se deteta mudança).\n- Secrets a serem lidos do Vault / AWS Secrets Manager em runtime, nunca em `.tfvars`.\n- Breakglass docs: como fazer `apply` manual se o CI estiver em baixo durante um incidente.',
    },
    {
      id: 'e20-6',
      difficulty: 3,
      kind: 'open',
      title: 'Adotar infraestrutura existente',
      statement: 'Herdas uma AWS com dezenas de recursos criados manualmente ao longo dos anos. Descreve a estratégia para passar tudo para Terraform sem quebrar nada. Lista os passos, ferramentas e pontos onde é fácil estragar.',
      hint: 'Começa pequeno. Importa recurso a recurso. `plan` sem diff antes de considerar importado. Comunica com a equipa.',
      solution: '**Princípio:** adotar incrementalmente, nunca em bloco. Cada semana, um conjunto pequeno passa a estar sob gestão de Terraform.\n\n**Fase 0 — Preparação (1 semana)**\n\n1. **Inventariar.** Listar o que existe em cada região e conta: `aws resourcegroupstaggingapi get-resources` ou ferramentas como [steampipe](https://steampipe.io/).\n2. **Agrupar por domínio.** Networking (VPC, subnets, security groups) · dados (RDS, S3, DynamoDB) · compute (EC2, ECS, EKS) · DNS (Route 53).\n3. **Bootstrap do backend remoto** (exercício 4). Criar estrutura `envs/prod`.\n4. **Comunicar à equipa.** Regra: a partir de agora, qualquer novo recurso é via Terraform. Alterações a recursos geridos, idem.\n\n**Fase 1 — Começar pelo mais estável (2-4 semanas)**\n\nRecursos que **raramente mudam** e que são **fáceis de verificar**: VPC, subnets, security groups.\n\n```bash\n# 1. Escrever o .tf com as características reais\n# 2. Import blocks (Terraform 1.5+)\nimport {\n  to = aws_vpc.main\n  id = "vpc-abc123"\n}\n\nimport {\n  to = aws_subnet.private["eu-west-1a"]\n  id = "subnet-def456"\n}\n\n# 3. Gerar config automático\nterraform plan -generate-config-out=generated.tf\n\n# 4. terraform plan deve mostrar 0 changes\n# Se mostrar, ajusta o .tf até coincidir com a realidade.\n\n# 5. terraform apply (sem efeito real — apenas confirma o state)\n```\n\n**Para massificar o scan inicial:** [terraformer](https://github.com/GoogleCloudPlatform/terraformer) gera `.tf` + state para toda uma conta. Útil como ponto de partida — mas revê e refatora, nunca merges output cru.\n\n**Fase 2 — Domínio por domínio (meses)**\n\nOrdem sugerida (do mais estável para o mais volátil):\n\n1. **Networking** — raramente muda; pouca superfície de erro.\n2. **DNS** — alterações são óbvias (plan mostra claramente); impacto imediato se errado.\n3. **IAM** — complexo; muitas políticas inline. Começa por roles e policies simples.\n4. **S3** — relativamente isolado.\n5. **RDS / DynamoDB** — perigoso: mau import pode causar recreate e perda de dados. **Sempre snapshot antes.**\n6. **Compute (EC2, ASG, ECS, EKS)** — muita mudança frequente, muitas associações.\n7. **Serviços auxiliares** (SQS, SNS, CloudWatch alarmes).\n\n**Pontos onde é fácil estragar:**\n\n- **Atributos `(known after apply)` após import** — o Terraform não consegue inferir tudo. Compara detalhadamente com `terraform show` vs. consola.\n- **Recursos com defaults implícitos na AWS** — ex.: um SG sem `description` recebe "managed by X" na consola, e o Terraform quer "null". Diffs chatos. Usa `lifecycle.ignore_changes` com critério.\n- **IAM policies inline vs managed** — a mesma política pode estar escrita em duas formas. Escolhe uma e padroniza.\n- **RDS: `apply_immediately`, `allow_major_version_upgrade`** — defaults do Terraform podem causar reboot imediato. Marca `lifecycle.ignore_changes` nos campos sensíveis até teres confiança.\n- **S3 buckets com encryption/versioning/lifecycle** — cada propriedade é um recurso separado (`aws_s3_bucket_*`). Importa todos.\n- **Resources que o Terraform "destruiria" para "recriar"** — aparecem no plan como `-/+ destroy and then create replacement`. STOP. Investiga. Normalmente é um atributo que mudou significado entre versões do provider.\n- **Drift durante o processo** — enquanto estás a importar, alguém fez alteração manual. Combina janela de congelamento; usa Service Control Policies para proibir IAM actions de criar/alterar os tipos já geridos.\n- **State lock perdido** — alguém cancelou um `apply` com Ctrl-C. Resolve com `terraform force-unlock <lock-id>` depois de confirmar que ninguém está a correr nada.\n\n**Ferramentas úteis:**\n\n- [terraformer](https://github.com/GoogleCloudPlatform/terraformer) — gera `.tf` + state.\n- [former2](https://former2.com/) — UI web que inspeciona a conta AWS e sugere HCL.\n- [tfmigrate](https://github.com/minamijoyo/tfmigrate) — scripta operações de state (mv, rm, import) em batch.\n- [terraform-docs](https://terraform-docs.io/) — gera README do módulo.\n- [checkov](https://www.checkov.io/) + [tfsec](https://aquasecurity.github.io/tfsec/) — scan de segurança e compliance; corre nos recursos importados para acelerar o hardening.\n\n**Regra de ouro:** importa, `plan` dá 0 mudanças → só então consideras adotado. Qualquer diff significa que ainda não sabes o que realmente existe. **Nunca aceites um "destroy" no plan durante import** sem perceber exatamente porquê.\n\n**Final (3-6 meses típico):** 100% da infra em Terraform, SCPs ativas a proibir criação/alteração manual nas contas prod, team hábito de PR para qualquer mudança. Nunca mais volta ao click-ops.',
    },
  ],
};
