import React, { useState, useEffect } from 'react';
import '../css/home.css';
import {
  Home as HomeIcon,
  Bell as NotificationsIcon,
  Mail as MessagesIcon,
  List as ListIcon,
  User as UserIcon,
  MoreHorizontal,
  Image,
  Smile,
  MapPin,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BadgeCheck as PremiumIcon,
  UserRound as ProfileIcon,
  MoreHorizontal as MoreOptionsIcon,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import GrokIcon from '../assets/GrokIcon'; // keep if used elsewhere

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on Esc or on window resize > 1250 (so UI resets)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1250) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className='Home-container'>
      <div className="Home-wrapper">

        {/* Header */}
        <div className="Header-container">
          <div className="Header-left">
            {/* menu button - visible on narrow screens (see CSS @ <=1250px) */}
            <button
              className="header-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>

            <h1>Dashboard</h1>
          </div>

          <div className="Header-right">
            <div className="search-bar">
              <SearchIcon size={20} className="search-icon" />
              <input type="text" placeholder="Search" className="search-input" />
            </div>
          </div>
        </div>

        {/* Overlay for slide-in menu when open on mobile */}
        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} aria-hidden />}

        <div className="Content-container">
          {/* LEFT PANEL (becomes slide-in on small screens) */}
          <div className={`left-pannel ${menuOpen ? 'open' : ''}`} role="navigation" aria-label="Main menu">
            <div className='left-pannel-upper'>
              <div className='left-pannel-upper-selection'><HomeIcon strokeWidth={3} /><span>Home</span></div>
              <div className='left-pannel-upper-selection'><SearchIcon strokeWidth={3} /><span>Explore</span></div>
              <div className='left-pannel-upper-selection'><NotificationsIcon strokeWidth={3} /><span>Notifications</span></div>
              <div className='left-pannel-upper-selection'><MessagesIcon strokeWidth={3} /><span>Messages</span></div>
              <div className='left-pannel-upper-selection'><BookmarkIcon strokeWidth={3} /><span>Bookmarks</span></div>
              <div className='left-pannel-upper-selection'><UserIcon strokeWidth={3} /><span>Communities</span></div>
              <div className='left-pannel-upper-selection'><PremiumIcon strokeWidth={3} /><span>Premium</span></div>
              <div className='left-pannel-upper-selection'><ProfileIcon strokeWidth={3} /><span>Profile</span></div>
              <div className='left-pannel-upper-selection'><MoreOptionsIcon strokeWidth={3} /><span>More</span></div>
               <button className="compose-btn">Post</button>
            </div>

            <div className='left-pannel-lower'>
              {/* Lower area (e.g., post button / user) */}
             
            </div>

            {/* Close button inside slide menu for mobile */}
            <button
              className="left-panel-close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* MAIN CONTENT (placeholder columns) */}
          <div className="main-column">
            {/* you can place feed, composer, etc. here */}
            <div style={{ padding: 20 }}>
              <h2>Main Content</h2>
              <p>Put your feed, composer and tweets here.</p>
            </div>
          </div>

          <div className="right-column">
            {/* Right column / widgets */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
