## Acuity Screener (Web)

Accurate distance visual acuity testing in any hospital room using only a computer display. Calibrate once with a credit card, set the patient distance, and present optotype lines sized to standard Snellen equivalents (e.g., 20/40, 20/20) using a geometric calculation based on viewing distance and pixels-per-inch.

### Table of Contents
- Overview
- Features
- Quick Start
- Calibration Guide
- Testing Workflow
- Keyboard and UI Controls
- Deployment (GitHub Pages)
- Project Structure
- Tech Stack
- Development Notes
- Troubleshooting

### Overview
This React app enables care teams to roll a workstation into a room and obtain an accurate distance acuity, without needing a chart at a fixed distance. The app computes letter heights from:
- Measured pixels-per-inch (via on-screen credit card matching)
- Entered viewing distance (feet)
- Standard optotype geometry (arcminutes)

The result is consistent letter sizing at arbitrary distances.

### Features
- Calibration with on-screen credit card matching to determine pixels-per-inch
- Adjustable viewing distance with inches and feet readouts
- Snellen-equivalent lines from 20/600 to 20/20
- Large, distraction-free testing UI with keyboard support
- Simple two-step flow: Calibration → Testing

### Quick Start
Prerequisites: Node.js 18+ and npm

```
npm install
npm start
```

Open `http://localhost:3000`.

### Calibration Guide
1. From the Calibration screen, adjust the slider until the on‑screen rectangle exactly matches a physical credit card’s width.
2. Enter the patient viewing distance in feet.
3. Click “Complete Calibration”. The app computes and stores:
   - `pixelsPerInch = onScreenCreditCardPixelWidth / 3.375in`
   - `viewingDistance` in inches

Notes
- Use an actual credit/debit/ID card with standard width (3.375 in).
- Ensure browser zoom is 100% and OS scaling is what you intend to use during testing.

### Testing Workflow
After calibration, the Testing screen displays optotypes sized via:
- Convert arcminutes to radians
- Compute physical letter height: `heightInches = tan(arcminutes / 60 * π/180) * viewingDistance`
- Convert to pixels: `heightPixels = heightInches * pixelsPerInch`

The UI shows:
- Current Snellen line (e.g., 20/40)
- Approximate cap height in px and mm
- The optotype letters sized to the computed pixel height

### Keyboard and UI Controls
- Arrow Up / Left: Larger letters (previous line)
- Arrow Down / Right: Smaller letters (next line)
- Sidebar buttons: switch between Calibration and Testing; up/down arrows appear during Testing

### Deployment (GitHub Pages)
The project includes a deployment script using `gh-pages`.

1. Build the app:
   ```
   npm run build
   ```
2. Deploy:
   ```
   npm run deploy
   ```

Ensure your repository is configured for GitHub Pages (Settings → Pages). If deploying from a custom domain or subpath, also set `homepage` in `package.json` accordingly.

### Project Structure
```
src/
  App.js                 # App shell and screen routing
  components/
    CalibrationScreen.js # Credit card matching, distance input, PPI computation
    TestingScreen.js     # Optotype rendering, navigation, computed sizes
public/
  index.html             # App template and metadata
```

### Tech Stack
- React 19 (Create React App tooling)
- Plain CSS for styling

### Development Notes
- Fonts: Optician Sans is included in `public/fonts` and `src/fonts`. Update font loading as needed for your deployment.
- Calculations: `TestingScreen` uses cap height and arcminute geometry for sizing. If changing font, verify the cap-height ratio (`capHeight`) remains appropriate.
- Linting/Testing: CRA defaults are available via `npm test`.

### Troubleshooting
- Letters look too small/large: Re-run calibration. Verify browser zoom at 100% and OS display scaling. Ensure the on-screen card width matches a real card precisely.
- Keyboard not working: The window must be focused; arrow keys are captured for navigation.
- Deployment path issues: If hosting under a subpath, set `homepage` in `package.json` and redeploy.

---

Maintainers: Please update this README whenever calibration logic, controls, or deployment steps change.
