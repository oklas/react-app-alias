import React from 'react'
import AboveRootJs from 'above-root-js/AboveRootJs'
import AboveRootTs from 'above-root-ts/AboveRootTs'
import NearSrc from 'near-src/NearSrc'
import Internal from 'InternalEx/index'
import './App.css'

function App() {
  return (
    <div className="App">
      <h2>Main</h2>
      <Internal />
      <NearSrc />
      <AboveRootJs/>
      <AboveRootTs />
    </div>
  );
}

export default App;
