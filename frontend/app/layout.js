// app/layout.js
import { Inter, Poppins } from 'next/font/google'
import './styles/globals.css'
import './styles/style.css'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

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
      <head>
       {/* Flaticon CDN for animated icons */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.1.0/uicons-regular-straight/css/uicons-regular-straight.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.1.0/uicons-solid-rounded/css/uicons-solid-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.1.0/uicons-thin-straight/css/uicons-thin-straight.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.1.0/uicons-animated/css/uicons-animated.css" />
        </head>
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
