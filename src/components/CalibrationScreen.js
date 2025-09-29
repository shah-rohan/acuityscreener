import React, { useState, useEffect } from 'react';
import './CalibrationScreen.css';

const CalibrationScreen = ({ onCalibrationComplete }) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [pixelDensity, setPixelDensity] = useState(0);
  const [viewingDistance, setViewingDistance] = useState(10); // feet
  const [creditCardPixelWidth, setCreditCardPixelWidth] = useState(200); // pixels

  // Standard credit card dimensions in inches
  const CREDIT_CARD_WIDTH_INCHES = 3.375;
  const CREDIT_CARD_HEIGHT_INCHES = 2.125;

  useEffect(() => {
    // Get screen dimensions
    setScreenWidth(window.screen.width);
    setScreenHeight(window.screen.height);
    const dpr = window.devicePixelRatio || 1;
    setPixelDensity(dpr);
    if (dpr === 1) {
      setCreditCardPixelWidth(315);
    } else if (dpr === 2) {
      setCreditCardPixelWidth(415);
    } else if (dpr === 3) {
      setCreditCardPixelWidth(515);
    }
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
      <h2>Calibration</h2>
      <p className="description">
        Match the rectangle to your credit card size, then set viewing distance.
      </p>

      <div className="calibration-form">
        <div className="calibration-columns">
          <div className="left-column">
            <div className="calibration-controls">
              <div className="input-group">
                <label htmlFor="cardWidth">Width (pixels):</label>
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
          </div>

          <div className="right-column">
            <div className="viewing-setup">
              <div className="input-group">
                <label htmlFor="viewingDistance">Viewing Distance (feet):</label>
                <input
                  id="viewingDistance"
                  type="number"
                  value={viewingDistance}
                  onChange={(e) => setViewingDistance(parseFloat(e.target.value) || 0)}
                  placeholder="10"
                  step="0.5"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            {creditCardPixelWidth > 0 && (
              <div className="calculated-info">
                <h4>Calculated Values</h4>
                <div>Pixels per inch: {(creditCardPixelWidth / CREDIT_CARD_WIDTH_INCHES).toFixed(2)}</div>
                <div>Distance: {viewingDistance} feet ({(viewingDistance * 12).toFixed(1)} inches)</div>
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
      </div>
    </div>
  );
};

export default CalibrationScreen;
