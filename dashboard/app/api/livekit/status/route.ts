import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

export async function GET() {
  const livekitUrl = process.env.LIVEKIT_URL
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!livekitUrl || !apiKey || !apiSecret) {
    return NextResponse.json({
      configured: false,
      error: 'LiveKit credentials not configured',
    })
  }

  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: 'dashboard-status-check',
      ttl: 60,
    })
    token.addGrant({ roomList: true })
    const jwt = await token.toJwt()

    const httpUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://')
    const res = await fetch(`${httpUrl}/twirp/livekit.RoomService/ListRooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({}),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({
        configured: true,
        connected: true,
        url: livekitUrl,
        activeRooms: data.rooms?.length || 0,
      })
    } else {
      return NextResponse.json({
        configured: true,
        connected: false,
        error: `HTTP ${res.status}`,
      })
    }
  } catch (err) {
    return NextResponse.json({
      configured: true,
      connected: false,
      error: err instanceof Error ? err.message : 'Connection failed',
    })
  }
}
