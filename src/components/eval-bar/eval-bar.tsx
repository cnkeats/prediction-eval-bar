import { getLatestPrediction } from '@/api/prediction'
import { useCallback, useEffect, useRef, useState } from 'react'
import EvalBarDisplay from './eval-bar-display'

const EvalBar: React.FC = () => {
  const [evalValue, setEvalValue] = useState(50)
  const [delay, setDelay] = useState(2000)
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
      setDelay(2000)
    } else {
      setDelay(10000)
    }
  }, [])

  useEffect(() => {
    void updatePredictionState()

    intervalRef.current = setInterval(() => {
      void updatePredictionState()
    }, delay)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [delay, updatePredictionState])

  return <EvalBarDisplay evalValue={evalValue} />
}

export default EvalBar
