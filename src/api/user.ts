import env from '@/env'
import { z } from 'zod'
import { getToken } from './token'

const userSchema = z.object({
  id: z.string(),
  login: z.string(),
  display_name: z.string(),
  type: z.string(),
  broadcaster_type: z.string(),
  description: z.string(),
  profile_image_url: z.string(),
  offline_image_url: z.string(),
  view_count: z.number(),
  created_at: z.string(),
})

const userResponseSchema = z.object({
  data: z.array(userSchema),
})

export type User = z.infer<typeof userSchema>

export const getUserId = async (): Promise<string> => {
  const token = await getToken()

  const url = new URL('https://api.twitch.tv/helix/users')

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': env.CLIENT_ID,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to retrieve user: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  const validatedResponse = userResponseSchema.safeParse(data)

  if (!validatedResponse.success) {
    throw new Error('Failed to validate user response:', validatedResponse.error)
  }

  const user = validatedResponse.data.data[0]

  if (!user) {
    throw new Error('No user data found')
  }

  return user.id
}
