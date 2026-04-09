import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Sparkles, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface BestSellerProduct {
  id: string
  name: string
  description: string
  image: string
  price: string
  originalPrice?: string
  installments: string
  link: string
  badge: string
  badgeColor: string
  rating: number
  reviews: number
  discount?: string
  category: 'bestsellers' | 'novidades'
}

const bestSellers: BestSellerProduct[] = [
  {
    id: 'bs-camuflage-medium',
    name: 'Camuflage Medium',
    description: 'O queridinho das castanhas. Camufla os brancos com tom natural e brilho intenso.',
    image: 'https://cdn.shopify.com/s/files/1/0579/3546/2464/files/Foto_Medium_fd63514f-4b3d-4250-a6ef-e3a437c8069c.png?v=1770991788',
    price: 'R$ 147,00',
    installments: '6x de R$ 24,50',
    link: 'https://nouecosmeticos.com.br/products/tonalizante-camuflage-medium-140ml',
    badge: '🏆 Mais Vendido',
    badgeColor: 'bg-black text-white',
    rating: 4.7,
    reviews: 312,
    category: 'bestsellers',
  },
  {
    id: 'bs-camuflage-light',
    name: 'Camuflage Light',
    description: 'Para cabelos castanho claro e loiro. Camufla os brancos com reflexos naturais.',
    image: 'https://cdn.shopify.com/s/files/1/0579/3546/2464/files/1_1000x1000_1ab9a7b0-baeb-4e91-973e-894e8d9d9835.jpg?v=1770991588',
    price: 'R$ 147,00',
    installments: '6x de R$ 24,50',
    link: 'https://nouecosmeticos.com.br/products/tonalizante-camuflage-light-140ml',
    badge: '🏆 Mais Vendido',
    badgeColor: 'bg-black text-white',
    rating: 4.5,
    reviews: 278,
    category: 'bestsellers',
  },
  {
    id: 'bs-glow',
    name: 'Coloração Glow 60g',
    description: 'Coloração sem amônia com brilho intenso. Resultado profissional em casa.',
    image: 'https://cdn.shopify.com/s/files/1/0579/3546/2464/files/GLOW_ef37a83b-b377-45dd-bfb7-51cebc005ad9.png?v=1767726089',
    price: 'R$ 127,70',
    installments: '6x de R$ 21,28',
    link: 'https://nouecosmeticos.com.br/products/colorante-glow-60g',
    badge: '⭐ Top Avaliado',
    badgeColor: 'bg-yellow-500 text-black',
    rating: 5.0,
    reviews: 189,
    category: 'bestsellers',
  },
  {
    id: 'bs-kit',
    name: 'Kit Camufla & Trata',
    description: 'Combo completo: Camuflage + Tratamento Regenér. Economia de 28% no kit.',
    image: 'https://cdn.shopify.com/s/files/1/0579/3546/2464/files/Kit_Camufla_Trata_-_Medium_1.png?v=1767724528',
    price: 'R$ 460,00',
    originalPrice: 'R$ 643,00',
    installments: '6x de R$ 76,66',
    link: 'https://nouecosmeticos.com.br/products/kit-camufla-trata-medium',
    badge: '💰 Melhor Custo-Benefício',
    badgeColor: 'bg-green-600 text-white',
    rating: 4.8,
    reviews: 143,
    discount: '28%',
    category: 'bestsellers',
  },
  {
    id: 'bs-mascara',
    name: 'Máscara Camuflage 150g',
    description: 'Tratamento intensivo para cabelos coloridos. Prolonga o resultado do Camuflage.',
    image: 'https://cdn.shopify.com/s/files/1/0579/3546/2464/files/IMG-01-v2.png?v=1764010979',
    price: 'R$ 89,00',
    originalPrice: 'R$ 129,00',
    installments: '6x de R$ 14,83',
    link: 'https://nouecosmeticos.com.br/products/mascara-camuflage-150g',
    badge: '🔥 Lançamento',
    badgeColor: 'bg-red-600 text-white',
    rating: 4.9,
    reviews: 94,
    discount: '31%',
    category: 'novidades',
  },
  {
    id: 'bs-perfume',
    name: 'Perfume Regenér 50ml',
    description: 'Fragrância exclusiva com ativos capilares. Perfuma e trata ao mesmo tempo.',
    image: 'https://cdn.shopify.com/s/files/1/0579/3546/2464/files/PERFUME.png?v=1770991839',
    price: 'R$ 109,00',
    installments: '6x de R$ 18,16',
    link: 'https://nouecosmeticos.com.br/products/perfume-regener-50ml',
    badge: '✨ Novidade',
    badgeColor: 'bg-purple-600 text-white',
    rating: 5.0,
    reviews: 67,
    category: 'novidades',
  },
]

export function BestSellersSection() {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'novidades'>('bestsellers')
  const displayItems = bestSellers.filter(p => p.category === activeTab)

  return (
    <section className="w-full max-w-5xl mx-auto mt-24 mb-16">
      <div className="text-center mb-10">
        <span className="inline-block py-1 px-3 border border-black text-xs font-bold tracking-widest uppercase mb-4">
          Loja Nouê
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-3">
          Descubra Mais Produtos
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Os produtos preferidos das nossas clientes e as últimas novidades da linha Nouê.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-10">
        {(['bestsellers', 'novidades'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
              activeTab === tab
                ? 'bg-black text-white'
                : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'
            }`}
          >
            {tab === 'bestsellers' ? <TrendingUp className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {tab === 'bestsellers' ? 'Mais Vendidos' : 'Novidades'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {displayItems.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <Card className="border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative bg-gray-50 aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://nouecosmeticos.com.br/cdn/shop/files/Medium_01.png' }}
                  />
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 uppercase tracking-widest ${product.badgeColor}`}>
                    {product.badge}
                  </span>
                  {product.discount && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      -{product.discount}
                    </span>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                    <span className="text-[11px] text-gray-400 ml-1">({product.reviews})</span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{product.description}</p>
                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through block">{product.originalPrice}</span>
                      )}
                      <span className="text-xl font-bold">{product.price}</span>
                      <span className="text-[11px] text-gray-400 block">{product.installments} sem juros</span>
                    </div>
                    <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-noue py-2.5 px-5 text-xs">
                      Ver Produto
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center mt-10">
        <a
          href="https://nouecosmeticos.com.br/collections/mais-vendidos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-black text-black text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-black hover:text-white transition-all duration-300"
        >
          Ver Todos os Produtos <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
