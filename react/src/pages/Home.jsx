// TODOS: nextLevel text cascade; Add inline padding to input;


import { useEffect, useMemo, useRef, useState } from "react";

function Home() {
  const [fullText, setFullText] = useState('Hello world');
  const [targetIndex, setTargetIndex] = useState(0);
  const [typo, setTypo] = useState(false);
  const [errorKey, setErrorKey] = useState(0);
  const inputRef = useRef(null);
  const [disabledFocus, setDisabledFocus] = useState(false);

  // For display:
  const { completedText, targetChar, pendingText } = useMemo(() => ({
    completedText: fullText.slice(0, targetIndex) || '',
    targetChar: fullText[targetIndex] || '',
    pendingText: fullText.slice(targetIndex + 1) || ''
  }), [fullText, targetIndex]);

  const handleTyping = (e) => {
    e.preventDefault();

    if (e.repeat || targetIndex >= fullText.length) return;

    if (e.key.length === 1) {
      if (e.key === fullText[targetIndex]) {
        setTypo(false);
        setTargetIndex(prev => prev + 1);
      }
      else {
        setTypo(true);
        setErrorKey(prev => prev + 1);
      }
      return;
    }

    if (e.key === 'Backspace' && targetIndex > 0) {
      setTargetIndex(prev => prev - 1);
      return;
    }
  }

  const nextLevel = () => {}

  // Triggers logic for next level
  useEffect(() => {
    if (!targetChar.length) {
      nextLevel();
    }
  }, [targetChar.length]);

  // Controls input focus
  useEffect(() => {
    if (!disabledFocus) {
      inputRef.current?.focus();
    }
    else {
      inputRef.current?.blur();
    }
  }, [disabledFocus]);

  return (
    <>
      <br />
      <br />

      <div>Typos: {errorKey}</div>

      <div className="input-container">
        <div className="text-display">
          {targetChar.length ? (
            <>
              <span className="correct">{completedText}</span>
              <span key={errorKey} className={`pending current ${typo ? 'error-flash' : ''}`}>
                {targetChar}
              </span>
              <span className="pending">{pendingText}</span>
            </>
          ) : (
            <span>Completado !</span>
          )}
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
