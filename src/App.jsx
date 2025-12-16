import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InstallerFlow from './components/InstallerFlow';
import ClientFlow from './components/ClientFlow';
import BookingFlow from './components/BookingFlow';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InstallerFlow />} />
      <Route path="/client" element={<ClientFlow />} />
      <Route path="/booking" element={<BookingFlow />} />
    </Routes>
  );
}

export default App;
