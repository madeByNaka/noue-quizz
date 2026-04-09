import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, Check, RefreshCcw, ShoppingBag, Lock, Star,
  Gift, Users, Flame, Clock, Copy, CheckCircle2, Zap,
  Shield, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getRecommendation, questions } from '@/lib/quiz-data'
import type { Product } from '@/lib/quiz-data'
import { supabase } from '@/lib/supabase'
import { BestSellersSection } from '@/components/BestSellersSection'

type Step = 'home' | 'lead-form' | 'quiz' | 'result'

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function Index() {
  const [step, setStep] = useState<Step>('home')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('goal')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [lastAnswerLabel, setLastAnswerLabel] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [couponTimer, setCouponTimer] = useState(15 * 60)
  const [couponExpired, setCouponExpired] = useState(false)
  const [couponCopied, setCouponCopied] = useState(false)
  const couponTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [peopleCount, setPeopleCount] = useState(() => Math.floor(Math.random() * 18) + 23)
  const [stockCount] = useState(() => Math.floor(Math.random() * 8) + 3)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timeoutRef = { current: null as ReturnType<typeof setTimeout> | null }
    const fluctuate = () => {
      setPeopleCount(prev => {
        const delta = Math.floor(Math.random() * 3) + 1
        const direction = Math.random() > 0.45 ? 1 : -1
        return Math.min(47, Math.max(18, prev + delta * direction))
      })
      timeoutRef.current = setTimeout(fluctuate, Math.floor(Math.random() * 5000) + 4000)
    }
    timeoutRef.current = setTimeout(fluctuate, 4000)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  useEffect(() => {
    if (step === 'result') {
      couponTimerRef.current = setInterval(() => {
        setCouponTimer(prev => {
          if (prev <= 1) { clearInterval(couponTimerRef.current!); setCouponExpired(true); return 0 }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (couponTimerRef.current) clearInterval(couponTimerRef.current) }
  }, [step])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleCopyCoupon = useCallback(() => {
    navigator.clipboard.writeText('QUIZ10').then(() => {
      setCouponCopied(true)
      toast.success('Cupom QUIZ10 copiado! Cole no checkout da Nouê.')
      setTimeout(() => setCouponCopied(false), 3000)
    })
  }, [])

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (leadPhone.replace(/\D/g, '').length < 10) {
      toast.error('Digite um WhatsApp válido com DDD.')
      return
    }
    setIsSubmittingLead(true)
    try {
      const { data } = await supabase
        .from('leads')
        .insert({ name: leadName, phone: leadPhone })
        .select('id')
        .single()
      if (data) setLeadId(data.id)
    } catch { /* best-effort */ }
    finally { setIsSubmittingLead(false) }
    setStep('quiz')
  }

  const currentQuestion = questions.find(q => q.id === currentQuestionId)!
  const currentQuestionIndex = questions.findIndex(q => q.id === currentQuestionId)

  const handleAnswer = (value: string, nextQuestionId?: string, label?: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(updatedAnswers)
    if (label) setLastAnswerLabel(label)

    if (nextQuestionId === 'result' || !nextQuestionId) {
      const recs = getRecommendation(updatedAnswers)
      setRecommendations(recs)
      setStep('result')
      if (leadId) {
        supabase.from('leads').update({
          answers: updatedAnswers,
          recommended_products: recs.map(p => p.name).join(', '),
        }).eq('id', leadId).then(() => {})
      }
    } else {
      setCurrentQuestionId(nextQuestionId)
    }
  }

  const handleRestart = () => {
    setStep('home')
    setCurrentQuestionId('goal')
    setAnswers({})
    setLastAnswerLabel(null)
    setLeadName('')
    setLeadPhone('')
    setLeadId(null)
    setRecommendations([])
    setCouponTimer(15 * 60)
    setCouponExpired(false)
    setCouponCopied(false)
    if (couponTimerRef.current) clearInterval(couponTimerRef.current)
  }

  const getWhatsAppLink = () => {
    const msg = `Olá! Sou ${leadName}, fiz o Quiz Nouê e meu resultado foi: ${recommendations.map(p => p.name).join(', ')}. Gostaria de resgatar meu cupom!`
    return `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* Barra de anúncios */}
      <div className="bg-black text-white text-[11px] font-bold tracking-widest uppercase py-2 overflow-hidden">
        <div className="flex items-center justify-center gap-6 px-4 whitespace-nowrap">
          <span>🎁 Brindes Exclusivos</span><span>•</span>
          <span>6x Sem Juros</span><span>•</span>
          <span>Frete Grátis Acima de R$250,00</span><span>•</span>
          <span>🎁 Brindes Exclusivos</span><span>•</span>
          <span>6x Sem Juros</span>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[88px] md:h-[100px] flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-bold tracking-widest uppercase">
            <a href="https://nouecosmeticos.com.br/collections/mais-vendidos" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors">Produtos</a>
            <a href="https://nouecosmeticos.com.br/collections/linhas" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors">Linhas</a>
            <a href="https://nouecosmeticos.com.br/collections/kit-linha-completa" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors">Kits</a>
          </nav>
          <a href="https://nouecosmeticos.com.br" target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/noue_logo_transparent_9fdd77c6.png"
              alt="Nouê Cosméticos"
              className="h-20 md:h-28 w-auto object-contain scale-150 md:scale-[1.8] origin-center"
            />
          </a>
          <div>
            <a href="https://nouecosmeticos.com.br/cart" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon"><ShoppingBag className="w-5 h-5" /></Button>
            </a>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="w-full">
        <a href="https://nouecosmeticos.com.br/collections/camuflagem-de-brancos-copia" target="_blank" rel="noopener noreferrer">
          <picture>
            <source media="(max-width: 768px)" srcSet="https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/banner_camuflage_mob_2b6e68b2.png" />
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663044436746/MzHu3UfyK925FTqvF8VAzp/banner_camuflage_desk_6566f7ec.png"
              alt="Linha Camuflage Nouê" className="w-full object-cover" style={{ maxHeight: '420px', objectPosition: 'center' }} />
          </picture>
        </a>
      </div>

      <main className="pt-16 pb-20 px-4 max-w-7xl mx-auto">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">

            {/* ── HOME ── */}
            {step === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="text-center max-w-2xl w-full">
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-4 py-2 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <Users className="w-3 h-3" />
                  {peopleCount} mulheres fazendo o diagnóstico agora
                </div>

                <span className="inline-block py-1 px-3 border border-black text-xs font-bold tracking-widest uppercase mb-6">
                  Diagnóstico Capilar Gratuito
                </span>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter uppercase leading-none">
                  Diagnóstico<br />
                  <span className="block text-4xl md:text-6xl">Capilar Personalizado</span>
                </h1>

                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
                  {[
                    { icon: <Zap className="w-5 h-5 text-yellow-500" />, title: '2 min', sub: 'Resultado rápido' },
                    { icon: <Gift className="w-5 h-5 text-red-500" />, title: 'Cupom 10%', sub: 'Exclusivo quiz' },
                    { icon: <Shield className="w-5 h-5 text-blue-500" />, title: '100% grátis', sub: 'Sem compromisso' },
                  ].map(item => (
                    <div key={item.title} className="flex flex-col items-center gap-1 p-3 bg-gray-50 border border-gray-100">
                      {item.icon}
                      <span className="font-bold text-xs uppercase tracking-wide">{item.title}</span>
                      <span className="text-gray-500 text-[11px]">{item.sub}</span>
                    </div>
                  ))}
                </div>

                <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                  Responda 5 perguntas rápidas e receba uma recomendação personalizada — mais um{' '}
                  <strong>cupom de 10% de desconto</strong> para usar na sua primeira compra.
                </p>

                <button onClick={() => setStep('lead-form')} className="btn-noue text-lg px-12 h-16 w-full sm:w-auto">
                  Iniciar Diagnóstico Grátis <ArrowRight className="ml-2 w-5 h-5 inline" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
                  <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <span className="font-semibold text-black">4.9</span>
                  <span>· mais de 2.400 diagnósticos realizados</span>
                </div>
              </motion.div>
            )}

            {/* ── LEAD FORM ── */}
            {step === 'lead-form' && (
              <motion.div key="lead-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md">
                <div className="text-center mb-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
                    <Gift className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">Antes de começar...</h2>
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-2 rounded-full mb-3">
                    <Flame className="w-3 h-3" />
                    Apenas {stockCount} cupons QUIZ10 disponíveis hoje
                  </div>
                  <p className="text-gray-600 text-sm">
                    Insira seus dados para receber seu <strong>resultado personalizado</strong> e um{' '}
                    <strong>cupom de 10% de desconto</strong> exclusivo.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-sm mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-300 mb-1">Seu presente exclusivo</div>
                    <div className="font-bold text-lg tracking-widest">CUPOM QUIZ10</div>
                    <div className="text-xs text-gray-300">10% de desconto · Liberado ao final do quiz</div>
                  </div>
                  <Lock className="w-5 h-5 text-gray-400 ml-auto flex-shrink-0" />
                </div>

                <Card className="border-gray-200 shadow-xl">
                  <CardContent className="p-6">
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest">Seu Nome</Label>
                        <Input id="name" placeholder="Ex: Maria Silva" value={leadName}
                          onChange={e => setLeadName(e.target.value)} required minLength={2} className="h-12" autoFocus />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest">Seu WhatsApp</Label>
                        <Input id="phone" placeholder="Ex: (11) 99999-9999" type="tel" value={leadPhone}
                          onChange={e => setLeadPhone(maskPhone(e.target.value))} required className="h-12" />
                      </div>
                      <button type="submit" disabled={isSubmittingLead} className="btn-noue w-full h-14 text-base mt-2 disabled:opacity-50">
                        {isSubmittingLead ? 'Preparando...' : <><ArrowRight className="mr-2 w-5 h-5 inline" />Iniciar Quiz</>}
                      </button>
                      <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% seguro</span>
                        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Sem spam</span>
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Dados protegidos</span>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── QUIZ ── */}
            {step === 'quiz' && currentQuestion && (
              <motion.div key={`q-${currentQuestionId}`}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className={`w-full ${currentQuestion.visualLayout === 'grid' && currentQuestion.options[0]?.images ? 'max-w-2xl' : 'max-w-xl'}`}>

                {/* Barra de progresso */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      Pergunta {currentQuestionIndex + 1} de {questions.length}
                    </span>
                    <span className="text-black font-bold">{Math.round((currentQuestionIndex / questions.length) * 100)}% concluído</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-black rounded-full"
                      initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                      animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }} />
                  </div>
                </div>

                {/* Micro-feedback */}
                {lastAnswerLabel && currentQuestionIndex > 0 && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Ótimo! Anotamos: <strong>{lastAnswerLabel}</strong></span>
                  </motion.div>
                )}

                <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight">{currentQuestion.text}</h2>
                {currentQuestion.subtitle
                  ? <p className="text-sm text-gray-500 mb-6">{currentQuestion.subtitle}</p>
                  : <div className="mb-8" />}

                {/* Grid com imagens */}
                {currentQuestion.visualLayout === 'grid' && currentQuestion.options[0]?.images ? (
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options.map(option => (
                      <motion.button key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(option.value, option.nextQuestionId, option.text + (option.subtitle ? ` (${option.subtitle})` : ''))}
                        className="text-left border-2 border-gray-200 hover:border-black transition-all duration-200 group overflow-hidden bg-white">
                        {option.images?.morena ? (
                          <div className="flex w-full" style={{ height: '140px' }}>
                            <div className="flex-1 overflow-hidden relative">
                              <img src={option.images.morena} alt="Morena" className="w-full h-full object-cover object-top" />
                              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">Morena</span>
                            </div>
                            <div className="flex-1 overflow-hidden relative border-l border-gray-100">
                              <img src={option.images.loira} alt="Loira" className="w-full h-full object-cover object-top" />
                              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">Loira</span>
                            </div>
                          </div>
                        ) : option.images?.single ? (
                          <div className="overflow-hidden" style={{ height: '160px' }}>
                            <img src={option.images.single} alt={option.text} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : null}
                        <div className="p-3 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold block">{option.text}</span>
                            {option.subtitle && <span className="text-[11px] text-gray-500">{option.subtitle}</span>}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors flex-shrink-0" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  /* Lista simples */
                  <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                      <motion.button key={option.value} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.value, option.nextQuestionId, option.text)}
                        className="w-full text-left p-5 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200 group flex items-center justify-between">
                        <span className="text-base font-medium">{option.text}</span>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{peopleCount} pessoas respondendo agora · Resultado em menos de 2 min</span>
                </div>
              </motion.div>
            )}

            {/* ── RESULT ── */}
            {step === 'result' && (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl">

                {/* Banner cupom */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`mb-8 overflow-hidden border-2 ${
                    couponExpired ? 'border-gray-300 bg-gray-50'
                    : couponTimer < 120 ? 'border-red-500 bg-red-50'
                    : 'border-black bg-black'}`}>
                  {!couponExpired ? (
                    <div className={`p-5 ${couponTimer < 120 ? 'text-black' : 'text-white'}`}>
                      {couponTimer < 120 && (
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 text-center mb-3 tracking-widest uppercase">
                          ⚠️ ATENÇÃO: Cupom expirando em instantes!
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                          <div className={`text-xs uppercase tracking-widest mb-1 ${couponTimer < 120 ? 'text-gray-500' : 'text-gray-300'}`}>Seu cupom exclusivo</div>
                          <div className="font-bold text-2xl tracking-widest">QUIZ10</div>
                          <div className={`text-xs ${couponTimer < 120 ? 'text-gray-500' : 'text-gray-300'}`}>10% de desconto em toda a loja</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className={`text-xs uppercase tracking-widest mb-1 flex items-center gap-1 ${couponTimer < 120 ? 'text-red-500 font-bold' : 'text-gray-300'}`}>
                              <Clock className="w-3 h-3" />Expira em
                            </div>
                            <div className={`font-bold text-3xl font-mono ${couponTimer < 120 ? 'text-red-600' : 'text-white'}`}>
                              {formatTimer(couponTimer)}
                            </div>
                          </div>
                          <button onClick={handleCopyCoupon}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                              couponCopied ? 'bg-green-500 text-white'
                              : couponTimer < 120 ? 'bg-black text-white hover:bg-zinc-800'
                              : 'bg-white text-black hover:bg-gray-100'}`}>
                            {couponCopied ? <><CheckCircle2 className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 text-center text-gray-500">
                      <div className="text-sm font-bold uppercase tracking-widest mb-1">Cupom Expirado</div>
                      <div className="text-xs">Entre em contato pelo WhatsApp para um novo cupom.</div>
                    </div>
                  )}
                </motion.div>

                {/* Cabeçalho resultado */}
                <div className="text-center mb-10">
                  <span className="inline-block py-1 px-3 border border-black text-xs font-bold tracking-widest uppercase mb-4">
                    Recomendação Personalizada
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-3">
                    Seu Ritual Nouê{leadName ? `, ${leadName}` : ''}
                  </h2>
                  <p className="text-gray-500 text-sm">Selecionamos os produtos ideais com base nas suas respostas.</p>
                </div>

                {/* Cards de produtos */}
                <div className={`grid gap-6 mb-12 ${recommendations.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {recommendations.map((product, index) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className={`overflow-hidden ${product.isPlus ? 'border-dashed border-gray-300' : 'border-black'}`}>
                        {product.isPlus && (
                          <div className="bg-gray-50 px-4 py-2 border-b border-dashed border-gray-300">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">✨ Dica de Especialista</span>
                          </div>
                        )}

                        {product.beforeAfter ? (
                          <div className="bg-gray-50 grid grid-cols-2" style={{ height: '200px' }}>
                            <div className="relative overflow-hidden border-r border-gray-200">
                              <img src={product.beforeAfter.before} alt="Antes" className="w-full h-full object-cover" />
                              <span className="absolute top-2 left-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase">Antes</span>
                            </div>
                            <div className="relative overflow-hidden">
                              <img src={product.beforeAfter.after} alt="Depois" className="w-full h-full object-cover" />
                              <span className="absolute top-2 right-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase">Depois</span>
                            </div>
                            {product.beforeAfter.caption && (
                              <div className="col-span-2 bg-black text-white text-[11px] font-bold text-center py-1.5 uppercase tracking-widest">
                                {product.beforeAfter.caption}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-50 aspect-[4/3] overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6" />
                          </div>
                        )}

                        <CardContent className="p-6">
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {product.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-0.5">{tag}</span>
                              ))}
                            </div>
                          )}
                          <h3 className="text-xl font-bold tracking-tight mb-2">{product.name}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>
                          {product.whyRecommended && (
                            <div className="bg-gray-50 border-l-4 border-black p-3 mb-4">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Por que escolhemos</div>
                              <p className="text-sm text-gray-700 leading-relaxed">{product.whyRecommended}</p>
                            </div>
                          )}
                          {product.isProfessional && (
                            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 mb-4">
                              <Shield className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                              <span className="text-xs font-bold text-yellow-800">Uso Profissional — recomendamos aplicação com cabeleireiro</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <span className="text-2xl font-bold">{product.price}</span>
                              <span className="text-xs text-gray-400 block">à vista</span>
                            </div>
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-noue py-3 px-6 text-sm">
                              Comprar <ArrowRight className="ml-1 w-4 h-4 inline" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* CTA WhatsApp */}
                <div className="text-center mb-8">
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest px-8 py-4 transition-all text-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.549 4.116 1.512 5.849L.057 23.852l6.137-1.608A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.367l-.36-.213-3.724.977.994-3.629-.234-.373A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    Tirar Dúvidas no WhatsApp
                  </a>
                </div>

                <div className="text-center">
                  <button onClick={handleRestart} className="inline-flex items-center gap-2 text-gray-400 hover:text-black text-sm transition-colors">
                    <RefreshCcw className="w-4 h-4" /> Refazer o Diagnóstico
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {step === 'result' && <BestSellersSection />}
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400 tracking-widest uppercase">
        <p>© 2025 Nouê Cosméticos · Todos os direitos reservados</p>
        <p className="mt-2">
          <a href="https://nouecosmeticos.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
            nouecosmeticos.com.br
          </a>
        </p>
      </footer>
    </div>
  )
}
