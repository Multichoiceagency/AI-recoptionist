'use client'

import Link from 'next/link'
import { Phone, Zap, Clock, Globe, Shield, TrendingUp, Check, ArrowRight, Play, Star, Users, HeadphonesIcon, Mic, Sparkles, Bot, MessageSquare, BarChart3, Headphones, Volume2, Settings, ChevronRight } from 'lucide-react'
import { LandingNav } from '@/components/landing-nav'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0118] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-transparent rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-fuchsia-600/10 via-violet-600/10 to-cyan-600/10 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-violet-300">AI-Powered Voice Technology</span>
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
                <span className="text-white">Your Voice.</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Amplified by AI.
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
                Transform your business communication with our premium AI voice assistant. 
                Natural conversations, 24/7 availability, infinite scalability.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                <Link
                  href="/signup"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border border-white/10 hover:border-white/20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-25" />
                    <Play className="h-5 w-5 relative z-10 fill-white" />
                  </div>
                  Watch Demo
                </button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>
            
            {/* Right Visual - Voice Assistant Visualization */}
            <div className="flex-1 relative">
              <VoiceVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider">Trusted by industry leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['OpenAI', 'LiveKit', 'Twilio', 'Google Cloud', 'AWS', 'Microsoft'].map((logo) => (
              <div key={logo} className="text-xl font-bold text-gray-400 hover:text-white transition-colors">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10M+" label="Calls Handled" icon={Phone} color="violet" />
            <StatCard value="99.99%" label="Uptime SLA" icon={Shield} color="emerald" />
            <StatCard value="<500ms" label="Response Time" icon={Zap} color="cyan" />
            <StatCard value="150+" label="Languages" icon={Globe} color="fuchsia" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">Premium Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Everything You Need</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A complete AI voice solution designed for modern businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic}
              title="Natural Voice AI"
              description="State-of-the-art speech synthesis and recognition for conversations that feel genuinely human."
              gradient="from-violet-500 to-fuchsia-500"
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Availability"
              description="Never miss a call. Your AI assistant handles inquiries around the clock, every day of the year."
              gradient="from-cyan-500 to-blue-500"
            />
            <FeatureCard
              icon={Globe}
              title="150+ Languages"
              description="Communicate with customers worldwide. Automatic language detection and natural responses."
              gradient="from-fuchsia-500 to-pink-500"
            />
            <FeatureCard
              icon={Bot}
              title="Smart Routing"
              description="Intelligent call routing based on intent, sentiment, and customer history for optimal resolution."
              gradient="from-emerald-500 to-teal-500"
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Comprehensive dashboards with call metrics, sentiment analysis, and actionable insights."
              gradient="from-orange-500 to-amber-500"
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise Security"
              description="SOC 2 Type II certified, GDPR compliant, with end-to-end encryption for all communications."
              gradient="from-blue-500 to-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Settings className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">Simple Setup</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Live in Minutes</span>
            </h2>
            <p className="text-xl text-gray-400">
              Three simple steps to your AI voice assistant
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-violet-500/50 via-fuchsia-500/50 to-cyan-500/50 -translate-y-1/2" />
            
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="01"
                title="Create Account"
                description="Sign up in 30 seconds with email or Google. No credit card required."
                gradient="from-violet-500 to-fuchsia-500"
              />
              <StepCard
                number="02"
                title="Configure"
                description="Set up your business info, greeting, and call handling preferences."
                gradient="from-fuchsia-500 to-pink-500"
              />
              <StepCard
                number="03"
                title="Go Live"
                description="Connect your phone number and start receiving AI-powered calls instantly."
                gradient="from-cyan-500 to-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">Transparent Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Simple, Fair Pricing</span>
            </h2>
            <p className="text-xl text-gray-400">
              Pay only for what you use. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="€49"
              period="/month"
              description="Perfect for small businesses"
              features={[
                '100 minutes/month',
                '1 phone number',
                'Basic analytics',
                'Email support',
                'Dutch voice',
              ]}
            />
            <PricingCard
              name="Professional"
              price="€149"
              period="/month"
              description="For growing companies"
              features={[
                '500 minutes/month',
                '3 phone numbers',
                'Advanced analytics',
                'Priority support',
                'Multi-language support',
                'Calendar integration',
                'Custom greeting',
              ]}
              popular
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              period=""
              description="For large organizations"
              features={[
                'Unlimited minutes',
                'Unlimited numbers',
                'Custom integrations',
                'Dedicated support',
                'SLA guarantee',
                'On-premise option',
                'White-label',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Users className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">Customer Stories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Loved by Teams</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Since implementing AI Receptionist, we haven't missed a single call. Customer satisfaction increased by 40%."
              author="Jan de Vries"
              role="Owner, De Vries Dental Practice"
              avatar="JV"
            />
            <TestimonialCard
              quote="The AI sounds incredibly natural. Most customers don't even realize they're talking to an AI system."
              author="Lisa Bakker"
              role="Manager, Bakker Real Estate"
              avatar="LB"
            />
            <TestimonialCard
              quote="Cost-effective and efficient. We save €2,000/month compared to a traditional receptionist."
              author="Mark Jansen"
              role="CEO, Tech Solutions BV"
              avatar="MJ"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 rounded-[2.5rem] p-12 sm:p-16 border border-white/10 overflow-hidden backdrop-blur-sm">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 animate-pulse" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-violet-500/20 to-transparent rounded-full blur-[100px]" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
                <Volume2 className="h-4 w-4 text-violet-400" />
                <span className="text-sm text-gray-300">Start your free trial today</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="text-white">Ready to Transform</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Communications?
                </span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                Join thousands of businesses already using AI voice technology. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:scale-[1.02]"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto text-gray-400 hover:text-white transition-colors px-8 py-4 font-medium"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">AI Receptionist</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                The most advanced AI voice assistant for businesses. Natural conversations, 24/7 availability.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <a key={social} href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 AI Receptionist. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Made with ❤️ in Amsterdam</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Voice Visualization Component
function VoiceVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
      
      {/* Main Circle */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 backdrop-blur-xl border border-white/10">
        {/* Inner Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Voice Waves */}
          <div className="relative w-full h-32 flex items-center justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-violet-500 to-cyan-400 rounded-full"
                style={{
                  height: `${20 + Math.random() * 60}%`,
                  animation: `wave 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Rotating Ring */}
        <div className="absolute inset-4 rounded-full border-2 border-dashed border-violet-500/30 animate-spin" style={{ animationDuration: '20s' }} />
        
        {/* Status Indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">Listening...</span>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 p-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/10">
        <MessageSquare className="h-5 w-5 text-violet-400" />
      </div>
      <div className="absolute bottom-12 left-4 p-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/10">
        <Headphones className="h-5 w-5 text-cyan-400" />
      </div>
      <div className="absolute top-1/4 left-0 p-3 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-white/10">
        <Bot className="h-5 w-5 text-fuchsia-400" />
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ value, label, icon: Icon, color }: { value: string; label: string; icon: any; color: string }) {
  const colorClasses: Record<string, string> = {
    violet: 'from-violet-500 to-fuchsia-500 text-violet-400',
    emerald: 'from-emerald-500 to-teal-500 text-emerald-400',
    cyan: 'from-cyan-500 to-blue-500 text-cyan-400',
    fuchsia: 'from-fuchsia-500 to-pink-500 text-fuchsia-400',
  }
  
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
        <div className={`p-2.5 bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')}/10 rounded-xl w-fit mb-4`}>
          <Icon className={`h-5 w-5 ${colorClasses[color].split(' ').pop()}`} />
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, gradient }: { icon: any; title: string; description: string; gradient: string }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl blur-xl`} />
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 h-full">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl w-fit mb-6 shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

// Step Card Component
function StepCard({ number, title, description, gradient }: { number: string; title: string; description: string; gradient: string }) {
  return (
    <div className="relative text-center group">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

// Pricing Card Component
function PricingCard({
  name,
  price,
  period,
  description,
  features,
  popular = false,
}: {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
}) {
  return (
    <div className={`relative group ${popular ? 'md:-mt-4 md:mb-4' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      <div className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 h-full ${
        popular 
          ? 'border-violet-500/50 shadow-xl shadow-violet-500/10' 
          : 'border-white/10 hover:border-white/20'
      }`}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        <div className="mb-8">
          <span className="text-5xl font-bold text-white">{price}</span>
          <span className="text-gray-400">{period}</span>
        </div>
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-300">
              <div className={`p-1 rounded-full ${popular ? 'bg-violet-500/20' : 'bg-white/10'}`}>
                <Check className={`h-3.5 w-3.5 ${popular ? 'text-violet-400' : 'text-emerald-400'}`} />
              </div>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href="/signup"
          className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
            popular
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
          }`}
        >
          {price === 'Custom' ? 'Contact Sales' : 'Get Started'}
        </Link>
      </div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 h-full">
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <p className="text-gray-300 mb-8 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center font-semibold text-white">
            {avatar}
          </div>
          <div>
            <p className="font-semibold text-white">{author}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
