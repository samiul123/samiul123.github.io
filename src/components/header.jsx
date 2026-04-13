import { useEffect, useState } from 'react';
import { menu, close } from '../assets';
import { navLinks } from '../constants';
import { motion } from 'framer-motion';
import { WebsiteLogo } from './WebsiteLogo';

function Header() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-20 py-5 transition-all duration-300 ${
        scrolled
          ? 'bg-custom-dark/90 backdrop-blur-md border-b border-[#1a1a1a]'
          : 'bg-transparent'
      }`}
    >
      <WebsiteLogo
        className="h-10 cursor-pointer"
        onClick={() => {
          setActiveMenu('home');
          window.scrollTo(0, 0);
        }}
      />

      {/* Mobile toggle */}
      <div className="fixed top-5 right-5 z-50 lg:hidden">
        <motion.button
          animate={{ rotate: menuOpen ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white"
        >
          <img src={menuOpen ? close : menu} alt="menu" className="w-7 h-7" />
        </motion.button>
      </div>

      {/* Desktop nav */}
      <nav className="hidden lg:block">
        <ul className="flex flex-row items-center gap-1">
            {navLinks.map(nav => (
              <li
                key={nav.id}
                className="relative cursor-pointer"
                onClick={() => {
                  setActiveMenu(nav.id);
                  setMenuOpen(false);
                }}
              >
                <a
                  href={`#${nav.id}`}
                  className={`block px-3 py-2 text-xs tracking-[2px] transition-colors duration-300 ${
                    activeMenu === nav.id ? 'text-white' : 'text-gray-500'
                  } hover:text-white`}
                >
                  {nav.title}
                </a>
                {activeMenu === nav.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-[1px] bg-custom-green"
                  />
                )}
              </li>
            ))}
          </ul>
      </nav>

      {/* Mobile nav */}
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: menuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="lg:hidden flex flex-col fixed top-0 left-0 w-full bg-custom-dark border-r border-[#1a1a1a] p-8 z-40 min-h-screen"
      >
        <ul className="flex flex-col gap-6 mt-20">
          {navLinks.map(nav => (
            <li
              key={nav.id}
              className={`cursor-pointer text-sm tracking-[2px] transition-colors duration-300 ${
                activeMenu === nav.id ? 'text-custom-green' : 'text-gray-500'
              } hover:text-white`}
              onClick={() => {
                setActiveMenu(nav.id);
                setMenuOpen(false);
              }}
            >
              <a href={`#${nav.id}`} className="block">
                {nav.title}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>
    </header>
  );
}

export default Header;
