import React from 'react'
import HeroSection from "./HeroSection"
import FeatureSection from "./FeaturesSection"
import PropertListingPreview from "./PropertyListingPreview"
import CTASection from "./CTASection"

const DashboardPage = () => {
   return (
      <>
         {/* Hero Section */}
         <HeroSection />
         <FeatureSection />
         <PropertListingPreview />
         <CTASection />

      </>
   )
}

export default DashboardPage