import React from 'react'

const FeaturesSection = () => {
   return (
      <div className="">

         {/* Features Section */}
         <section className="py-16 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                     <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-text-primary mb-2">Buy Property</h3>
                     <p className="text-text-secondary">Find your perfect home from thousands of verified listings.</p>
                  </div>

                  <div className="text-center p-6">
                     <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-text-primary mb-2">Rent Properties</h3>
                     <p className="text-text-secondary">Discover rental properties that match your lifestyle and budget.</p>
                  </div>

                  <div className="text-center p-6">
                     <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-text-primary mb-2">Verified Listings</h3>
                     <p className="text-text-secondary">All properties are verified by our team of experts.</p>
                  </div>
               </div>
            </div>
         </section>
      </div>
   )
}

export default FeaturesSection