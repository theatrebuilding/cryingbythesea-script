import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [script, setScript] = useState([]);
  const scriptRef = useRef(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/jazbogross/script-more-script-1741035226125/main/script.json')
      .then((response) => response.json())
      .then((data) => setScript(data.ops))
      .catch((error) => console.error('Error fetching script:', error));
  }, []);

  useEffect(() => {
    if (!scriptRef.current || script.length === 0) return;
    const container = scriptRef.current;
    const totalScrollHeight = container.scrollHeight / 2;
    const SCROLL_SPEED = 10;
    const duration = totalScrollHeight / SCROLL_SPEED;

    const now = new Date();
    const gmtTimeInSeconds = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
    const scrollPosition = ((gmtTimeInSeconds % duration) / duration) * totalScrollHeight;

    container.scrollTop = scrollPosition;
  }, [script]);

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

  const renderScript = (ops) => {
    const lines = [];
    let currentLine = [];

    ops.forEach((op) => {
      const segments = op.insert.split(/(\n)/);

      segments.forEach((segment) => {
        if (segment === '\n') {
          lines.push({ segments: currentLine, alignment: op.attributes?.align || 'left' });
          currentLine = [];
        } else if (segment) {
          currentLine.push({ insert: segment, attributes: op.attributes });
        }
      });
    });

    if (currentLine.length) lines.push({ segments: currentLine, alignment: 'left' });

    return lines.map((line, lineIndex) => (
      <div key={lineIndex} className="script-line" style={{ textAlign: line.alignment }}>
        {line.segments.map((seg, segIndex) => {
          let content = seg.insert;
          if (seg.attributes?.bold && seg.attributes?.italic) {
            content = <strong key={segIndex}><em>{content}</em></strong>;
          } else if (seg.attributes?.bold) {
            content = <strong key={segIndex}>{content}</strong>;
          } else if (seg.attributes?.italic) {
            content = <em key={segIndex}>{content}</em>;
          }
          return <React.Fragment key={segIndex}>{content}</React.Fragment>;
        })}
      </div>
    ));
  };

  return (
    <div className="App">
      <div
        className="scroll-container"
        ref={scriptRef}
        style={{ height: '100%', overflowY: 'scroll' }}
        onScroll={handleScroll}
      >
        {renderScript(script)}
        {renderScript(script)}
      </div>
    </div>
  );
}

export default App;
