import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// Make sure to use createRoot for React 18
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 