import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Timer from "tiny-timer";
import "./App.css";

type TimerStates = "Session" | "Break";

interface TimeLeft {
  seconds: string;
  minutes: string;
}

function App() {
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [breakMilliseconds, setBreakMilliseconds] = useState(0);
  const [sessionMilliseconds, setSessionMilliseconds] = useState(0);
  const [activeTimer, setActiveTimer] = useState<TimerStates>("Session");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    seconds: "00",
    minutes: "00",
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const timer = useMemo(() => new Timer(), []);
  // a force render hack :)
  const [_, forceRender] = useState([]);

  const convertMinutestoMilliseconds = (minutes: number) => {
    // adding 1 second to "show the 00:00"
    return Math.floor(minutes * 60 * 1000) + 1000;
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
    // substracting 1 to show the "00:00"
    let seconds = Math.round(ms / timeAPI.SECONDS);

    if (seconds > 0) {
      seconds = seconds - 1;
    }

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
      activeTimer === "Session" ? sessionMilliseconds : breakMilliseconds;

    timer.start(timeInMilli);
  };

  const handlePause = () => {
    timer.pause();
    forceRender([]);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    timer.stop();
    setActiveTimer("Session");
    setSessionMinutes(25);
    setBreakMinutes(5);
    setBreakMilliseconds(convertMinutestoMilliseconds(5));
    setSessionMilliseconds(convertMinutestoMilliseconds(25));
    setTimeLeft(convertMillisecondsToTime(convertMinutestoMilliseconds(25)));
  };

  const handleDone = useCallback(() => {
    if (activeTimer === "Session") {
      setActiveTimer("Break");
      timer.start(breakMilliseconds);
      setSessionMilliseconds(convertMinutestoMilliseconds(sessionMinutes));
    } else {
      setActiveTimer("Session");
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
      const timeLeft = convertMillisecondsToTime(ms);

      if (timeLeft.minutes === "00" && timeLeft.seconds === "00") {
        audioRef.current?.play();
      }

      if (activeTimer === "Session") {
        setSessionMilliseconds(ms);
      } else {
        setBreakMilliseconds(ms);
      }
      setTimeLeft(timeLeft);
    },
    [activeTimer]
  );

  useEffect(() => {
    const timeInMs = convertMinutestoMilliseconds(sessionMinutes);
    setSessionMilliseconds(timeInMs);

    if (activeTimer === "Session") {
      setTimeLeft(convertMillisecondsToTime(timeInMs));
    }
  }, [activeTimer, sessionMinutes]);

  useEffect(() => {
    const timeInMs = convertMinutestoMilliseconds(breakMinutes);
    setBreakMilliseconds(timeInMs);

    if (activeTimer === "Break") {
      setTimeLeft(convertMillisecondsToTime(timeInMs));
    }
  }, [activeTimer, breakMinutes]);

  useEffect(() => {
    timer.on("tick", handleTick);

    timer.on("done", handleDone);

    return () => {
      timer.removeAllListeners();
    };
  }, [timer, handleTick, handleDone]);

  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div className="container-break-session">
        <div className="container-break">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={handleBreakLessClick}>
            -
          </button>
          <div id="break-length">{breakMinutes}</div>
          <button id="break-increment" onClick={handleBreakAddClick}>
            +
          </button>
        </div>
        <div className="container-session">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={handleSessionLessClick}>
            -
          </button>
          <div id="session-length">{sessionMinutes}</div>
          <button id="session-increment" onClick={handleSessionAddClick}>
            +
          </button>
        </div>
      </div>
      <div className="session-screen">
        <div id="timer-label">{activeTimer}</div>
        <p id="time-left">
          {timeLeft.minutes}:{timeLeft.seconds}
        </p>
        {timer.status === "running" ? (
          <button id="start_stop" onClick={handlePause}>
            pause
          </button>
        ) : (
          <button id="start_stop" onClick={handlePlay}>
            play
          </button>
        )}
        <button id="reset" onClick={handleRewind}>
          rewinde
        </button>
        <audio ref={audioRef} id="beep" src="/sound/beep.wav"></audio>
      </div>
    </div>
  );
}

export default App;
