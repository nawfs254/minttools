import { NextResponse } from 'next/server';

// In-memory sliding window rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 60; // Max 60 requests per 10s per IP

// Cleanup expired IP records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }, 30000);
}

// Patterns of automated vulnerability scanners & exploit probes
const BLOCKED_PATH_PATTERNS = [
  /\.env($|\?)/i,
  /\.git($|\/|\?)/i,
  /wp-(login|admin|content|includes)/i,
  /xmlrpc\.php/i,
  /phpmyadmin/i,
  /\.(php|asp|aspx|jsp|cgi)($|\?)/i,
  /\/\.aws/i,
  /\/\.ssh/i,
  /\/actuator/i,
  /\/etc\/passwd/i,
  /\/\.well-known\/(?!pki-validation)/i,
];

// Known exploit tools & scanner signatures
const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'masscan',
  'nmap',
  'wpscan',
  'dirbuster',
  'gobuster',
  'acunetix',
  'censys',
  'shodan',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const method = request.method;

  // 1. Block Suspicious HTTP Methods (Static site only serves GET, HEAD, OPTIONS)
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }

  // 2. Block Known Vulnerability Scanner User-Agents
  for (const bot of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  // 3. Block Exploit Probes & Path Traversal (.env, wp-login, .git, etc.)
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // 4. In-Memory Anti-DDoS Rate Limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             '127.0.0.1';

  const now = Date.now();
  let rateData = rateLimitMap.get(ip);

  if (!rateData || now > rateData.resetTime) {
    rateData = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitMap.set(ip, rateData);
  } else {
    rateData.count++;
    if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse('Too Many Requests. Please slow down.', {
        status: 429,
        headers: {
          'Retry-After': '10',
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes except Next.js internal static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.svg|icons.svg|pdf.worker.min.mjs).*)',
  ],
};
