/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: ['www.propertyfinder.ae'],
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'www.propertyfinder.ae',
            port: '',
            pathname: '/**',
         },
         // You can add more domains if needed
         {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
         },
         {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            port: '',
            pathname: '/**',
         },
      ],
   },
};

export default nextConfig;