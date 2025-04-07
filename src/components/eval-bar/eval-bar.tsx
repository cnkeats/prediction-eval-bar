import { getLatestPrediction, Prediction } from '@/api/prediction'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import EvalBarDisplay from './eval-bar-display'

const DEFAULT_EVAL_VALUE = 50
const DEFAULT_REFRESH_INTERVAL = 2000
const MAX_REFRESH_INTERVAL = 10000

const EvalBar: React.FC = () => {
  const prediction = useRefreshingLatestPrediction()

  const evalValue = useMemo(() => {
    if (!prediction) {
      return DEFAULT_EVAL_VALUE
    }
    return getEvalValueFromPrediction(prediction)
  }, [prediction])

  return <EvalBarDisplay evalValue={evalValue} />
}

export default EvalBar

const useRefreshingLatestPrediction = () => {
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL)

  const { data: prediction } = useSWR('latestPrediction', getLatestPrediction, {
    refreshInterval,
  })

  useEffect(() => {
    if (prediction?.status === 'ACTIVE') {
      setRefreshInterval(DEFAULT_REFRESH_INTERVAL)
    } else {
      setRefreshInterval(MAX_REFRESH_INTERVAL)
    }
  }, [prediction?.status])

  return prediction
}

const getEvalValueFromPrediction = (prediction: Prediction): number => {
  const [believerOutcome, doubterOutcome] = prediction.outcomes

  if (!believerOutcome || !doubterOutcome) {
    return DEFAULT_EVAL_VALUE
  }

  const believerPoints = believerOutcome.channel_points
  const doubterPoints = doubterOutcome.channel_points
  const totalPoints = believerPoints + doubterPoints

  if (totalPoints === 0) {
    return DEFAULT_EVAL_VALUE // avoid division by zero
  }

  const percentage = (believerPoints / totalPoints) * 100

  return percentage
}
