import { NavLink } from "react-router-dom";
import logo from "../assets/logo-electro.png";

export default function Header() {
  return (
    <>
      {/* SVG icons */}
      <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
        <symbol id="cart" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
        </symbol>
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
        <symbol id="login" viewBox="0 0 90 90">
          <path d="M 45 53.718 c -10.022 0 -18.175 -8.153 -18.175 -18.175 S 34.978 17.368 45 17.368 c 10.021 0 18.175 8.153 18.175 18.175 S 55.021 53.718 45 53.718 z" />

          <path d="M 45 0 C 20.187 0 0 20.187 0 45 c 0 24.813 20.187 45 45 45 c 24.813 0 45 -20.187 45 -45 C 90 20.187 69.813 0 45 0 z M 74.821 70.096 c -3.543 -5.253 -8.457 -9.568 -14.159 -12.333 c -2.261 -1.096 -4.901 -1.08 -7.247 0.047 c -2.638 1.268 -5.47 1.91 -8.415 1.91 c -2.945 0 -5.776 -0.643 -8.415 -1.91 c -2.343 -1.125 -4.984 -1.143 -7.247 -0.047 c -5.702 2.765 -10.616 7.08 -14.16 12.333 C 9.457 63.308 6 54.552 6 45 C 6 23.495 23.495 6 45 6 s 39 17.495 39 39 C 84 54.552 80.543 63.308 74.821 70.096 z" />
        </symbol>
      </svg>

      {/* Navbar */}
      <nav
        className="navbar navbar-expand-md bg-dark sticky-top border-bottom"
        data-bs-theme="dark"
      >
        <div className="container">
          {/* Mobile logo */}
          <NavLink className="navbar-brand d-md-none" to="/">
            <img src={logo} alt="Logo" height="32" />
          </NavLink>

          {/* Mobile menu button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas"
            aria-controls="offcanvas"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation */}
          <div
            className="offcanvas offcanvas-end"
            id="offcanvas"
            aria-labelledby="offcanvasLabel"
          >
            {/* Mobile menu header */}
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasLabel">
                Menu
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>

            {/* Menu items */}
            <div className="offcanvas-body">
              <ul className="navbar-nav flex-grow-1 justify-content-between">
                {/* Logo - desktop */}
                <li className="nav-item d-none d-md-block">
                  <NavLink className="nav-link" to="/" aria-label="Home">
                    <img src={logo} alt="Logo" height="32" />
                  </NavLink>
                </li>

                <div style={{ display: "flex" }}>
                  {/* Home */}

                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      to="/"
                    >
                      Home
                    </NavLink>
                  </li>

                  {/* Catalog */}
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      to="/catalog"
                    >
                      Catalog
                    </NavLink>
                  </li>

                  {/* Cart */}

                  {/* Contacts */}
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      to="/contact"
                    >
                      Contacts
                    </NavLink>
                  </li>
                </div>
                <div style={{ display: "flex" }}>
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                      to="/cart"
                      aria-label="Cart"
                    >
                      <svg
                        className="bi"
                        width="24"
                        height="24"
                        aria-hidden="true"
                      >
                        <use href="#cart"></use>
                      </svg>
                    </NavLink>
                  </li>

                  {/* Log In */}
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/logIn">
                      <svg
                        className="bi"
                        width="24"
                        height="24"
                        aria-hidden="true"
                      >
                        <use href="#login"></use>
                      </svg>
                    </NavLink>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
