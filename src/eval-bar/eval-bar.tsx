import env from '@/env'
import { useEffect, useRef, useState } from 'react'
import { EvalBarDisplay } from './eval-bar-display'
import { Prediction } from './types'

export default function EvalBar() {
  const [evalValue, setEvalValue] = useState(50)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState(env.ACCESS_TOKEN)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction>()

  const refreshAccessToken = async () => {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: env.CLIENT_ID!,
        client_secret: env.CLIENT_SECRET!,
        refresh_token: env.REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
    })

    const data = await response.json()

    if (response.ok) {
      setAccessToken(data.access_token)
      return data.access_token
    } else {
      console.error('Failed to refresh token:', data)
      throw new Error('Failed to refresh token')
    }
  }

  const updatePredictionState = async (token = accessToken) => {
    if (!env.CLIENT_ID || !token || !env.BROADCASTER_ID) {
      console.error('Missing required environment variables or broadcaster ID.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `https://api.twitch.tv/helix/predictions?broadcaster_id=${env.BROADCASTER_ID}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Client-Id': env.CLIENT_ID,
          },
        },
      )

      if (response.status === 401) {
        console.log('Token expired, refreshing...')
        const newAccessToken = await refreshAccessToken()
        return updatePredictionState(newAccessToken)
      }

      if (!response.ok) {
        throw new Error('Failed to fetch predictions.')
      }

      const data = await response.json()
      setCurrentPrediction(data.data[0])

      const latestPredictionOutcomes = data.data[0].outcomes
      const believerPoints = latestPredictionOutcomes[0].channel_points
      const doubterPoints = latestPredictionOutcomes[1].channel_points
      const totalPoints = believerPoints + doubterPoints
      const percentage = (believerPoints / totalPoints) * 100
      setEvalValue(percentage)
      console.table({
        BelieverPercentage: percentage.toFixed(2) + '%',
      })

      const predictionStatus = currentPrediction?.status

      // if (predictionStatus !== "ACTIVE") {
      // 	setDuration(10000);
      // 	console.log('prediction not active');
      // }
      // else {
      // 	setDuration(1000);
      // }
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const [duration, setDuration] = useState(2000)
  const interval = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      await updatePredictionState()
    }

    fetchData()

    interval.current = setInterval(fetchData, duration)

    return () => clearInterval(interval.current)
  }, [])

  return <EvalBarDisplay evalValue={evalValue} error={error} />
}
