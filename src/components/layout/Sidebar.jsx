import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <aside style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', 
      width: '16rem', 
      minHeight: 'calc(100vh - 4rem)' 
    }}>
      <nav style={{ padding: '1rem' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'rgb(37 99 235)' : 'transparent',
                  color: isActive ? 'white' : 'rgb(55 65 81)',
                  fontWeight: isActive ? '500' : '400'
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

