// 1. Import the React library for creating user interfaces
import React from 'react';

// 2. Import the ReactDOM library for rendering React components in the DOM
import { createRoot } from 'react-dom/client';

// 3. Import the Bootstrap CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// 4. Import the App component from the App.js file
import App from './App';

// 5. Create a root container where the app will be rendered
const root = createRoot(document.getElementById('root'));  // 6. Select the DOM element with the id 'root' as the root container

// 7. Render the App component into the root container
// 8. Enable Strict Mode for highlighting potential problems in an application
// 9. Insert the App component to be rendered
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
