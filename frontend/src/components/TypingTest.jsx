import React, { useEffect, useState, useRef } from "react";
import paragraphs from "../utils/paragraphs";

const TypingTest = () => {
  const [textToType, setTextToType] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWPM] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Load random paragraph
  const loadNewParagraph = () => {
    const raw = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    const formatted = raw.replace(/\. /g, ".\n").replace(/\s+/g, " ").trim();
    setTextToType(formatted.split(""));
    setUserInput("");
    setTimeLeft(60);
    setStarted(false);
    setEnded(false);
    setAccuracy(0);
    setWPM(0);
    clearTimeout(timerRef.current);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    loadNewParagraph();
  }, []);

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    }

    if (timeLeft === 0 && started && !ended) {
      endTest();
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, started, ended]);

  const handleChange = (e) => {
    if (!started) {
      setStarted(true);
    }
    if (ended) return;

    const val = e.target.value;
    if (val.length > textToType.length) return;
    setUserInput(val);
  };

  const endTest = () => {
  clearTimeout(timerRef.current);
  setStarted(false);
  setEnded(true);

  const originalWords = textToType.join("").replace(/\n/g, " ").trim().split(/\s+/);
  const typedWords = userInput.trim().split(/\s+/).filter(Boolean);

  let correctWords = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === originalWords[i]) {
      correctWords++;
    }
  }

  const accuracyPercent = typedWords.length === 0 ? 0 : Math.round((correctWords / typedWords.length) * 100);
  const minutes = (60 - timeLeft) / 60 || 1;
  const wpmCalc = Math.round(correctWords / minutes);

  setAccuracy(accuracyPercent);
  setWPM(wpmCalc);
};

  const renderColoredText = () => {
    const elements = [];
    textToType.forEach((char, i) => {
      let color = "";
      if (i < userInput.length) {
        color = char === userInput[i] ? "text-green-600" : "text-red-500";
      }

      if (char === "\n") {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(
          <span key={i} className={color}>
            {char === " " ? "\u00A0" : char}
          </span>
        );
      }
    });
    return elements;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Typing Test</h2>

      <div className="border p-4 rounded min-h-[120px] whitespace-pre-wrap font-mono text-lg leading-relaxed">
        {renderColoredText()}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleChange}
        disabled={ended}
        placeholder="Start typing here..."
        className="w-full border p-3 rounded-lg text-lg"
      />

      <div className="flex justify-between items-center mt-2">
        <p className="text-gray-700">⏱ Time Left: <strong>{timeLeft}s</strong></p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={endTest}
          disabled={ended || !started}
        >
          End Test
        </button>
      </div>

      {ended && (
        <div className="text-center mt-4 space-y-2">
          <p className="text-green-600 font-semibold text-lg">WPM: {wpm}</p>
          <p className="text-blue-600 font-semibold text-lg">Accuracy: {accuracy}%</p>
          <button
            className="mt-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
            onClick={loadNewParagraph}
          >
            Retest
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingTest;
