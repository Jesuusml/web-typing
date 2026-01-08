import { useEffect, useMemo, useState } from "react";

function Home() {
  const [fullText, setFullText] = useState('Hello world');
  const [targetIndex, setTargetIndex] = useState(0);

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
        setTargetIndex(prev => prev + 1);
      }
      return;
    }

    if (e.key === 'Backspace' && targetIndex > 0) {
      setTargetIndex(prev => prev - 1);
      return;
    }
  }

  const nextLevel = () => {}

  useEffect(() => {
    if (!targetChar.length) {
      nextLevel();
    }
  }, [targetChar.length]);

  return (
    <>
      <br />
      <br />

      <div className="input-container">
        <div className="text-display">
          {targetChar.length ? (
            <>
              <span className="correct">{completedText}</span>
              <span className="pending current">{targetChar}</span>
              <span className="pending">{pendingText}</span>
            </>
          ) : (
            <span>Completado !</span>
          )}
        </div>
        <input
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
