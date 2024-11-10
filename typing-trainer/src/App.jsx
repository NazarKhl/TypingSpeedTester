import React, { useState, useEffect } from "react";

// Simulated API for generating random sentences
const getRandomSentence = () => {
  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing speed is a great skill to have.",
    "Practice makes perfect, so keep typing!",
    "A journey of a thousand miles begins with a single step.",
    "React is a powerful library for building user interfaces.",
    "JavaScript is versatile and fun to learn.",
    "Consistency is the key to becoming a better programmer.",
    "The sun rises in the east and sets in the west.",
    "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    "Success is not the key to happiness. Happiness is the key to success."
  ];
  return sentences[Math.floor(Math.random() * sentences.length)];
};

const App = () => {
  const [sampleText, setSampleText] = useState(getRandomSentence());
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [testDuration, setTestDuration] = useState(60); // Default duration in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [isTestEnded, setIsTestEnded] = useState(false);

  // Calculate WPM and Accuracy
  const wpm = Math.round((correctChars / 5) / (timer / 60));
  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;

  // Start the timer and handle test duration
  useEffect(() => {
    let interval;
    if (isStarted && !isTestEnded) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);

        // End the test when the time is up
        if (timer >= testDuration) {
          endTest();
        }
      }, 1000); // Timer runs every second
    }
    return () => clearInterval(interval);
  }, [isStarted, timer, testDuration, isTestEnded]);

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

    // End the test if the entire text is typed correctly
    if (value === sampleText) {
      endTest();
    }
  };

  // End the typing test
  const endTest = () => {
    setIsTestEnded(true);
    setIsStarted(false);
  };

  // Reset the test
  const handleReset = () => {
    setSampleText(getRandomSentence());
    setInput("");
    setStartTime(null);
    setTimer(0);
    setIsStarted(false);
    setCorrectChars(0);
    setIsTestEnded(false);
  };

  // Render the sample text with color coding
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
      {isTestEnded ? (
        <div className="results">
          <h2>Test Results</h2>
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Time: {timer} seconds</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="settings">
            <label>
              Test Duration (seconds):
              <input
                type="number"
                min="1"
                value={testDuration}
                onChange={(e) => setTestDuration(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="text-display">{renderText()}</div>
          <input
            type="text"
            className="text-input"
            placeholder="Start typing here..."
            value={input}
            onChange={handleInputChange}
            autoFocus
            disabled={isTestEnded}
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
        </>
      )}
    </div>
  );
};

export default App;
