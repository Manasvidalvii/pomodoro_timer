// 1. IMPORT REACT HOOKS
// - React: Core library needed to write JSX (HTML inside JavaScript).
// - useState: Remembers state data that updates on screen (like number of tab switches).
// - useEffect: Runs side effects — used here to attach native browser event listeners when the page loads.
import React, { useState, useEffect } from "react";

// 2. MAIN COMPONENT FUNCTION DECLARATION
// - export default: Allows App.jsx to import this component using `import DistractionBox from './components/DistractionBox'`
export default function DistractionBox() {

  // 3. REACT STATES (Component Memory)
  // - switchCount: Stores the total number of times the user left this browser tab during focus session.
  // - setSwitchCount: Function used to update the switch count state value.
  const [switchCount, setSwitchCount] = useState(0);

  // - lastLeftTime: Stores the formatted time string (e.g., "4:35 PM") when the user last switched away.
  // - setLastLeftTime: Function used to update the timestamp state value.
  const [lastLeftTime, setLastLeftTime] = useState(null);

  // 4. BROWSER VISIBILITY LISTENER ENGINE
  // - useEffect: Runs automatically when the component mounts on the screen.
  useEffect(() => {
    
    // Callback function that fires every time the browser tab's visibility changes (tab switch, minimize, app switch)
    const handleVisibilityChange = () => {
      // document.hidden: Native browser Page Visibility API property
      // Returns `true` when the tab is hidden/backgrounded, and `false` when active on screen.
      if (document.hidden) {
        
        // Increments total switch count by 1 (uses functional update to get freshest previous count)
        setSwitchCount((prevCount) => prevCount + 1);

        // Capture the exact local system time when they switched away
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        
        // Update state with the formatted time string
        setLastLeftTime(currentTime);
      }
    };

    // Attach native browser event listener to the window/document context
    // "visibilitychange" fires automatically whenever browser tab focus changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // CLEANUP FUNCTION:
    // Runs automatically when the component unmounts to remove the listener and prevent memory leaks!
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array [] means this listener registers ONCE when page loads

  // 5. RESET HANDLER FUNCTION
  // - Resets both stats back to zero/null so the user can start a fresh focus session
  const resetStats = () => {
    setSwitchCount(0);
    setLastLeftTime(null);
  };

  // 6. JSX LAYOUT RETURN (HTML Structure with React Logic)
  return (
    // Outer card container styled via CSS
    <div className="distraction-card">
      
      {/* SECTION TITLE */}
      <h2>👁️ Tab Distraction Tracker</h2>

      {/* STATS DISPLAY GRID */}
      <div className="tracker-stats">
        
        {/* STAT BOX 1: TOTAL SWITCH COUNT */}
        <div className="stat-box">
          {/* Dynamically renders the switchCount state variable */}
          <span className="stat-number">{switchCount}</span>
          <span className="stat-label">Tab Switches Today</span>
        </div>

        {/* STAT BOX 2: TIMESTAMP OF LAST DISTRACTION */}
        <div className="stat-box">
          {/* Ternary Operator: If lastLeftTime exists, show the time; otherwise show "None 🎉" */}
          <span className="stat-value">
            {lastLeftTime ? lastLeftTime : "None 🎉"}
          </span>
          <span className="stat-label">Last Distraction</span>
        </div>

      </div>

      {/* DYNAMIC FEEDBACK MESSAGE */}
      {/* Uses logical AND (&&) to render messages conditionally based on switchCount value */}
      <p className="tracker-message">
        {switchCount === 0 && "🌟 Great focus! You haven't left this tab."}
        {switchCount > 0 && switchCount < 5 && "⚠️ Stay focused! Avoid switching tabs."}
        {switchCount >= 5 && "🚨 Too many distractions! Lock in!"}
      </p>

      {/* RESET BUTTON */}
      {/* Event listener: Runs resetStats() when user clicks this button */}
      <button className="reset-stats-btn" onClick={resetStats}>
        🧹 Clear Tracker
      </button>

    </div>
  );
}