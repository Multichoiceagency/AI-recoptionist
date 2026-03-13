'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Star,
  Rocket,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Code2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
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

interface AgentEditorProps {
  name: string
  initialData: {
    raw: string
    sha: string
    parsed: Record<string, unknown>
  }
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

type TabType = 'form' | 'yaml'

export function AgentEditor({ name, initialData }: AgentEditorProps) {
  const router = useRouter()
  const parsed = initialData.parsed as Record<string, unknown>

  const business = ((parsed?.business ?? {}) as Record<string, string>)
  const voice = ((parsed?.voice ?? {}) as Record<string, string>)
  const hours = ((parsed?.hours ?? {}) as Record<string, unknown>)
  const routing = ((parsed?.routing ?? []) as unknown as RoutingEntry[])
  const faqs = ((parsed?.faqs ?? []) as unknown as FAQ[])

  const [tab, setTab] = useState<TabType>('form')
  const [rawYaml, setRawYaml] = useState(initialData.raw)
  const [sha, setSha] = useState(initialData.sha)

  // Form state
  const [businessName, setBusinessName] = useState(business.name || '')
  const [businessType, setBusinessType] = useState(business.type || '')
  const [timezone, setTimezone] = useState(business.timezone || 'Europe/Amsterdam')
  const [voiceId, setVoiceId] = useState(voice.voice_id || 'coral')
  const [greeting, setGreeting] = useState(((parsed?.greeting ?? '') as string))
  const [personality, setPersonality] = useState(((parsed?.personality ?? '') as string))
  const [afterHours, setAfterHours] = useState(((parsed?.after_hours_message ?? '') as string))
  const [routingEntries, setRoutingEntries] = useState<RoutingEntry[]>(routing)
  const [faqEntries, setFaqEntries] = useState<FAQ[]>(faqs)

  const [saving, setSaving] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [settingDefault, setSettingDefault] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [yamlError, setYamlError] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const buildYaml = useCallback((): string => {
    const config: Record<string, unknown> = {
      business: {
        name: businessName,
        type: businessType,
        timezone,
      },
      voice: {
        voice_id: voiceId,
        model: 'gpt-realtime',
      },
      greeting,
      personality,
      hours,
      after_hours_message: afterHours,
      routing: routingEntries,
      faqs: faqEntries,
    }
    // Preserve messages config if it exists
    if (parsed?.messages) config.messages = parsed.messages
    return yaml.dump(config, { lineWidth: 120, quotingType: '"' })
  }, [businessName, businessType, timezone, voiceId, greeting, personality, afterHours, routingEntries, faqEntries, hours, parsed])

  const handleSave = async () => {
    setSaving(true)
    try {
      const content = tab === 'yaml' ? rawYaml : buildYaml()

      // Validate YAML
      try {
        yaml.load(content)
        setYamlError(null)
      } catch (e) {
        setYamlError(`Ongeldige YAML: ${e instanceof Error ? e.message : 'Fout'}`)
        setSaving(false)
        return
      }

      const res = await fetch(`/api/agents/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sha }),
      })

      const data = await res.json()
      if (res.ok) {
        showMsg('Agent opgeslagen!', 'success')
        // Refresh SHA
        const freshRes = await fetch(`/api/agents/${name}`)
        if (freshRes.ok) {
          const fresh = await freshRes.json()
          setSha(fresh.sha)
          if (tab === 'yaml') setRawYaml(fresh.raw)
        }
      } else {
        showMsg(data.error || 'Opslaan mislukt', 'error')
      }
    } catch {
      showMsg('Netwerkfout bij opslaan', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSetDefault = async () => {
    setSettingDefault(true)
    try {
      const res = await fetch('/api/coolify/default', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: name }),
      })
      const data = await res.json()
      if (res.ok) {
        showMsg(`"${name}" is nu de standaard agent!`, 'success')
      } else {
        showMsg(data.error || 'Mislukt', 'error')
      }
    } catch {
      showMsg('Netwerkfout', 'error')
    } finally {
      setSettingDefault(false)
    }
  }

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      const res = await fetch('/api/coolify/deploy', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        showMsg('Deployment gestart!', 'success')
      } else {
        showMsg(data.error || 'Deploy mislukt', 'error')
      }
    } catch {
      showMsg('Netwerkfout', 'error')
    } finally {
      setDeploying(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/agents/${name}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/agents')
        router.refresh()
      } else {
        const data = await res.json()
        showMsg(data.error || 'Verwijderen mislukt', 'error')
        setDeleteOpen(false)
      }
    } catch {
      showMsg('Netwerkfout', 'error')
      setDeleteOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const addRouting = () =>
    setRoutingEntries((prev) => [...prev, { name: '', number: '', description: '' }])
  const removeRouting = (i: number) =>
    setRoutingEntries((prev) => prev.filter((_, idx) => idx !== i))
  const updateRouting = (i: number, field: keyof RoutingEntry, value: string) =>
    setRoutingEntries((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    )

  const addFaq = () =>
    setFaqEntries((prev) => [...prev, { question: '', answer: '' }])
  const removeFaq = (i: number) =>
    setFaqEntries((prev) => prev.filter((_, idx) => idx !== i))
  const updateFaq = (i: number, field: keyof FAQ, value: string) =>
    setFaqEntries((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f))
    )

  return (
    <div className="min-h-screen">
      <PageHeader
        title={businessName || name}
        description={`Agent configuratie — ${name}.yaml`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/agents">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Terug
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              loading={settingDefault}
            >
              <Star className="h-3.5 w-3.5" />
              Als standaard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeploy}
              loading={deploying}
            >
              <Rocket className="h-3.5 w-3.5" />
              Deploy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" />
              Opslaan
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-5">
        {/* Message */}
        {message && (
          <div
            className={`px-4 py-3 rounded-xl text-sm border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {yamlError && (
          <div className="px-4 py-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
            {yamlError}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab('form')}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
              tab === 'form'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Formulier
          </button>
          <button
            onClick={() => {
              if (tab === 'form') setRawYaml(buildYaml())
              setTab('yaml')
            }}
            className={`px-4 py-1.5 text-sm rounded-md font-medium flex items-center gap-1.5 transition-colors ${
              tab === 'yaml'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            YAML Editor
          </button>
        </div>

        {tab === 'yaml' ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3">
              Bewerk de raw YAML configuratie. Zorg dat de YAML geldig is voor het opslaan.
            </p>
            <textarea
              value={rawYaml}
              onChange={(e) => setRawYaml(e.target.value)}
              className="w-full font-mono text-xs bg-gray-800 border border-gray-700 rounded-lg p-4 text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={40}
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Business Info */}
            <Section title="Bedrijfsinformatie">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bedrijfsnaam"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Mijn Bedrijf B.V."
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
                  options={[
                    { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam' },
                    { value: 'Europe/Brussels', label: 'Europe/Brussels' },
                    { value: 'Europe/London', label: 'Europe/London' },
                    { value: 'UTC', label: 'UTC' },
                  ]}
                />
                <Select
                  label="Stem"
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  options={VOICE_OPTIONS}
                />
              </div>
            </Section>

            {/* Greeting & Personality */}
            <Section title="Begroeting en persoonlijkheid">
              <div className="space-y-4">
                <Input
                  label="Begroeting"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder="Goedemiddag, u spreekt met..."
                />
                <Textarea
                  label="Persoonlijkheid / Instructies"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  rows={12}
                  className="font-mono text-xs"
                />
                <Textarea
                  label="Bericht buiten openingstijden"
                  value={afterHours}
                  onChange={(e) => setAfterHours(e.target.value)}
                  rows={4}
                />
              </div>
            </Section>

            {/* Routing */}
            <Section
              title="Doorverbinden"
              action={
                <Button variant="outline" size="sm" onClick={addRouting}>
                  <Plus className="h-3.5 w-3.5" />
                  Toevoegen
                </Button>
              }
            >
              <div className="space-y-3">
                {routingEntries.length === 0 && (
                  <p className="text-sm text-gray-500">Geen routeringsopties geconfigureerd.</p>
                )}
                {routingEntries.map((r, i) => (
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
                      />
                      <Input
                        placeholder="Beschrijving"
                        value={r.description}
                        onChange={(e) => updateRouting(i, 'description', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRouting(i)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Section>

            {/* FAQs */}
            <Section
              title={`FAQ's (${faqEntries.length})`}
              action={
                <Button variant="outline" size="sm" onClick={addFaq}>
                  <Plus className="h-3.5 w-3.5" />
                  Toevoegen
                </Button>
              }
            >
              <div className="space-y-2">
                {faqEntries.length === 0 && (
                  <p className="text-sm text-gray-500">Geen FAQ items geconfigureerd.</p>
                )}
                {faqEntries.map((faq, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 truncate">
                          {faq.question || `FAQ #${i + 1}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedFaq === i ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFaq(i)
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
                        <Input
                          label="Vraag"
                          value={faq.question}
                          onChange={(e) => updateFaq(i, 'question', e.target.value)}
                          placeholder="Wat zijn uw openingstijden?"
                          className="mt-3"
                        />
                        <Textarea
                          label="Antwoord"
                          value={faq.answer}
                          onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                          rows={3}
                          placeholder="Wij zijn open van..."
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>

      {/* Delete dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Agent verwijderen"
        description={`Weet je zeker dat je "${name}" permanent wilt verwijderen? Dit verwijdert het YAML bestand uit GitHub.`}
      >
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>
            Annuleren
          </Button>
          <Button
            variant="destructive"
            loading={deleting}
            onClick={handleDelete}
          >
            Definitief verwijderen
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function Section({
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
