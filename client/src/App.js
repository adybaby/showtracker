import React from "react";
import "./App.css";
import FirstComponent from "./FirstComponent";

function App() {
  return (
    <div className="App">
      {/*
 react boilerplate code
       <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
 */}

      <FirstComponent displaytext="First Component Data" />
    </div>
  );
}

export default App;
