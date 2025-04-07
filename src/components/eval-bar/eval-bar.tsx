import { getLatestPrediction, Prediction } from '@/api/prediction'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EvalBarDisplay } from './eval-bar-display'

export default function EvalBar() {
  const [evalValue, setEvalValue] = useState(50)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction>()

  const updatePredictionState = useCallback(async () => {
    const prediction = await getLatestPrediction()
    if (!prediction) return

    setCurrentPrediction(prediction)

    const latestPredictionOutcomes = prediction.outcomes

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
  }, [currentPrediction?.status])

  const [duration, setDuration] = useState(5000)
  const interval = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      await updatePredictionState()
    }

    fetchData()

    interval.current = setInterval(fetchData, duration)

    return () => {
      clearInterval(interval.current)
    }
  }, [duration, updatePredictionState])

  return <EvalBarDisplay evalValue={evalValue} />
}
