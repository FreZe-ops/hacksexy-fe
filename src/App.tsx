import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Approuter from "./routes/router";
import BodyBackgroundSync from "./components/BodyBackgroundSync";
import ToolVideoBackground from "./components/ToolVideoBackground";

function App() {
  return (
    <BrowserRouter>
      <BodyBackgroundSync />
      <ToolVideoBackground />
      <Approuter />
    </BrowserRouter>
  );
}

export default App;
