export interface Prediction {
	id: string
	broadcaster_id: string
	broadcaster_name: string
	broadcaster_login: string
	title: string
	winning_outcome_id: number
	outcomes: Outcome[]
	prediction_window: number
	status: string
	created_at: string
	ended_at: string
	locked_at: string
  }
  
  export interface Outcome {
	id: string
	title: string
	users: number
	channel_points: number
	top_predictors: []
	color: string
  }
  