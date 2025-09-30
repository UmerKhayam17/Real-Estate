// landing page layout
export const metadata = {
   title: "PrimeProperties - Find Your Dream Home",
   description: "Discover the perfect property for sale, rent, or investment with PrimeProperties",
};

export default function LandingPageLayout({ children }) {
   return (
      <div className="font-sans antialiased min-h-screen bg-background">
         <Navbar />
         <Header />
         <main>
            {children}
         </main>
      </div>
   );
}