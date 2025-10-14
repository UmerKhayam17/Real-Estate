import React from 'react'

const PropertyListingsSection = () => {
   return (
      <div className="">

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

      </div>
   )
}

export default PropertyListingsSection