'use client';

import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
   return (
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & About */}
            <div>
               <h2 className="text-2xl font-semibold text-white mb-3">PropertyFinder</h2>
               <p className="text-sm leading-relaxed">
                  Find your perfect property with verified listings across the country.
                  Explore homes, apartments, and commercial spaces that match your lifestyle.
               </p>
            </div>

            {/* Quick Links */}
            <div>
               <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
               <ul className="space-y-2 text-sm">
                  <li><a href="/properties" className="hover:text-white">Browse Properties</a></li>
                  <li><a href="/agents" className="hover:text-white">Find an Agent</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                  <li><a href="/about" className="hover:text-white">About</a></li>
               </ul>
            </div>

            {/* Contact Info */}
            <div>
               <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
               <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                     <MapPin className="h-4 w-4 text-gray-400" />
                     <span>123 Real Estate Ave, Karachi</span>
                  </li>
                  <li className="flex items-center gap-2">
                     <Phone className="h-4 w-4 text-gray-400" />
                     <a href="tel:+923001234567" className="hover:text-white">+92 300 123 4567</a>
                  </li>
                  <li className="flex items-center gap-2">
                     <Mail className="h-4 w-4 text-gray-400" />
                     <a href="mailto:support@propertyfinder.com" className="hover:text-white">support@propertyfinder.com</a>
                  </li>
               </ul>
            </div>

            {/* Social Links */}
            <div>
               <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
               <div className="flex gap-4">
                  <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook /></a>
                  <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram /></a>
                  <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter /></a>
                  <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin /></a>
               </div>
            </div>
         </div>

         {/* Bottom Bar */}
         <div className="border-t border-gray-800 mt-8">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
               <p>© {new Date().getFullYear()} PropertyFinder. All rights reserved.</p>
               <div className="flex gap-4 mt-2 md:mt-0">
                  <a href="/privacy" className="hover:text-white">Privacy Policy</a>
                  <a href="/terms" className="hover:text-white">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>
   );
}
