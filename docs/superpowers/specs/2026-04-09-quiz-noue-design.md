# Quiz Nouê Cosméticos — Design Spec
**Data:** 2026-04-09  
**Versão:** 1.1  
**Deploy target:** Lovable

---

## 1. Objetivo

Clonar o quiz de consultoria capilar da Nouê Cosméticos (projeto `noue_product_finder`) como uma aplicação frontend pura, compatível com Lovable, usando Supabase para captura de leads em substituição ao tRPC + MySQL original.

---

## 2. Fluxo de Telas

```
[home] → [lead-form] → [quiz] → [result + best-sellers]
```

1. **home** — Tela inicial com logo, hero copy e botão "Iniciar Consultoria"
2. **lead-form** — Formulário com campos Nome e WhatsApp. Ao submeter, salva o lead no Supabase e avança para o quiz.
3. **quiz** — Sequência de perguntas navegadas por `nextQuestionId`. Máximo de 5 perguntas dependendo do caminho.
4. **result** — Produtos recomendados + cupom QUIZ10 com timer de 15 minutos + prova social dinâmica
5. **best-sellers** — Seção abaixo do resultado com tabs "Mais Vendidos" / "Novidades"

**Navegação:** Não há botão de voltar durante o quiz. O usuário pode apenas reiniciar (botão "Refazer Consultoria" na tela de resultado).

**Timer:** O timer de 15 minutos reinicia a cada visita à tela de resultado. Sem persistência em localStorage.

---

## 3. Lógica do Quiz

### Perguntas (de `quiz-data.ts`)

| ID | Pergunta | Aparece quando |
|----|----------|----------------|
| `goal` | Qual é o seu objetivo principal? | Sempre (1ª pergunta) |
| `preference_type` | O que você prefere? | goal = cobrir |
| `white_percentage` | Quantidade de fios brancos? | preference_type = praticidade |
| `hair_tone` | Qual é o tom do seu cabelo? | após white_percentage |
| `desired_color` | Que resultado você quer? | após hair_tone |
| `current_tone` | Tom atual do cabelo? | preference_type = durabilidade |
| `mechas_tone` | Que tom quer nas mechas? | goal = tonalizar |

**Caminhos diretos ao resultado (sem perguntas adicionais):**
- `goal = tratar` → vai direto para `result` (sem perguntas intermediárias)
- `goal = tonalizar` → vai direto para `mechas_tone` → depois `result`
- `goal = cobrir` + `preference_type = durabilidade` → `current_tone` → `result`

### Resultados possíveis

- **Tratar** → Kit Regenér Completo + Shampoo Regenér + Máscara Regenér
- **Tonalizar mechas** → Couleurs (Pérola / Mel / Avelã / Doce de Leite / Manteiga) + Máscara Camuflage
- **Cobrir (Glow permanente):**
  - tons escuros → Coloração Glow Intense 60g + OX 10 Vol
  - tons claros → Coloração Glow 60g + OX 10 Vol
- **Cobrir (Camuflage temporária):**
  - Poucos brancos (<40%) → Camuflage Medium + Máscara
  - Médio (40-70%) + dourado → Camuflage Light + Máscara
  - Médio (40-70%) + castanho → Camuflage Medium + Máscara
  - Muitos (70-90%) + dourado → Kit Light+Pérola + Máscara
  - Muitos (70-90%) + castanho → Camuflage Medium + Máscara
  - Quase todos (90-100%) + loiro → Camuflage Pérola + Máscara
  - Quase todos (90-100%) + castanho → Camuflage Medium + Máscara

---

## 4. Arquitetura de Arquivos

```
src/
├── lib/
│   ├── quiz-data.ts          ← copiado do original sem alteração
│   └── supabase.ts           ← cliente Supabase usando variáveis de ambiente
├── pages/
│   └── Index.tsx             ← página principal com máquina de estados
├── components/
│   ├── ui/                   ← shadcn/ui (padrão Lovable)
│   └── BestSellersSection.tsx ← extraído de Home.tsx original
├── index.css                 ← tema Nouê (Montserrat + Lato, cores, radius=0)
└── main.tsx / App.tsx        ← padrão Lovable
```

**Removido do original:** pasta `server/`, tRPC, Drizzle ORM, MySQL, wouter (Lovable usa React Router), `useAuth`, páginas Admin/NPS/Live.

---

## 5. Supabase

### Variáveis de Ambiente

As credenciais NUNCA devem ser hardcodadas no código-fonte. Usar variáveis de ambiente do Lovable:

```
VITE_SUPABASE_URL=https://oxyafakvhjshhcyiacad.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

O arquivo `supabase.ts` deve ler essas variáveis:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**Nunca usar a `service_role` key no frontend.**

### Tabela `leads`

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  answers jsonb,
  recommended_products text  -- formato: string separada por vírgula, ex: "Camuflage Light, Máscara Camuflage"
);

alter table leads enable row level security;

-- Permite INSERT anônimo (para o quiz funcionar)
create policy "allow_anon_insert"
on leads for insert
to anon
with check (true);

-- Permite UPDATE anônimo (para atualizar answers e produtos ao final do quiz)
create policy "allow_anon_update"
on leads for update
to anon
using (true)
with check (true);
```

**Nota:** A policy de UPDATE é ampla (qualquer anon pode atualizar qualquer linha). Isso é aceitável dado o contexto público do quiz e o fato de não haver dados sensíveis além de nome e WhatsApp.

### Estratégia de salvamento (duas etapas)

1. **Ao submeter o formulário (lead-form):**
   ```ts
   const { data } = await supabase
     .from('leads')
     .insert({ name, phone })
     .select('id')
     .single()
   // guarda data.id em estado local como leadId
   ```

2. **Ao exibir o resultado:**
   ```ts
   await supabase
     .from('leads')
     .update({
       answers: answers,
       recommended_products: recommendations.map(p => p.name).join(', ')
     })
     .eq('id', leadId)
   ```

**Tratamento de erro:** Se o INSERT falhar (erro de rede, etc.), o `leadId` ficará `null`. Nesse caso, o usuário deve prosseguir normalmente para o quiz sem bloqueio — a captura do lead é best-effort. O UPDATE no final simplesmente não será executado se `leadId` for null.

---

## 6. Formulário de Lead (lead-form)

### Campos
- **Nome** — texto livre, obrigatório, mínimo 2 caracteres
- **WhatsApp** — obrigatório, máscara brasileira `(XX) XXXXX-XXXX`, validação de 11 dígitos (DDD + número)

### Máscara do WhatsApp
Aplicar máscara no `onChange`:
```
(11) 91234-5678  ← formato final esperado
```
Aceitar entrada com ou sem formatação, armazenar no Supabase como string com máscara aplicada.

---

## 7. Estado da Aplicação (Index.tsx)

```typescript
type Step = 'home' | 'lead-form' | 'quiz' | 'result'

const [step, setStep] = useState<Step>('home')
const [leadId, setLeadId] = useState<string | null>(null)
const [leadName, setLeadName] = useState('')
const [leadPhone, setLeadPhone] = useState('')
const [currentQuestionId, setCurrentQuestionId] = useState<string>('goal')
const [answers, setAnswers] = useState<Record<string, string>>({})
```

**Navegação por ID** (não por index):
```typescript
const currentQuestion = questions.find(q => q.id === currentQuestionId)!

const handleAnswer = (value: string, nextQuestionId?: string) => {
  setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  if (nextQuestionId === 'result') {
    setStep('result')
  } else if (nextQuestionId) {
    setCurrentQuestionId(nextQuestionId)
  } else {
    // Não deve acontecer se quiz-data.ts estiver correto.
    // Fallback seguro: avança para o resultado.
    console.warn('Answer with no nextQuestionId:', currentQuestion.id, value)
    setStep('result')
  }
}

// Nota: se answers for {} ao chegar no resultado (improvável), o UPDATE no Supabase
// salva answers = {} sem erros — comportamento aceitável.
```

---

## 8. Componentes Principais

### `BestSellersSection.tsx`

Produtos da aba **Mais Vendidos** (4 itens):
| Nome | Preço | Badge |
|------|-------|-------|
| Camuflage Medium | R$ 147,00 | 🏆 Mais Vendido |
| Camuflage Light | R$ 147,00 | 🏆 Mais Vendido |
| Coloração Glow 60g | R$ 127,70 | ⭐ Top Avaliado |
| Kit Camufla & Trata | R$ 460,00 | 💰 Melhor Custo-Benefício |

Produtos da aba **Novidades** (2 itens):
| Nome | Preço | Badge |
|------|-------|-------|
| Máscara Camuflage 150g | R$ 89,00 | 🔥 Lançamento |
| Perfume Regenér 50ml | R$ 109,00 | ✨ Novidade |

Todos com link externo para `nouecosmeticos.com.br`, avaliação em estrelas e número de reviews.

---

## 9. Gatilhos de Conversão

- **Cupom QUIZ10** com timer regressivo de 15 minutos (reinicia a cada visita ao resultado)
- **Prova social** — contador client-side com número aleatório entre 18-47, flutuando ±1-3 a cada 4-9 segundos (não é dado real, apenas UX)
- **Estoque limitado** — número aleatório entre 3-10 unidades, gerado uma vez no mount
- **Botão copiar cupom** com feedback visual via toast (sonner)

---

## 10. Visual / Tema

- **Fontes:** Montserrat (títulos) + Lato (corpo) — via Google Fonts no `index.html`
- **Cor primária:** verde neon da marca `oklch(0.65 0.25 145)` — valor proveniente do `index.css` original do projeto
- **Border radius:** 0 (design sharp/quadrado, `--radius: 0rem`)
- **Botões:** uppercase + tracking-widest + fundo preto
- **Tema claro** como padrão (sem toggle de dark mode no quiz público)

---

## 11. Dependências

| Pacote | Versão | Motivo |
|--------|--------|--------|
| `@supabase/supabase-js` | latest | Captura de leads |
| `framer-motion` | ^12.x | Animações entre telas |
| `lucide-react` | latest | Ícones |
| `sonner` | latest | Toast de confirmação do cupom |

`framer-motion` v12 — usar `import { motion, AnimatePresence } from 'framer-motion'` (sem mudanças no import path vs v11).

Todos os outros (`@radix-ui/*`, `tailwind-merge`, `clsx`) já vêm no template padrão do Lovable.

---

## 12. Fora do escopo

- Páginas Admin, NPS, Live — não serão migradas
- Dashboard de métricas — não será migrado
- Backend server (Express, tRPC, Drizzle) — substituído por Supabase
- Autenticação de usuários — não necessária para o quiz público
- Back navigation durante o quiz — não implementar
