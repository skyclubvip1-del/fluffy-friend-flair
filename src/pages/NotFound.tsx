import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold-base/5 blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold-base/60 block mb-4">
          // ERROR 404
        </span>
        
        <h1 className="font-display font-bold text-gold-gradient mb-4 text-[8rem] leading-none">
          404
        </h1>
        
        <p className="font-body text-xl text-white/50 mb-8">
          Page not found
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gold-base/30 text-gold-light font-display text-sm uppercase tracking-wider hover:bg-gold-base hover:text-void hover:border-gold-base transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
