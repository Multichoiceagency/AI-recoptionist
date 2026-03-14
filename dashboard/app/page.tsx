'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Phone, Clock, Globe, Shield, Check, ArrowRight, Play, Pause, Star, Users, Volume2, Sparkles, ChevronRight, Award, Building2, Headphones, MessageCircle, CalendarCheck, PhoneCall, MicVocal, Waves } from 'lucide-react'
import { LandingNav } from '@/components/landing-nav'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0f0f0f] to-[#0c0c0c]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-amber-900/10 via-transparent to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-amber-950/5 to-transparent" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-3 mb-12">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-light">Premium Voice Technology</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extralight leading-[1.1] mb-8 tracking-tight">
            <span className="text-white/90">Your Voice</span>
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent font-light italic">
              Reimagined
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
            Experience the art of conversation, perfected. Our AI concierge delivers 
            exceptional service with the warmth and sophistication your guests expect.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link
              href="/signup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-10 py-5 rounded-full font-medium text-base transition-all duration-500 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/30"
            >
              Begin Your Experience
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#voice-demos"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 text-white/70 hover:text-white px-10 py-5 font-light text-base transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
                <Play className="h-4 w-4 relative z-10 fill-current" />
              </div>
              Listen to Demos
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-12 text-xs uppercase tracking-widest text-white/30">
            <span>Trusted by Leading Hotels</span>
            <span className="hidden sm:block">•</span>
            <span>Enterprise Ready</span>
            <span className="hidden sm:block">•</span>
            <span>24/7 Availability</span>
          </div>
        </div>
      </section>

      {/* Marquee Logos */}
      <section className="relative py-16 z-10 border-y border-white/5">
        <div className="flex items-center justify-center gap-20 opacity-30 text-sm tracking-widest font-light">
          {['THE RITZ', 'FOUR SEASONS', 'MANDARIN ORIENTAL', 'ST. REGIS', 'WALDORF ASTORIA', 'PENINSULA'].map((name) => (
            <span key={name} className="whitespace-nowrap">{name}</span>
          ))}
        </div>
      </section>

      {/* Voice Demos Section */}
      <section id="voice-demos" className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-light">Voice Demonstrations</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extralight mb-6">
              <span className="text-white/90">Hear the</span>{' '}
              <span className="italic text-amber-200">Difference</span>
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto">
              Experience the natural warmth and sophistication of our AI voices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VoiceDemoCard
              title="Hotel Concierge"
              subtitle="Warm & Professional"
              description="Perfect for luxury hospitality, greeting guests and handling reservations."
              voiceType="Sophia"
              accent="American"
              audioSrc="/demos/concierge.mp3"
              gradient="from-amber-500/10 to-orange-500/10"
            />
            <VoiceDemoCard
              title="Business Assistant"
              subtitle="Clear & Efficient"
              description="Ideal for corporate environments, scheduling and information delivery."
              voiceType="James"
              accent="British"
              audioSrc="/demos/business.mp3"
              gradient="from-blue-500/10 to-indigo-500/10"
            />
            <VoiceDemoCard
              title="Medical Reception"
              subtitle="Calm & Reassuring"
              description="Designed for healthcare, with empathetic and clear communication."
              voiceType="Emma"
              accent="Neutral"
              audioSrc="/demos/medical.mp3"
              gradient="from-emerald-500/10 to-teal-500/10"
            />
            <VoiceDemoCard
              title="Restaurant Maître d'"
              subtitle="Elegant & Refined"
              description="Crafted for fine dining, handling reservations with sophistication."
              voiceType="Alexandre"
              accent="French"
              audioSrc="/demos/restaurant.mp3"
              gradient="from-rose-500/10 to-pink-500/10"
            />
            <VoiceDemoCard
              title="Real Estate Agent"
              subtitle="Confident & Engaging"
              description="Built for property inquiries, scheduling viewings with enthusiasm."
              voiceType="Michael"
              accent="American"
              audioSrc="/demos/realestate.mp3"
              gradient="from-violet-500/10 to-purple-500/10"
            />
            <VoiceDemoCard
              title="Multilingual Support"
              subtitle="Global & Adaptive"
              description="Seamlessly switches between languages with natural fluency."
              voiceType="Isabella"
              accent="Multilingual"
              audioSrc="/demos/multilingual.mp3"
              gradient="from-cyan-500/10 to-sky-500/10"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Feature List */}
            <div>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
                <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-light">Exceptional Capabilities</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extralight mb-8 leading-tight">
                <span className="text-white/90">Crafted for</span>
                <br />
                <span className="italic text-amber-200">Excellence</span>
              </h2>
              <p className="text-white/50 font-light mb-12 leading-relaxed">
                Every interaction is designed to reflect the highest standards of service, 
                combining cutting-edge AI with the timeless art of hospitality.
              </p>
              
              <div className="space-y-6">
                <FeatureItem
                  icon={Clock}
                  title="24/7 Availability"
                  description="Unwavering presence, any hour of the day or night"
                />
                <FeatureItem
                  icon={Globe}
                  title="150+ Languages"
                  description="Fluent conversation in your guests' native tongues"
                />
                <FeatureItem
                  icon={CalendarCheck}
                  title="Intelligent Scheduling"
                  description="Seamless appointment and reservation management"
                />
                <FeatureItem
                  icon={Shield}
                  title="Enterprise Security"
                  description="Bank-grade encryption and compliance standards"
                />
              </div>
            </div>
            
            {/* Right - Visual */}
            <div className="relative">
              <div className="aspect-square relative">
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent" />
                
                {/* Main Circle */}
                <div className="absolute inset-8 rounded-full border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm">
                  {/* Inner Ring */}
                  <div className="absolute inset-8 rounded-full border border-amber-500/20">
                    {/* Center Element */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MicVocal className="h-16 w-16 text-amber-400/60 mx-auto mb-4" />
                        <p className="text-white/40 text-sm font-light tracking-wide">Always Listening</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0c0c0c] border border-white/5 rounded-full">
                    <span className="text-xs text-amber-400/60 tracking-wider">ACTIVE</span>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute top-8 right-0 bg-[#0c0c0c]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
                  <p className="text-2xl font-light text-white">99.9%</p>
                  <p className="text-xs text-white/40 tracking-wide">UPTIME</p>
                </div>
                <div className="absolute bottom-8 left-0 bg-[#0c0c0c]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
                  <p className="text-2xl font-light text-white">&lt;400ms</p>
                  <p className="text-xs text-white/40 tracking-wide">RESPONSE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 z-10 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-light">The Journey</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extralight mb-6">
              <span className="text-white/90">Effortless</span>{' '}
              <span className="italic text-amber-200">Implementation</span>
            </h2>
          </div>
          
          <div className="space-y-0">
            <ProcessStep
              number="01"
              title="Consultation"
              description="We begin with understanding your unique needs and brand voice"
            />
            <ProcessStep
              number="02"
              title="Customization"
              description="Your AI is trained to embody your service standards perfectly"
            />
            <ProcessStep
              number="03"
              title="Integration"
              description="Seamless connection with your existing phone systems"
            />
            <ProcessStep
              number="04"
              title="Excellence"
              description="Continuous optimization ensures impeccable performance"
              isLast
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-light">Investment</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extralight mb-6">
              <span className="text-white/90">Transparent</span>{' '}
              <span className="italic text-amber-200">Value</span>
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto">
              Investment plans designed for establishments that demand excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              tier="Essential"
              price="€99"
              period="/month"
              description="For boutique establishments"
              features={[
                '200 minutes/month',
                '1 phone line',
                'Standard analytics',
                'Email support',
                '5 voice styles',
              ]}
            />
            <PricingCard
              tier="Prestige"
              price="€249"
              period="/month"
              description="For growing properties"
              features={[
                '1,000 minutes/month',
                '5 phone lines',
                'Advanced analytics',
                'Priority support',
                '20 voice styles',
                'Custom greetings',
                'CRM integration',
              ]}
              featured
            />
            <PricingCard
              tier="Grand"
              price="Custom"
              period=""
              description="For luxury establishments"
              features={[
                'Unlimited minutes',
                'Unlimited lines',
                'White-label solution',
                'Dedicated success manager',
                'Custom voice cloning',
                'Full API access',
                'On-site training',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-400/80 font-light">Testimonials</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extralight mb-6">
              <span className="text-white/90">Words from</span>{' '}
              <span className="italic text-amber-200">Excellence</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="The level of sophistication in every interaction has elevated our guest experience beyond measure. It's like having a master concierge available around the clock."
              author="Elisabeth van der Berg"
              role="General Manager"
              company="Grand Hotel Amsterdam"
              rating={5}
            />
            <TestimonialCard
              quote="Our guests frequently compliment our 'new staff member' without realizing it's AI. The natural conversation flow is simply remarkable."
              author="Pierre Dubois"
              role="Director of Operations"
              company="Château Lumière"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-12">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <Award className="h-5 w-5 text-amber-400/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight mb-8 leading-tight">
            <span className="text-white/90">Elevate Your</span>
            <br />
            <span className="italic text-amber-200">Guest Experience</span>
          </h2>
          
          <p className="text-lg text-white/50 font-light mb-12 max-w-xl mx-auto leading-relaxed">
            Join the world's most discerning establishments in redefining 
            what exceptional service truly means.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-12 py-5 rounded-full font-medium transition-all duration-500 shadow-2xl shadow-amber-500/20"
            >
              Request a Consultation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-white/30 font-light">
            Complimentary 14-day experience • No commitment required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/20">
                  <Phone className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-lg font-light tracking-wide text-white/80">AI Receptionist</span>
              </div>
              <p className="text-white/40 font-light text-sm leading-relaxed max-w-sm">
                Redefining hospitality through the art of intelligent conversation. 
                Every interaction, a masterpiece.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/60 mb-6">Experience</h4>
              <ul className="space-y-4 text-sm text-white/40 font-light">
                <li><a href="#voice-demos" className="hover:text-amber-400/80 transition-colors">Voice Demos</a></li>
                <li><a href="#features" className="hover:text-amber-400/80 transition-colors">Capabilities</a></li>
                <li><a href="#pricing" className="hover:text-amber-400/80 transition-colors">Investment</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/60 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/40 font-light">
                <li><a href="#" className="hover:text-amber-400/80 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-amber-400/80 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-amber-400/80 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-light tracking-wide">
              © 2024 AI Receptionist. Crafted with precision.
            </p>
            <p className="text-xs text-white/30 font-light tracking-wide">
              Amsterdam • London • New York
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Voice Demo Card Component
function VoiceDemoCard({
  title,
  subtitle,
  description,
  voiceType,
  accent,
  audioSrc,
  gradient,
}: {
  title: string
  subtitle: string
  description: string
  voiceType: string
  accent: string
  audioSrc: string
  gradient: string
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // Demo: simulate playback if no audio file
          simulatePlayback()
        })
      }
      setIsPlaying(!isPlaying)
    } else {
      setIsPlaying(!isPlaying)
      simulatePlayback()
    }
  }
  
  const simulatePlayback = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev + 2
      })
    }, 100)
  }
  
  return (
    <div className={`group relative bg-gradient-to-br ${gradient} backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-500`}>
      <audio ref={audioRef} src={audioSrc} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-light text-white/90 mb-1">{title}</h3>
          <p className="text-sm text-white/40 font-light">{subtitle}</p>
        </div>
        <button
          onClick={togglePlay}
          className={`p-3 rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'bg-amber-500 text-black' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
      </div>
      
      {/* Waveform */}
      <div className="h-12 flex items-center gap-[2px] mb-6">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${
              isPlaying && progress > (i / 40) * 100
                ? 'bg-amber-400'
                : 'bg-white/10'
            }`}
            style={{
              height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 10}%`,
            }}
          />
        ))}
      </div>
      
      {/* Description */}
      <p className="text-sm text-white/40 font-light mb-4 leading-relaxed">{description}</p>
      
      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-white/30">
        <span className="flex items-center gap-1">
          <MicVocal className="h-3 w-3" />
          {voiceType}
        </span>
        <span>{accent}</span>
      </div>
    </div>
  )
}

// Feature Item Component
function FeatureItem({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/10 group-hover:border-amber-500/20 transition-colors">
        <Icon className="h-4 w-4 text-amber-400/60" />
      </div>
      <div>
        <h4 className="text-base font-light text-white/80 mb-1">{title}</h4>
        <p className="text-sm text-white/40 font-light">{description}</p>
      </div>
    </div>
  )
}

// Process Step Component
function ProcessStep({ number, title, description, isLast = false }: { number: string; title: string; description: string; isLast?: boolean }) {
  return (
    <div className="relative flex gap-8 pb-12">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 w-px h-full bg-gradient-to-b from-amber-500/30 to-transparent" />
      )}
      
      {/* Number */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-[#0c0c0c] border border-amber-500/30 flex items-center justify-center">
        <span className="text-xs text-amber-400/80 font-light">{number}</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-light text-white/80 mb-2">{title}</h3>
        <p className="text-white/40 font-light">{description}</p>
      </div>
    </div>
  )
}

// Pricing Card Component
function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  featured = false,
}: {
  tier: string
  price: string
  period: string
  description: string
  features: string[]
  featured?: boolean
}) {
  return (
    <div className={`relative group ${featured ? 'md:-mt-4 md:mb-4' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 bg-[#0c0c0c] px-4 py-1 border border-amber-500/30 rounded-full">
            Recommended
          </span>
        </div>
      )}
      
      <div className={`relative h-full bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 ${
        featured 
          ? 'border-amber-500/30 shadow-xl shadow-amber-500/5' 
          : 'border-white/5 hover:border-white/10'
      }`}>
        {/* Tier */}
        <div className="mb-6">
          <h3 className="text-lg font-light text-white/80 mb-1">{tier}</h3>
          <p className="text-sm text-white/40 font-light">{description}</p>
        </div>
        
        {/* Price */}
        <div className="mb-8">
          <span className="text-4xl font-extralight text-white">{price}</span>
          <span className="text-white/40 font-light">{period}</span>
        </div>
        
        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-white/60 font-light">
              <Check className={`h-4 w-4 flex-shrink-0 ${featured ? 'text-amber-400' : 'text-white/30'}`} />
              {feature}
            </li>
          ))}
        </ul>
        
        {/* CTA */}
        <Link
          href="/signup"
          className={`block w-full text-center py-4 rounded-full font-light text-sm transition-all duration-300 ${
            featured
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          {price === 'Custom' ? 'Contact Us' : 'Get Started'}
        </Link>
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, company, rating }: { quote: string; author: string; role: string; company: string; rating: number }) {
  return (
    <div className="relative bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-500">
      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-lg font-light text-white/70 leading-relaxed mb-8 italic">
        "{quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center">
          <span className="text-sm font-light text-amber-400">
            {author.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="text-sm font-light text-white/80">{author}</p>
          <p className="text-xs text-white/40 font-light">{role}, {company}</p>
        </div>
      </div>
    </div>
  )
}
