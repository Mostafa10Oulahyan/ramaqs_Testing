import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import customLogo from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-8 border-t border-zinc-900 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Mock Social Links */}
        <div className="flex gap-6 mb-8 text-zinc-300">
          <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition">
            <MapPin className="w-5 h-5" />
          </button>
        </div>

        {/* Info Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-semibold text-zinc-300 mb-8 max-w-2xl">
          <a href="#" className="hover:text-white transition">Get the PowerpuffGirls App</a>
          <a href="#" className="hover:text-white transition">Help</a>
          <a href="#" className="hover:text-white transition">Site Index</a>
          <a href="#" className="hover:text-white transition">IMDbPro</a>
          <a href="#" className="hover:text-white transition">Box Office Mojo</a>
          <a href="#" className="hover:text-white transition">PowerpuffGirls Developer</a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-semibold text-zinc-300 mb-8 max-w-2xl">
          <a href="#" className="hover:text-white transition">Press Room</a>
          <a href="#" className="hover:text-white transition">Advertising</a>
          <a href="#" className="hover:text-white transition">Jobs</a>
          <a href="#" className="hover:text-white transition">Conditions of Use</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Your Ads Privacy Choices</a>
        </div>

        {/* Logo and Copyright */}
        <div className="flex flex-col items-center gap-4 text-xs text-zinc-500 font-semibold mt-4">
          <Link to="/" className="bg-[#00000] rounded-[4px] px-1.5 py-0.5 flex items-center justify-center w-[80px] h-[35px] hover:brightness-110 transition-all shrink-0">
            <img src={customLogo} alt="Logo" className="h-full w-full object-contain" />
          </Link>
          <p>© 1990-{new Date().getFullYear()} by PowerpuffGirls.com, Inc.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
