import React, { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number; // Delay between characters in ms
  stagger?: boolean; // Stagger appearance for more dynamic effect
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '', delay = 50, stagger = false }) => {
  const [visibleText, setVisibleText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setVisibleText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setVisibleText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, text, delay]);

  return (
    <span className={className}>
      {visibleText.split('').map((char, index) => {
        if (char === '\n') {
          return <br key={index} />;
        }
        if (char === ' ') {
          return <span key={index}>&nbsp;</span>;
        }
        return (
          <span
            key={index}
            className={stagger ? 'animated-char-stagger-initial' : ''}
            style={stagger ? { animation: `fadeInChar 0.5s ${index * 0.05}s ease-out forwards` } : {}}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default AnimatedText;