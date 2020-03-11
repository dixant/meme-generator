import React from 'react';
import logo from './images/meme-generator.png';
import './styles/App.css';

import MemeTemplate from './components/MemeTemplate'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Meme Generator</h1>
        <div>start with a basic meme template:</div>
        <MemeTemplate />
      </header>
    </div>
  );
}

export default App;
