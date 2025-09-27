import React, { useState, useEffect } from 'react';
import './TestingScreen.css';

const TestingScreen = ({ calibrationData, onReset }) => {
  const [currentLine, setCurrentLine] = useState(0);

  // Standard visual acuity sizes with unique letter sets for each level
  const acuitySizes = [
    { label: '20/200', arcminutes: 50, letters: 'E F P' },
    { label: '20/100', arcminutes: 25, letters: 'T O Z' },
    { label: '20/70', arcminutes: 17.5, letters: 'L P E D' },
    { label: '20/50', arcminutes: 12.5, letters: 'F C Z H R' },
    { label: '20/40', arcminutes: 10, letters: 'D N P O T H' },
    { label: '20/30', arcminutes: 7.5, letters: 'F E Z P C L D' },
    { label: '20/25', arcminutes: 6.25, letters: 'P O L E D F C Z' },
    { label: '20/20', arcminutes: 5, letters: 'E D F P O T E C L' },
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

  const moveToNextLine = () => {
    if (currentLine < acuitySizes.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };

  const moveToPrevLine = () => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
    }
  };

  const resetTest = () => {
    setCurrentLine(0);
  };

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
  }, [currentLine]);

  const currentAcuity = acuitySizes[currentLine];
  const letterHeight = calculateLetterHeight(currentAcuity.arcminutes);

  return (
    <div className="testing-screen">
      <div className="testing-header">
        <h2>Visual Acuity Test</h2>
        <div className="test-controls">
          <button onClick={resetTest} className="reset-button">
            Reset Test
          </button>
          <button onClick={onReset} className="recalibrate-button">
            Recalibrate
          </button>
        </div>
      </div>

      <div className="calibration-summary">
        <h3>Current Calibration</h3>
        <div className="cal-info">
          <span>Distance: {(calibrationData?.viewingDistance / 12).toFixed(1)} feet ({calibrationData?.viewingDistance}" total)</span>
          <span>Resolution: {calibrationData?.screenWidth}×{calibrationData?.screenHeight}</span>
          <span>Pixels/inch: {calibrationData?.pixelsPerInch.toFixed(2)}</span>
        </div>
      </div>

      <div className="test-area">
        <div className="current-line-info">
          <h3>Line {currentLine + 1} of {acuitySizes.length}</h3>
          <div className="acuity-info">
            <span className="acuity-label">{currentAcuity.label}</span>
            <span className="letter-size">Letter height: {letterHeight}px ({((letterHeight / calibrationData?.pixelsPerInch) * 25.4).toFixed(1)}mm)</span>
          </div>
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

        <div className="navigation-controls">
          <button 
            onClick={moveToPrevLine}
            className="nav-button prev-button"
            disabled={currentLine === 0}
          >
            ↑ Larger Letters
          </button>
          
          <button 
            onClick={moveToNextLine}
            className="nav-button next-button"
            disabled={currentLine === acuitySizes.length - 1}
          >
            ↓ Smaller Letters
          </button>
        </div>
        
        <div className="keyboard-hint">
          Use arrow keys or click buttons to navigate
        </div>
      </div>

    </div>
  );
};

export default TestingScreen;
