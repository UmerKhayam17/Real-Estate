// app/components/FindAgent/SubHeader.jsx
import React from 'react';
import SubHeaderImage from "@/public/svgs/superagent_illustration.svg";

const SubHeader = ({ activeTab }) => {
   if (activeTab !== 'agents') return null;

   return (
      <div className="bg-gray-50 py-16">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
               <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
                     Find your SuperAgent
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                     The most responsive agents with up-to-date and improved accuracy on the properties you are searching for.
                  </p>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                     Learn more
                  </button>
               </div>
               <div className="md:w-1/2 flex justify-center">
                  <div className="w-80 h-80">
                     {/* Replace with your actual image component */}
                     <img
                        src={SubHeaderImage.src}
                        alt="SuperAgent Illustration"
                        className="w-full h-full object-contain"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SubHeader;