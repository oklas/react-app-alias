import React from 'react'
import NearSrc from 'near-src/NearSrc'
import AboveRootJs from 'above-root-js/AboveRootJs'
import AboveRootTs from 'above-root-ts/AboveRootTs'
import './App.css'

function App() {
  return (
    <div className="App">
      <h2>Main</h2>
      <NearSrc />
      <AboveRootJs/>
      <AboveRootTs />
    </div>
  );
}

export default App;
