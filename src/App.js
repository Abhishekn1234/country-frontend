
import React from "react";
import { Routes, Route } from "react-router-dom";
import CountryList from "./components/CountryList";
import CountryDetail from "./components/CountryDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CountryList />} />
      <Route path="/country/:code" element={<CountryDetail />} />
    </Routes>
  );
}
