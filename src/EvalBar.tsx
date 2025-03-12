import { useState } from "react";

export default function EvalBar() {
  const [evalValue, setEvalValue] = useState(0); // -100 (Black) to 100 (White)

  const increaseEval = () => {
    setEvalValue((prev) => Math.min(prev + 10, 100));
  };

  const decreaseEval = () => {
    setEvalValue((prev) => Math.max(prev - 10, -100));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-10 h-64 border">
        {/* White Bar with red border */}
        <div
          className="absolute left-0 w-full bg-white"
          style={{
            height: `${(evalValue + 100) / 2}%`,
            bottom: 0,
            border: "2px solid red", // Red border for the white bar
          }}
        />
        {/* Black Bar with green border */}
        <div
          className="absolute left-0 w-full bg-black"
          style={{
            height: `${(200 - (evalValue + 100)) / 2}%`,
            top: 0,
            border: "2px solid green", // Green border for the black bar
          }}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={increaseEval}>▲</button>
        <button onClick={decreaseEval}>▼</button>
      </div>
    </div>
  );
}
