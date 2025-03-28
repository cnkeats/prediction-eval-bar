/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Prediction } from "./types";

export default function EvalBar() {
	const [evalValue, setEvalValue] = useState(50);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [accessToken, setAccessToken] = useState(import.meta.env.VITE_ACCESS_TOKEN);
	const [currentPrediction, setCurrentPrediction] = useState<Prediction>();

	const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
	const REFRESH_TOKEN = import.meta.env.VITE_REFRESH_TOKEN;
	const BROADCASTER_ID = import.meta.env.VITE_BROADCASTER_ID;

	const refreshAccessToken = async () => {
		const response = await fetch("https://id.twitch.tv/oauth2/token", {
			method: "POST",
			body: new URLSearchParams({
				client_id: CLIENT_ID!,
				client_secret: import.meta.env.VITE_CLIENT_SECRET!,
				refresh_token: REFRESH_TOKEN!,
				grant_type: "refresh_token",
			}),
		});

		const data = await response.json();

		if (response.ok) {
			setAccessToken(data.access_token);
			return data.access_token;
		} else {
			console.error("Failed to refresh token:", data);
			throw new Error("Failed to refresh token");
		}
	};

	const updatePredictionState = async (token = accessToken) => {
		if (!CLIENT_ID || !token || !BROADCASTER_ID) {
			console.error("Missing required environment variables or broadcaster ID.");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(
				`https://api.twitch.tv/helix/predictions?broadcaster_id=${BROADCASTER_ID}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Client-Id": CLIENT_ID,
					},
				}
			);

			if (response.status === 401) {
				console.log("Token expired, refreshing...");
				const newAccessToken = await refreshAccessToken();
				return updatePredictionState(newAccessToken);
			}

			if (!response.ok) {
				throw new Error("Failed to fetch predictions.");
			}

			const data = await response.json();
			setCurrentPrediction(data.data[0]);

			const latestPredictionOutcomes = data.data[0].outcomes;
			const believerPoints = latestPredictionOutcomes[0].channel_points;
			const doubterPoints = latestPredictionOutcomes[1].channel_points;
			const totalPoints = believerPoints + doubterPoints;
			const percentage = (believerPoints / totalPoints) * 100;
			setEvalValue(percentage);
			console.table({
				BelieverPercentage: (percentage).toFixed(2) + '%'
			})
			
			const predictionStatus = currentPrediction?.status;
			
			// if (predictionStatus !== "ACTIVE") {
			// 	setDuration(10000);
			// 	console.log('prediction not active');
			// }
			// else {
			// 	setDuration(1000);
			// }
			
			
		} catch (error) {
			console.error("Error fetching predictions:", error);
		} finally {
			setLoading(false);
		}
	};
	
	const [duration, setDuration] = useState(2000)
	const interval = useRef(null);
	
	useEffect(() => {
		const fetchData = async () => {
			await updatePredictionState();
		};
		
		fetchData();
	
		interval.current = setInterval(fetchData, duration);
	 
		return () => clearInterval(interval.current);
	}, []);

	return (
		<div
			style={{
				border: "0px solid red",
				display: "flex",
				backgroundColor: "rgba(94, 130, 191, 0.5)",
				boxSizing: "border-box",
				height: "100vh",
				flexDirection: "column",
				justifyContent: "stretch",
			}}
		>
			<div
				style={{
					flexGrow: 100 - evalValue,
					backgroundColor: "#db00b3",
					color: "#db00b3",
					fontWeight: "bold",
					transition: "all 1s",
				}}
			>
				Doubters
			</div>
			<div
				style={{
					flexGrow: evalValue,
					backgroundColor: "#1e69ff",
					color: "#1e69ff",
					fontWeight: "bold",
					alignContent: "end",
					transition: "all 1s",
				}}
			>
				Believers
			</div>
			{error && <p style={{ color: "red" }}>Error: {error}</p>}
		</div>
	);
}
