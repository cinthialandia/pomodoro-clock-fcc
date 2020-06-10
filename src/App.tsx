import React, { useState, useEffect, useCallback, useMemo } from "react";
import Timer from "tiny-timer";
import "./App.css";

function App() {
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [breakMilliseconds, setBreakMilliseconds] = useState(0);
  const [sessionMilliseconds, setSessionMilliseconds] = useState(0);
  const [activeTimer, setActiveTimer] = useState<"session" | "break">(
    "session"
  );
  const timer = useMemo(() => new Timer(), []);

  const convertMinutestoMilliseconds = (minutes: number) => {
    return Math.floor(minutes * 60 * 1000);
  };

  const convertMillisecondsToTime = (ms: number) => {
    const timeAPI = {
      MINUTES: 1000 * 60,
      SECONDS: 1000,
    };

    if (ms <= 0) {
      return {
        minutes: `00`,
        seconds: `00`,
      };
    }

    const minutes = Math.floor(ms / timeAPI.MINUTES);
    ms %= timeAPI.MINUTES;
    const seconds = Math.round(ms / timeAPI.SECONDS);

    console.log({ minutes, seconds });

    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const handleBreakLessClick = (e: any) => {
    if (timer.status === "running") {
      return;
    }
    let updateNumberBreak = breakMinutes;

    if (breakMinutes > 1) {
      updateNumberBreak -= 1;
    }

    setBreakMinutes(updateNumberBreak);
  };

  const handleBreakAddClick = (e: any) => {
    if (timer.status === "running") {
      return;
    }
    let updateNumber = breakMinutes;

    if (breakMinutes < 60) {
      updateNumber += 1;
    }

    setBreakMinutes(updateNumber);
  };

  const handleSessionLessClick = (e: any) => {
    if (timer.status === "running") {
      return;
    }
    let updateNumberSession = sessionMinutes;

    if (updateNumberSession > 1) {
      updateNumberSession -= 1;
    }
    setSessionMinutes(updateNumberSession);
  };

  const handleSessionAddClick = (e: any) => {
    if (timer.status === "running") {
      return;
    }
    let updateNumberSession = sessionMinutes;

    if (updateNumberSession < 60) {
      updateNumberSession += 1;
    }

    setSessionMinutes(updateNumberSession);
  };

  const handlePlay = () => {
    if (timer.status === "paused") {
      timer.resume();
      return;
    }
    const timeInMilli =
      activeTimer === "session" ? sessionMilliseconds : breakMilliseconds;

    timer.start(timeInMilli);
  };

  const handlePause = () => {
    timer.pause();
  };

  const handleRewind = () => {
    timer.stop();
    setActiveTimer("session");
    setSessionMinutes(25);
    setBreakMinutes(5);
    setBreakMilliseconds(convertMinutestoMilliseconds(5));
    setSessionMilliseconds(convertMinutestoMilliseconds(25));
  };

  const handleDone = useCallback(() => {
    if (activeTimer === "session") {
      setActiveTimer("break");
      timer.start(breakMilliseconds);
      setSessionMilliseconds(convertMinutestoMilliseconds(sessionMinutes));
    } else {
      setActiveTimer("session");
      timer.start(sessionMilliseconds);
      setBreakMilliseconds(convertMinutestoMilliseconds(breakMinutes));
    }
  }, [
    activeTimer,
    breakMilliseconds,
    breakMinutes,
    sessionMilliseconds,
    sessionMinutes,
    timer,
  ]);

  const handleTick = useCallback(
    (ms: number) => {
      if (activeTimer === "session") {
        setSessionMilliseconds(ms);
      } else {
        setBreakMilliseconds(ms);
      }
    },
    [activeTimer]
  );

  useEffect(() => {
    setSessionMilliseconds(convertMinutestoMilliseconds(sessionMinutes));
  }, [sessionMinutes]);

  useEffect(() => {
    setBreakMilliseconds(convertMinutestoMilliseconds(breakMinutes));
  }, [breakMinutes]);

  useEffect(() => {
    timer.on("tick", handleTick);

    timer.on("done", handleDone);

    return () => {
      timer.removeAllListeners();
    };
  }, [timer, handleTick, handleDone]);

  const { minutes, seconds } = convertMillisecondsToTime(
    activeTimer === "session" ? sessionMilliseconds : breakMilliseconds
  );

  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div className="container-break-session">
        <div className="container-break">
          <div>Break Length</div>
          <button onClick={handleBreakLessClick}>-</button>
          <div>{breakMinutes}</div>
          <button onClick={handleBreakAddClick}>+</button>
        </div>
        <div className="container-session">
          <div>Session Length</div>
          <button onClick={handleSessionLessClick}>-</button>
          <div>{sessionMinutes}</div>
          <button onClick={handleSessionAddClick}>+</button>
        </div>
      </div>
      <div className="session-screen">
        <div>{activeTimer}</div>
        <p>
          {minutes}:{seconds}
        </p>
        <button onClick={handlePlay}>play</button>
        <button onClick={handlePause}>pause</button>
        <button onClick={handleRewind}>rewinde</button>
      </div>
    </div>
  );
}

export default App;
