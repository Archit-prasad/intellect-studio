import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ── Single plugin registration ──────────────────────────────────────────────
// Must happen before any component module evaluates so every Vite chunk
// resolves to the same singleton instance that already has the plugins.
gsap.registerPlugin(ScrollTrigger, useGSAP);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
