
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Activity, FileText } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedGenius</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/checkup" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Checkup Buddy
            </Link>
            <Link to="/medicine" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"></path><path d="M12 13v5"></path><path d="M12 13v5"></path><path d="M9 13h6"></path><path d="M9 8h6"></path></svg>
              MedInfo
            </Link>
            <Link to="/reports" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Report Scanner
            </Link>
            <Button variant="default">Sign In</Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/checkup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              <span className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Checkup Buddy
              </span>
            </Link>
            <Link to="/medicine" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"></path><path d="M12 13v5"></path><path d="M12 13v5"></path><path d="M9 13h6"></path><path d="M9 8h6"></path></svg>
                MedInfo
              </span>
            </Link>
            <Link to="/reports" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Report Scanner
              </span>
            </Link>
            <div className="pt-2">
              <Button variant="default" className="w-full">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
