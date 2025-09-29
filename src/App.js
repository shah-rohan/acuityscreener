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
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <button 
            className={`icon-button ${currentScreen === 'calibration' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('calibration')}
            title="Calibration"
          >
            ⚙️
          </button>
          <button 
            className={`icon-button ${currentScreen === 'testing' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('testing')}
            disabled={!calibrationData}
            title="Testing"
          >
            👁️
          </button>
        </nav>
        
        {currentScreen === 'testing' && (
          <div className="sidebar-middle">
            <button 
              className="icon-button"
              onClick={() => {
                const testingScreen = document.querySelector('.testing-screen');
                if (testingScreen?.cycleLetterSet) testingScreen.cycleLetterSet();
              }}
              title="Cycle Letter Sets"
            >
              🔄
            </button>
          </div>
        )}
        
        {currentScreen === 'testing' && (
          <div className="testing-arrows">
            <button 
              className="arrow-button"
              onClick={() => {
                const testingScreen = document.querySelector('.testing-screen');
                if (testingScreen?.moveUp) testingScreen.moveUp();
              }}
              title="Larger Letters"
            >
              ↑
            </button>
            <button 
              className="arrow-button"
              onClick={() => {
                const testingScreen = document.querySelector('.testing-screen');
                if (testingScreen?.moveDown) testingScreen.moveDown();
              }}
              title="Smaller Letters"
            >
              ↓
            </button>
          </div>
        )}
      </aside>

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
