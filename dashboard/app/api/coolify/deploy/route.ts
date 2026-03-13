import { NextResponse } from 'next/server'

const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN
const COOLIFY_APP_UUID = process.env.COOLIFY_APP_UUID
const COOLIFY_URL = process.env.COOLIFY_URL || 'https://coolify.barosy.nl'

export async function POST() {
  if (!COOLIFY_API_TOKEN || !COOLIFY_APP_UUID) {
    return NextResponse.json(
      { error: 'Configureer COOLIFY_API_TOKEN en COOLIFY_APP_UUID in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  try {
    const res = await fetch(
      `${COOLIFY_URL}/api/v1/deploy?uuid=${COOLIFY_APP_UUID}&force=false`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
          Accept: 'application/json',
        },
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      return NextResponse.json(
        { error: `Coolify deploy fout: ${res.status} — ${msg}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({
      success: true,
      deploymentUuid: data.deployment_uuid || data.uuid || 'unknown',
      message: data.message || 'Deployment gestart.',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
