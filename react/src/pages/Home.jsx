// TODOS: nextLevel text cascade; Add inline padding to input;


import { useEffect, useMemo, useRef, useState } from "react";

function Home() {
  const [displayText, setDisplayText] = useState('nivel 1');
  const [newDisplayText, setNewDisplayText] = useState('');
  const [targetIndex, setTargetIndex] = useState(0);
  const [typo, setTypo] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const inputRef = useRef(null);
  const [animating, setAnimating] = useState(false);

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
    const newText = 'level 2';
  };

  useEffect(() => {
    if (completedText.length === displayText.length) {
      setAnimating(true);
    }
  }, [completedText.length]);

  useEffect(() => {
    if (!animating) {
      inputRef.current?.focus();
    }
    else {
      inputRef.current?.blur();
      nextLevel();
    }
  }, [animating]);

  return (
    <>
      <br />
      <br />

      <div>Typos: {errorKey}</div>

      <div className="input-container">
        <div className={`text-display ${animating ? 'slide-up' : ''}`}>
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
