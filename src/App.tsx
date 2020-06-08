import React, { useState } from "react";

import "./App.css";

function App() {
  const [numberBreakLength, setNumberBreakLength] = useState(5);
  const [numberSessionLength, setNumberSessionLength] = useState(25);

  const handleClickLess = (e: any) => {
    let updateNumberBreak = numberBreakLength;

    if (numberBreakLength > 1) {
      updateNumberBreak -= 1;
    }
    setNumberBreakLength(updateNumberBreak);
  };

  const handleClickAdd = (e: any) => {
    let updateNumber = numberBreakLength;

    if (numberBreakLength < 60) {
      updateNumber += 1;
    }
    setNumberBreakLength(updateNumber);
  };

  const handleClickLessLength = (e: any) => {
    console.log(e);
    let updateNumberSession = numberSessionLength;

    if (updateNumberSession > 1) {
      updateNumberSession -= 1;
    }
    setNumberSessionLength(updateNumberSession);
  };

  const handleClickAddLength = (e: any) => {
    let updateNumberSession = numberSessionLength;

    if (updateNumberSession < 60) {
      updateNumberSession += 1;
    }
    setNumberSessionLength(updateNumberSession);
  };

  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div className="container-break-session">
        <div className="container-break">
          <div>Break Length</div>
          <button onClick={handleClickLess}>-</button>
          <div>{numberBreakLength}</div>
          <button onClick={handleClickAdd}>+</button>
        </div>
        <div className="container-session">
          <div>Session Length</div>
          <button onClick={handleClickLessLength}>-</button>
          <div>{numberSessionLength}</div>
          <button onClick={handleClickAddLength}>+</button>
        </div>
      </div>
      <div className="session-screen">
        <div>Session</div>
        <div>{numberSessionLength}:00</div>
      </div>
      <div className="button-controls">
        <button>play</button>
        <button>pause</button>
        <button>rewinde</button>
      </div>
    </div>
  );
}

export default App;
