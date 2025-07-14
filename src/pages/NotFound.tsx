import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gold-light">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gold">404</h1>
        <p className="text-xl text-brand-green mb-4">Oops! Page not found</p>
        <a href="/" className="text-gold hover:text-gold-dark underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
