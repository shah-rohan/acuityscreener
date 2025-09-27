import React, { useState } from 'react';
import './App.css';
import CalibrationScreen from './components/CalibrationScreen';
import TestingScreen from './components/TestingScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('calibration');
  const [calibrationData, setCalibrationData] = useState(null);

  const handleCalibrationComplete = (data) => {
    setCalibrationData(data);
    setCurrentScreen('testing');
  };

  const resetToCalibration = () => {
    setCurrentScreen('calibration');
    setCalibrationData(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Visual Acuity Screener</h1>
        <nav className="navigation">
          <button 
            className={currentScreen === 'calibration' ? 'active' : ''}
            onClick={() => setCurrentScreen('calibration')}
          >
            Calibration
          </button>
          <button 
            className={currentScreen === 'testing' ? 'active' : ''}
            onClick={() => setCurrentScreen('testing')}
            disabled={!calibrationData}
          >
            Testing
          </button>
        </nav>
      </header>

      <main className="main-content">
        {currentScreen === 'calibration' && (
          <CalibrationScreen 
            onCalibrationComplete={handleCalibrationComplete}
          />
        )}
        
        {currentScreen === 'testing' && (
          <TestingScreen 
            calibrationData={calibrationData}
            onReset={resetToCalibration}
          />
        )}
      </main>
    </div>
  );
}

export default App;
