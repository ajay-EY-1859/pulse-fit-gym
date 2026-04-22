import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/book', label: 'Book' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span>Pulse</span>Fit
      </NavLink>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
