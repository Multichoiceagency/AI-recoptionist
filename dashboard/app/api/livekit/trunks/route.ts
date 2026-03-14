import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

export async function GET() {
  const livekitUrl = process.env.LIVEKIT_URL
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!livekitUrl || !apiKey || !apiSecret) {
    return NextResponse.json({
      error: 'LiveKit credentials not configured',
      trunks: [],
    }, { status: 400 })
  }

  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: 'dashboard-admin',
      ttl: 300,
    })
    token.addGrant({ 
      roomList: true,
      roomAdmin: true,
    })
    const jwt = await token.toJwt()

    const httpUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://')
    
    const res = await fetch(`${httpUrl}/twirp/livekit.SIP/ListSIPTrunkResource`, {
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
        trunks: data.items || [],
        count: data.items?.length || 0,
      })
    } else {
      const errorText = await res.text()
      return NextResponse.json({
        error: `Failed to fetch trunks: ${res.status}`,
        details: errorText,
        trunks: [],
      }, { status: res.status })
    }
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed to connect to LiveKit',
      trunks: [],
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const livekitUrl = process.env.LIVEKIT_URL
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!livekitUrl || !apiKey || !apiSecret) {
    return NextResponse.json({
      error: 'LiveKit credentials not configured',
    }, { status: 400 })
  }

  try {
    const body = await request.json()
    
    const token = new AccessToken(apiKey, apiSecret, {
      identity: 'dashboard-admin',
      ttl: 300,
    })
    token.addGrant({ 
      roomAdmin: true,
    })
    const jwt = await token.toJwt()

    const httpUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://')
    
    const res = await fetch(`${httpUrl}/twirp/livekit.SIP/CreateSIPTrunk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    } else {
      const errorText = await res.text()
      return NextResponse.json({
        error: `Failed to create trunk: ${res.status}`,
        details: errorText,
      }, { status: res.status })
    }
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed to create trunk',
    }, { status: 500 })
  }
}
