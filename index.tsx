
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { consumeAuthCallback } from './services/authCallback';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Resolve any magic-link / error redirect before the app mounts so App sees a
// settled session (or a stashed error) on its first render.
consumeAuthCallback().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
