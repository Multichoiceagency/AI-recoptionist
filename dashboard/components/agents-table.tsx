'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Search, ExternalLink, Pencil, Star, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export interface AgentRow {
  name: string
  businessName: string
  businessType: string
  city?: string
  voice?: string
  active: boolean
}

interface AgentsTableProps {
  agents: AgentRow[]
  currentDefault?: string
}

const PAGE_SIZE = 15

export function AgentsTable({ agents, currentDefault }: AgentsTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState<string | null>(null)
  const [settingDefault, setSettingDefault] = useState<string | null>(null)
  const [defaultMsg, setDefaultMsg] = useState<string | null>(null)

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.businessName.toLowerCase().includes(search.toLowerCase()) ||
      a.businessType.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleSetDefault = async (name: string) => {
    setSettingDefault(name)
    setDefaultMsg(null)
    try {
      const res = await fetch('/api/coolify/default', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: name }),
      })
      if (res.ok) {
        setDefaultMsg(`"${name}" is nu de standaard agent.`)
        router.refresh()
      } else {
        const data = await res.json()
        setDefaultMsg(`Fout: ${data.error || 'Onbekende fout'}`)
      }
    } catch {
      setDefaultMsg('Netwerkfout bij het instellen van standaard.')
    } finally {
      setSettingDefault(null)
    }
  }

  const handleDelete = async (name: string) => {
    setDeletingName(name)
    try {
      const res = await fetch(`/api/agents/${name}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(`Verwijderen mislukt: ${data.error || 'Onbekende fout'}`)
      }
    } catch {
      alert('Netwerkfout bij verwijderen.')
    } finally {
      setDeletingName(null)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Zoek op naam, bedrijf of type..."
          className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {defaultMsg && (
        <div className="text-sm px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
          {defaultMsg}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Naam</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Branche</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Stem</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  Geen agents gevonden
                </td>
              </tr>
            ) : (
              paginated.map((agent) => (
                <tr
                  key={agent.name}
                  className="bg-gray-900 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <Link
                          href={`/agents/${agent.name}`}
                          className="font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {agent.businessName || agent.name}
                        </Link>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{agent.name}</p>
                      </div>
                      {currentDefault === agent.name && (
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{agent.businessType || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                    {agent.voice || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={agent.active ? 'success' : 'secondary'}>
                      {agent.active ? 'Actief' : 'Inactief'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/agents/${agent.name}`}>
                        <Button variant="ghost" size="icon" title="Bekijk">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/agents/${agent.name}`}>
                        <Button variant="ghost" size="icon" title="Bewerk">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Als standaard instellen"
                        loading={settingDefault === agent.name}
                        onClick={() => handleSetDefault(agent.name)}
                        className={currentDefault === agent.name ? 'text-yellow-400' : ''}
                      >
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Verwijderen"
                        onClick={() => setDeleteTarget(agent.name)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{filtered.length} agents gevonden</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Agent verwijderen"
        description={`Weet je zeker dat je "${deleteTarget}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
      >
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Annuleren
          </Button>
          <Button
            variant="destructive"
            loading={deletingName === deleteTarget}
            onClick={() => deleteTarget && handleDelete(deleteTarget)}
          >
            Verwijderen
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
