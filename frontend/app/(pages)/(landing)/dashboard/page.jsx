import React from 'react'

const DashboardPage = () => {
   return (
      <div className="min-h-screen bg-background">
         {/* Hero Section */}
         <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
               <h1 className="text-4xl md:text-6xl font-heading font-bold text-text-primary mb-6">
                  Find Your Dream
                  <span className="text-primary-600"> Home</span>
               </h1>
               <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
                  Discover the perfect property for sale, rent, or investment.
                  Thousands of listings updated daily with verified information.
               </p>

               {/* Search Bar */}
               <div className="max-w-2xl mx-auto bg-surface rounded-lg shadow-medium p-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                     <input
                        type="text"
                        placeholder="Search by location, property, or keyword..."
                        className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                     />
                     <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                        Search
                     </button>
                  </div>
               </div>
            </div>
         </section>

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

         {/* Property Listings Preview */}
         <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <h2 className="text-3xl font-heading font-bold text-text-primary text-center mb-12">
                  Featured Properties
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Property Card 1 */}
                  <div className="bg-surface rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200">
                     <div className="h-48 bg-primary-200"></div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Modern Apartment</h3>
                        <p className="text-text-secondary mb-4">Downtown • 3 Beds • 2 Baths</p>
                        <div className="flex justify-between items-center">
                           <span className="text-2xl font-bold text-primary-600">$350,000</span>
                           <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                              View Details
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Property Card 2 */}
                  <div className="bg-surface rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200">
                     <div className="h-48 bg-accent-200"></div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Luxury Villa</h3>
                        <p className="text-text-secondary mb-4">Suburban • 5 Beds • 4 Baths</p>
                        <div className="flex justify-between items-center">
                           <span className="text-2xl font-bold text-primary-600">$850,000</span>
                           <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                              View Details
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Property Card 3 */}
                  <div className="bg-surface rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200">
                     <div className="h-48 bg-success-200"></div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Studio Condo</h3>
                        <p className="text-text-secondary mb-4">City Center • 1 Bed • 1 Bath</p>
                        <div className="flex justify-between items-center">
                           <span className="text-2xl font-bold text-primary-600">$220,000</span>
                           <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                              View Details
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-16 bg-primary-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <h2 className="text-3xl font-heading font-bold text-white mb-4">
                  Ready to Find Your New Home?
               </h2>
               <p className="text-primary-100 mb-8 text-lg">
                  Join thousands of satisfied customers who found their dream property with us.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                     Browse Properties
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                     Contact Agent
                  </button>
               </div>
            </div>
         </section>
      </div>
   )
}

export default DashboardPage