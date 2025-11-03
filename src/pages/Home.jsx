import React, { useState, useEffect } from "react";
import "../css/home.css";
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
  User,
} from "lucide-react";
import GrokIcon from "../assets/GrokIcon";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(null);

  // Listen for Firebase Auth user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Example dropdown suggestions
  const suggestions = [
    "React",
    "Firebase",
    "Tailwind",
    "Lucide Icons",
    "JavaScript",
    "Node.js",
    "MongoDB",
  ];

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="Home-container">
      <div className="Home-wrapper">
        {/* Header */}
        <div className="Header-container">
          <div className="Header-left">
            <button
              className="header-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>
            <h1>X-Space</h1>
          </div>

          <div className="Header-right">
            {windowWidth > 444 ? (
              <div className="search-bar">
                <SearchIcon size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <div className="search-dropdown">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item, i) => (
                        <div
                          key={i}
                          className="dropdown-item"
                          onClick={() => setQuery(item)}
                        >
                          {item}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-item no-result">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {!isExpanded ? (
                  <button
                    className="search-icon-btn"
                    onClick={() => setIsExpanded(true)}
                  >
                    <SearchIcon size={22} />
                  </button>
                ) : (
                  <div className="search-bar mobile">
                    <SearchIcon size={20} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="search-input"
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                      className="close-search"
                      onClick={() => {
                        setQuery("");
                        setIsExpanded(false);
                      }}
                    >
                      <CloseIcon size={20} />
                    </button>

                    {query && (
                      <div className="search-dropdown">
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((item, i) => (
                            <div
                              key={i}
                              className="dropdown-item"
                              onClick={() => setQuery(item)}
                            >
                              {item}
                            </div>
                          ))
                        ) : (
                          <div className="dropdown-item no-result">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <div
            className="menu-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
        )}

        <div className="Content-container">
          <div
            className={`left-pannel ${menuOpen ? "open" : ""}`}
            role="navigation"
            aria-label="Main menu"
          >
            <div className="left-pannel-upper">
              <div className="left-pannel-upper-selection">
                <HomeIcon strokeWidth={3} />
                <span>Home</span>
              </div>
              <div className="left-pannel-upper-selection">
                <SearchIcon strokeWidth={3} />
                <span>Explore</span>
              </div>
              <div className="left-pannel-upper-selection">
                <NotificationsIcon strokeWidth={3} />
                <span>Notifications</span>
              </div>
              <div className="left-pannel-upper-selection">
                <MessagesIcon strokeWidth={3} />
                <span>Messages</span>
              </div>
              <div className="left-pannel-upper-selection">
                <BookmarkIcon strokeWidth={3} />
                <span>Bookmarks</span>
              </div>
              <div className="left-pannel-upper-selection">
                <UserIcon strokeWidth={3} />
                <span>Communities</span>
              </div>
              <div className="left-pannel-upper-selection">
                <PremiumIcon strokeWidth={3} />
                <span>Premium</span>
              </div>
              <div className="left-pannel-upper-selection">
                <ProfileIcon strokeWidth={3} />
                <span>Profile</span>
              </div>
              <div className="left-pannel-upper-selection">
                <MoreOptionsIcon strokeWidth={3} />
                <span>More</span>
              </div>
              <button className="compose-btn">Post</button>
              
            <div className="left-pannel-lower">
              <div className="image">
                <UserIcon size={20} />
              </div>

              <div className="user-info">
                <span className="user-name">
                  {user?.displayName || "User"}
                </span>
                <span className="user-handle">
                  @{user?.email ? user.email.split("@")[0] : "username"}
                </span>
              </div>

              <MoreHorizontal size={20} className="more-icon" />
            </div>
            </div>

            <button
              className="left-panel-close-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="main-column">
            <div style={{ padding: 20 }}>
              <h2>Main Content</h2>
              <p>Put your feed, composer and tweets here.</p>
            </div>
          </div>

          <div className="right-column"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
