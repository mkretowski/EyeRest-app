import React from 'react';
import { render } from 'react-dom';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  const timeToWorkInMs = 1200000; // 20 minutes in miliseconds
  const timeToRestInMs = 200000; // 20 seconds in miliseconds
  const [status, setStatus] = useState('off');
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);

  const playBell = () => {
    const bell = new Audio('./sounds/bell.wav');
    bell.play();
  };

  const formatTime = useMemo(() => {
    const padTo2Digits = (num) => {
      return num.toString().padStart(2, '0');
    };

    return (time) => {
      let seconds = Math.floor(time / 1000);
      let minutes = Math.floor(seconds / 60);

      //format to display
      seconds = seconds % 60;
      minutes = minutes % 60;
      return padTo2Digits(minutes) + ':' + padTo2Digits(seconds);
    };
  }, [time]);

  useEffect(() => {
    clearInterval(timer); // code that runs once at the start
    return () => {
      if (timer) clearInterval(timer); // code that runs once at the end
    };
  }, []);

  useEffect(() => {
    if (time <= 0 && status === 'work') {
      playBell();
      setTime(timeToRestInMs);
      setStatus('rest');
    } else if (time <= 0 && status === 'rest') {
      playBell();
      setTime(timeToWorkInMs);
      setStatus('work');
    }
  }, [time]);

  const start = () => {
    setTime(timeToWorkInMs);
    setStatus('work');
    setTimer(
      setInterval(() => {
        setTime((time) => time - 1000);
      }, 1000)
    );
  };

  const stop = () => {
    setStatus('off');
    setTimer(clearInterval(timer));
    setTime(0);
  };

  return (
    <div>
      <h1>Protect your eyes</h1>
      {status === 'off' && (
        <div>
          <p>
            According to optometrists in order to save your eyes, you should follow the 20/20/20. It means you should to
            rest your eyes every 20 minutes for 20 seconds by looking more than 20 feet away.
          </p>
          <p>This app will help you track your time and inform you when it's time to rest.</p>
        </div>
      )}
      {status === 'work' && <img src='./images/work.png' />}
      {status === 'rest' && <img src='./images/rest.png' />}
      {status !== 'off' && <div className='timer'>{formatTime(time)}</div>}
      {status === 'off' && (
        <button className='btn' onClick={start}>
          Start
        </button>
      )}
      {status !== 'off' && (
        <button className='btn' onClick={stop}>
          Stop
        </button>
      )}
      <button className='btn btn-close' onClick={() => window.close()}>
        X
      </button>
    </div>
  );
};

render(<App />, document.querySelector('#app'));
