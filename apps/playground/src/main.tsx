import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@all3hp/tasksgo-ui/styles.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
