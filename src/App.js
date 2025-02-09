import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [script, setScript] = useState([]);
  const scriptRef = useRef(null);

  // Fetch the script from a JSON file.
  useEffect(() => {
    fetch('/script.json')
      .then((response) => response.json())
      .then((data) => {
        // The new JSON format has a "script" property that holds the lines.
        // Convert the script object into a sorted array by its numeric keys.
        const lines = Object.keys(data.script)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => data.script[key]);
        setScript(lines);
      })
      .catch((error) => console.error('Error fetching script:', error));
  }, []);

  // Once the script is loaded, calculate initial scroll offset based on GMT time.
  useEffect(() => {
    if (!scriptRef.current || script.length === 0) return;

    const container = scriptRef.current;
    // Duplicate the script so the scroll appears seamless.
    const totalScrollHeight = container.scrollHeight / 2;

    // Speed factor (pixels per second) to calculate duration.
    const SCROLL_SPEED = 10; // Adjust as needed.
    const duration = totalScrollHeight / SCROLL_SPEED;

    // Get current GMT time in seconds.
    const now = new Date();
    const gmtTimeInSeconds =
      now.getUTCHours() * 3600 +
      now.getUTCMinutes() * 60 +
      now.getUTCSeconds();

    // Determine scroll position based on time modulo the duration.
    const scrollPosition =
      ((gmtTimeInSeconds % duration) / duration) * totalScrollHeight;

    container.scrollTop = scrollPosition;
  }, [script]);

  // Handle scrolling to create a seamless wrap-around effect.
  const handleScroll = () => {
    const container = scriptRef.current;
    if (!container) return;

    const halfHeight = container.scrollHeight / 2;

    // If scrolling past the first duplicated block, jump back by half the height.
    if (container.scrollTop >= halfHeight) {
      container.scrollTop -= halfHeight;
    } else if (container.scrollTop < 0) {
      // In case of reverse scrolling.
      container.scrollTop += halfHeight;
    }
  };

  return (
    <div className="App">
      <div
        className="scroll-container"
        ref={scriptRef}
        style={{ height: '100%', overflowY: 'scroll' }}
        onScroll={handleScroll}
      >
        {/* Render original script lines */}
        {script.map((lineObj, index) => (
          <div
            key={index}
            className="script-line"
            style={{ textAlign: lineObj.alignment }}
          >
            {lineObj.text}
          </div>
        ))}
        {/* Duplicate script lines for seamless wrap-around */}
        {script.map((lineObj, index) => (
          <div
            key={`repeat-${index}`}
            className="script-line"
            style={{ textAlign: lineObj.alignment }}
          >
            {lineObj.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
