import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TestingScreen.css';

const TestingScreen = ({ calibrationData, onReset }) => {
  const [currentLine, setCurrentLine] = useState(4);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [currentLetterSet, setCurrentLetterSet] = useState(0); // 0 = default, 1 = alt1, 2 = alt2
  const lettersRef = useRef(null);

  // Extended visual acuity sizes with 3 sets of letters for each level
  const acuitySizes = [
    { label: '20/600', arcminutes: 150, letters: ['E', 'V', 'T'] },
    { label: '20/500', arcminutes: 125, letters: ['A', 'T', 'Z'] },
    { label: '20/400', arcminutes: 100, letters: ['B', 'E', 'H'] },
    { label: '20/300', arcminutes: 75, letters: ['F', 'C', 'L'] },
    { label: '20/250', arcminutes: 62.5, letters: ['C', 'P', 'N'] },
    { label: '20/200', arcminutes: 50, letters: ['E', 'A', 'Z'] },
    { label: '20/150', arcminutes: 37.5, letters: ['A', 'B', 'R'] },
    { label: '20/125', arcminutes: 31.25, letters: ['D O', 'G H', 'K L'] },
    { label: '20/100', arcminutes: 25, letters: ['H B', 'G V', 'O Z'] },
    { label: '20/80', arcminutes: 20, letters: ['P H T', 'G U A', 'U F V'] },
    { label: '20/70', arcminutes: 17.5, letters: ['V L N E', 'A O Z N', 'T N D K'] },
    { label: '20/60', arcminutes: 15, letters: ['D A O F', 'L C K R', 'C U B V'] },
    { label: '20/50', arcminutes: 12.5, letters: ['E G N D H', 'N L S G R', 'S F E O C'] },
    { label: '20/40', arcminutes: 10, letters: ['F Z B D E', 'P F O C R', 'A N S O V'] },
    { label: '20/30', arcminutes: 7.5, letters: ['O F L C T', 'F L K U V', 'D T S K F'] },
    { label: '20/25', arcminutes: 6.25, letters: ['A P E O T F', 'C R U D F N', 'Z B D C U V'] },
    { label: '20/20', arcminutes: 5, letters: ['T Z V E C L', 'L Z U N H B', 'H V N U S O'] },
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
      setCurrentLetterSet(0); // Reset to default set when changing acuity
    }
  }, [currentLine, acuitySizes.length]);

  const moveToPrevLine = useCallback(() => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1);
      setCurrentLetterSet(0); // Reset to default set when changing acuity
    }
  }, [currentLine]);

  // Cycle through letter sets for current acuity
  const cycleLetterSet = useCallback(() => {
    setCurrentLetterSet((prev) => (prev + 1) % 3);
  }, []);

  // Mobile: tap left/right of letters to change lines (horizontal only)
  const handleLetterDisplayTouch = useCallback((event) => {
    if (!isMobile) return; // Only handle touch as horizontal on mobile
    const touch = event.touches && event.touches[0];
    if (!touch) return;
    const lettersElement = lettersRef.current;
    if (!lettersElement) return;
    const lettersRect = lettersElement.getBoundingClientRect();
    const eventX = touch.clientX;
    const lettersCenterX = (lettersRect.left + lettersRect.right) / 2;

    // Prevent synthetic click and 300ms delay
    event.preventDefault();

    if (eventX < lettersCenterX) {
      moveToPrevLine();
    } else {
      moveToNextLine();
    }
  }, [isMobile, moveToPrevLine, moveToNextLine]);


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

  // Track viewport to detect mobile (including landscape)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentAcuity = acuitySizes[currentLine];
  const currentLetters = currentAcuity.letters[currentLetterSet];
  const capHeight = 0.52;
  const emsSquareHeight = calculateLetterHeight(currentAcuity.arcminutes);
  const letterHeight = emsSquareHeight / capHeight;
  const currentDenominator = parseInt(currentAcuity.label.split('/')[1], 10);
  const reduceSpacingForMobile = isMobile && currentDenominator > 40;
  const letterSpacing = reduceSpacingForMobile ? '0.01em' : '0.15em';

  // Expose functions for sidebar arrows
  useEffect(() => {
    const testingScreen = document.querySelector('.testing-screen');
    if (testingScreen) {
      testingScreen.moveUp = moveToPrevLine;
      testingScreen.moveDown = moveToNextLine;
      testingScreen.cycleLetterSet = cycleLetterSet;
    }
    return () => {
      if (testingScreen) {
        delete testingScreen.moveUp;
        delete testingScreen.moveDown;
        delete testingScreen.cycleLetterSet;
      }
    };
  }, [moveToNextLine, moveToPrevLine, cycleLetterSet]);

  return (
    <div className="testing-screen">
      <div className="acuity-info-corner">
        <div>{currentAcuity.label}</div>
        <div>{((emsSquareHeight / calibrationData?.pixelsPerInch) * 25.4).toFixed(1)}mm</div>
        <div>{letterHeight.toFixed(1)}px</div>
      </div>

      <div className="letter-display" onTouchStart={handleLetterDisplayTouch}>
        <div 
          className="letters"
          ref={lettersRef}
          style={{ 
            fontSize: `${letterHeight}px`,
            lineHeight: `${letterHeight}px`,
            letterSpacing
          }}
        >
          {currentLetters}
        </div>
      </div>

      <div className="acuity-denominator">
        {currentAcuity.label.split('/')[1]}
      </div>

    </div>
  );
};

export default TestingScreen;
