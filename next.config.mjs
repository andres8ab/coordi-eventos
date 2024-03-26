/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'a0.muscache.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'res.cloudinary.com',
        protocol: 'http',
        port: '',
      },
    ],
  },
}

export default nextConfig
