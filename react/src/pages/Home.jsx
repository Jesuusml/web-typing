// TODOS: nextLevel text cascade; Add inline padding to input;


import { useEffect, useMemo, useRef, useState } from "react";

function Home() {
  const [displayText, setDisplayText] = useState('level 1');
  const [targetIndex, setTargetIndex] = useState(0);
  const [typo, setTypo] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef(null);
  const typewriterSlideFX = useRef(new Audio('/typewriter-slide.mp3'));
  const typewriterEndFX = useRef(new Audio('/typewriter-end.mp3'));
  const animationTime = 1200;

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
      }
      else {
        setTypo(true);
        setErrorKey(prev => prev + 1);
      }
    }

    else if (e.key === 'Backspace' && targetIndex > 0) {
      setTargetIndex(prev => prev - 1);
    }
  }

  const nextLevel = () => {
    const newText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ipsam cum modi eveniet eum dolores, accusantium quia quis, ducimus dicta iure?';

    // Resets variables
    setDisplayText(newText);
    setTargetIndex(0);
    setTypo(false);

    // Starts animation
    setAnimating(true);
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
          onTransitionStart={() => {
            typewriterSlideFX.current.currentTime = 0;
            typewriterSlideFX.current.play();
          }}
          onTransitionEnd={() => {
            typewriterEndFX.current.currentTime = 0;
            typewriterEndFX.current.play();
          }}
        >
          {/* <span className="correct">{completedText}</span> */}
          <span></span>
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
