import React, { useState, useEffect } from "react";

const sampleText = "This is a sample text for the typing test application.";

const App = () => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);

  // Calculate WPM and Accuracy
  const wpm = Math.round((correctChars / 5) / (timer / 60));
  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;

  // Start the timer when typing begins
  useEffect(() => {
    let interval;
    if (isStarted) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    // Check for correct characters
    let correctCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === sampleText[i]) {
        correctCount++;
      } else {
        break;
      }
    }
    setCorrectChars(correctCount);
  };

  // Reset the test
  const handleReset = () => {
    setInput("");
    setStartTime(null);
    setTimer(0);
    setIsStarted(false);
    setCorrectChars(0);
  };

  // Display the sample text with color coding
  const renderText = () => {
    return sampleText.split("").map((char, index) => {
      let className = "";
      if (index < input.length) {
        className = input[index] === char ? "correct" : "incorrect";
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="container">
      <h1>Typing Trainer</h1>
      <div className="text-display">{renderText()}</div>
      <input
        type="text"
        className="text-input"
        placeholder="Start typing here..."
        value={input}
        onChange={handleInputChange}
        autoFocus
      />
      <div className="stats">
        <div>
          <p>WPM</p>
          <p className="value">{isNaN(wpm) ? 0 : wpm}</p>
        </div>
        <div>
          <p>Accuracy</p>
          <p className="value">{accuracy}%</p>
        </div>
        <div>
          <p>Time</p>
          <p className="value">{timer} sec</p>
        </div>
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default App;
