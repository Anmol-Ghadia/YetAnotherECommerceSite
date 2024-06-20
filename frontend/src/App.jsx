import React from "react";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import './App.css';

function App() {

  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
  );
}

export default App;
