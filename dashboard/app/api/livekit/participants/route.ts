import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

export async function GET() {
  const livekitUrl = process.env.LIVEKIT_URL
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!livekitUrl || !apiKey || !apiSecret) {
    return NextResponse.json({
      error: 'LiveKit credentials not configured',
      participants: [],
    }, { status: 400 })
  }

  try {
    const token = new AccessToken(apiKey, apiSecret, {
      identity: 'dashboard-admin',
      ttl: 300,
    })
    token.addGrant({ roomList: true })
    const jwt = await token.toJwt()

    const httpUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://')
    
    const roomsRes = await fetch(`${httpUrl}/twirp/livekit.RoomService/ListRooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({}),
    })

    if (!roomsRes.ok) {
      return NextResponse.json({
        error: 'Failed to fetch rooms',
        participants: [],
      }, { status: roomsRes.status })
    }

    const roomsData = await roomsRes.json()
    const rooms = roomsData.rooms || []

    const allParticipants: any[] = []
    
    for (const room of rooms) {
      const participantsRes = await fetch(`${httpUrl}/twirp/livekit.RoomService/ListParticipants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({ room: room.name }),
      })

      if (participantsRes.ok) {
        const participantsData = await participantsRes.json()
        const participants = participantsData.participants || []
        participants.forEach((p: any) => {
          allParticipants.push({
            ...p,
            roomName: room.name,
          })
        })
      }
    }

    return NextResponse.json({
      participants: allParticipants,
      count: allParticipants.length,
      rooms: rooms.length,
    })
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Failed to connect to LiveKit',
      participants: [],
    }, { status: 500 })
  }
}
