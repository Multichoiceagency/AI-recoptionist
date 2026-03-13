import { NextRequest, NextResponse } from 'next/server'
import yaml from 'js-yaml'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || 'Multichoiceagency/AI-recoptionist'
const CONFIG_PATH = 'config/businesses'

async function getFileData(name: string) {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_PATH}/${name}.yaml`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    }
  )
  return res
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Configureer GITHUB_TOKEN in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  const { name } = params
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    return NextResponse.json({ error: 'Ongeldige agent naam.' }, { status: 400 })
  }

  try {
    const res = await getFileData(name)
    if (res.status === 404) {
      return NextResponse.json({ error: 'Agent niet gevonden.' }, { status: 404 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: `GitHub API fout: ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8')
    const parsed = yaml.load(decoded)

    return NextResponse.json({ name, sha: data.sha, raw: decoded, parsed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Configureer GITHUB_TOKEN in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  const { name } = params
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    return NextResponse.json({ error: 'Ongeldige agent naam.' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { content, sha } = body as { content: string; sha: string }

    if (!content) {
      return NextResponse.json({ error: 'Inhoud is vereist.' }, { status: 400 })
    }

    // Validate YAML
    try {
      yaml.load(content)
    } catch {
      return NextResponse.json({ error: 'Ongeldige YAML inhoud.' }, { status: 400 })
    }

    // Get current SHA if not provided
    let fileSha = sha
    if (!fileSha) {
      const checkRes = await getFileData(name)
      if (checkRes.ok) {
        const existing = await checkRes.json()
        fileSha = existing.sha
      }
    }

    const encoded = Buffer.from(content, 'utf-8').toString('base64')
    const payload: Record<string, unknown> = {
      message: `feat: update agent config ${name}`,
      content: encoded,
    }
    if (fileSha) payload.sha = fileSha

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_PATH}/${name}.yaml`,
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

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'Configureer GITHUB_TOKEN in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  const { name } = params
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    return NextResponse.json({ error: 'Ongeldige agent naam.' }, { status: 400 })
  }

  try {
    // Get SHA first
    const checkRes = await getFileData(name)
    if (checkRes.status === 404) {
      return NextResponse.json({ error: 'Agent niet gevonden.' }, { status: 404 })
    }
    if (!checkRes.ok) {
      return NextResponse.json({ error: `GitHub API fout: ${checkRes.status}` }, { status: checkRes.status })
    }
    const existing = await checkRes.json()

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_PATH}/${name}.yaml`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `chore: remove agent config ${name}`,
          sha: existing.sha,
        }),
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json(
        { error: `GitHub API fout: ${res.status} — ${msg}` },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
