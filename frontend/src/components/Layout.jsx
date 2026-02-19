import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/menu', label: 'Menu' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/consumption', label: 'Consumption' },
  { path: '/expiry', label: 'Expiry Check' }
];

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Smart Kitchen</h2>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;
