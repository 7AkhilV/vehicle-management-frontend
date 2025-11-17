import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, sidebarLinks }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {sidebarLinks && <Sidebar links={sidebarLinks} />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

