
import { Link } from "react-router-dom";
import { Brain, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedGenius</span>
            </Link>
            <p className="mt-4 text-gray-500 max-w-md">
              Empowering healthcare with AI. MedGenius provides smart health tools for self-analysis, 
              early diagnosis, and instant insights without needing immediate medical supervision.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Features</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/checkup" className="text-gray-500 hover:text-primary">Checkup Buddy</Link>
              </li>
              <li>
                <Link to="/medicine" className="text-gray-500 hover:text-primary">MedInfo</Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-500 hover:text-primary">Report Scanner</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} MedGenius. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">
            <span className="font-medium">Disclaimer:</span> MedGenius is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
