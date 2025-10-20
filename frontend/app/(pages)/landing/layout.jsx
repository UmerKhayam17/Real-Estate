import Navbar from "@/components/layout/landing/navbar"
import Header from "@/components/layout/landing/header"
import Footer from "@/components/layout/landing/footer"

export default function LandingPageLayout({ children }) {
   return (
      <div className="font-sans antialiased min-h-screen bg-background">
         <Navbar />
         <Header />
         <main>
            {children}
         </main>
         <Footer />
      </div>
   );
}