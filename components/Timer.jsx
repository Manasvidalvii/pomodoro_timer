//JSX stands for JavaScript XML.
//t is a special syntax extension for JavaScript used in React that allows you to write HTML-like tags directly inside your JavaScript code.
// // 1. IMPORT REACT HOOKS
// - React: Needed to write JSX (HTML inside JavaScript).
// - useState: Stores values that update on screen (like seconds left on the clock).
// - useEffect: Runs code automatically on updates (like counting down every second).
// - useRef: Holds the timer interval ID without triggering extra re-renders.
import React, { useState, useEffect, useRef } from "react";

// 2. MAIN TIMER COMPONENT
export default function Timer() {
  // 25 minutes converted to seconds (25 * 60 = 1500 seconds)
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Keeps track of whether the timer is currently running (true/false)
  const [isRunning, setIsRunning] = useState(false);

  // Mode state: "work" (25 min) or "break" (5 min)
  const [mode, setMode] = useState("work");

  // Stores the JavaScript setInterval reference safely
  const timerRef = useRef(null);

  // 3. COUNTDOWN ENGINE
  useEffect(() => {
    if (isRunning) {
      // Run every 1000ms (1 second)
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    // Cleanup interval on unmount or pause
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  // 4. BROWSER TAB TITLE UPDATER
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    document.title = `${formattedTime} - ${mode === "work" ? "Focus" : "Break"} | FocusSpace`;
  }, [timeLeft, mode]);

  // 5. ALERT WHEN TIME REACHES 00:00
  const handleTimerComplete = () => {
    alert(
      mode === "work"
        ? "🎉 Work session completed! Take a 5-minute break."
        : "⏰ Break is over! Back to focus."
    );
  };

  // 6. BUTTON HANDLERS
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "work" ? 25 * 60 : 5 * 60);
  };

  // 7. HELPER TO FORMAT SECONDS INTO MM:SS
  const formatDisplayTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 8. HTML / JSX OUTPUT
  return (
    <div className="timer-card">
      {/* Mode Switcher */}
      <div className="mode-toggle">
        <button
          className={mode === "work" ? "active-btn" : ""}
          onClick={() => switchMode("work")}
        >
          🧠 Focus Mode (25m)
        </button>
        <button
          className={mode === "break" ? "active-btn" : ""}
          onClick={() => switchMode("break")}
        >
          ☕ Short Break (5m)
        </button>
      </div>

      {/* Clock Display */}
      <div className="clock-display">
        <h1>{formatDisplayTime()}</h1>
      </div>

      {/* Play/Pause & Reset Controls */}
      <div className="control-buttons">
        <button className="primary-btn" onClick={toggleTimer}>
          {isRunning ? "⏸️ Pause" : "▶️ Start"}
        </button>
        <button className="secondary-btn" onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
}