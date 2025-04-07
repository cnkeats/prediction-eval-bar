import { getLatestPrediction } from '@/api/prediction'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EvalBarDisplay } from './eval-bar-display'

export default function EvalBar() {
  const [evalValue, setEvalValue] = useState(50)
  const [duration, setDuration] = useState(2000)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  const updatePredictionState = useCallback(async () => {
    const prediction = await getLatestPrediction()

    if (!prediction) {
      return
    }

    const [believerOutcome, doubterOutcome] = prediction.outcomes

    if (!believerOutcome || !doubterOutcome) {
      return
    }

    const believerPoints = believerOutcome.channel_points
    const doubterPoints = doubterOutcome.channel_points
    const totalPoints = believerPoints + doubterPoints
    const percentage = (believerPoints / totalPoints) * 100
    setEvalValue(percentage)

    if (prediction.status === 'ACTIVE') {
      setDuration(2000)
    } else {
      setDuration(10000)
    }
  }, [])

  useEffect(() => {
    void updatePredictionState()

    intervalRef.current = setInterval(() => {
      void updatePredictionState()
    }, duration)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [duration, updatePredictionState])

  return <EvalBarDisplay evalValue={evalValue} />
}
