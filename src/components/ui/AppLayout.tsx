import { NavLink, Outlet } from 'react-router-dom';
import './AppLayout.css';

const navItems = [
  { to: '/dashboard', label: 'Flags' },
  { to: '/dashboard/create', label: 'Create' },
  { to: '/dashboard/experiments', label: 'A/B Tests' },
  { to: '/dashboard/killswitch', label: 'Kill Switch' },
  { to: '/dashboard/lifecycle', label: 'Lifecycle' },
  { to: '/dashboard/audit', label: 'Audit Log' },
  { to: '/dashboard/sdk', label: 'SDK' },
];

export default function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-link">
            <span className="brand-icon">&#9873;</span>
            <span className="brand-text">FeatureGate</span>
          </NavLink>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="env-badge">Production</div>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
