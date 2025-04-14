
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MedicineSearch from "@/components/medinfo/MedicineSearch";
import { Pill, BarChart3, FileSearch } from "lucide-react";

const MedInfo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold">MedInfo</h1>
            <p className="mt-2 text-lg">Search for any medicine and get detailed information</p>
          </div>
        </section>
        
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Medication Info</h3>
                  <p className="text-sm text-gray-500">Understand what you're taking</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <FileSearch className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Image Recognition</h3>
                  <p className="text-sm text-gray-500">Identify medicines from photos</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Side Effect Analysis</h3>
                  <p className="text-sm text-gray-500">Know potential risks & interactions</p>
                </div>
              </div>
            </div>
            
            <MedicineSearch />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MedInfo;
