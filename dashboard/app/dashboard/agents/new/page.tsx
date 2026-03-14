'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import yaml from 'js-yaml'

interface RoutingEntry {
  name: string
  number: string
  description: string
}

interface FAQ {
  question: string
  answer: string
}

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'coral', label: 'Coral' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'nova', label: 'Nova' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'shimmer', label: 'Shimmer' },
]

const TIMEZONE_OPTIONS = [
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (Nederland)' },
  { value: 'Europe/Brussels', label: 'Europe/Brussels (België)' },
  { value: 'Europe/London', label: 'Europe/London (VK)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (Duitsland)' },
  { value: 'UTC', label: 'UTC' },
]

const DELIVERY_OPTIONS = [
  { value: 'file', label: 'Bestand (lokaal opslaan)' },
  { value: 'webhook', label: 'Webhook (URL)' },
]

const DEFAULT_PERSONALITY = `Je bent een professionele en vriendelijke receptionist.
Jouw doel is om bellers te helpen en naar de juiste afdeling door te verbinden.

TAAL: Spreek ALTIJD in het Nederlands. Gebruik "u" tenzij de beller "jij/je" gebruikt.

AANPAK:
1. Begroet de beller vriendelijk en vraag waarmee je kan helpen
2. Luister goed naar de vraag of het probleem
3. Beantwoord vragen of verbind door naar de juiste persoon
4. Neem berichten op als niemand beschikbaar is

TOON: Professioneel, warm en behulpzaam.`

export default function NewAgentPage() {
  const router = useRouter()

  const [configName, setConfigName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [timezone, setTimezone] = useState('Europe/Amsterdam')
  const [greeting, setGreeting] = useState('')
  const [voiceId, setVoiceId] = useState('coral')
  const [personality, setPersonality] = useState(DEFAULT_PERSONALITY)
  const [afterHours, setAfterHours] = useState(
    'Wij zijn momenteel gesloten. Laat uw naam, telefoonnummer en een korte omschrijving van uw vraag achter. Wij nemen zo snel mogelijk contact met u op.'
  )
  const [delivery, setDelivery] = useState('file')
  const [webhookUrl, setWebhookUrl] = useState('')

  const [routing, setRouting] = useState<RoutingEntry[]>([
    { name: 'Receptie', number: '', description: 'Algemene vragen en doorverbinden' },
  ])
  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: 'Wat zijn uw openingstijden?', answer: '' },
  ])

  const [hours, setHours] = useState({
    monday: { open: '09:00', close: '17:00' },
    tuesday: { open: '09:00', close: '17:00' },
    wednesday: { open: '09:00', close: '17:00' },
    thursday: { open: '09:00', close: '17:00' },
    friday: { open: '09:00', close: '17:00' },
    saturday: 'closed' as 'closed' | { open: string; close: string },
    sunday: 'closed' as 'closed' | { open: string; close: string },
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)

  const handleNameChange = (val: string) => {
    const slugged = val.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setConfigName(slugged)
    if (val && !/^[a-zA-Z0-9-]+$/.test(val)) {
      setNameError('Alleen kleine letters, cijfers en koppeltekens toegestaan')
    } else {
      setNameError(null)
    }
  }

  const addRouting = () =>
    setRouting((prev) => [...prev, { name: '', number: '', description: '' }])
  const removeRouting = (i: number) =>
    setRouting((prev) => prev.filter((_, idx) => idx !== i))
  const updateRouting = (i: number, field: keyof RoutingEntry, value: string) =>
    setRouting((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    )

  const addFaq = () => setFaqs((prev) => [...prev, { question: '', answer: '' }])
  const removeFaq = (i: number) =>
    setFaqs((prev) => prev.filter((_, idx) => idx !== i))
  const updateFaq = (i: number, field: keyof FAQ, value: string) =>
    setFaqs((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f))
    )

  const DAYS_NL: [string, string][] = [
    ['monday', 'Maandag'],
    ['tuesday', 'Dinsdag'],
    ['wednesday', 'Woensdag'],
    ['thursday', 'Donderdag'],
    ['friday', 'Vrijdag'],
    ['saturday', 'Zaterdag'],
    ['sunday', 'Zondag'],
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!configName) { setError('Config naam is vereist.'); return }
    if (!businessName) { setError('Bedrijfsnaam is vereist.'); return }
    if (nameError) return

    setSaving(true)

    const config = {
      business: { name: businessName, type: businessType, timezone },
      voice: { voice_id: voiceId, model: 'gpt-realtime' },
      greeting: greeting || `Goedemiddag, u spreekt met ${businessName}. Waarmee kan ik u helpen?`,
      personality,
      hours: {
        monday: hours.monday,
        tuesday: hours.tuesday,
        wednesday: hours.wednesday,
        thursday: hours.thursday,
        friday: hours.friday,
        saturday: hours.saturday,
        sunday: hours.sunday,
      },
      after_hours_message: afterHours,
      routing: routing.filter((r) => r.name && r.number),
      faqs: faqs.filter((f) => f.question && f.answer),
      messages: {
        delivery,
        ...(delivery === 'file'
          ? { file_path: `./messages/${configName}/` }
          : { webhook_url: webhookUrl }),
      },
    }

    const content = yaml.dump(config, { lineWidth: 120, quotingType: '"' })

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: configName, content }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push(`/dashboard/agents/${configName}`)
        router.refresh()
      } else {
        setError(data.error || 'Opslaan mislukt')
      }
    } catch {
      setError('Netwerkfout bij opslaan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Nieuw Agent"
        description="Maak een nieuwe AI receptionist configuratie aan"
        actions={
          <Link href="/dashboard/agents">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-4xl">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Config info */}
        <FormSection title="Configuratie">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Config naam (slug)"
              value={configName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="mijn-bedrijf"
              error={nameError || undefined}
              hint="Alleen kleine letters, cijfers en koppeltekens. Dit wordt de bestandsnaam."
              required
            />
            <Input
              label="Bedrijfsnaam"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Mijn Bedrijf B.V."
              required
            />
            <Input
              label="Bedrijfstype / Branche"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="tandartspraktijk, kapsalon, ..."
            />
            <Select
              label="Tijdzone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={TIMEZONE_OPTIONS}
            />
          </div>
        </FormSection>

        {/* Voice */}
        <FormSection title="Stem & Model">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Stem"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              options={VOICE_OPTIONS}
              hint="Kies de stem voor de AI receptionist"
            />
            <Input
              label="Model"
              value="gpt-realtime"
              disabled
              hint="OpenAI Realtime API model"
            />
          </div>
        </FormSection>

        {/* Personality */}
        <FormSection title="Begroeting en persoonlijkheid">
          <div className="space-y-4">
            <Input
              label="Begroeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder={`Goedemiddag, u spreekt met ${businessName || 'ons bedrijf'}. Waarmee kan ik u helpen?`}
            />
            <Textarea
              label="Persoonlijkheid / Instructies"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              rows={10}
              className="font-mono text-xs"
              hint="Gedetailleerde instructies voor de AI agent"
            />
            <Textarea
              label="Bericht buiten openingstijden"
              value={afterHours}
              onChange={(e) => setAfterHours(e.target.value)}
              rows={3}
            />
          </div>
        </FormSection>

        {/* Hours */}
        <FormSection title="Openingstijden">
          <div className="space-y-2">
            {DAYS_NL.map(([day, label]) => {
              const dayKey = day as keyof typeof hours
              const val = hours[dayKey]
              const isClosed = val === 'closed'
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-28 text-sm text-gray-300">{label}</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!isClosed}
                      onChange={(e) => {
                        setHours((prev) => ({
                          ...prev,
                          [dayKey]: e.target.checked
                            ? { open: '09:00', close: '17:00' }
                            : 'closed',
                        }))
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-xs text-gray-400">Open</span>
                  </label>
                  {!isClosed && typeof val === 'object' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={val.open}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [dayKey]: { ...(prev[dayKey] as { open: string; close: string }), open: e.target.value },
                          }))
                        }
                        className="bg-gray-800 border border-gray-700 rounded text-sm text-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-gray-500 text-sm">—</span>
                      <input
                        type="time"
                        value={val.close}
                        onChange={(e) =>
                          setHours((prev) => ({
                            ...prev,
                            [dayKey]: { ...(prev[dayKey] as { open: string; close: string }), close: e.target.value },
                          }))
                        }
                        className="bg-gray-800 border border-gray-700 rounded text-sm text-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {isClosed && (
                    <span className="text-xs text-gray-500 italic">Gesloten</span>
                  )}
                </div>
              )
            })}
          </div>
        </FormSection>

        {/* Routing */}
        <FormSection
          title="Doorverbinden"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addRouting}>
              <Plus className="h-3.5 w-3.5" />
              Toevoegen
            </Button>
          }
        >
          <div className="space-y-3">
            {routing.map((r, i) => (
              <div key={i} className="flex gap-3 items-start bg-gray-800 rounded-lg p-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Naam (bv. Sales)"
                    value={r.name}
                    onChange={(e) => updateRouting(i, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="+31612345678"
                    value={r.number}
                    onChange={(e) => updateRouting(i, 'number', e.target.value)}
                    type="tel"
                  />
                  <Input
                    placeholder="Beschrijving"
                    value={r.description}
                    onChange={(e) => updateRouting(i, 'description', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRouting(i)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {routing.length === 0 && (
              <p className="text-sm text-gray-500">Geen routeringsopties. Klik op toevoegen.</p>
            )}
          </div>
        </FormSection>

        {/* FAQs */}
        <FormSection
          title="Veelgestelde vragen (FAQ)"
          action={
            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
              <Plus className="h-3.5 w-3.5" />
              Toevoegen
            </Button>
          }
        >
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">FAQ #{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFaq(i)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  placeholder="Wat zijn uw openingstijden?"
                  value={faq.question}
                  onChange={(e) => updateFaq(i, 'question', e.target.value)}
                />
                <Textarea
                  placeholder="Wij zijn open van maandag t/m vrijdag..."
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
            {faqs.length === 0 && (
              <p className="text-sm text-gray-500">Geen FAQ items. Klik op toevoegen.</p>
            )}
          </div>
        </FormSection>

        {/* Delivery */}
        <FormSection title="Berichten opslaan">
          <div className="space-y-4">
            <Select
              label="Bezorging"
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              options={DELIVERY_OPTIONS}
            />
            {delivery === 'webhook' && (
              <Input
                label="Webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                type="url"
              />
            )}
          </div>
        </FormSection>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/dashboard/agents">
            <Button type="button" variant="outline">
              Annuleren
            </Button>
          </Link>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" />
            Agent aanmaken
          </Button>
        </div>
      </form>
    </div>
  )
}

function FormSection({
  title,
  children,
  action,
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}
