import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logoUrl from "../assets/logo_new.png";
import { useFetch } from "../hooks/useFetch";
import { getProductImage } from "../utils/productImages";
import {
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiInfo,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiPhone,
  FiSettings,
  FiShoppingBag,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";

const productLinks = [
  { label: "Male T-Shirts", href: "/tshirts?category=male" },
  { label: "Female T-Shirts", href: "/tshirts?category=female" },
  { label: "Oversized T-Shirts", href: "/tshirts?category=oversized" }
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { data: allProducts = [] } = useFetch('/admin/public/products');
  const fallbackProductImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&q=75&w=600&h=760&fit=crop';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/tshirts?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setIsSearchFocused(false);
      closeMenu();
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/tshirts?search=${encodeURIComponent(tag)}`);
    setIsSearchFocused(false);
    setSearchVal("");
    closeMenu();
  };

  const searchResults = searchVal.trim()
    ? (allProducts || []).filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase())).slice(0, 5)
    : [];
  const mobileMenuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const productsRef = useRef(null);
  const accountRef = useRef(null);

  const syncAuth = () => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }

      if (productsRef.current && !productsRef.current.contains(event.target)) {
        setProductsOpen(false);
      }

      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setProductsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setAccountOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userInitial = userName.trim().charAt(0).toUpperCase() || "U";
  const cartCount = cartItems.length;
  const accountLinks = [
    { label: "My Orders", href: "/my-orders", icon: <FiPackage size={16} /> },
    { label: "Order Tracking", href: "/order-tracking", icon: <FiMapPin size={16} /> },
    { label: "Profile", href: "/profile", icon: <FiSettings size={16} /> },
  ];

  return (
    <header className="site-header">
      {/* Click-to-close Backdrop Overlay */}
      {isOpen && (
        <div 
          className="mobile-backdrop"
          onClick={closeMenu}
        />
      )}

      <div className="header-promo">
        <div className="marquee-content">
          New stitched drops are live. <Link to="/tshirts">Shop T-Shirts</Link>
        </div>
      </div>

      <div className="header-shell">
        <button
          ref={menuBtnRef}
          className="menu-button-icon"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Link className="brand-link" to="/" onClick={closeMenu}>
          <img src={logoUrl} alt="NYF TOTH" className="brand-logo" />
          <div className="brand-copy">
            <span className="brand-name">NYF TOTH</span>
            <span className="brand-tag">ROYALTY MEETS ETERNITY</span>
          </div>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          <div className="nav-dropdown" ref={productsRef} onMouseLeave={() => setProductsOpen(false)}>
            <button
              className="nav-link dropdown-trigger"
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              onMouseEnter={() => setProductsOpen(true)}
            >
              Products
              <FiChevronDown size={14} className="dropdown-arrow" />
            </button>
            <div
              className={`dropdown-menu ${productsOpen ? "show" : ""}`}
            >
              {productLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={closeMenu}>
                  {item.label}
                  <FiChevronRight size={12} />
                </Link>
              ))}
            </div>
          </div>

          <NavLink to="/about" className="nav-link">
            About Us
          </NavLink>
          <NavLink to="/custom" className="nav-link">
            LookBook
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </nav>

        <div className="header-actions">
          <form onSubmit={handleSearchSubmit} className="header-search-form" ref={searchRef}>
            <div className="header-search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="header-search-input"
              />
              {searchVal && (
                <button type="button" onClick={() => setSearchVal("")} className="clear-search-btn">✕</button>
              )}
            </div>

            {/* Live Autocomplete Search Dropdown */}
            {isSearchFocused && (
              <div className="live-search-dropdown">
                {searchVal.trim() === "" ? (
                  <div className="search-suggestions">
                    <p className="suggestion-title">Trending Searches</p>
                    <div className="suggestion-tags">
                      <button type="button" onClick={() => handleTagClick("Oversized")}>Oversized</button>
                      <button type="button" onClick={() => handleTagClick("Male")}>Male T-Shirts</button>
                      <button type="button" onClick={() => handleTagClick("Female")}>Female T-Shirts</button>
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="no-search-results">
                    No products found for "{searchVal}"
                  </div>
                ) : (
                  <div className="search-results-list">
                    <p className="suggestion-title">Products Found</p>
                    {searchResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/product/${p.id}`} 
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchVal("");
                        }}
                        className="live-search-item"
                      >
                        <img 
                          src={getProductImage(p) || fallbackProductImage} 
                          alt={p.name} 
                          className="live-search-thumb" 
                          onError={(e) => { e.target.src = fallbackProductImage; }}
                        />
                        <div className="live-search-info">
                          <span className="live-search-name">{p.name}</span>
                          <span className="live-search-price">₹{p.price}</span>
                        </div>
                      </Link>
                    ))}
                    <button type="submit" className="view-all-results-btn">
                      View all {allProducts.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase())).length} results →
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          <Link className="cart-link" to="/cart" aria-label="Cart">
            <FiShoppingBag size={16} />
            Bag
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="account-menu" ref={accountRef}>
              <button
                type="button"
                className="account-trigger"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <span className="account-avatar">{userInitial}</span>
                <span className="account-trigger-copy">
                  <span className="account-name">{userName}</span>
                  <span className="account-label">Account</span>
                </span>
                <FiChevronDown className={`account-chevron ${accountOpen ? "open" : ""}`} size={15} />
              </button>
              <div className={`account-dropdown ${accountOpen ? "show" : ""}`} role="menu">
                <div className="account-dropdown-head">
                  <span className="account-avatar large">{userInitial}</span>
                  <div>
                    <p>{userName}</p>
                    <span>{userEmail || "NYF TOTH member"}</span>
                  </div>
                </div>
                <div className="account-dropdown-links">
                  {accountLinks.map((item) => (
                    <Link key={item.href} to={item.href} onClick={() => setAccountOpen(false)}>
                      {item.icon}
                      <span>{item.label}</span>
                      <FiChevronRight size={13} />
                    </Link>
                  ))}
                </div>
                <button type="button" className="account-dropdown-logout" onClick={handleLogout}>
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="login-button" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Sliding Mobile Menu Panel */}
      <div ref={mobileMenuRef} className={`mobile-panel ${isOpen ? "open" : ""}`}>
        <div className="mobile-panel-header">
          <span className="mobile-brand-title">
            <img src={logoUrl} alt="NYF TOTH" />
            NYF TOTH
          </span>
          <button type="button" className="mobile-close-btn" onClick={closeMenu}>
            <FiX size={24} />
          </button>
        </div>

        <div className="mobile-panel-body">
          {/* Mobile Search */}
          <div className="px-4 mb-6">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-4 py-2 w-full">
                <span className="mr-2 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full text-gray-850"
                />
              </div>
            </form>
          </div>

          {/* Section 1: Categories */}
          <div className="mobile-section">
            <h4 className="mobile-section-title">Shop Collection</h4>
            <div className="mobile-section-links">
              {productLinks.map((item) => (
                <Link key={item.href} to={item.href} onClick={closeMenu} className="mobile-drawer-link">
                  <span className="flex items-center gap-3">
                    <FiTag size={16} className="text-[#d4af37]" />
                    {item.label}
                  </span>
                  <FiChevronRight size={14} className="link-arrow" />
                </Link>
              ))}
            </div>
          </div>

          {/* Section 2: Explore */}
          <div className="mobile-section">
            <h4 className="mobile-section-title">Explore Atelier</h4>
            <div className="mobile-section-links">
              <NavLink to="/" onClick={closeMenu} className="mobile-drawer-link">
                <span className="flex items-center gap-3">
                  <FiHome size={16} className="text-gray-400" />
                  Home
                </span>
                <FiChevronRight size={14} className="link-arrow" />
              </NavLink>
              <NavLink to="/about" onClick={closeMenu} className="mobile-drawer-link">
                <span className="flex items-center gap-3">
                  <FiInfo size={16} className="text-gray-400" />
                  About Us
                </span>
                <FiChevronRight size={14} className="link-arrow" />
              </NavLink>
              <NavLink to="/custom" onClick={closeMenu} className="mobile-drawer-link">
                <span className="flex items-center gap-3">
                  <FiUser size={16} className="text-gray-400" />
                  LookBook
                </span>
                <FiChevronRight size={14} className="link-arrow" />
              </NavLink>
              <NavLink to="/contact" onClick={closeMenu} className="mobile-drawer-link">
                <span className="flex items-center gap-3">
                  <FiPhone size={16} className="text-gray-400" />
                  Contact
                </span>
                <FiChevronRight size={14} className="link-arrow" />
              </NavLink>
            </div>
          </div>

          {/* Section 3: Bag & Account */}
          <div className="mobile-section mobile-footer-section">
            <Link to="/cart" onClick={closeMenu} className="mobile-bag-pill">
              <FiShoppingBag size={18} />
              Bag {cartCount > 0 ? `(${cartCount})` : "(0)"}
            </Link>

            {isLoggedIn ? (
              <div className="mobile-user-box">
                <div className="mobile-user-info">
                  <span className="account-avatar">{userInitial}</span>
                  <span>
                    {userName}
                    {userEmail && <small>{userEmail}</small>}
                  </span>
                </div>
                <div className="mobile-account-links">
                  {accountLinks.map((item) => (
                    <Link key={item.href} to={item.href} onClick={closeMenu} className="mobile-drawer-link">
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      <FiChevronRight size={14} className="link-arrow" />
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="mobile-drawer-logout"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mobile-drawer-login"
                onClick={() => {
                  navigate("/login");
                  closeMenu();
                }}
              >
                Login to Atelier
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
