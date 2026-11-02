import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import reportWebVitals from './reportWebVitals';

// Global Audio/Video Single-Playback Coordinator: prevents two audios/videos playing simultaneously
if (typeof document !== 'undefined') {
  document.addEventListener(
    'play',
    function (e) {
      const playingEl = e.target;
      if (playingEl && (playingEl.tagName === 'VIDEO' || playingEl.tagName === 'AUDIO')) {
        const allMedia = document.querySelectorAll('video, audio');
        allMedia.forEach((el) => {
          if (el !== playingEl && !el.paused) {
            try {
              el.pause();
              el.muted = true;
            } catch (err) {}
          }
        });
      }
    },
    true
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
