/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    allowMiddlewareResponseBody: true,
  },
  async rewrites() {
    return [
      {
        source: '/rest/:path*',
        has: [
          {
            type: 'host',
            value: '(?<api>.*)\\..*',
          },
        ],
        destination: `http://169.51.205.252:31060/:path*`
      }
    ]
  }
}

module.exports = nextConfig
