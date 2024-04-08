import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { Logs } from "./pages/Logs";
import { Metrics } from "./pages/Metrics";
import React, { useState } from "react";
export const TimeContext = React.createContext();

function App() {
  const [selectedInterval, setSelectedInterval] = useState(0)
  return (
    <>
      <TimeContext.Provider value={[selectedInterval, setSelectedInterval]}>
        <Header />
        <Routes>
          <Route path="logs" element={<Logs />}></Route>
          <Route path="metrics" index element={<Metrics />}></Route>
          {/* <Route path='storybook' element={}></Route> */}
        </Routes>
      </TimeContext.Provider>
    </>
  );
}

export default App;
