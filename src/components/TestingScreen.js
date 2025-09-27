import React, { useState, useEffect, useCallback } from 'react';
import './TestingScreen.css';

const TestingScreen = ({ calibrationData, onReset }) => {
  const [currentLine, setCurrentLine] = useState(0);

  // Extended visual acuity sizes with unique letter sets for each level
  const acuitySizes = [
    { label: '20/600', arcminutes: 150, letters: 'V' },
    { label: '20/400', arcminutes: 100, letters: 'B' },
    { label: '20/300', arcminutes: 75, letters: 'C' },
    { label: '20/250', arcminutes: 62.5, letters: 'P' },
    { label: '20/200', arcminutes: 50, letters: 'E' },
    { label: '20/150', arcminutes: 37.5, letters: 'H B' },
    { label: '20/100', arcminutes: 25, letters: 'P H T' },
    { label: '20/80', arcminutes: 20, letters: 'V L N E' },
    { label: '20/60', arcminutes: 15, letters: 'D A O F' },
    { label: '20/50', arcminutes: 12.5, letters: 'E G N D H' },
    { label: '20/40', arcminutes: 10, letters: 'F Z B D E' },
    { label: '20/30', arcminutes: 7.5, letters: 'O F L C T' },
    { label: '20/25', arcminutes: 6.25, letters: 'A P E O T F' },
    { label: '20/20', arcminutes: 5, letters: 'T Z V E C L' },
  ];

  // Calculate letter height in pixels based on calibration data and arcminutes
  const calculateLetterHeight = (arcminutes) => {
    if (!calibrationData) return 16;
    
    // Convert arcminutes to radians
    const radians = (arcminutes / 60) * (Math.PI / 180);
    
    // Calculate height in inches at viewing distance
    const heightInches = Math.tan(radians) * calibrationData.viewingDistance;
    
    // Convert to pixels
    const heightPixels = heightInches * calibrationData.pixelsPerInch;
    
    return Math.round(heightPixels);
  };

  const moveToNextLine = useCallback(() => {
    if (currentLine < acuitySizes.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  }, [currentLine, acuitySizes.length]);

  const moveToPrevLine = useCallback(() => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
    }
  }, [currentLine]);


  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveToPrevLine();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveToNextLine();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveToNextLine, moveToPrevLine]);

  const currentAcuity = acuitySizes[currentLine];
  const letterHeight = calculateLetterHeight(currentAcuity.arcminutes);

  // Expose functions for sidebar arrows
  useEffect(() => {
    const testingScreen = document.querySelector('.testing-screen');
    if (testingScreen) {
      testingScreen.moveUp = moveToPrevLine;
      testingScreen.moveDown = moveToNextLine;
    }
    return () => {
      if (testingScreen) {
        delete testingScreen.moveUp;
        delete testingScreen.moveDown;
      }
    };
  }, [moveToNextLine, moveToPrevLine]);

  return (
    <div className="testing-screen">
      <div className="acuity-info-corner">
        <div>{currentAcuity.label}</div>
        <div>{((letterHeight / calibrationData?.pixelsPerInch) * 25.4).toFixed(1)}mm</div>
      </div>

      <div className="letter-display">
        <div 
          className="letters"
          style={{ 
            fontSize: `${letterHeight}px`,
            lineHeight: `${letterHeight}px`
          }}
        >
          {currentAcuity.letters}
        </div>
      </div>

      <div className="acuity-denominator">
        {currentAcuity.label.split('/')[1]}
      </div>

    </div>
  );
};

export default TestingScreen;
