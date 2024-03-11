import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactPDF from '@react-pdf/renderer';

const root = ReactDOM.createRoot(document.getElementById('root'));
// ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);

root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
reportWebVitals();
