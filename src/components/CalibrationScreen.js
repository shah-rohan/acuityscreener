import React, { useState, useEffect } from 'react';
import './CalibrationScreen.css';

const CalibrationScreen = ({ onCalibrationComplete }) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [pixelDensity, setPixelDensity] = useState(0);
  const [viewingDistance, setViewingDistance] = useState(6.5); // feet
  const [creditCardPixelWidth, setCreditCardPixelWidth] = useState(200); // pixels

  // Standard credit card dimensions in inches
  const CREDIT_CARD_WIDTH_INCHES = 3.375;
  const CREDIT_CARD_HEIGHT_INCHES = 2.125;

  useEffect(() => {
    // Get screen dimensions
    setScreenWidth(window.screen.width);
    setScreenHeight(window.screen.height);
    setPixelDensity(window.devicePixelRatio || 1);
  }, []);

  const handleCalibrate = () => {
    const pixelsPerInch = creditCardPixelWidth / CREDIT_CARD_WIDTH_INCHES;
    
    const calibrationData = {
      screenWidth,
      screenHeight,
      pixelDensity,
      viewingDistance: viewingDistance * 12, // convert feet to inches
      pixelsPerInch,
      creditCardPixelWidth,
    };
    
    onCalibrationComplete(calibrationData);
  };

  const isCalibrationReady = creditCardPixelWidth > 0 && viewingDistance > 0;

  return (
    <div className="calibration-screen">
      <h2>Screen Calibration</h2>
      <p className="description">
        Use a standard credit card to calibrate your screen. Adjust the rectangle below to match the size of your credit card, then set the viewing distance.
      </p>

      <div className="calibration-form">
        <div className="screen-info">
          <h3>Detected Screen Properties</h3>
          <div className="info-grid">
            <div>Resolution: {screenWidth} × {screenHeight} pixels</div>
            <div>Pixel Density: {pixelDensity}×</div>
          </div>
        </div>

        <div className="credit-card-section">
          <h3>Credit Card Calibration</h3>
          <p className="calibration-instructions">
            Hold a credit card up to your screen and adjust the rectangle below to match its size exactly.
            <br />
            <strong>Standard credit card: {CREDIT_CARD_WIDTH_INCHES}" × {CREDIT_CARD_HEIGHT_INCHES}"</strong>
          </p>
          
          <div className="credit-card-display">
            <div 
              className="credit-card-rectangle"
              style={{
                width: `${creditCardPixelWidth}px`,
                height: `${(creditCardPixelWidth * CREDIT_CARD_HEIGHT_INCHES / CREDIT_CARD_WIDTH_INCHES)}px`
              }}
            >
              <div className="card-label">Credit Card Size</div>
            </div>
          </div>

          <div className="calibration-controls">
            <div className="input-group">
              <label htmlFor="cardWidth">Credit Card Width (pixels):</label>
              <input
                id="cardWidth"
                type="number"
                value={creditCardPixelWidth}
                onChange={(e) => setCreditCardPixelWidth(parseInt(e.target.value) || 0)}
                min="50"
                max="800"
                step="1"
              />
            </div>
            
            <div className="slider-group">
              <label htmlFor="cardSlider">Adjust Size:</label>
              <input
                id="cardSlider"
                type="range"
                value={creditCardPixelWidth}
                onChange={(e) => setCreditCardPixelWidth(parseInt(e.target.value))}
                min="50"
                max="800"
                step="1"
                className="card-slider"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h3>Viewing Setup</h3>
          <div className="input-group">
            <label htmlFor="viewingDistance">Viewing Distance (feet):</label>
            <input
              id="viewingDistance"
              type="number"
              value={viewingDistance}
              onChange={(e) => setViewingDistance(parseFloat(e.target.value) || 0)}
              placeholder="6.5"
              step="0.5"
              min="1"
              max="50"
            />
          </div>
        </div>

        {creditCardPixelWidth > 0 && (
          <div className="calculated-info">
            <h3>Calculated Values</h3>
            <div>Pixels per inch: {(creditCardPixelWidth / CREDIT_CARD_WIDTH_INCHES).toFixed(2)}</div>
            <div>Viewing distance: {viewingDistance} feet ({(viewingDistance * 12).toFixed(1)} inches)</div>
          </div>
        )}

        <button 
          className="calibrate-button"
          onClick={handleCalibrate}
          disabled={!isCalibrationReady}
        >
          Complete Calibration
        </button>
      </div>
    </div>
  );
};

export default CalibrationScreen;
