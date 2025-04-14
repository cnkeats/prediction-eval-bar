import env from '@/env'
import { z } from 'zod'
import { getToken } from './token'
import { getUserId } from './user'

const predictionOutcomeSchema = z.object({
  id: z.string(),
  title: z.string(),
  users: z.number(),
  channel_points: z.number(),
  top_predictors: z.array(z.unknown()).nullable(),
  color: z.string(),
})

const predictionSchema = z.object({
  id: z.string(),
  broadcaster_id: z.string(),
  broadcaster_name: z.string(),
  broadcaster_login: z.string(),
  title: z.string(),
  outcomes: z.array(predictionOutcomeSchema),
  status: z.string(),
  prediction_window: z.number(),
  created_at: z.string(),
  ended_at: z.string().nullable(),
  locked_at: z.string().nullable(),
})

const predictionResponseSchema = z.object({
  data: z.array(predictionSchema),
})

export type PredictionOutcome = z.infer<typeof predictionOutcomeSchema>
export type Prediction = z.infer<typeof predictionSchema>

export const getLatestPrediction = async (): Promise<Prediction | null> => {
  const token = await getToken()
  const userId = await getUserId()

  const url = new URL('https://api.twitch.tv/helix/predictions')
  const params = new URLSearchParams({
    broadcaster_id: userId,
  })
  url.search = params.toString()

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': env.CLIENT_ID,
    },
  })

  if (!response.ok) {
    try {
      const errorData = await response.json()
      throw new Error(
        `Failed to fetch predictions: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
      )
    } catch (error) {
      throw new Error(`Failed to fetch predictions: ${response.status} ${response.statusText}`)
    }
  }

  const data = await response.json()

  const validatedResponse = predictionResponseSchema.safeParse(data)

  if (!validatedResponse.success) {
    throw new Error('Failed to validate prediction response:', validatedResponse.error)
  }

  const prediction = validatedResponse.data.data[0]
  return prediction ?? null
}
