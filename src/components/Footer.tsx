import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-muted/50 py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p className="font-serif text-base text-foreground">Kilnin' It with Chloe</p>
      <nav className="flex gap-6">
        <Link to="/" className="hover:text-foreground transition-colors">Gallery</Link>
        <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
      </nav>
      <div className="flex items-center gap-4">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Instagram
        </a>
        <span>© {new Date().getFullYear()} Chloe Ceramics</span>
      </div>
    </div>
  </footer>
);

export default Footer;
