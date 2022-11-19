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
        source: "/server/:path*",
        destination: `${process.env.REWRITE_SERVER_URL}/:path*`
      },
      {
        source: '/rest/:path*',
        has: [
          {
            type: 'host',
            value: '(?<api>.*)\\..*',
          },
        ],
        destination: `${process.env.REWRITE_SERVER_URL}/:path*`
      }
    ]
  }
}

module.exports = nextConfig
