
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  link: string;
  tags: string[];
  isProfessional?: boolean;
  whyRecommended?: string;
  isPlus?: boolean;
  beforeAfter?: { before: string; after: string; caption?: string };
}

export interface Question {
  id: string;
  text: string;
  subtitle?: string;
  visualLayout?: "grid" | "list";
  options: {
    value: string;
    text: string;
    subtitle?: string;
    nextQuestionId?: string;
    images?: { morena?: string; loira?: string; single?: string };
  }[];
}

export const products: Product[] = [
  // --- LINHA CAMUFLAGE (TEMPORÁRIA) ---
  {
    id: "camuflage-light",
    name: "Tonalizante Camuflage Light",
    description: "Transforma seus fios brancos em mechas douradas naturais. Ideal para quem tem entre 40% e 70% de brancos e busca um efeito de luzes sem química agressiva.",
    image: "http://nouecosmeticos.com.br/cdn/shop/files/1_1000x1000_1ab9a7b0-baeb-4e91-973e-894e8d9d9835.jpg",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-camuflage-light-140ml",
    tags: ["Efeito Dourado", "Sem Amônia", "40-70% Brancos"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/light_A1_57079129.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/light_D1_f5ebcd1b.jpg",
      caption: "Fios brancos viram mechas douradas naturais"
    }
  },
  {
    id: "camuflage-medium",
    name: "Tonalizante Camuflage Medium",
    description: "Devolve o tom castanho natural aos seus fios. Perfeito para quem quer que os brancos fiquem castanhos, harmonizados com a cor natural.",
    image: "http://nouecosmeticos.com.br/cdn/shop/files/Foto_Medium_fd63514f-4b3d-4250-a6ef-e3a437c8069c.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-camuflage-medium-140ml",
    tags: ["Tom Castanho", "Sem Amônia", "Cobertura Natural"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/medium_A1_99a4ea8c.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/medium_D1_conv_ce1bdf97.jpg",
      caption: "Fios brancos voltam ao tom castanho natural"
    }
  },
  {
    id: "camuflage-perola",
    name: "Tonalizante Camuflage Pérola",
    description: "EXCLUSIVO para cabelos 100% naturais (sem química) com 90-100% de brancos. Remove o amarelado e cria um tom loiro claríssimo champanhe elegante e sofisticado.",
    image: "http://nouecosmeticos.com.br/cdn/shop/files/CAMU_PEARL_140ML.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-camuflage-perola-140ml",
    tags: ["Loiro Champanhe", "90-100% Brancos", "Cabelo Natural"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/perola_A1_6c2f6b15.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/perola_D1_205b048a.jpg",
      caption: "Amarelado some, fios ficam perolados e luminosos"
    }
  },
  {
    id: "kit-light-perola",
    name: "Kit Camuflage Light + Pérola",
    description: "Combinação perfeita para quem tem 70-100% de brancos e quer um tom dourado suave. Misture 50% de cada para um resultado sofisticado.",
    image: "http://nouecosmeticos.com.br/cdn/shop/files/PEROLIGHT.png",
    price: "R$ 294,00",
    link: "https://nouecosmeticos.com.br/products/kit-camuflagem-light-perola",
    tags: ["Efeito Dourado Suave", "70-100% Brancos", "Kit Completo"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/light_A1_57079129.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/perola_D1_205b048a.jpg",
      caption: "Muitos brancos viram mechas douradas sofisticadas"
    }
  },
  {
    id: "mascara-camuflage",
    name: "Máscara de Tratamento Camuflage 150g",
    description: "Tratamento intensivo para manutenção da cor e saúde dos fios. Ideal para usar após o tonalizante ou coloração.",
    image: "http://nouecosmeticos.com.br/cdn/shop/files/IMG-01-v2.png",
    price: "R$ 89,00",
    link: "https://nouecosmeticos.com.br/products/mascara-camuflage-150g",
    tags: ["Manutenção", "Hidratação", "Pós-Coloração"],
    isPlus: true
  },

  // --- LINHA GLOW (PERMANENTE) ---
  {
    id: "glow-regular",
    name: "Coloração Permanente Glow (Tons Claros)",
    description: "Coloração profissional para tons de base 5 a 10. Garante cobertura total dos brancos com reflexos luminosos. Requer oxidante e aplicação técnica.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/GLOW_ef37a83b-b377-45dd-bfb7-51cebc005ad9.png",
    price: "R$ 127,70",
    link: "https://nouecosmeticos.com.br/products/colorante-glow-60g",
    tags: ["Permanente", "Uso Profissional", "Cobertura 100%"],
    isProfessional: true
  },
  {
    id: "glow-intense",
    name: "Coloração Permanente Glow Intense (Tons Escuros)",
    description: "Coloração profissional para tons de base 1 a 4 (Preto a Castanho Médio). Cobertura profunda e duradoura para quem busca tons escuros e intensos.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/GLOW_INTENSE_608439a9-ac29-426e-b490-89026c3899fc.png",
    price: "R$ 127,70",
    link: "https://nouecosmeticos.com.br/products/coloracao-glow-intense-60g",
    tags: ["Tons Escuros", "Uso Profissional", "Alta Cobertura"],
    isProfessional: true
  },
  {
    id: "ox-10-vol",
    name: "Oxidante OX 10 Vol 900ml",
    description: "Oxidante necessário para ativar a coloração Glow. Mistura obrigatória para o processo de coloração permanente.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/Ox10.jpg",
    price: "R$ 89,00",
    link: "https://nouecosmeticos.com.br/products/agua-oxigenada-ox10",
    tags: ["Oxidante", "Uso Profissional", "Necessário para Glow"]
  },

  // --- LINHA COULEURS (TONALIZANTE PARA MECHAS) ---
  {
    id: "couleurs-perola",
    name: "Couleurs Pérola 9.21",
    description: "Tonalizante para mechas loiras. Remove amarelado e cria reflexos perolados platinados. Não cobre brancos.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/Perle_01.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-couleurs-perola-9-21-140ml",
    tags: ["Mechas", "Pérola", "Sem Amônia"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_perola_A1_0ddaaf45.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/cabelo_perola_1444dc57.png",
      caption: "Mechas ficam peroladas, platinadas e luminosas"
    }
  },
  {
    id: "couleurs-mel",
    name: "Couleurs Mel 8.3",
    description: "Tonalizante para mechas. Tom dourado quente e natural. Não cobre brancos.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/Mel_01.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-couleurs-mel-8-3-140ml",
    tags: ["Mechas", "Mel", "Dourado"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_mel_A1_4103e9f5.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_mel_D1_cc2a4a66.jpg",
      caption: "Mechas ganham tom dourado quente e vibrante"
    }
  },
  {
    id: "couleurs-avela",
    name: "Couleurs Avelã 7.7",
    description: "Tonalizante para mechas. Tom marrom avelã iluminado. Não cobre brancos.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/Avela_01.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-couleurs-avela-7-7-140ml",
    tags: ["Mechas", "Avelã", "Marrom"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_avela_A1_dfde0d6d.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_avela_D1_bcb54c55.jpg",
      caption: "Mechas ganham tom avelã iluminado e natural"
    }
  },
  {
    id: "couleurs-doce-leite",
    name: "Couleurs Doce de Leite 8.73",
    description: "Tonalizante para mechas. Tom caramelo vibrante e sofisticado. Não cobre brancos.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/Doce_de_Leite_01.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-couleurs-doce-de-leite-140ml",
    tags: ["Mechas", "Caramelo", "Vibrante"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_doce_leite_A1_849b2041.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_doce_leite_D1_98f65d2d.jpg",
      caption: "Mechas ganham tom caramelo vibrante e sofisticado"
    }
  },
  {
    id: "couleurs-manteiga",
    name: "Couleurs Manteiga 10.3",
    description: "Tonalizante para mechas muito claras. Tom dourado luminoso para loiras. Não cobre brancos.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/Manteiga_01.png",
    price: "R$ 147,00",
    link: "https://nouecosmeticos.com.br/products/tonalizante-couleurs-manteiga-10-34-140ml",
    tags: ["Mechas", "Loiro Claro", "Luminoso"],
    beforeAfter: {
      before: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_manteiga_A1_bb3094e3.jpg",
      after: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/cabelo_manteiga_b0677ee9.png",
      caption: "Mechas claras ficam com brilho luminoso e dourado"
    }
  },

  // --- LINHA REGENÉR (TRATAMENTO) ---
  {
    id: "kit-regener",
    name: "Kit Regenér Completo",
    description: "Tratamento completo para nutrição profunda e reconstrução dos fios. Inclui shampoo, máscara e finalizador.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/VERAO_NOUE_-_KIT_NUTRICAO_DE_VERAO_1a7eb00f-2cd3-4649-9bea-dc939538e676.png",
    price: "R$ 271,00",
    link: "https://nouecosmeticos.com.br/products/kit-regener",
    tags: ["Tratamento", "Reconstrução", "Nutrição"]
  },
  {
    id: "shampoo-regener",
    name: "Shampoo Regenér 300ml",
    description: "Shampoo nutritivo que limpa suavemente enquanto restaura os fios danificados.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/SHAMPOO_REGENER_d33fb775-20bd-4f47-974c-f8709c9dbee1.png",
    price: "R$ 89,00",
    link: "https://nouecosmeticos.com.br/products/shampoo-regener",
    tags: ["Shampoo", "Reparação", "Limpeza Suave"]
  },
  {
    id: "mascara-regener",
    name: "Máscara Regenér 250g",
    description: "Máscara de nutrição intensiva que recupera a força e o brilho dos fios.",
    image: "https://nouecosmeticos.com.br/cdn/shop/files/MASCARA_REGENER_250.png",
    price: "R$ 129,00",
    link: "https://nouecosmeticos.com.br/products/mascara-regener",
    tags: ["Máscara", "Reconstrução", "Hidratação Profunda"]
  }
];

// Perguntas do Quiz - VERSÃO 7 - COM PERGUNTAS DE TOM (SEM IMAGENS INCOERENTES)
export const questions: Question[] = [
  // PERGUNTA 1: Objetivo Principal
  {
    id: "goal",
    text: "Qual é o seu objetivo principal?",
    options: [
      { value: "cobrir", text: "Camuflar/cobrir fios brancos", nextQuestionId: "preference_type" },
      { value: "tonalizar", text: "Tonalizar mechas", nextQuestionId: "mechas_tone" },
      { value: "tratar", text: "Tratar e nutrir os fios", nextQuestionId: "result" }
    ]
  },

  // PERGUNTA 2: Preferência (Praticidade vs Durabilidade)
  {
    id: "preference_type",
    text: "O que você prefere?",
    options: [
      { value: "praticidade", text: "Praticidade (pronto para usar, dura 8-10 lavagens)", nextQuestionId: "white_percentage" },
      { value: "durabilidade", text: "Durabilidade (permanente, requer mistura)", nextQuestionId: "current_tone" }
    ]
  },

  // PERGUNTA 3a: Quantidade de Brancos (SE CAMUFLAGE) → vai direto para resultado
  {
    id: "white_percentage",
    text: "Qual a quantidade de fios brancos?",
    subtitle: "Selecione a opção que mais se parece com seu cabelo",
    visualLayout: "grid",
    options: [
      {
        value: "poucos",
        text: "Poucos",
        subtitle: "menos de 40%",
        nextQuestionId: "hair_tone",
        images: {
          morena: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_morena_30_02ecf0d6.jpg",
          loira: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_loira_30_f1de9d3b.jpg"
        }
      },
      {
        value: "medio",
        text: "Médio",
        subtitle: "40% a 70%",
           nextQuestionId: "hair_tone",
        images: {
          morena: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_morena_50_1dc4465d.jpg",
          loira: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_loira_50_4fc1b84e.jpg"
        }
      },
      {
        value: "muitos",
        text: "Muitos",
        subtitle: "70% a 90%",
        nextQuestionId: "hair_tone",
        images: {
          morena: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_morena_70_b1a212fa.jpg",
          loira: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_loira_70_4253d74c.jpg"
        }
      },
      {
        value: "total",
        text: "Quase todos",
        subtitle: "90% a 100%",
        nextQuestionId: "hair_tone",
        images: {
          morena: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_morena_90_cb6179db.jpg",
          loira: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/ref_loira_90_af542e67.jpg"
        }
      }
    ]
  },

  // PERGUNTA 4: Tom do Cabelo (texto apenas, sem imagens incoerentes)
  {
    id: "hair_tone",
    text: "Qual é o tom do seu cabelo?",
    options: [
      { value: "castanho", text: "Castanho", nextQuestionId: "desired_color" },
      { value: "loiro", text: "Loiro", nextQuestionId: "desired_color" }
    ]
  },

  // PERGUNTA 5: Cor Desejada (texto apenas, sem imagens incoerentes)
  {
    id: "desired_color",
    text: "Que resultado você quer?",
    options: [
      { value: "dourado", text: "Dourados (reflexos dourados/loiros)", nextQuestionId: "result" },
      { value: "castanho", text: "Castanhos (tom castanho natural)", nextQuestionId: "result" }
    ]
  },

  // PERGUNTA 3b: Tom Atual (SE GLOW)
  {
    id: "current_tone",
    text: "Qual o tom atual do seu cabelo?",
    options: [
      { value: "escuro", text: "Escuro (tons 1-4)", nextQuestionId: "result" },
      { value: "claro", text: "Claro (tons 5-10)", nextQuestionId: "result" }
    ]
  },

  // PERGUNTA 4: Tom das Mechas (SE TONALIZAR - COULEURS)
  {
    id: "mechas_tone",
    text: "Que tom você quer nas mechas?",
    subtitle: "Escolha o resultado que mais te atrai",
    visualLayout: "grid",
    options: [
      {
        value: "perola",
        text: "Pérola",
        subtitle: "platinado/frio",
        nextQuestionId: "result",
        images: {
          single: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/cabelo_perola_1444dc57.png"
        }
      },
      {
        value: "mel",
        text: "Mel",
        subtitle: "dourado quente",
        nextQuestionId: "result",
        images: {
          single: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_mel_D1_cc2a4a66.jpg"
        }
      },
      {
        value: "avela",
        text: "Avelã",
        subtitle: "marrom iluminado",
        nextQuestionId: "result",
        images: {
          single: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_avela_D1_bcb54c55.jpg"
        }
      },
      {
        value: "doce_leite",
        text: "Doce de Leite",
        subtitle: "caramelo vibrante",
        nextQuestionId: "result",
        images: {
          single: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/couleurs_doce_leite_D1_98f65d2d.jpg"
        }
      },
      {
        value: "manteiga",
        text: "Manteiga",
        subtitle: "loiro luminoso",
        nextQuestionId: "result",
        images: {
          single: "https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/cabelo_manteiga_b0677ee9.png"
        }
      }
    ]
  }
];

// Função de Recomendação - VERSÃO 7 - COM PERGUNTAS DE TOM
export function getRecommendation(answers: Record<string, string>): Product[] {
  const goal = answers["goal"];
  const preference_type = answers["preference_type"];
  const white_percentage = answers["white_percentage"];
  const hair_tone = answers["hair_tone"];
  const desired_color = answers["desired_color"];
  const current_tone = answers["current_tone"];
  const mechas_tone = answers["mechas_tone"];

  // FLUXO 1: TRATAMENTO
  if (goal === "tratar") {
    const kitRegener = products.find(p => p.id === "kit-regener")!;
    const shampooRegener = products.find(p => p.id === "shampoo-regener")!;
    const mascaraRegener = products.find(p => p.id === "mascara-regener")!;
    kitRegener.whyRecommended = "Para uma transformação completa, o Kit Regenér oferece todo o ciclo de tratamento necessário.";
    return [kitRegener, shampooRegener, mascaraRegener];
  }

  // FLUXO 2: TONALIZAR MECHAS (COULEURS)
  if (goal === "tonalizar") {
    if (mechas_tone === "perola") {
      const couleursPérola = products.find(p => p.id === "couleurs-perola")!;
      couleursPérola.whyRecommended = "Para o tom Pérola (9.21), seu cabelo precisa estar num fundo de clareamento 9 ou 10. Ele não cobre brancos, apenas matiza.";
      return [couleursPérola];
    }
    if (mechas_tone === "mel") {
      const couleursMel = products.find(p => p.id === "couleurs-mel")!;
      couleursMel.whyRecommended = "Para o tom Mel (8.3), o fundo ideal é 8. Dourado quente e natural. Não cobre brancos.";
      return [couleursMel];
    }
    if (mechas_tone === "avela") {
      const couleursAvelã = products.find(p => p.id === "couleurs-avela")!;
      couleursAvelã.whyRecommended = "Para o tom Avelã (7.7), o fundo ideal é 7. Perfeito para morenas iluminadas. Não cobre brancos.";
      return [couleursAvelã];
    }
    if (mechas_tone === "doce_leite") {
      const couleursDoceLeite = products.find(p => p.id === "couleurs-doce-leite")!;
      couleursDoceLeite.whyRecommended = "Para o tom Doce de Leite (8.73), o fundo ideal é 8. Um caramelo vibrante. Não cobre brancos.";
      return [couleursDoceLeite];
    }
    if (mechas_tone === "manteiga") {
      const couleursManteiga = products.find(p => p.id === "couleurs-manteiga")!;
      couleursManteiga.whyRecommended = "Para o tom Manteiga (10.3), ideal para fundos 9 e 10. Cria um dourado luminoso. Lembre-se: não cobre brancos.";
      return [couleursManteiga];
    }
  }

  // FLUXO 3: CAMUFLAR BRANCOS → GLOW (PERMANENTE)
  if (goal === "cobrir" && preference_type === "durabilidade") {
    const ox = products.find(p => p.id === "ox-10-vol")!;
    if (current_tone === "escuro") {
      const glowIntense = products.find(p => p.id === "glow-intense")!;
      glowIntense.whyRecommended = "Você escolheu durabilidade e cobertura total para tons escuros. A Glow Intense é a escolha profissional ideal.";
      return [glowIntense, ox];
    }
    if (current_tone === "claro") {
      const glowRegular = products.find(p => p.id === "glow-regular")!;
      glowRegular.whyRecommended = "Você escolheu durabilidade e cobertura total para tons claros. A Glow garante cor vibrante e uniforme.";
      return [glowRegular, ox];
    }
  }

  // FLUXO 4: CAMUFLAR BRANCOS → CAMUFLAGE (TEMPORÁRIA) - VERSÃO 7 - COM TOM E COR DESEJADA
  if (goal === "cobrir" && preference_type === "praticidade") {
    const mascara = products.find(p => p.id === "mascara-camuflage")!;

    // POUCOS BRANCOS (<40%) → SEMPRE MEDIUM (Light não funciona com menos de 40%)
    if (white_percentage === "poucos") {
      const camuflageMedium = products.find(p => p.id === "camuflage-medium")!;
      camuflageMedium.whyRecommended = "Com menos de 40% de brancos, o Camuflage Medium é a melhor escolha — harmoniza os fios brancos com o tom natural do cabelo. ⚠️ O Camuflage Light NÃO funciona com menos de 40% de brancos.";
      return [camuflageMedium, mascara];
    }

    // MÉDIO (40-70%) → LIGHT (dourado) ou MEDIUM (castanho)
    if (white_percentage === "medio") {
      if (desired_color === "castanho" || hair_tone === "castanho") {
        const camuflageMedium = products.find(p => p.id === "camuflage-medium")!;
        camuflageMedium.whyRecommended = "✨ Com 40-70% de brancos e preferência por tom castanho, o Camuflage Medium é perfeito! Cobre os brancos com um castanho natural e uniforme.";
        return [camuflageMedium, mascara];
      }
      const camuflageLight = products.find(p => p.id === "camuflage-light")!;
      camuflageLight.whyRecommended = "✨ Cenário perfeito! Com 40-70% de brancos e desejo de reflexos dourados, o Camuflage Light cria luzes douradas naturais incríveis. Os fios brancos ficarão dourados/loiros!";
      return [camuflageLight, mascara];
    }

    // MUITOS (70-90%) → KIT LIGHT + PÉROLA (dourado) ou MEDIUM (castanho)
    if (white_percentage === "muitos") {
      if (desired_color === "castanho" || hair_tone === "castanho") {
        const camuflageMedium = products.find(p => p.id === "camuflage-medium")!;
        camuflageMedium.whyRecommended = "✨ Com 70-90% de brancos e preferência por castanho, o Camuflage Medium garante uma cobertura uniforme e natural.";
        return [camuflageMedium, mascara];
      }
      const kitLightPerola = products.find(p => p.id === "kit-light-perola")!;
      kitLightPerola.whyRecommended = "✨ Com muitos brancos (70-90%) e desejo de reflexos dourados, recomendamos o Kit Light + Pérola (misture 50% de cada) para um resultado dourado sofisticado e equilibrado!";
      return [kitLightPerola, mascara];
    }

    // QUASE TODOS (90-100%) → PÉROLA (loiro/frio) ou MEDIUM (castanho)
    if (white_percentage === "total") {
      if (desired_color === "castanho" || hair_tone === "castanho") {
        const camuflageMedium = products.find(p => p.id === "camuflage-medium")!;
        camuflageMedium.whyRecommended = "✨ Com 90-100% de brancos e preferência por castanho, o Camuflage Medium transforma os fios brancos em castanho uniforme e brilhante.";
        return [camuflageMedium, mascara];
      }
      const camuflagePerola = products.find(p => p.id === "camuflage-perola")!;
      camuflagePerola.whyRecommended = "✨ Com 90-100% de brancos e preferência por loiro, o Camuflage Pérola é perfeito! Remove o amarelado e cria um tom loiro champanhe elegante e sofisticado.";
      return [camuflagePerola, mascara];
    }
  }

  // Fallback
  return [];
}
