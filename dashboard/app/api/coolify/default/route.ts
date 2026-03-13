import { NextRequest, NextResponse } from 'next/server'

const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN
const COOLIFY_APP_UUID = process.env.COOLIFY_APP_UUID
const COOLIFY_URL = process.env.COOLIFY_URL || 'https://coolify.barosy.nl'

export async function PATCH(req: NextRequest) {
  if (!COOLIFY_API_TOKEN || !COOLIFY_APP_UUID) {
    return NextResponse.json(
      { error: 'Configureer COOLIFY_API_TOKEN en COOLIFY_APP_UUID in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { value } = body as { value: string }

    if (!value || !/^[a-zA-Z0-9-]+$/.test(value)) {
      return NextResponse.json({ error: 'Ongeldige waarde voor standaard agent.' }, { status: 400 })
    }

    // First, get current env vars to find the UUID of DEFAULT_CONFIG
    const envRes = await fetch(
      `${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}/envs`,
      {
        headers: {
          Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
          Accept: 'application/json',
        },
      }
    )

    if (!envRes.ok) {
      const msg = await envRes.text()
      return NextResponse.json(
        { error: `Coolify API fout bij ophalen envs: ${envRes.status} — ${msg}` },
        { status: envRes.status }
      )
    }

    const envData = await envRes.json()
    const envVars = Array.isArray(envData) ? envData : envData.data || []
    const defaultConfigVar = envVars.find(
      (v: { key: string }) => v.key === 'DEFAULT_CONFIG'
    )

    // Build the bulk update payload
    const envEntry: Record<string, unknown> = {
      key: 'DEFAULT_CONFIG',
      value,
      is_preview: false,
    }
    if (defaultConfigVar?.uuid) {
      envEntry.uuid = defaultConfigVar.uuid
    }

    const res = await fetch(
      `${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}/envs/bulk`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [envEntry] }),
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json(
        { error: `Coolify API fout: ${res.status} — ${msg}` },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true, value })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
