import { Phone, PhoneCall, PhoneIncoming, Server, AlertTriangle, Check, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatsCard } from '@/components/stats-card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

async function getLiveKitData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
  
  try {
    const [statusRes, trunksRes, rulesRes, participantsRes] = await Promise.all([
      fetch(`${baseUrl}/api/livekit/status`, { next: { revalidate: 30 } }),
      fetch(`${baseUrl}/api/livekit/trunks`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/livekit/dispatch-rules`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/livekit/participants`, { next: { revalidate: 10 } }),
    ])

    const status = statusRes.ok ? await statusRes.json() : null
    const trunks = trunksRes.ok ? await trunksRes.json() : { trunks: [], error: 'Failed to fetch' }
    const rules = rulesRes.ok ? await rulesRes.json() : { rules: [], error: 'Failed to fetch' }
    const participants = participantsRes.ok ? await participantsRes.json() : { participants: [], error: 'Failed to fetch' }

    return { status, trunks, rules, participants }
  } catch {
    return { 
      status: null, 
      trunks: { trunks: [], error: 'Network error' }, 
      rules: { rules: [], error: 'Network error' },
      participants: { participants: [], error: 'Network error' }
    }
  }
}

export default async function TelephonyPage() {
  const { status, trunks, rules, participants } = await getLiveKitData()
  
  const isConfigured = status?.configured === true
  const isConnected = status?.connected === true
  const livekitUrl = status?.url || process.env.LIVEKIT_URL || '—'

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Telefonie"
        description="LiveKit SIP trunks en actieve gesprekken"
        actions={
          <a
            href="https://cloud.livekit.io/projects/p_25s652kqyiw/telephony/trunks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            LiveKit Cloud Openen
            <ExternalLink className="h-4 w-4" />
          </a>
        }
      />

      <div className="p-6 space-y-6">
        {/* Connection Status */}
        {!isConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-300">LiveKit niet geconfigureerd</p>
              <p className="text-xs text-yellow-400/70 mt-1">
                Configureer LIVEKIT_URL, LIVEKIT_API_KEY en LIVEKIT_API_SECRET in uw .env bestand.
              </p>
            </div>
          </div>
        )}

        {isConfigured && !isConnected && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">Kan geen verbinding maken met LiveKit</p>
              <p className="text-xs text-red-400/70 mt-1">
                {status?.error || 'Controleer uw credentials en netwerk verbinding.'}
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Verbinding Status"
            value={isConnected ? 'Verbonden' : isConfigured ? 'Fout' : 'Niet geconfigureerd'}
            description={livekitUrl}
            icon={Server}
            iconClassName={isConnected ? 'bg-green-500/10' : 'bg-red-500/10'}
          />
          <StatsCard
            title="SIP Trunks"
            value={trunks.count ?? trunks.trunks?.length ?? 0}
            description="Geconfigureerde telefoonlijnen"
            icon={Phone}
            iconClassName="bg-blue-500/10"
          />
          <StatsCard
            title="Dispatch Rules"
            value={rules.count ?? rules.rules?.length ?? 0}
            description="Actieve routeringsregels"
            icon={PhoneIncoming}
            iconClassName="bg-purple-500/10"
          />
          <StatsCard
            title="Actieve Gesprekken"
            value={participants.count ?? participants.participants?.length ?? 0}
            description={`In ${participants.rooms ?? 0} kamers`}
            icon={PhoneCall}
            iconClassName="bg-green-500/10"
          />
        </div>

        {/* SIP Trunks Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div>
              <h2 className="font-semibold text-white">SIP Trunks</h2>
              <p className="text-xs text-gray-500 mt-1">Geconfigureerde telefoonlijnen in LiveKit</p>
            </div>
            <a
              href="https://cloud.livekit.io/projects/p_25s652kqyiw/telephony/trunks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              Beheren in LiveKit
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {trunks.error && !trunks.trunks?.length ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 text-sm">{trunks.error}</p>
              <p className="text-gray-600 text-xs mt-2">
                Configureer SIP trunks in de LiveKit Cloud Console
              </p>
            </div>
          ) : trunks.trunks?.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Phone className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">Geen SIP trunks gevonden</p>
              <p className="text-gray-500 text-xs mt-1">
                Maak een trunk aan in de LiveKit Cloud Console om te beginnen
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Naam / ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Nummer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Transport</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {trunks.trunks?.map((trunk: any) => (
                  <tr key={trunk.sipTrunkId || trunk.sip_trunk_id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <span className="font-medium text-white">{trunk.name || 'Unnamed Trunk'}</span>
                        <p className="text-xs text-gray-500 font-mono">{trunk.sipTrunkId || trunk.sip_trunk_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden md:table-cell font-mono">
                      {trunk.numbers?.join(', ') || trunk.inboundNumbersRegex || '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {trunk.transport || 'UDP'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant="success">
                        <Check className="h-3 w-3 mr-1" />
                        Actief
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Dispatch Rules Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div>
              <h2 className="font-semibold text-white">Dispatch Rules</h2>
              <p className="text-xs text-gray-500 mt-1">Routeringsregels voor inkomende gesprekken</p>
            </div>
          </div>

          {rules.error && !rules.rules?.length ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 text-sm">{rules.error}</p>
            </div>
          ) : rules.rules?.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <PhoneIncoming className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">Geen dispatch rules gevonden</p>
              <p className="text-gray-500 text-xs mt-1">
                Maak routeringsregels aan om gesprekken naar de juiste agent te sturen
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Regel ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Trunk ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Room</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {rules.rules?.map((rule: any) => (
                  <tr key={rule.sipDispatchRuleId || rule.sip_dispatch_rule_id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <span className="text-xs text-gray-300 font-mono">
                        {rule.sipDispatchRuleId || rule.sip_dispatch_rule_id}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden md:table-cell font-mono">
                      {rule.trunkIds?.join(', ') || rule.trunk_ids?.join(', ') || '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {rule.rule?.dispatchRuleDirect?.roomName || 
                       rule.rule?.dispatchRuleIndividual?.roomPrefix ||
                       rule.rule?.dispatch_rule_direct?.room_name ||
                       rule.rule?.dispatch_rule_individual?.room_prefix ||
                       '—'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant="success">Actief</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Active Participants */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div>
              <h2 className="font-semibold text-white">Actieve Gesprekken</h2>
              <p className="text-xs text-gray-500 mt-1">Huidige deelnemers in gesprekken</p>
            </div>
          </div>

          {participants.error && !participants.participants?.length ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 text-sm">{participants.error}</p>
            </div>
          ) : participants.participants?.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <PhoneCall className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">Geen actieve gesprekken</p>
              <p className="text-gray-500 text-xs mt-1">
                Wacht op inkomende oproepen
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Deelnemer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Kamer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {participants.participants?.map((participant: any, index: number) => (
                  <tr key={participant.sid || index} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <span className="font-medium text-white">{participant.identity || 'Unknown'}</span>
                        <p className="text-xs text-gray-500 font-mono">{participant.sid}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {participant.roomName || '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {participant.kind === 'SIP' || participant.kind === 1 ? 'SIP' : 
                       participant.kind === 'AGENT' || participant.kind === 2 ? 'Agent' : 
                       'Standaard'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={participant.state === 'ACTIVE' || participant.state === 1 ? 'success' : 'secondary'}>
                        {participant.state === 'ACTIVE' || participant.state === 1 ? 'Actief' : 'Verbinden...'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Snelle Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLink
              href="https://cloud.livekit.io/projects/p_25s652kqyiw/telephony/trunks"
              label="SIP Trunks"
              description="Beheer telefoonlijnen"
            />
            <QuickLink
              href="https://cloud.livekit.io/projects/p_25s652kqyiw/telephony/dispatch"
              label="Dispatch Rules"
              description="Routeringsregels"
            />
            <QuickLink
              href="https://cloud.livekit.io/projects/p_25s652kqyiw/telephony/numbers"
              label="Phone Numbers"
              description="Telefoonnummers"
            />
            <QuickLink
              href="https://cloud.livekit.io/projects/p_25s652kqyiw/settings"
              label="Project Settings"
              description="LiveKit instellingen"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickLink({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
    >
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
    </a>
  )
}
