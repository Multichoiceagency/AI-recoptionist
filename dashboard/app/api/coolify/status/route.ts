import { NextResponse } from 'next/server'

const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN
const COOLIFY_APP_UUID = process.env.COOLIFY_APP_UUID
const COOLIFY_URL = process.env.COOLIFY_URL || 'https://coolify.barosy.nl'

export async function GET() {
  if (!COOLIFY_API_TOKEN || !COOLIFY_APP_UUID) {
    return NextResponse.json(
      {
        configured: false,
        error: 'Configureer COOLIFY_API_TOKEN en COOLIFY_APP_UUID in .env om dit te activeren.',
      },
      { status: 200 }
    )
  }

  try {
    const [appRes, envRes] = await Promise.all([
      fetch(`${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}`, {
        headers: {
          Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
          Accept: 'application/json',
        },
        next: { revalidate: 30 },
      }),
      fetch(`${COOLIFY_URL}/api/v1/applications/${COOLIFY_APP_UUID}/envs`, {
        headers: {
          Authorization: `Bearer ${COOLIFY_API_TOKEN}`,
          Accept: 'application/json',
        },
        next: { revalidate: 30 },
      }),
    ])

    let appStatus = 'unknown'
    let lastDeployment: string | null = null
    let appName: string | null = null

    if (appRes.ok) {
      const appData = await appRes.json()
      appStatus = appData.status || appData.deployment_status || 'unknown'
      lastDeployment = appData.last_deployment_uuid || appData.deployment_uuid || null
      appName = appData.name || null
    }

    let defaultConfig: string | null = null
    let allEnvVars: Array<{ key: string; value: string }> = []

    if (envRes.ok) {
      const envData = await envRes.json()
      const vars = Array.isArray(envData) ? envData : envData.data || []
      allEnvVars = vars.map((v: { key: string; value: string }) => ({
        key: v.key,
        value: v.value,
      }))
      const dcVar = vars.find((v: { key: string }) => v.key === 'DEFAULT_CONFIG')
      defaultConfig = dcVar?.value || null
    }

    return NextResponse.json({
      configured: true,
      appName,
      appStatus,
      lastDeployment,
      defaultConfig,
      envVars: allEnvVars,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ configured: false, error: message }, { status: 500 })
  }
}
