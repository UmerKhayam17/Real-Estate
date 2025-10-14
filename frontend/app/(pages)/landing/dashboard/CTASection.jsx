import React from 'react'

const CTASection = () => {
   return (
      <div className="">

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

export default CTASection