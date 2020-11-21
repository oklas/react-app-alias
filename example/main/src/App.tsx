import React from 'react'
//import AboveRootTs from 'above-root-ts/AboveRootTs'
import AboveRootJs from 'above-root-js/AboveRootJs'
import NearSrc from 'near-src/NearSrc'
import './App.css';

function App() {
  return (
    <div className="App">
      <h2>Main</h2>
      <NearSrc />
      {/*<AboveRootTs />*/}
      <AboveRootJs />
    </div>
  );
}

export default App;
