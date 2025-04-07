import env from '@/env'
import { z } from 'zod'

const tokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
})

let accessToken: string | null = null
let expirationTime: number | null = null

export const getToken = async (): Promise<string> => {
  if (accessToken && expirationTime && Date.now() < expirationTime) {
    return accessToken
  }

  const url = new URL('https://id.twitch.tv/oauth2/token')
  const params = new URLSearchParams({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: env.REFRESH_TOKEN,
  })
  url.search = params.toString()

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to retrieve token: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const validatedResponse = tokenResponseSchema.safeParse(data)

  if (!validatedResponse.success) {
    throw new Error('Failed to validate token response:', validatedResponse.error)
  }

  accessToken = validatedResponse.data.access_token
  expirationTime = Date.now() + validatedResponse.data.expires_in * 1000

  return accessToken
}
