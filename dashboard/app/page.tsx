import Link from 'next/link'
import { Phone, Zap, Clock, Globe, Shield, TrendingUp, Check, ArrowRight, Play, Star, Users, HeadphonesIcon } from 'lucide-react'
import { LandingNav } from '@/components/landing-nav'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 transition-colors">
      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">Powered by OpenAI & LiveKit</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Uw AI Receptionist.<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              24/7 Beschikbaar.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Automatiseer uw telefoonbeantwoording met geavanceerde AI. 
            Nooit meer gemiste oproepen, afspraken of klanten.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
            >
              Start Gratis Proefperiode
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-gray-700">
              <Play className="h-5 w-5" />
              Bekijk Demo
            </button>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Geen creditcard nodig
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              14 dagen gratis
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Binnen 5 minuten actief
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10K+" label="Oproepen Verwerkt" />
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value="< 1s" label="Responstijd" />
            <StatCard value="50+" label="Tevreden Klanten" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Alles Wat U Nodig Heeft
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Een complete oplossing voor professionele telefoonbeantwoording
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Clock}
              title="24/7 Beschikbaar"
              description="Uw AI receptionist neemt altijd op, ook buiten kantooruren, weekenden en feestdagen."
            />
            <FeatureCard
              icon={Globe}
              title="Meertalig"
              description="Ondersteunt Nederlands, Engels, Duits, Frans en meer. Automatische taalherkenning."
            />
            <FeatureCard
              icon={HeadphonesIcon}
              title="Natuurlijke Gesprekken"
              description="Geavanceerde spraak-naar-spraak AI voor vloeiende, menselijke interacties."
            />
            <FeatureCard
              icon={Shield}
              title="Veilig & GDPR-compliant"
              description="Uw gegevens zijn beschermd met enterprise-grade beveiliging en encryptie."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Analytics Dashboard"
              description="Realtime inzichten in oproepen, kosten en prestaties van uw AI receptionist."
            />
            <FeatureCard
              icon={Zap}
              title="Directe Integratie"
              description="Koppel eenvoudig met uw bestaande telefoonsysteem via SIP trunk."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Binnen 5 Minuten Live
            </h2>
            <p className="text-lg text-gray-400">
              Drie eenvoudige stappen naar uw eigen AI receptionist
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Account Aanmaken"
              description="Registreer in 30 seconden met uw email of Google account."
            />
            <StepCard
              number="2"
              title="Configureren"
              description="Stel uw bedrijfsinformatie, openingstijden en begroeting in."
            />
            <StepCard
              number="3"
              title="Verbinden"
              description="Koppel uw telefoonnummer en ga direct live."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Transparante Prijzen
            </h2>
            <p className="text-lg text-gray-400">
              Betaal alleen voor wat u gebruikt, geen verborgen kosten
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Starter"
              price="€49"
              period="/maand"
              description="Perfect voor kleine bedrijven"
              features={[
                '100 minuten/maand',
                '1 telefoonnummer',
                'Basis analytics',
                'Email support',
                'Nederlandse stem',
              ]}
            />
            <PricingCard
              name="Professional"
              price="€149"
              period="/maand"
              description="Voor groeiende bedrijven"
              features={[
                '500 minuten/maand',
                '3 telefoonnummers',
                'Geavanceerde analytics',
                'Prioriteit support',
                'Meertalige ondersteuning',
                'Agenda integratie',
              ]}
              popular
            />
            <PricingCard
              name="Enterprise"
              price="Op maat"
              period=""
              description="Voor grote organisaties"
              features={[
                'Onbeperkte minuten',
                'Onbeperkte nummers',
                'Custom integraties',
                'Dedicated support',
                'SLA garantie',
                'On-premise optie',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Wat Klanten Zeggen
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Sinds we AI Receptionist gebruiken, missen we geen oproepen meer. Onze klanttevredenheid is met 40% gestegen."
              author="Jan de Vries"
              role="Eigenaar, Tandartspraktijk De Vries"
            />
            <TestimonialCard
              quote="De AI klinkt ongelooflijk natuurlijk. Klanten merken vaak niet eens dat ze met een AI praten."
              author="Lisa Bakker"
              role="Manager, Makelaardij Bakker"
            />
            <TestimonialCard
              quote="Kostenbesparend en efficiënt. We besparen €2000/maand vergeleken met een traditionele receptionist."
              author="Mark Jansen"
              role="CEO, Tech Solutions BV"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-blue-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Klaar om te Beginnen?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                Start vandaag nog met uw gratis proefperiode. Geen creditcard nodig.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-blue-500/25"
                >
                  Start Gratis Proefperiode
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto text-gray-300 hover:text-white transition-colors px-8 py-4 font-medium"
                >
                  Al een account? Inloggen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Phone className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-bold text-white">AI Receptionist</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Voorwaarden</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 AI Receptionist. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

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
    <div className={`relative bg-gray-900 border rounded-xl p-6 ${popular ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-800'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
          Meest Gekozen
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-gray-400">{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
          popular
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
        }`}
      >
        {price === 'Op maat' ? 'Contact Opnemen' : 'Selecteer Plan'}
      </Link>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-300 text-sm mb-4">"{quote}"</p>
      <div>
        <p className="font-medium text-white text-sm">{author}</p>
        <p className="text-gray-500 text-xs">{role}</p>
      </div>
    </div>
  )
}
