// TODOS: nextLevel text cascade; Add inline padding to input;


import { useEffect, useMemo, useRef, useState } from "react";

function Home() {
  const [displayText, setDisplayText] = useState('level 1');
  const [targetIndex, setTargetIndex] = useState(0);
  const [typo, setTypo] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lastKeyTime, setLastKeyTime] = useState(Date.now());
  const inputRef = useRef(null);
  const animationTime = 615;

  const returnSound = useRef(new Audio('/sounds/return.mp3'));
  const typeSound = '/sounds/typing.mp3';
  const errorSound = '/sounds/error.mp3';

  // For display:
  const { completedText, targetChar, pendingText } = useMemo(() => ({
    completedText: displayText.slice(0, targetIndex) || '',
    targetChar: displayText[targetIndex] || '',
    pendingText: displayText.slice(targetIndex + 1) || ''
  }), [displayText, targetIndex]);

  const handleTyping = (e) => {
    e.preventDefault();

    if (e.repeat || animating) return;

    else if (e.key.length === 1) {
      if (e.key === displayText[targetIndex]) {
        setTypo(false);
        setTargetIndex(prev => prev + 1);
        playKeySound();
      }
      else {
        setTypo(true);
        setErrorKey(prev => prev + 1);
        playErrorSound();
      }
    }

    else if (e.key === 'Backspace' && targetIndex > 0) {
      setTargetIndex(prev => prev - 1);
    }
  }

  const playKeySound = () => {
    const sound = new Audio(typeSound);
    const steps = Math.floor(Math.random() * 4) + 1;

    sound.currentTime = steps / 100;
    sound.volume = 0.5;
    sound.playbackRate = calculateRate();
    sound.pan = -0.2 + Math.random() * 0.4;

    sound.play();
  };

  const playErrorSound = () => {
    const sound = new Audio(errorSound);

    sound.currentTime = 0.04;
    sound.play();
  };

  const calculateRate = () => {
    const now = Date.now();
    const delta = (now - lastKeyTime) / 1000;
    setLastKeyTime(now);

    let rate;
    if (delta > 0.5) rate = 1;
    else if (delta > 0.2) rate = 1.1;
    else if (delta > 0.15) rate = 1.2;
    else if (delta > 0.1) rate = 1.3;
    else if (delta > 0.05) rate = 1.4;
    else rate = 1.5;

    return rate;
  };

  const nextLevel = () => {
    const newText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';

    // Resets variables
    setDisplayText(newText);
    setTargetIndex(0);
    setTypo(false);
    returnSound.current.currentTime = 0;
    returnSound.current.volume = 0.6;

    // Starts animation
    setAnimating(true);
    returnSound.current.play();
    setTimeout(() => {
      setAnimating(false);
    }, animationTime + 10);
  };

  useEffect(() => {
    if (completedText.length === displayText.length) {
      nextLevel();
    }
  }, [completedText.length]);

  useEffect(() => {
    if (!animating) {
      inputRef.current?.focus();
    }
    else {
      inputRef.current?.blur();
    }
  }, [animating]);

  return (
    <>
      <br />
      <br />

      <div>Typos: {errorKey}</div>

      <div className="input-container">
        <div
          className={`text-display ${animating ? 'slide-in' : ''}`}
          style={{ '--animation-time': `${animationTime}ms` }}
        >
          {/* <span className="correct">{completedText}</span> */}
          <span key={errorKey} className={`pending current ${typo ? 'error-flash' : ''}`}>
            {targetChar === ' ' ? <>&nbsp;</> : targetChar}
          </span>
          <span className="pending">{pendingText}</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value=""
          onKeyDown={(e) => handleTyping(e)}
          onPaste={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
        />
      </div>
    </>
  );
}

export default Home;
