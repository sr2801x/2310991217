import React from "react";
import PriorityInbox from "./components/PriorityInbox";
import { LogUtils } from "../../logging_middleware";
import "./App.css";

function App() {
  React.useEffect(() => {
    LogUtils.info("component", "App component mounted");
  }, []);

  return (
    <div className="app">
      <PriorityInbox />
    </div>
  );
}

export default App;
