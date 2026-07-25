// 1. IMPORT REACT LIBRARY
// React is required to write JSX and build components.
import React from "react";

// 2. IMPORT CHILD COMPONENTS
// We import the 3 components from our components/ folder.
import Timer from "./components/Timer";             // Main Countdown Clock
import NatureMixer from "./components/NatureMixer"; // Ambient Nature Sounds
import DistractionBox from "./components/DistractionBox"; // Tab Switch Tracker

// 3. IMPORT GLOBAL CSS STYLESHEET
// Applies modern dark-mode styling, layouts, and button designs.
import "./App.css";

// 4. MAIN PARENT APP COMPONENT
// export default allows React to render this main layout on screen.
export default function App() {

  // 5. JSX / HTML STRUCTURE
  return (
    // Outer page container
    <div className="app-container">
      
      {/* HEADER SECTION */}
      <header className="app-header">
        <h1>🌲 FocusSpace</h1>
        <p>Your Ambient Pomodoro & Distraction-Free Workspace</p>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="app-content">
        
        {/* TOP CARD: Pomodoro Timer */}
        <section className="timer-section">
          <Timer />
        </section>

        {/* BOTTOM CARDS: Sound Mixer & Distraction Tracker */}
        <section className="dashboard-grid">
          <NatureMixer />
          <DistractionBox />
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="app-footer">
        <p>Built with React & Vanilla CSS | Stay Focused 🚀</p>
      </footer>

    </div>
  );
}