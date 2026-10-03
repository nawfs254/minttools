/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 1. Prevent Clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 2. Prevent MIME-sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 3. Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 4. Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()',
          },
          // 5. Content Security Policy with AdSense support
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://adservice.google.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.gstatic.com https://www.google-analytics.com",
              "worker-src 'self' blob:",
              "frame-src 'self' https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://adservice.google.com https://tpc.googlesyndication.com",
              "connect-src 'self' blob: data: https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://stats.g.doubleclick.net",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
