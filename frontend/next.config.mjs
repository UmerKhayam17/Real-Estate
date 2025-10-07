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
         {
            protocol: 'http',
            hostname: 'localhost',
            port: '5000',
            pathname: '/uploads/**',
         },
      ],
   },
    async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;