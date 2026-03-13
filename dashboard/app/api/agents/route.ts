import { NextRequest, NextResponse } from 'next/server'
import yaml from 'js-yaml'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || 'Multichoiceagency/AI-recoptionist'
const CONFIG_PATH = 'config/businesses'

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Configureer GITHUB_TOKEN in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json(
        { error: `GitHub API fout: ${res.status} — ${msg}` },
        { status: res.status }
      )
    }

    const files = await res.json()
    const yamlFiles = (files as Array<{ name: string; sha: string; download_url: string }>)
      .filter((f) => f.name.endsWith('.yaml') || f.name.endsWith('.yml'))

    const agents = await Promise.all(
      yamlFiles.map(async (file) => {
        try {
          const contentRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_PATH}/${file.name}`,
            {
              headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json',
              },
              next: { revalidate: 300 },
            }
          )
          if (!contentRes.ok) return null
          const contentData = await contentRes.json()
          const decoded = Buffer.from(contentData.content, 'base64').toString('utf-8')
          const parsed = yaml.load(decoded) as Record<string, unknown>

          const business = (parsed?.business as Record<string, string>) || {}
          const voice = (parsed?.voice as Record<string, string>) || {}

          return {
            name: file.name.replace(/\.ya?ml$/, ''),
            sha: contentData.sha,
            businessName: business.name || file.name.replace(/\.ya?ml$/, ''),
            businessType: business.type || '',
            timezone: business.timezone || 'Europe/Amsterdam',
            voice: voice.voice_id || 'coral',
            model: voice.model || 'gpt-realtime',
            active: true,
          }
        } catch {
          return null
        }
      })
    )

    return NextResponse.json(agents.filter(Boolean))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Configureer GITHUB_TOKEN in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { name, content } = body as { name: string; content: string }

    if (!name || !content) {
      return NextResponse.json({ error: 'Naam en inhoud zijn vereist.' }, { status: 400 })
    }

    // Validate name: only letters, numbers, and dashes
    if (!/^[a-zA-Z0-9-]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Naam mag alleen letters, cijfers en koppeltekens bevatten.' },
        { status: 400 }
      )
    }

    const encoded = Buffer.from(content, 'utf-8').toString('base64')
    const filePath = `${CONFIG_PATH}/${name}.yaml`

    // Check if file already exists (to get SHA for update)
    let existingSha: string | undefined
    const checkRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )
    if (checkRes.ok) {
      const existing = await checkRes.json()
      existingSha = existing.sha
    }

    const payload: Record<string, unknown> = {
      message: `feat: add agent config ${name}`,
      content: encoded,
    }
    if (existingSha) payload.sha = existingSha

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json(
        { error: `GitHub API fout: ${res.status} — ${msg}` },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, name })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
