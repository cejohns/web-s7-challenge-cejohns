
import React from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import Home from './Home'
import Form from './Form'

function App() {
  return (
    <div id="app">
      <nav>
        {/* NavLinks */}
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
      </nav>
      {/* Routes */}
      <Routes>
        {/* Route for Home */}
        <Route path="/" element={<Home />} />
        {/* Route for Order */}
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App