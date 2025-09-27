import React, { useState, useEffect, useCallback } from 'react';
import './TestingScreen.css';

const TestingScreen = ({ calibrationData, onReset }) => {
  const [currentLine, setCurrentLine] = useState(0);

  // Extended visual acuity sizes with unique letter sets for each level
  const acuitySizes = [
    { label: '20/400', arcminutes: 100, letters: 'E' },
    { label: '20/300', arcminutes: 75, letters: 'F P' },
    { label: '20/250', arcminutes: 62.5, letters: 'E T L' },
    { label: '20/200', arcminutes: 50, letters: 'F P O Z' },
    { label: '20/150', arcminutes: 37.5, letters: 'E D T C L' },
    { label: '20/100', arcminutes: 25, letters: 'F P O Z E D' },
    { label: '20/80', arcminutes: 20, letters: 'D F P O T E C' },
    { label: '20/60', arcminutes: 15, letters: 'F E L O P Z D T' },
    { label: '20/50', arcminutes: 12.5, letters: 'D F P O T E C Z L' },
    { label: '20/40', arcminutes: 10, letters: 'E D F P O T C Z L H' },
    { label: '20/30', arcminutes: 7.5, letters: 'F E Z P C L D O T H R' },
    { label: '20/25', arcminutes: 6.25, letters: 'P O L E D F C Z T H R N' },
    { label: '20/20', arcminutes: 5, letters: 'E D F P O T C Z L H R N K' },
    { label: '20/15', arcminutes: 3.75, letters: 'F P O C Z L D T H R N K V Y' },
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
