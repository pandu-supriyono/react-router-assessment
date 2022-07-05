import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './auth/hooks/useAuth';
import { useLogOut } from './auth/hooks/useLogOut';
import { ROUTE_MANIFEST } from './constants';

function App() {
  const user = useAuth();
  const logOut = useLogOut(ROUTE_MANIFEST.ROOT.path);
  const location = useLocation();

  return (
    <>
      <div>
        <nav className="nav">
          <ul className="nav__list">
            <li className="nav__item">
              <Link
                to={ROUTE_MANIFEST.ROOT.path}
                state={{ from: location.pathname }}
              >
                Home
              </Link>
            </li>
            <li className="nav__item">
              <Link
                to={ROUTE_MANIFEST.DASHBOARD.path}
                state={{ from: location.pathname }}
              >
                Dashboard
              </Link>
            </li>
            {user ? (
              <button
                type="button"
                className="button nav__button nav__button--log-out"
                onClick={logOut}
              >
                Log out
              </button>
            ) : (
              <li className="nav__item nav__item--log-in">
                <Link
                  to={ROUTE_MANIFEST.LOG_IN.path}
                  state={{ from: location.pathname }}
                >
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <main id="main">
        <Outlet />
      </main>
    </>
  );
}

export default App;
