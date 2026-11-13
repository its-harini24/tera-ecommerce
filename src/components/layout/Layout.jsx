import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Main site layout wrapper.
 * CartWishlistProvider is expected to be mounted higher up (e.g. in App.jsx),
 * but if it isn't yet, wrap here as a convenience.
 */
export default function Layout({ children }) {
  return (
    <div className="tera-layout">
      <Navbar />
      <main className="tera-layout__main">{children}</main>
      <Footer />
    </div>
  );
}
