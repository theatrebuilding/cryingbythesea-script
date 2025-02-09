import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [script, setScript] = useState([]);
  const scriptRef = useRef(null);

  // Helper function to parse text for star formatting.
  // - ***text*** → bold+italic (<strong><em>text</em></strong>)
  // - **text**   → bold (<strong>text</strong>)
  // - *text*     → italic (<em>text</em>)
  const parseFormattedText = (text) => {
    // This regex matches triple, double, or single star markers.
    // Group 2 captures content inside ***...***,
    // Group 3 captures content inside **...**,
    // Group 4 captures content inside *...*.
    const regex = /(\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    const result = [];
    let lastIndex = 0;
    let match;
    let counter = 0;
    while ((match = regex.exec(text)) !== null) {
      // Push any text that comes before the current match.
      if (match.index > lastIndex) {
        result.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        // Triple stars: bold and italic.
        result.push(
          <strong key={counter}>
            <em>{match[2]}</em>
          </strong>
        );
      } else if (match[3]) {
        // Double stars: bold.
        result.push(<strong key={counter}>{match[3]}</strong>);
      } else if (match[4]) {
        // Single star: italic.
        result.push(<em key={counter}>{match[4]}</em>);
      }
      counter++;
      lastIndex = regex.lastIndex;
    }
    // Append any remaining text after the last match.
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }
    return result;
  };

  // Fetch the script from the JSON file.
  useEffect(() => {
    fetch('/script.json')
      .then((response) => response.json())
      .then((data) => {
        // Convert the "script" object (with line numbers as keys)
        // into a sorted array of script lines.
        const lines = Object.keys(data.script)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => data.script[key]);
        setScript(lines);
      })
      .catch((error) => console.error('Error fetching script:', error));
  }, []);

  // Calculate the initial scroll offset based on GMT time.
  useEffect(() => {
    if (!scriptRef.current || script.length === 0) return;

    const container = scriptRef.current;
    // Duplicate the script to allow seamless scrolling; we use half the total height.
    const totalScrollHeight = container.scrollHeight / 2;
    const SCROLL_SPEED = 10; // pixels per second (adjust if needed)
    const duration = totalScrollHeight / SCROLL_SPEED;

    const now = new Date();
    const gmtTimeInSeconds =
      now.getUTCHours() * 3600 +
      now.getUTCMinutes() * 60 +
      now.getUTCSeconds();

    const scrollPosition =
      ((gmtTimeInSeconds % duration) / duration) * totalScrollHeight;

    container.scrollTop = scrollPosition;
  }, [script]);

  // Handle scrolling to ensure a seamless wrap-around.
  const handleScroll = () => {
    const container = scriptRef.current;
    if (!container) return;

    const halfHeight = container.scrollHeight / 2;

    if (container.scrollTop >= halfHeight) {
      container.scrollTop -= halfHeight;
    } else if (container.scrollTop < 0) {
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
        {/* Render the original script lines */}
        {script.map((lineObj, index) => (
          <div
            key={index}
            className="script-line"
            style={{ textAlign: lineObj.alignment }}
          >
            {parseFormattedText(lineObj.text)}
          </div>
        ))}
        {/* Duplicate the script lines for seamless scrolling */}
        {script.map((lineObj, index) => (
          <div
            key={`repeat-${index}`}
            className="script-line"
            style={{ textAlign: lineObj.alignment }}
          >
            {parseFormattedText(lineObj.text)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
