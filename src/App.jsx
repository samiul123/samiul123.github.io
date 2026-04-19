import './App.css';
import Header from './components/header';
import { Footer } from './components/footer';
import { navLinks } from './constants';
import React from 'react';

function App() {
  return (
    <div className="bg-custom-dark w-full">
      <Header />
      {navLinks.map(nav => {
        if (nav.route) {
          return <nav.route key={nav.id} id={nav.id} />;
        }
        return null;
      })}
      <Footer />
    </div>
  );
}

export default App;
