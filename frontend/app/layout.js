// app/layout.js
import { Inter, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/style.css'
import { TanstackProvider } from '@/components/providers/tanstack-provider'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../hooks/useAuth';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: "Real Estate Portal",
  description: "Dealer and property management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <TanstackProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>

        </TanstackProvider>
      </body>
    </html>
  );
}