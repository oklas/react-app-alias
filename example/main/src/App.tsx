import React from 'react'
import './App.css'
import NearSrc from 'near-src/NearSrc'
import SomeComponent from '@components/SomeComponent'

function App() {
  return (
    <div className="App">
      <h2>Main</h2>
      <NearSrc />
      <SomeComponent/>
    </div>
  );
}

export default App;
