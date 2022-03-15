import React from 'react'
import NearSrc from 'near-src/NearSrc'
import Internal from 'Internal/index'
import './App.css'

function App() {
  return (
    <div className="App">
      <h2>Main</h2>
      <Internal />
      <NearSrc />
    </div>
  );
}

export default App;
